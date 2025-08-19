import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const PieLoader = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/icon.png')} // 🔁 Replace with your PNG
                style={styles.image}
                resizeMode="cover"
            />
            <ActivityIndicator style={styles.indicator} size={50} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        overflow: "hidden"
    },
    image: {
        width: 50,
        height: 50
    },
    indicator: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
});

export default PieLoader;
