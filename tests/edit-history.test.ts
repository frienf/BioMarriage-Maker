import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { createEditHistoryGuard } from '../src/lib/edit-history.ts';

test('repeated dirty and clean transitions never stack history entries', () => {
  let dirty = true, prompts = 0, pushes = 0, backs = 0, leaves = 0;
  const guard = createEditHistoryGuard({
    dirty: () => dirty, confirm: () => { prompts++; return true; },
    push: () => { pushes++; }, back: () => { backs++; }, leave: () => { leaves++; }, forward: () => {}
  });
  guard.arm(); dirty = false; guard.arm(); dirty = true; guard.arm();
  assert.equal(pushes, 1);
  let stopped = 0;
  guard.pop({ stopImmediatePropagation: () => { stopped++; } });
  assert.equal(prompts, 1);
  assert.equal(backs, 0);
  assert.equal(leaves, 1);
  guard.pop({ stopImmediatePropagation: () => { stopped++; } });
  assert.equal(stopped, 1, 'the actual previous entry reaches the router');
  guard.arm();
  assert.equal(pushes, 2, 'another edit can arm the guard after back cannot leave');
});

test('cancelled Back restores the editor and future Back still prompts', () => {
  let confirms = 0, forwards = 0, leaves = 0, stopped = 0;
  const guard = createEditHistoryGuard({
    dirty: () => true, confirm: () => ++confirms > 1,
    push: () => {}, back: () => {}, leave: () => { leaves++; }, forward: () => { forwards++; }
  });
  const event = { stopImmediatePropagation: () => { stopped++; } };
  guard.arm(); guard.pop(event);
  assert.equal(forwards, 1);
  guard.pop(event); // the forward event restoring the editor
  guard.pop(event);
  assert.equal(confirms, 2);
  assert.equal(leaves, 1);
  assert.equal(stopped, 3);
});

test('a clean editor skips its sentinel without prompting or trapping Back', () => {
  let dirty = true, prompts = 0, backs = 0, stopped = 0;
  const guard = createEditHistoryGuard({
    dirty: () => dirty, confirm: () => { prompts++; return false; },
    push: () => {}, back: () => { backs++; }, leave: () => { throw new Error('clean editor should not redirect'); }, forward: () => {}
  });
  guard.arm();
  dirty = false;
  guard.pop({ stopImmediatePropagation: () => { stopped++; } });
  guard.pop({ stopImmediatePropagation: () => { stopped++; } });
  assert.equal(prompts, 0);
  assert.equal(backs, 1);
  assert.equal(stopped, 1);
});

test('fragment navigation keeps the dirty guard armed', () => {
  let href = 'https://example.test/order/edit', confirms = 0, stopped = 0;
  const guard = createEditHistoryGuard({
    dirty: () => true, confirm: () => { confirms++; return false; },
    push: () => {}, back: () => {}, leave: () => {}, forward: () => {}, location: () => href
  });
  const event = { stopImmediatePropagation: () => { stopped++; } };
  guard.arm();
  href += '#main'; guard.pop(event);
  href = 'https://example.test/order/edit'; guard.pop(event);
  assert.equal(confirms, 0);
  assert.equal(stopped, 0);
  guard.pop(event);
  assert.equal(confirms, 1);
  assert.equal(stopped, 1);
});

test('Back during a save restores the editor without a discard prompt', () => {
  let prompts = 0, notices = 0, forwards = 0, leaves = 0;
  const guard = createEditHistoryGuard({
    dirty: () => true, busy: () => true, notifyBusy: () => { notices++; },
    confirm: () => { prompts++; return true; }, push: () => {}, back: () => {},
    leave: () => { leaves++; }, forward: () => { forwards++; }
  });
  let stopped = 0;
  guard.arm(); guard.pop({ stopImmediatePropagation: () => { stopped++; } });
  assert.deepEqual({ prompts, notices, forwards, leaves, stopped }, { prompts: 0, notices: 1, forwards: 1, leaves: 0, stopped: 1 });
});
