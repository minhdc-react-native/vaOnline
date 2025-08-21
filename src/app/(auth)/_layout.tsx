import LayoutStack from "@/components/layoutStack";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const LayoutLogin = () => {
    return (
        <LayoutStack data={{
            login: { headerShown: false }
        }} />
    );
}
export default LayoutLogin;