import { open } from "sqlite";
import sqlite3 from "sqlite3";

import { createSchema } from "./schema";
import { getOverduePendingOrders } from "./queries/order_queries";
import { sendOrderAlert } from "./slack";

async function main() {
  const db = await open({
    filename: "ecommerce.db",
    driver: sqlite3.Database,
  });

  await createSchema(db, false);

  const overdueOrders = await getOverduePendingOrders(db);
  if (overdueOrders.length > 0) {
    await sendOrderAlert(overdueOrders);
    console.log(
      `Sent Slack alert for ${overdueOrders.length} overdue order(s).`,
    );
  } else {
    console.log("No overdue pending orders.");
  }
}

main();
