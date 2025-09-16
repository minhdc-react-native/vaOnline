import { IDataSource } from "@/schema";
import { DataMenuAccounting } from "./dataMenuAccounting";
import { DataMenuAdmin } from "./dataMenuAdmin";
import { DataMenuHkd } from "./dataMenuHkd";
import { getColor, getColorHv } from "./getColor";
export const VcData = {
    listApp: ['d72ee2a8-88ff-45b4-9c04-41f71d93e282', '3dfaf3c6-cff1-47c9-9a25-e3533a433eb7', '52105373-95f1-40f3-9899-9b77852b7209'], // kế toán, hộ kinh doanh, quản trị
    iconApp: {
        'd72ee2a8-88ff-45b4-9c04-41f71d93e282': 'calculator-variant',
        '3dfaf3c6-cff1-47c9-9a25-e3533a433eb7': 'storefront',
        '52105373-95f1-40f3-9899-9b77852b7209': 'account-cog'
    },
    routerApp: {
        'd72ee2a8-88ff-45b4-9c04-41f71d93e282': '/accounting',
        '3dfaf3c6-cff1-47c9-9a25-e3533a433eb7': '/hkd',
        '52105373-95f1-40f3-9899-9b77852b7209': '/admin'
    },
    drawerTitle: {
        dashboard: 'Trang chủ',
        catalog: 'Danh mục',
        voucher: 'Chứng từ',
        invoice: 'Hoá đơn',
        tool: 'TSCĐ - CCDC',
        costing: 'Giá thành',
        report: 'Báo cáo',
        system: 'Hệ thống'
    },
    drawerTitleE: {
        dashboard: 'Dashboard',
        catalog: 'Catalog',
        voucher: 'Voucher',
        invoice: 'Invoice',
        tool: 'Assets - Tools',
        costing: 'Costing',
        report: 'Reports',
        system: 'System'
    },
    drawerAccounting: [
        { label: 'dashboard', path: '/accounting/dashboard', icon: 'view-dashboard-outline' },
        { label: 'catalog', path: '/accounting/catalog', icon: 'format-list-text' },
        { label: 'voucher', path: '/accounting/voucher', icon: 'file-document-multiple' },
        // { label: 'invoice', path: '/accounting/invoice', icon: 'file-document-outline' },
        // { label: 'tool', path: '/accounting/tool', icon: 'cube' },
        // { label: 'costing', path: '/accounting/costing', icon: 'factory' },
        { label: 'report', path: '/accounting/report', icon: 'chart-bar' },
        // { label: 'system', path: '/accounting/system', icon: 'cog' }
    ],
    drawerHkd: [
        { label: 'dashboard', path: '/hkd/dashboard', icon: 'view-dashboard-outline' },
        { label: 'catalog', path: '/hkd/catalog', icon: 'format-list-text' },
        { label: 'voucher', path: '/hkd/voucher', icon: 'file-document-multiple' },
        // { label: 'invoice', path: '/hkd/invoice', icon: 'file-document-outline' },
        { label: 'report', path: '/hkd/report', icon: 'chart-bar' },
        // { label: 'system', path: '/hkd/system', icon: 'cog' }
    ],
    menuApp: {
        'd72ee2a8-88ff-45b4-9c04-41f71d93e282': DataMenuAccounting,
        '3dfaf3c6-cff1-47c9-9a25-e3533a433eb7': DataMenuHkd,
        '52105373-95f1-40f3-9899-9b77852b7209': DataMenuAdmin
    },
}

