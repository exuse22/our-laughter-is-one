
type OrderEmailDetails = {
  customerName: string;
  orderReference: string;
  edition: string;
  format: string;
  priceETB: number;
  status: string;
};

export function createOrderEmail(order: OrderEmailDetails) {
  const messages: Record<string, string> = {
    pending: "We have received your order.",
    processing: "Your book order is now being prepared.",
    shipped: "Your book is on its way to you!",
    completed: "Your order has been completed. Thank you!",
    cancelled: "Your order has been cancelled.",
  };

  const message =
    messages[order.status] ||
    "Your order status has been updated.";

  const safe = (value: string) =>
    value.replace(/[&<>"']/g, (char) => {
      const entities: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return entities[char];
    });

  return {
    subject: `Order Update | ${order.orderReference}`,
    html: `
      <div style="margin:0;padding:35px 12px;background:#090806;font-family:Arial,sans-serif;">
        <div style="max-width:600px;margin:auto;background:#f5eddf;border:1px solid #bd9145;">

          <div style="padding:38px 24px;text-align:center;background:#090806;">
            <div style="font-size:12px;letter-spacing:5px;color:#d9ad5c;">
              OUR LAUGHTER IS ONE
            </div>
            <div style="width:55px;height:1px;background:#bd9145;margin:22px auto;"></div>
            <h1 style="margin:0;color:#f5eddf;font-size:29px;font-weight:400;">
              Your Order Update
            </h1>
            <p style="margin:14px 0 0;color:#d9ad5c;font-size:13px;letter-spacing:2px;">
              READ • SMILE • BE UNITED.
            </p>
          </div>

          <div style="padding:35px 28px;">
            <p style="color:#6e604c;font-size:13px;letter-spacing:2px;">
              A MESSAGE FOR YOU
            </p>

            <h2 style="color:#211b12;font-size:23px;font-weight:400;">
              Hello ${safe(order.customerName)},
            </h2>

            <p style="color:#514633;font-size:16px;line-height:1.7;">
              ${safe(message)}
            </p>

            <div style="margin:28px 0;padding:22px;background:#090806;">
              <p style="margin:0 0 10px;color:#d9ad5c;font-size:11px;letter-spacing:2px;">
                ORDER REFERENCE
              </p>
              <p style="margin:0;color:#f5eddf;font-size:17px;word-break:break-word;">
                ${safe(order.orderReference)}
              </p>
              <div style="height:1px;background:#59472b;margin:20px 0;"></div>
              <p style="margin:0;color:#d9ad5c;font-size:11px;letter-spacing:2px;">
                CURRENT STATUS
              </p>
              <p style="margin:10px 0 0;color:#f5eddf;font-size:19px;text-transform:capitalize;">
                ${safe(order.status)}
              </p>
            </div>

            <h3 style="color:#bd9145;font-size:13px;letter-spacing:2px;font-weight:400;">
              ORDER SUMMARY
            </h3>

            <table style="width:100%;border-collapse:collapse;color:#514633;font-size:14px;">
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #ded2bd;">Edition</td>
                <td style="padding:12px 0;border-bottom:1px solid #ded2bd;text-align:right;">${safe(order.edition)}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #ded2bd;">Format</td>
                <td style="padding:12px 0;border-bottom:1px solid #ded2bd;text-align:right;">${safe(order.format)}</td>
              </tr>
              <tr>
                <td style="padding:15px 0;font-weight:bold;color:#211b12;">Total</td>
                <td style="padding:15px 0;text-align:right;font-weight:bold;color:#bd9145;">
                  ${Number(order.priceETB).toLocaleString("en-US")} ETB
                </td>
              </tr>
            </table>

            <p style="margin-top:30px;color:#514633;font-size:14px;line-height:1.7;">
              Thank you for being part of our journey. Different languages, one humanity, one shared laughter.
            </p>
          </div>

          <div style="padding:25px;text-align:center;background:#090806;">
            <p style="margin:0;color:#d9ad5c;font-size:14px;letter-spacing:2px;">
              READ • SMILE • BE UNITED.
            </p>
            <p style="margin:12px 0 0;color:#a99b83;font-size:11px;">
              OUR LAUGHTER IS ONE
            </p>
          </div>

        </div>
      </div>
    `,
  };
}
