import LoadingScreen from "@/components/loadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { getRemember, getToken } from "@/utils/vcStorage";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function AppScreen() {
    const { isLoggedIn, login, setLoggedIn, biometricLogin } = useAuth();
    useEffect(() => {
        const checkLogin = async () => {
            const token = await getToken();
            if (!!token) {
                const remember = await getRemember();
                await login(remember);
                // await biometricLogin(async (password) => {
                //     await login({ ...remember, pass: password });
                // })
            } else {
                setLoggedIn(false);
            }
        };
        checkLogin();
    }, []);

    if (isLoggedIn === null) {
        return <View style={{ flex: 1, paddingTop: 100 }}><LoadingScreen /></View>
    }
    return <Redirect href={isLoggedIn ? "/(auth)/login" : "/welcome"} />;
}