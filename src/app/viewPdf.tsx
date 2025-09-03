import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Share from 'react-native-share';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import RNFS from 'react-native-fs';
import Pdf from 'react-native-pdf';
import { VACOMTheme } from '@/theme/theme';
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';

const ViewerPdf = () => {
    const { title, uriPdf } = useLocalSearchParams();
    const navigation = useNavigation();
    const uri = uriPdf?.toString();
    const { colors } = useTheme<VACOMTheme>();
    const sharePdf = async () => {
        if (!uri) return;
        Share.open({
            url: uri,
            type: 'application/pdf',
            title: 'Chia sẻ file...',
        }).finally(() => { });
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            uri && RNFS.unlink(uri);
        });
        return unsubscribe;
    }, [navigation, uri]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.vacom.backLayout }}>
            <View style={styles.header}>
                <IconButton icon={() => <MaterialIcons name="keyboard-arrow-left" size={30} color={colors.secondary} />} onPress={() => router.back()} />
                <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} variant='titleLarge'>{title?.toString()}</Text>
                </View>
                <IconButton icon="share-variant" iconColor={colors.secondary} onPress={sharePdf} />
            </View>
            {uri && <Pdf
                source={{ uri: uri }}
                style={styles.pdf}
                fitPolicy={0}
                trustAllCerts={false}
                horizontal={false}
                enablePaging={false}
                spacing={4}
                onLoadComplete={(pages) => console.log(`Tổng trang: ${pages}`)}
                onError={(error) => console.log(error)}
            />}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: 'flex-start',
        // padding: 8,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#eee',
        paddingRight: 10
    },
    pdf: {
        flex: 1,
        paddingHorizontal: 20
    },
});

export default ViewerPdf;
