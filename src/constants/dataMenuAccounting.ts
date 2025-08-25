import { IConfigDateMenuWin } from "./vcData";

export const DataMenuAccounting: Record<string, Partial<Record<IKeyMenuWin, IConfigDateMenuWin[]>>> = {
    catalog: {
        acCatalogBalance: [],
        acCatalogBank: [],
        acCatalogGood: [],
        acCatalogOther: [],
        acCatalogPartner: [
            {
                title: 'Danh mục',
                data: [
                    { id: 'WIN00007', typeWin: "(winTree)", label: 'Nhóm đối tượng', tableWin: "Empty", row: 1, col: 1 },
                    { id: 'WIN00016', typeWin: "(window)", label: 'Đối tượng', tableWin: "Empty", row: 2, col: 1 },
                    { id: 'WIN00005', typeWin: "(winTree)", label: 'Bộ phận', tableWin: "Empty", row: 2, col: 2 },
                    { id: 'WIN00015', typeWin: "(window)", label: 'Phân xưởng', tableWin: "Empty", row: 3, col: 1 },
                    { id: 'WIN00006', typeWin: "(winTree)", label: 'Tài khoản', tableWin: "Empty", row: 3, col: 2 },
                    { id: 'WIN00023', typeWin: "(window)", label: 'Tên người giao dịch', tableWin: "Empty", row: 4, col: 1 },
                ]
            }
        ]
    },
    costing: {

    },
    invoice: {

    },
    report: {

    },
    system: {

    },
    tool: {

    },
    voucher: {

    },
}
