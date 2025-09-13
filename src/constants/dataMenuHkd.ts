import { theme } from "@/theme/theme";
import { IConfigDateMenuWin } from "./vcData";
const colors = theme.colors, nameIcon = "arrow-right-thin";
const icon: any = { type: "M", name: nameIcon, color: colors.secondary };
export const DataMenuHkd: Record<string, Partial<Record<IKeyMenuWin, IConfigDateMenuWin[]>>> = {
    catalog: {
        acCatalogBalance: [],
        acCatalogBank: [],
        acCatalogGood: [
            {
                title: 'Hàng hoá', titleE: 'Goods',
                data: [
                    { id: 'WIN00333', typeWin: "(winTree)", tableWin: "DMNHHV", label: 'Nhóm hàng hóa', labelE: 'Group of goods', codeField: 'MA_NH_HV', icon: icon, row: 1, col: 1 },
                    { id: 'WIN00017', typeWin: "(winMaster)", tableWin: "DMHV", label: 'Hàng hóa - vật tư', labelE: 'Goods - supplies', icon: icon, row: 2, col: 1, typeView: { _typeView: 2 } },
                    { id: 'WIN00336', typeWin: "(window)", tableWin: "DMDVT", label: 'Đơn vị tính', labelE: 'Unit', icon: icon, row: 3, col: 1 },
                    { id: 'WIN00335', typeWin: "(winTree)", tableWin: "DMKHO", label: 'Danh mục kho hàng', labelE: 'Warehouse category', codeField: 'MA_KHO', icon: icon, row: 4, col: 1 },
                ]
            }
        ],
        acCatalogOther: [],
        acCatalogPartner: [
            {
                title: 'Danh mục', titleE: 'Category',
                data: [
                    { id: 'WIN00331', typeWin: "(winTree)", tableWin: "DMNHDT", label: 'Nhóm đối tượng', labelE: 'Group of objects', codeField: 'MA_NH_DT', icon: icon, row: 1, col: 1 },
                    { id: 'WIN00332', typeWin: "(winMaster)", tableWin: "DMDT", label: 'Đối tượng', labelE: 'Object', icon: icon, row: 2, col: 1 },
                    { id: 'WIN00338', typeWin: "(window)", tableWin: "DMTK", label: 'Tài khoản', labelE: 'Account categories', icon: icon, row: 3, col: 2 },
                ]
            }
        ]
    },
    invoice: {

    },
    report: {
        baoCaoDonVi: [
            {
                title: 'Báo cáo kế toán', titleE: 'Accounting report',
                data: [
                    {
                        id: 'WIN00330', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo TT88', labelE: 'Report TT88',
                        icon: icon, row: 1, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00398', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo khác', labelE: 'Other report',
                        icon: icon, row: 2, col: 1, typeView: { _typeView: 1 }
                    }
                ]
            }
        ]
    },
    system: {

    },
    voucher: {
        goodDocuments: [
            {
                title: 'Chứng từ', titleE: 'Vouchers',
                data: [
                    {
                        id: 'WIN00323', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Phiếu nhập kho', labelE: 'Warehouse input slip',
                        defaultValue: { MA_CT: 'PN8' }, copyDetails: { CTHV: ['MA_KHO', 'TK_CO'] }, icon: icon, row: 1, col: 1, typeView: { _typeView: 2 }
                    },
                    {
                        id: 'WIN00324', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Hóa đơn bán hàng', labelE: 'Sale invoice',
                        defaultValue: { MA_CT: 'BH8' }, copyDetails: { CTHV: ['MA_KHO', 'TK_CO'] }, icon: icon, row: 2, col: 1, typeView: { _typeView: 2 }
                    },
                    {
                        id: 'WIN00362', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Bán hàng mã vạch', labelE: 'Barcode sales',
                        defaultValue: { MA_CT: 'MV8' }, copyDetails: { CTHV: ['MA_KHO', 'TK_CO'] }, icon: icon, row: 3, col: 1, typeView: { _typeView: 2 }
                    },
                    {
                        id: 'WIN00352', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Phiếu xuất kho', labelE: 'Delivery slip',
                        defaultValue: { MA_CT: 'PX8' }, copyDetails: { CTHV: ['MA_KHO', 'TK_NO'] }, icon: icon, row: 4, col: 1, typeView: { _typeView: 2 }
                    },
                ]
            }
        ],
        accountingDocuments: [
            {
                title: 'Chứng từ', titleE: 'Vouchers',
                data: [
                    {
                        id: 'WIN00321', typeWin: "(winMaster)", tableWin: "DPKT", label: 'Phiếu thu tiền', labelE: 'Receipt',
                        defaultValue: { MA_CT: 'PT8' }, copyDetails: { CTKT: ['TK_NO', 'TK_CO'] }, icon: icon, row: 1, col: 1, typeView: { _typeView: 2 }
                    },
                    {
                        id: 'WIN00322', typeWin: "(winMaster)", tableWin: "DPKT", label: 'Phiếu chi tiền', labelE: 'Payment slip',
                        defaultValue: { MA_CT: 'PC8' }, copyDetails: { CTKT: ['TK_NO', 'TK_CO'] }, icon: icon, row: 2, col: 1, typeView: { _typeView: 2 }
                    },
                    {
                        id: 'WIN00326', typeWin: "(winMaster)", tableWin: "DPKT", label: 'Báo nợ ngân hàng (chi)', labelE: 'Bank debt report',
                        defaultValue: { MA_CT: 'BN8' }, copyDetails: { CTKT: ['TK_NO', 'TK_CO'] }, icon: icon, row: 3, col: 1, typeView: { _typeView: 2 }
                    },
                    {
                        id: 'WIN00327', typeWin: "(winMaster)", tableWin: "DPKT", label: 'Báo có ngân hàng (thu)', labelE: 'Bank credit report',
                        defaultValue: { MA_CT: 'BC8' }, copyDetails: { CTKT: ['TK_NO', 'TK_CO'] }, icon: icon, row: 4, col: 1, typeView: { _typeView: 2 }
                    },
                    {
                        id: 'WIN00325', typeWin: "(winMaster)", tableWin: "DPKT", label: 'Phiếu kế toán khác', labelE: 'Other accounting slips',
                        defaultValue: { MA_CT: 'KT8' }, copyDetails: { CTKT: ['TK_NO', 'TK_CO'] }, icon: icon, row: 5, col: 1, typeView: { _typeView: 2 }
                    },
                ]
            }
        ],
        congTacCuoiKy: [
            {
                title: 'Chức năng', titleE: 'Function',
                data: [
                    {
                        id: 'WIN00337', typeWin: "(custom)", tableWin: "Empty", label: 'Tính giá vốn hàng xuất', labelE: 'Calculate cost of exported goods',
                        icon: icon, row: 1, col: 1, typeView: { _typeView: 1 }
                    },
                ]
            }
        ]
    },
}
