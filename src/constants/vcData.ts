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
    ]
}

export const DataMenuWin: Record<string, IMenuWin[]> = {

}