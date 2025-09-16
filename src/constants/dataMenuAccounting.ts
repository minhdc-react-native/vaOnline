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
        baoCaoDonVi: [
            {
                title: 'Báo cáo kế toán', titleE: 'Accounting report',
                data: [
                    {
                        id: 'WIN00071', typeWin: "(report)", tableWin: "Empty", label: 'Chứng từ ghi sổ', labelE: 'Recording documents',
                        icon: icon, row: 1, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00027', typeWin: "(report)", tableWin: "Empty", label: 'Nhật ký chung', labelE: 'General Journal',
                        icon: icon, row: 2, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00072', typeWin: "(report)", tableWin: "Empty", label: 'Công nợ phải thu - phải trả', labelE: 'Receivable - payable debts',
                        icon: icon, row: 4, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00051', typeWin: "(report)", tableWin: "Empty", label: 'Nhập - xuất - tồn', labelE: 'Import-export-inventory',
                        icon: icon, row: 5, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00142', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo giá thành', labelE: 'Cost report',
                        icon: icon, row: 6, col: 1, typeView: { _typeView: 1 }
                    }
                ]
            },
            {
                title: 'Báo cáo TSCĐ & CCDC', titleE: 'Report on tools and intruments', expanded: false,
                data: [
                    {
                        id: 'WIN00085', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo Tài sản', labelE: 'Asset Report',
                        icon: icon, row: 1, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00086', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo công cụ, dụng cụ', labelE: 'Report on tools and instruments',
                        icon: icon, row: 2, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00280', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo danh mục TSCD/CCDC', labelE: 'Report on list of fixed assets - tools',
                        icon: icon, row: 3, col: 1, typeView: { _typeView: 1 }
                    }
                ]
            },
            {
                title: 'Báo cáo tài chính', titleE: 'Financial report', expanded: false,
                data: [
                    {
                        id: 'WIN00083', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo thuế GTGT', labelE: 'Value added tax report',
                        icon: icon, row: 1, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00091', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo tài chính (TT 133- B01a)', labelE: 'Financial report (TT 133- B01a)',
                        icon: icon, row: 2, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00318', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo tài chính (TT 133- B01b)', labelE: 'Financial report (TT 133- B01b)',
                        icon: icon, row: 3, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00084', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo tài chính (TT 200)', labelE: 'Financial report (TT 200)',
                        icon: icon, row: 4, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00180', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo tài chính (TT 132)', labelE: 'Financial report (TT 132)',
                        icon: icon, row: 5, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00367', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo tài chính (TT 201)', labelE: 'Financial report (TT 201)',
                        icon: icon, row: 6, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00399', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo tài chính (TT 71-HTX)', labelE: 'Financial report (TT 71)',
                        icon: icon, row: 7, col: 1, typeView: { _typeView: 1 }
                    }
                ]
            },
            {
                title: 'Báo cáo khác', titleE: 'Other reports', expanded: false,
                data: [
                    {
                        id: 'WIN00157', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo danh mục', labelE: 'Category report',
                        icon: icon, row: 1, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00281', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo đầu phiếu CT', labelE: 'Report of document listing',
                        icon: icon, row: 2, col: 1, typeView: { _typeView: 1 }
                    }
                ]
            }
        ],
        baoCaoToanNganh: [
            {
                title: 'Báo cáo kế toán', titleE: 'Accounting report',
                data: [
                    {
                        id: 'WIN00229', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo kế toán', labelE: 'Accounting report',
                        icon: icon, row: 1, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00230', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo công nợ', labelE: 'Debt report',
                        icon: icon, row: 2, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00231', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo hàng tồn kho', labelE: 'Inventory report',
                        icon: icon, row: 3, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00232', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo tài sản - công cụ', labelE: 'Report on tools and intruments',
                        icon: icon, row: 4, col: 1, typeView: { _typeView: 1 }
                    },
                ]
            },
            {
                title: 'Báo cáo tài chính', titleE: 'Financial report', expanded: false,
                data: [
                    {
                        id: 'WIN00233', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo thuế GTGT', labelE: 'Value added tax report',
                        icon: icon, row: 1, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00283', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo TNDN', labelE: 'Corporate Income Tax Report',
                        icon: icon, row: 2, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00234', typeWin: "(report)", tableWin: "Empty", label: 'Báo cáo tài chính', labelE: 'Financial report',
                        icon: icon, row: 3, col: 1, typeView: { _typeView: 1 }
                    },
                ]
            }
        ]
    },
    system: {

    },
    tool: {

    },
    voucher: {
        goodDocuments: [
            {
                title: 'Bán hàng - phải thu', titleE: 'Sales - receivables',
                data: [
                    {
                        id: 'WIN00122', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Báo giá', labelE: 'Quotation',
                        defaultValue: { MA_CT: 'PBG' }, copyDetails: { CTHV: ['MA_KHO', 'TK_NO2'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 1, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00125', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Đơn đặt hàng', labelE: 'Order',
                        defaultValue: { MA_CT: 'DDH' }, copyDetails: { CTHV: ['MA_KHO', 'TK_NO2'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 2, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00052', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Hóa đơn bán hàng', labelE: 'Sale invoice',
                        defaultValue: { MA_CT: 'PBH' }, copyDetails: { CTHV: ['MA_KHO', 'TK_NO2'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 3, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00076', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Hóa đơn dịch vụ', labelE: 'Service invoice',
                        defaultValue: { MA_CT: 'PDV' }, copyDetails: { CTHV: ['MA_KHO', 'TK_NO'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 4, col: 1, typeView: { _typeView: 1 }
                    },
                    { id: 'LINE-WIN00076', typeWin: "(custom)", tableWin: "Empty", label: '', labelE: '', row: 5, col: 1 },
                    {
                        id: 'WIN00077', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Hóa đơn bán hàng, dịch vụ trực tiếp', labelE: 'Direct sales and service invoices',
                        defaultValue: { MA_CT: 'BH0' }, copyDetails: { CTHV: ['MA_KHO', 'TK_NO2'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 6, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00054', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Hàng bán bị trả lại', labelE: 'Returned goods',
                        defaultValue: { MA_CT: 'PTL' }, copyDetails: { CTHV: ['MA_KHO', 'TK_CO2'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 7, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00361', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Hàng bán bị trả lại (giá thực tế)', labelE: 'Returned goods (actual price)',
                        defaultValue: { MA_CT: 'TLT' }, copyDetails: { CTHV: ['MA_KHO', 'TK_CO2'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 8, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00252', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Bán hàng mã vạch', labelE: 'Barcode sales',
                        defaultValue: { MA_CT: 'BMV' }, copyDetails: { CTHV: ['MA_KHO', 'TK_NO'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 9, col: 1, typeView: { _typeView: 1 }
                    },
                ]
            },
            {
                title: 'Mua hàng - phải trả', titleE: 'Purchases - payables', expanded: false,
                data: [
                    {
                        id: 'WIN00126', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Đơn mua hàng', labelE: 'Purchase order',
                        defaultValue: { MA_CT: 'DMH' }, copyDetails: { CTHV: ['MA_KHO', 'TK_CO'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 1, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00049', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Phiếu nhập kho', labelE: 'Goods Inward Note',
                        defaultValue: { MA_CT: 'PNH' }, copyDetails: { CTHV: ['MA_KHO', 'TK_CO'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 2, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00062', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Phiếu nhập khẩu', labelE: 'Import slip',
                        defaultValue: { MA_CT: 'PNK' }, copyDetails: { CTHV: ['MA_KHO', 'TK_CO'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 3, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00075', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Phiếu nhập chi phi', labelE: 'Expense entry slip',
                        defaultValue: { MA_CT: 'PCP' }, copyDetails: { CTHV: ['MA_KHO', 'TK_CO'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 4, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00215', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Phiếu nhập xuât thẳng', labelE: 'Direct import and export slip',
                        defaultValue: { MA_CT: 'PNX' }, copyDetails: { CTHV: ['MA_KHO', 'TK_NO', 'TK_CO'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 6, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00216', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Phiếu NXT (không qua kho)', labelE: 'Direct import and export slip (not warehouse)',
                        defaultValue: { MA_CT: 'NXT' }, copyDetails: { CTHV: ['MA_KHO', 'TK_NO', 'TK_CO'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 7, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00130', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Phiếu nhập thành phẩm', labelE: 'Finished product input slip',
                        defaultValue: { MA_CT: 'PTP' }, copyDetails: { CTHV: ['MA_KHO', 'TK_CO'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 8, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00131', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Phiếu nhập thu hồi', labelE: 'Recalled input slip',
                        defaultValue: { MA_CT: 'PTH' }, copyDetails: { CTHV: ['MA_KHO', 'TK_CO'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 9, col: 1, typeView: { _typeView: 1 }
                    },
                ]
            },
            {
                title: 'Chức từ khác', titleE: 'Other vouchers', expanded: false,
                data: [
                    {
                        id: 'WIN00057', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Phiếu xuất kho', labelE: 'Delivery slip',
                        defaultValue: { MA_CT: 'PXH' }, copyDetails: { CTHV: ['MA_KHO', 'TK_NO'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 1, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00058', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Phiếu xuất điều chuyển', labelE: 'Transfer export slip',
                        defaultValue: { MA_CT: 'PDC' }, copyDetails: { CTHV: ['MA_KHO', 'TK_NO', 'TK_CO'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 2, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00253', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Phiếu chuyển đổi hàng', labelE: 'Goods conversion slip',
                        defaultValue: { MA_CT: 'PCH' }, copyDetails: { CTHV: ['MA_KHO', 'TK_NO', 'TK_CO'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 3, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00063', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Phiếu xuất trả lại nhà cung cấp', labelE: 'Slip of delivery to return to supplier',
                        defaultValue: { MA_CT: 'XTL' }, copyDetails: { CTHV: ['MA_KHO', 'TK_NO'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 4, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00251', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Phiếu xuất kho (giá thực tế)', labelE: 'Warehouse delivery slip (actual price)',
                        defaultValue: { MA_CT: 'PXT' }, copyDetails: { CTHV: ['MA_KHO', 'TK_CO'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 6, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00081', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Phiếu xuất lắp ráp', labelE: 'Assembly delivery slip',
                        defaultValue: { MA_CT: 'PLR' }, copyDetails: { CTHV: ['MA_KHO', 'TK_NO', 'TK_CO'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 7, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00082', typeWin: "(winMaster)", tableWin: "DPHV", label: 'Phiếu xuất tháo dỡ (giá thực tế)', labelE: 'Dismantling delivery slip (actual price)',
                        defaultValue: { MA_CT: 'PTR' }, copyDetails: { CTHV: ['MA_KHO', 'TK_NO'], PSTHUE: ['TK_NO'], PSCF: ['TK_CO'] }, icon: icon, row: 8, col: 1, typeView: { _typeView: 1 }
                    },
                ]
            }
        ],
        accountingDocuments: [
            {
                title: 'Tiền mặt - tiền gửi', titleE: 'Cash - deposits',
                data: [
                    {
                        id: 'WIN00018', typeWin: "(winMaster)", tableWin: "DPKT", label: 'Phiếu thu tiền', labelE: 'Receipt',
                        defaultValue: { MA_CT: 'PTT' }, copyDetails: { CTKT: ['TK_NO', 'TK_CO'] }, icon: icon, row: 1, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00033', typeWin: "(winMaster)", tableWin: "DPKT", label: 'Phiếu chi tiền', labelE: 'Payment slip',
                        defaultValue: { MA_CT: 'PCT' }, copyDetails: { CTKT: ['TK_NO', 'TK_CO'] }, icon: icon, row: 2, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00038', typeWin: "(winMaster)", tableWin: "DPKT", label: 'Báo nợ ngân hàng', labelE: 'Bank debt report',
                        defaultValue: { MA_CT: 'GBN' }, copyDetails: { CTKT: ['TK_NO', 'TK_CO'] }, icon: icon, row: 3, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00039', typeWin: "(winMaster)", tableWin: "DPKT", label: 'Báo có ngân hàng', labelE: 'Bank credit report',
                        defaultValue: { MA_CT: 'GBC' }, copyDetails: { CTKT: ['TK_NO', 'TK_CO'] }, icon: icon, row: 4, col: 1, typeView: { _typeView: 1 }
                    },
                ]
            },
            {
                title: 'Chứng từ khác', titleE: 'Other vouchers',
                data: [
                    {
                        id: 'WIN00040', typeWin: "(winMaster)", tableWin: "DPKT", label: 'Phiếu kế toán khác', labelE: 'Other accounting slips',
                        defaultValue: { MA_CT: 'PKT' }, copyDetails: { CTKT: ['TK_NO', 'TK_CO'] }, icon: icon, row: 1, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00043', typeWin: "(winMaster)", tableWin: "DPKT", label: 'Phiếu hoàn ứng', labelE: 'Refund slip',
                        defaultValue: { MA_CT: 'PHU' }, copyDetails: { CTKT: ['TK_NO', 'TK_CO'] }, icon: icon, row: 2, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00041', typeWin: "(winMaster)", tableWin: "DPKT", label: 'Phiếu bù trừ công nợ', labelE: 'Debt clearing slip',
                        defaultValue: { MA_CT: 'BCN' }, copyDetails: { CTKT: ['TK_NO', 'TK_CO'] }, icon: icon, row: 3, col: 1, typeView: { _typeView: 1 }
                    },
                    {
                        id: 'WIN00042', typeWin: "(winMaster)", tableWin: "DPKT", label: 'Chứng từ phát sinh thuế', labelE: 'Tax arising documents',
                        defaultValue: { MA_CT: 'VAT' }, copyDetails: { CTKT: ['TK_NO', 'TK_CO'] }, icon: icon, row: 4, col: 1, typeView: { _typeView: 1 }
                    },
                ]
            }
        ],
        congTacCuoiKy: [
            {
                title: 'Chức năng', titleE: 'Function',
                data: [
                    {
                        id: 'TINH_GV', typeWin: "(custom)", tableWin: "Empty", label: 'Tính giá vốn hàng xuất', labelE: 'Calculate cost of exported goods',
                        icon: icon, row: 1, col: 1
                    },
                    {
                        id: 'WIN00227', typeWin: "(custom)", tableWin: "Empty", label: 'Phân bổ kết chuyển tự động', labelE: 'Automatic forward allocation',
                        icon: icon, row: 2, col: 1
                    },
                ]
            }
        ]
    }
}
