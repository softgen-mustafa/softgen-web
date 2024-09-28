const outstandingBlocks: any[] = [
  {
    id: "heading",
    label: "Heading",
    content: '<div data-gjs-type="text">Heading Name</div>',
  },
  {
    id: "subheading",
    label: "Sub-Heading",
    content: '<div data-gjs-type="text">Sub-Heading Name</div>',
  },
  {
    id: "paragraph",
    label: "Paragraph",
    content: '<div data-gjs-type="text">Type here</div>',
  },
  {
    id: "partyName",
    label: "Party Name",
    content: "<span>{{.PartyName}}</span>",
  },
  {
    id: "address",
    label: "Party Address",
    content: "<span>{{.Address}}</span>",
  },
  {
    id: "bills",
    label: "<b>Bills</b>",
    attributes: { class: "gjs-block-section" },
    content: `<div >
            <table>
                <thead>
                    <tr>
                        <th>Bill Date</th>
                        <th>Bill Number</th>
                        <th>Bill Amount</th>
                        <th>Due Date</th>
                        <th>Delay Days</th>
                    </tr>
                </thead>
                <tbody>
                    {{range .Bills}}
                    <tr>
                        <td class="date">{{.BillDate}}</td>
                        <td>{{.BillName}}</td>
                        <td class="amount">{{.AmountStr}}</td>
                        <td class="date">{{.DueDate}}</td>
                        <td class="amount">{{.DelayDays}}</td>
                    </tr>
                    {{end}}
                </tbody>
                <tfoot>
                        <td></td>
                        <td>Total</td>
                        <td class="amount">{{.TotalAmountStr}}</td>
                        <td></td>
                        <td></td>
                </tfoot>
            </table>
        </div>`,
  },
];

export { outstandingBlocks };
