import LayoutStack from "@/components/layoutStack";
const Layout = () => {
    return (
        <LayoutStack data={{
            index: { headerShown: false },
            paramReport: { headerShown: false },
            reportDetail1: { headerShown: false },
            reportDetail2: { headerShown: false },
            reportDetail3: { headerShown: false }
        }} />
    );
}
export default Layout;