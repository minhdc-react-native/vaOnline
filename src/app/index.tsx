import { useAuth } from "@/hooks/useAuth";
import { getRemember, getToken } from "@/utils/vcStorage";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

export default function AppScreen() {
    const { isLoggedIn, login, setLoggedIn, biometricLogin } = useAuth();
    useEffect(() => {
        const checkLogin = async () => {
            const token = await getToken();
            if (!!token) {
                const remember = await getRemember();
                await biometricLogin(async (password) => {
                    await login({ ...remember, pass: password });
                })
            } else {
                setLoggedIn(false);
            }
        };
        checkLogin();
    }, []);

    if (isLoggedIn === null) {
        return null
    }
    return <Redirect href={isLoggedIn ? "/(auth)/login" : "/welcome"} />;
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
});