/**
 * Deletes what we promised to delete.
 *
 * The privacy page says details and PDFs are erased 14 days after purchase.
 * That promise is only true if this runs, so run it on a schedule:
 *   node --experimental-strip-types scripts/sweep.ts
 */
import { eraseOrder, expiredOrders } from '../src/lib/orders.ts';

const rows = await expiredOrders();
let erased = 0;

// Revisit erased orders too to collect legacy orphans. Cleanup is repeatable.
for (const row of rows) {
  if (await eraseOrder(row.token)) erased += 1;
}

console.log(`Erased ${erased} orders; checked ${rows.length} expired or erased orders.`);
process.exit(0);
