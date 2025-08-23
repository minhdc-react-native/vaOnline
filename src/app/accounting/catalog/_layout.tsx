import LayoutStack from "@/components/layoutStack";

const Layout = () => {
    return (
        <LayoutStack data={{
            index: { headerShown: false },
            'acc-catalog-balance': { headerShown: false },
            'acc-catalog-bank': { headerShown: false },
            'acc-catalog-good': { headerShown: false },
            'acc-catalog-other': { headerShown: false },
            'acc-catalog-partner': { headerShown: false }
        }} />
    );
}
export default Layout;