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

// eraseOrder removes the cached PDF along with the details.
for (const row of rows) {
  if (await eraseOrder(row.token)) erased += 1;
}

console.log(`Swept ${erased} of ${rows.length} expired orders.`);
process.exit(0);
