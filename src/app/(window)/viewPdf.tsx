import { VACOMTheme } from '@/theme/theme';
import * as FileSystem from 'expo-file-system';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import Pdf from 'react-native-pdf';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shareFile } from './useActionMap';

const ViewerPdf = () => {
    const insets = useSafeAreaInsets();
    const { title, uriPdf } = useLocalSearchParams();
    const navigation = useNavigation();
    const uri = uriPdf?.toString();
    const { colors } = useTheme<VACOMTheme>();
    const sharePdf = async () => {
        if (uri) {
            await shareFile({
                uri: uri,
                type: "application/pdf",
                isDelete: false
            });
        }
    };
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            {
                if (uri) {
                    try {
                        FileSystem.deleteAsync(uri);
                        console.log("✅ Xoá thành công:", uri);
                    } catch (err) {
                        console.warn("❌ Lỗi xoá file:", err);
                    }
                }
            }
        });
        return unsubscribe;
    }, [navigation, uri]);
    const [base64, setBase64] = useState<string>();

    return (
        <View style={{ flex: 1, backgroundColor: colors.vacom.backLayout, marginBottom: insets.bottom }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title={title?.toString()} />
                <Appbar.Action icon="share-variant" onPress={sharePdf} />
            </Appbar.Header>
            {uri && <Pdf
                source={{ uri: encodeURI(uri), cache: true }}
                style={styles.pdf}
                fitPolicy={0}
                trustAllCerts={false}
                horizontal={false}
                enablePaging={false}
                spacing={4}
                onPageChanged={(page, pages) => console.log(`page: ${page}/${pages}`)}
                onLoadComplete={(pages) => console.log(`Tổng trang: ${pages}`)}
                onError={(error) => console.log(error)}
            />}
        </View>
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
