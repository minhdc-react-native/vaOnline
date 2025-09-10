import LayoutStack from "@/components/layoutStack";

const Layout = () => {
    return (
        <LayoutStack data={{
            index: { headerShown: false },
            paramReport: { headerShown: false },
            reportView: { headerShown: false }
        }} />
    );
}
export default Layout;