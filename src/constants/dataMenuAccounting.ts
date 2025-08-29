import { theme } from "@/theme/theme";
import { IConfigDateMenuWin } from "./vcData";
const colors = theme.colors, nameIcon = "arrow-right-thin";
const icon: any = { type: "M", name: nameIcon, color: colors.secondary };
export const DataMenuAccounting: Record<string, Partial<Record<IKeyMenuWin, IConfigDateMenuWin[]>>> = {
    catalog: {
        acCatalogBalance: [],
        acCatalogBank: [],
        acCatalogGood: [
            {
                title: 'Hàng hoá', titleE: 'Goods',
                data: [
                    { id: 'WIN00031', typeWin: "(winTree)", tableWin: "DMNHHV", label: 'Nhóm hàng hóa', labelE: 'Group of goods', codeField: 'MA_NH_HV', icon: icon, row: 1, col: 1 },
                    { id: 'WIN00334', typeWin: "(winMaster)", tableWin: "DMHV", label: 'Hàng hóa - vật tư', labelE: 'Goods - supplies', icon: icon, row: 2, col: 1, typeView: { _typeView: 1 } },
                    { id: 'WIN00004', typeWin: "(window)", tableWin: "DMDVT", label: 'Đơn vị tính', labelE: 'Unit', icon: icon, row: 3, col: 1 },
                    { id: 'WIN00009', typeWin: "(winTree)", tableWin: "DMKHO", label: 'Danh mục kho hàng', labelE: 'Warehouse category', codeField: 'MA_KHO', icon: icon, row: 4, col: 1 },
                ]
            }
        ],
        acCatalogOther: [],
        acCatalogPartner: [
            {
                title: 'Danh mục', titleE: 'Category',
                data: [
                    { id: 'WIN00007', typeWin: "(winTree)", tableWin: "DMNHDT", label: 'Nhóm đối tượng', labelE: 'Group of objects', codeField: 'MA_NH_DT', icon: icon, row: 1, col: 1 },
                    { id: 'WIN00016', typeWin: "(winMaster)", tableWin: "DMDT", label: 'Đối tượng', labelE: 'Object', icon: icon, row: 2, col: 1 },
                    { id: 'WIN00005', typeWin: "(winTree)", tableWin: "DMBP", label: 'Bộ phận', labelE: 'Department', codeField: 'MA_BP', icon: icon, row: 2, col: 2 },
                    { id: 'WIN00015', typeWin: "(window)", tableWin: "DMPX", label: 'Phân xưởng', labelE: 'Factory', icon: icon, row: 3, col: 1 },
                    { id: 'WIN00006', typeWin: "(window)", tableWin: "DMTK", label: 'Tài khoản', labelE: 'Account categories', icon: icon, row: 3, col: 2 },
                    { id: 'WIN00023', typeWin: "(window)", tableWin: "DMOB", label: 'Tên người giao dịch', labelE: 'Name of transaction person', icon: icon, row: 4, col: 1 },
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
