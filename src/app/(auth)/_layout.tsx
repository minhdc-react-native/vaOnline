import LayoutStack from "@/components/layoutStack";

const LayoutLogin = () => {
    return (
        <LayoutStack data={{
            login: { headerShown: false },
            'about-us': { headerShown: false }
        }} />
    );
}
export default LayoutLogin;