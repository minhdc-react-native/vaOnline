import SquareLoader from "@/components/dialog/squareLoader";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function AppScreen() {
    const { isLoggedIn } = useAuth();
    if (isLoggedIn === null) {
        return <View style={styles.overlay}>
            <SquareLoader />
        </View>;
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