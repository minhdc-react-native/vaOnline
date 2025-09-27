import VcSwipeList from "@/components/vcSwipeList";
import { router } from "expo-router";
import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Appbar, Text } from "react-native-paper";

type Item = { id: string; title: string };

const data: Item[] = Array.from({ length: 30 }, (_, i) => ({
    id: String(i + 1),
    title: `Dòng số ${i + 1}`,
}));

export default function SwipeListScreen() {
    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
            </Appbar.Header>

            <VcSwipeList<Item>
                data={data}
                multipleOpen={false}
                itemKey={(item) => item.id}
                renderItemContent={(item) => <Text>{item.title}</Text>}
                renderRightActions={(item) => (
                    <View style={{ flexDirection: "row" }}>
                        <RectButton style={[styles.action, { backgroundColor: "red" }]} onPress={() => Alert.alert(`Delete ${item.id}`)}>
                            <Text style={styles.text}>Delete</Text>
                        </RectButton>
                        <RectButton style={[styles.action, { backgroundColor: "darkblue" }]}>
                            <Text style={styles.text}>Print</Text>
                        </RectButton>
                    </View>
                )}
                renderLeftActions={(item) => (
                    <RectButton style={[styles.action, { backgroundColor: "darkgreen", width: 200 }]}>
                        <Text style={styles.text}>Send email</Text>
                    </RectButton>
                )}
            />
        </>
    );
}

const styles = StyleSheet.create({
    action: {
        justifyContent: "center",
        alignItems: "center",
        width: 80,
    },
    text: {
        color: "white",
        fontWeight: "bold",
    },
});