export const VcReferences: IDataSource = {
    STATUS: {
        data: [
            { id: 1, value: 'Đã ghi sổ', color: '#4CAF50' },
            { id: 2, value: 'Chưa ghi sổ', color: 'gray' }
        ]
    },
    p_MA_NT: { url: `/api/System/GetDataByReferencesId?id=f7f3ab94-4917-4830-bfa5-46b309d978b2` },
    DMNT: { url: `/api/System/GetDataByReferencesId?id=98665935-a3db-487e-8bc5-2a63515972b5` },
    DMTHUE: { url: `/api/System/GetDataByReferencesId?id=6bba44d6-6a47-4471-ad98-656ed502fc5a` },
    DMNHOMHD: { url: `/api/System/GetDataByReferencesId?id=933e15df-235e-452f-a38b-8b8a54bfe73a` },
    DMNHDT: { url: `/api/System/GetDataByReferencesId?id=0749b993-1b71-47d4-833a-338082f4755b`, typeData: "tree", fieldCode: "id" },
    DMNHHV: { url: `/api/System/GetDataByReferencesId?id=379afc91-6f0d-4011-8bfc-f6f941f2288a`, typeData: "tree", fieldCode: "id" },
    DMKHO: { url: `/api/System/GetDataByReferencesId?id=189d7179-da87-40cc-a5b3-64f52cef8b86`, typeData: "tree", fieldCode: "id" },
    LOAI_DT: {
        url: `/api/System/GetDataByReferencesId?id=37f0ef8c-9a4a-4c2f-8a83-61a9a8600b6a`,
        getColor: getColor
    },
    LOAI_HV: {
        url: `/api/System/GetDataByReferencesId?id=d926d69a-807e-43c7-a4d6-9b2af3bff39b`,
        getColor: getColorHv
    },
    DMBP: { url: `/api/System/GetDataByReferencesId?id=08790464-f168-49e6-97ea-2cb670e2139d`, typeData: "tree", fieldCode: "id" },
    KIEU_TK: {
        url: `/api/System/GetDataByReferencesId?id=d737cd03-7f9c-4fe4-a3c0-17c935e86048`,
        getColor: getColor
    },
    DMKM: { url: `/api/System/GetDataByReferencesId?id=49e80ac4-2b07-47ef-8297-6efb2074fbdd` },
    DMTK: { url: `/api/System/GetDataByReferencesId?id=0a93c38b-5f1f-422a-8039-a6cee1967af2` },
    DMTTDB: { url: `/api/System/GetDataByReferencesId?id=ad61024c-69cc-4d3b-9d5e-e5685db5bdce` },
    DMSX: { url: `/api/System/GetDataByReferencesId?id=4f4a3acd-c873-45aa-9d1b-098cea801f65` },
    DVT_CB: { url: `/api/System/GetDataByReferencesId?id=81ac9446-6c9f-410e-af92-a724a142cafc&filtervalue=null&extrafilter=#ExtraFilter#` },
    DMNN: { url: `/api/System/GetDataByReferencesId?id=f54efa39-7871-4f8d-b59a-8257befd61a2` },
    DMLF_PNK: { url: `/api/System/GetDataByReferencesId?id=33291373-09c3-4c08-bec8-c3a724b42f15` },
    DMLF_OTHER: { url: `/api/System/GetDataByReferencesId?id=bc6431f9-ed8b-4d67-a734-e8e5aa8efacd` },
    DMDVT: { url: `/api/System/GetDataByReferencesId?id=2beb4691-3bc8-40aa-a5ba-6170fef7a7c4` },
    MA_NGANHNGHE: { url: `/api/System/GetDataByReferencesId?id=7a10ab7a-dfc5-478e-af00-53f5dc1cee1e` },
}
export interface IConfigDateMenuWin {
    title: string,
    titleE: string,
    data: IMenuWin[];
    icon?: React.ReactNode;
    expanded?: boolean;
    disable?: boolean
}

export const defaultNumberNew: Partial<Record<ITableWin, string[]>> = {
    CTKT: ['TIEN_NT', 'TIEN'],
    PSTHUE: ['TIEN_TT_NT', 'TIEN_TT', 'TIEN_NT', 'TIEN', 'TONG_TIEN_NT', 'TONG_TIEN'],
    CTHV: [
        'SO_LUONG', 'GIA_NT2', 'GIA2', 'TIEN_NT2', 'TIEN2', 'GIA_NT', 'GIA', 'TIEN_NT', 'TIEN',
        'PT_CK', 'T_CK_NT', 'T_CK', 'PT_GG', 'GIA_GG_NT', 'GIA_GG', 'T_GG_NT', 'T_GG', 'PT_NK', 'T_NK_NT', 'T_NK',
        'PT_DB', 'T_DB_NT', 'T_DB', 'PT_THUE', 'T_THUE_NT', 'T_THUE',
        'T_CP_NT', 'T_CP', 'T_CP_NT1', 'T_CP1', 'T_CP_NT0', 'T_CP0', 'THUE_GTGT', 'TIEN_THUE', 'GIAM_TRU', 'TIEN_GT', 'TIEN_ST'
    ],
    PSCF: ['TIEN_NT', 'TIEN'],
}