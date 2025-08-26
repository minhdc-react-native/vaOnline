import { IDataSource } from "@/schema";
import { theme } from "@/theme/theme";
import { DataMenuAccounting } from "./dataMenuAccounting";
import { DataMenuAdmin } from "./dataMenuAdmin";
import { DataMenuHkd } from "./dataMenuHkd";
const colors = theme.colors;
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
        { label: 'invoice', path: '/accounting/invoice', icon: 'file-document-outline' },
        { label: 'tool', path: '/accounting/tool', icon: 'cube' },
        { label: 'costing', path: '/accounting/costing', icon: 'factory' },
        { label: 'report', path: '/accounting/report', icon: 'chart-bar' },
        { label: 'system', path: '/accounting/system', icon: 'cog' }
    ],
    drawerHkd: [
        { label: 'dashboard', path: '/hkd/dashboard', icon: 'view-dashboard-outline' },
        { label: 'catalog', path: '/hkd/catalog', icon: 'format-list-text' },
        { label: 'voucher', path: '/hkd/voucher', icon: 'file-document-multiple' },
        { label: 'invoice', path: '/hkd/invoice', icon: 'file-document-outline' },
        { label: 'report', path: '/hkd/report', icon: 'chart-bar' },
        { label: 'system', path: '/hkd/system', icon: 'cog' }
    ],
    menuApp: {
        'd72ee2a8-88ff-45b4-9c04-41f71d93e282': DataMenuAccounting,
        '3dfaf3c6-cff1-47c9-9a25-e3533a433eb7': DataMenuHkd,
        '52105373-95f1-40f3-9899-9b77852b7209': DataMenuAdmin
    },
}
const getColor = (item: IData): string => {
    let color = colors.backdrop;
    switch (item.id) {
        case 1:
            color = 'blue'
            break;
        case 2:
            color = 'purple'
            break;
        case 3:
            color = 'green'
            break;
    }
    return color;
}
export const VcReferences: IDataSource = {
    DMNHDT: { url: `/api/System/GetDataByReferencesId?id=0749b993-1b71-47d4-833a-338082f4755b`, typeData: "tree", fieldCode: "id" },
    DMNHV: { url: `/api/System/GetDataByReferencesId?id=379afc91-6f0d-4011-8bfc-f6f941f2288a`, typeData: "tree", fieldCode: "id" },
    DMKHO: { url: `/api/System/GetDataByReferencesId?id=189d7179-da87-40cc-a5b3-64f52cef8b86`, typeData: "tree", fieldCode: "id" },
    LOAI_DT: {
        url: `/api/System/GetDataByReferencesId?id=37f0ef8c-9a4a-4c2f-8a83-61a9a8600b6a`,
        getColor: getColor
    },
    DMBP: { url: `/api/System/GetDataByReferencesId?id=08790464-f168-49e6-97ea-2cb670e2139d`, typeData: "tree", fieldCode: "id" },
    KIEU_TK: {
        url: `/api/System/GetDataByReferencesId?id=d737cd03-7f9c-4fe4-a3c0-17c935e86048`,
        getColor: getColor
    },
    DMKM: { url: `/api/System/GetDataByReferencesId?id=49e80ac4-2b07-47ef-8297-6efb2074fbdd` },
    DMTK: { url: `/api/System/GetDataByReferencesId?id=0a93c38b-5f1f-422a-8039-a6cee1967af2` }
}

export interface IConfigDateMenuWin {
    title: string,
    titleE: string,
    data: IMenuWin[];
    icon?: React.ReactNode;
    expanded?: boolean;
    disable?: boolean
}
