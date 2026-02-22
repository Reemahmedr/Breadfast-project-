export function invoiceTemplate(order: any) {
  const address = order.addresses;
  const items = order.order_items;

  return `
  <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; background: #f9f5ff; color: #1a1a2e; }

        .page { max-width: 780px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(107,33,168,0.10); }

        /* Header */
        .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); padding: 40px 48px 32px; color: white; }
        .header-top { display: flex; justify-content: space-between; align-items: center; }
        .brand { display: flex; align-items: center; gap: 12px; }
        .brand-icon { width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .brand-name { font-size: 28px; font-weight: 800; letter-spacing: -1px; }
        .brand-tagline { font-size: 11px; opacity: 0.75; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }
        .invoice-label { text-align: right; }
        .invoice-label .title { font-size: 12px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.75; }
        .invoice-label .number { font-size: 24px; font-weight: 800; margin-top: 4px; letter-spacing: -0.5px; }
        .header-divider { border: none; border-top: 1px solid rgba(255,255,255,0.25); margin: 24px 0; }
        .header-meta { display: flex; gap: 40px; }
        .meta-item .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.7; }
        .meta-item .value { font-size: 14px; font-weight: 600; margin-top: 3px; }

        /* Body */
        .body { padding: 40px 48px; }

        /* Section title */
        .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #9333ea; font-weight: 700; margin-bottom: 12px; }

        /* Address */
        .address-box { background: #faf5ff; border: 1px solid #e9d5ff; border-left: 4px solid #9333ea; border-radius: 10px; padding: 18px 22px; margin-bottom: 36px; }
        .address-box .name { font-size: 14px; font-weight: 700; color: #1a1a2e; margin-bottom: 6px; text-transform: capitalize; }
        .address-box p { font-size: 13px; color: #4b5563; line-height: 1.9; text-transform: capitalize; }
        .address-box .phone { margin-top: 8px; font-size: 13px; color: #9333ea; font-weight: 600; }

        /* Table */
        table { width: 100%; border-collapse: collapse; margin-bottom: 32px; border-radius: 12px; overflow: hidden; }
        thead tr { background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); }
        thead th { padding: 13px 18px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: white; font-weight: 700; }
        thead th:last-child { text-align: right; }
        tbody tr { border-bottom: 1px solid #f3e8ff; }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:nth-child(even) { background: #fdf4ff; }
        tbody td { padding: 14px 18px; font-size: 14px; color: #374151; }
        tbody td:last-child { text-align: right; font-weight: 700; color: #1a1a2e; }
        .product-name { font-weight: 600; color: #1a1a2e; }
        .qty-badge { display: inline-block; background: #f3e8ff; color: #9333ea; font-weight: 700; font-size: 12px; padding: 2px 10px; border-radius: 20px; }

        /* Totals */
        .totals { display: flex; justify-content: flex-end; margin-bottom: 36px; }
        .totals-box { width: 300px; background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px; overflow: hidden; }
        .totals-row { display: flex; justify-content: space-between; padding: 12px 20px; font-size: 14px; color: #6b7280; border-bottom: 1px solid #f3e8ff; }
        .totals-row:last-child { border-bottom: none; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); }
        .totals-row.grand-total { color: white; font-size: 17px; font-weight: 800; padding: 16px 20px; }

        /* Footer */
        .footer { background: linear-gradient(135deg, #faf5ff 0%, #fdf2f8 100%); border-top: 1px solid #e9d5ff; padding: 24px 48px; display: flex; justify-content: space-between; align-items: center; }
        .footer-note { font-size: 13px; color: #9ca3af; }
        .footer-brand { font-size: 13px; font-weight: 800; background: linear-gradient(135deg, #9333ea, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.3px; }
      </style>
    </head>
    <body>
      <div class="page">

        <!-- Header -->
        <div class="header">
          <div class="header-top">
            <div class="brand">
              <div class="brand-icon">🥐</div>
              <div>
                <div class="brand-name">breadfast</div>
                <div class="brand-tagline">Fresh to your door</div>
              </div>
            </div>
            <div class="invoice-label">
              <div class="title">Invoice</div>
              <div class="number">#${order.order_number}</div>
            </div>
          </div>
          <hr class="header-divider" />
          <div class="header-meta">
            <div class="meta-item">
              <div class="label">Issue Date</div>
              <div class="value">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
            </div>
            <div class="meta-item">
              <div class="label">Status</div>
              <div class="value">✓ Paid</div>
            </div>
          </div>
        </div>

        <!-- Body -->
        <div class="body">

          <!-- Address -->
          <div class="section-title">Delivery Address</div>
          <div class="address-box">
            <div class="name">${address?.label || ""}</div>
            <p>
              ${address?.street_address}, ${address?.area}, ${address?.city}<br/>
              ${address?.building ? `Building: ${address.building}` : ""}
              ${address?.floor ? ` &nbsp;·&nbsp; Floor: ${address.floor}` : ""}
              ${address?.apartment ? ` &nbsp;·&nbsp; Apt: ${address.apartment}` : ""}
            </p>
            <p class="phone">📞 ${address?.phone}</p>
          </div>

          <!-- Items -->
          <div class="section-title">Order Items</div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((item: any) => `
                <tr>
                  <td class="product-name">${item.product_name}</td>
                  <td><span class="qty-badge">${item.quantity}</span></td>
                  <td>${item.unit_price} EGP</td>
                  <td>${item.total_price} EGP</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <!-- Totals -->
          <div class="totals">
            <div class="totals-box">
              <div class="totals-row grand-total">
                <span>Total Amount</span>
                <span>${order.total_amount} EGP</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="footer">
          <span class="footer-note">Thank you for choosing breadfast ❤️</span>
          <span class="footer-brand">breadfast © ${new Date().getFullYear()}</span>
        </div>

      </div>
    </body>
  </html>
`;
}