import React from "react"
import ContentLoader, { Rect, Circle, Path, Facebook } from "react-content-loader/native"
import { useTheme } from "react-native-paper";

export default function LoadingScreen() {
    const { colors } = useTheme();
    return (
        <ContentLoader
            speed={1}
            width={400}
            height={200}
            viewBox="0 0 440 200"
            backgroundColor={colors.outlineVariant}
            foregroundColor="#ecebeb"
            style={{ marginTop: 50, marginHorizontal: 20 }}
        >
            <Rect x="48" y="8" rx="3" ry="3" width="80%" height="10" />
            <Rect x="48" y="26" rx="3" ry="3" width="52" height="10" />
            <Rect x="0" y="56" rx="3" ry="3" width="410" height="10" />
            <Rect x="0" y="72" rx="3" ry="3" width="380" height="10" />
            <Rect x="0" y="88" rx="3" ry="3" width="178" height="10" />
            <Circle cx="20" cy="20" r="20" />
        </ContentLoader>
    );
}
