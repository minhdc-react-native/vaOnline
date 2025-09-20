import { VACOMTheme } from '@/theme/theme';
import { File } from 'expo-file-system';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
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
            // const file = new File(uri);
            // file.open();
            const a = await File.pickFileAsync(uri, "application/pdf");
            console.log('a>>', a);
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
                        const file = new File(uri);
                        file.delete();
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

    useEffect(() => {
        if (Platform.OS === "ios") {
            console.log('uri>>', uri);
            const file = new File(uri);
            console.log('file exists>>', file.exists);
            // setBase64(file.base64Sync());
        }
    }, [uri]);
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
