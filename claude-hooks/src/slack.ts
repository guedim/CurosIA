const WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL ?? "";

export interface PendingOrderAlert {
  order_number: string;
  customer_name: string;
  phone: string | null;
  days_pending: number;
}

export async function sendOrderAlert(
  orders: PendingOrderAlert[],
): Promise<void> {
  if (!WEBHOOK_URL) {
    throw new Error("SLACK_WEBHOOK_URL environment variable is not set");
  }

  const lines = orders.map(
    (o) =>
      `• *${o.customer_name}* — Order \`${o.order_number}\` (${o.days_pending}d pending) — Phone: ${o.phone ?? "N/A"}`,
  );

  const text =
    `:warning: *${orders.length} order(s) have been pending for more than 3 days:*\n` +
    lines.join("\n");

  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channel: "#order-alerts", text }),
  });

  if (!response.ok) {
    throw new Error(
      `Slack webhook failed: ${response.status} ${response.statusText}`,
    );
  }
}
