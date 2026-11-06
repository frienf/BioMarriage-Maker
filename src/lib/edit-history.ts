type HistoryActions = {
  dirty: () => boolean;
  busy?: () => boolean;
  notifyBusy?: () => void;
  confirm: () => boolean;
  push: () => void;
  back: () => void;
  leave: () => void;
  forward: () => void;
  location?: () => string;
};

/** One sentinel per mounted editor, rearmed only after it has been consumed. */
export function createEditHistoryGuard(actions: HistoryActions) {
  let armed = false;
  let restoring = false;
  let previous = actions.location?.();
  return {
    syncLocation() { previous = actions.location?.(); },
    arm() {
      if (!armed && !restoring && actions.dirty()) {
        actions.push();
        armed = true;
      }
    },
    pop(event: { stopImmediatePropagation(): void }) {
      const current = actions.location?.();
      const from = previous && new URL(previous);
      const to = current && new URL(current);
      previous = current;
      if (restoring) {
        event.stopImmediatePropagation();
        restoring = false;
      } else if (from && to && from.origin === to.origin && from.pathname === to.pathname && from.search === to.search && from.hash !== to.hash) {
        // Fragment navigation stays in this editor and must not consume its guard.
        return;
      } else if (armed) {
        event.stopImmediatePropagation();
        if (actions.busy?.()) { restoring = true; actions.notifyBusy?.(); actions.forward(); }
        else if (!actions.dirty()) { armed = false; actions.back(); }
        else if (!actions.confirm()) { restoring = true; actions.forward(); }
        else { armed = false; actions.leave(); }
      }
    }
  };
}
