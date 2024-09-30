const outstandingBlocks: any[] = [
  {
    id: "heading",
    label: "Heading",
    content: `<section style="margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h1 style="font-size: 28px; font-weight: 700; color: #333; margin: 0; padding-bottom: 10px; border-bottom: 2px solid #e0e0e0; font-family: Arial, sans-serif; text-align: center;">
          Heading Name
        </h1>
      </section>`,
  },
  {
    id: "subheading",
    label: "Sub-Heading",
    content: `<section style="margin-bottom: 25px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="font-size: 22px; font-weight: 600; color: #444; margin: 0; padding-bottom: 10px; border-bottom: 1px solid #ccc; font-family: Arial, sans-serif; text-align: center;">
          Sub-Heading Name
        </h2>
      </section>`,
  },
  {
    id: "paragraph",
    label: "Paragraph",
    content: `<section style="margin-bottom: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <p style="font-size: 16px; line-height: 1.8; color: #555; margin: 0; text-align: justify; font-family: Arial, sans-serif;">
          Type here
        </p>
      </section>`,
  },
  {
    id: "partyName",
    label: "Party Name",
    content: `<section>
        <span style="font-weight: 600; font-size: 18px; color: #2c3e50; display: block; margin-bottom: 10px; font-family: Arial, sans-serif; text-align: left;">
          {{.PartyName}}
        </span>
      </section>`,
  },

  {
    id: "address",
    label: "Party Address",
    content: `<section>
        <address style="font-style: normal; font-size: 16px; line-height: 1.6; color: #555; margin: 0; font-family: Arial, sans-serif; text-align: left;">
          {{.Address}}
        </address>
      </section>`,
  },

  {
    id: "bills",
    label: "<b>Bills</b>",
    attributes: { class: "gjs-block-section" },
    content: `
      <section style="margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <div style="font-family: Arial, sans-serif;">
          <table style="width: 100%; border-collapse: collapse; background-color: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <thead>
              <tr>
                <th style="padding: 15px; text-align: left; background-color: #f8f9fa; font-weight: 600; color: #333; border: 1px solid #dee2e6;">Bill Date</th>
                <th style="padding: 15px; text-align: left; background-color: #f8f9fa; font-weight: 600; color: #333; border: 1px solid #dee2e6;">Bill Number</th>
                <th style="padding: 15px; text-align: right; background-color: #f8f9fa; font-weight: 600; color: #333; border: 1px solid #dee2e6;">Bill Amount</th>
                <th style="padding: 15px; text-align: left; background-color: #f8f9fa; font-weight: 600; color: #333; border: 1px solid #dee2e6;">Due Date</th>
                <th style="padding: 15px; text-align: right; background-color: #f8f9fa; font-weight: 600; color: #333; border: 1px solid #dee2e6;">Delay Days</th>
              </tr>
            </thead>
            <tbody>
              {{range .Bills}}
              <tr>
                <td style="padding: 12px 15px; text-align: left; border: 1px solid #dee2e6; color: #555;">{{.BillDate}}</td>
                <td style="padding: 12px 15px; text-align: left; border: 1px solid #dee2e6; color: #333; font-weight: 500;">{{.BillName}}</td>
                <td style="padding: 12px 15px; text-align: right; border: 1px solid #dee2e6; color: #333;">{{.AmountStr}}</td>
                <td style="padding: 12px 15px; text-align: left; border: 1px solid #dee2e6; color: #555;">{{.DueDate}}</td>
                <td style="padding: 12px 15px; text-align: right; border: 1px solid #dee2e6; color: #e74c3c; font-weight: 500;">{{.DelayDays}}</td>
              </tr>
              {{end}}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="text-align: right; padding: 15px; font-weight: 600; color: #333; border-top: 2px solid #dee2e6;">Total</td>
                <td style="padding: 15px; text-align: right; font-weight: 600; color: #e74c3c; border-top: 2px solid #dee2e6;">{{.TotalAmountStr}}</td>
                <td colspan="2" style="padding: 15px; border-top: 2px solid #dee2e6;"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    `,
  },
];

export { outstandingBlocks };
