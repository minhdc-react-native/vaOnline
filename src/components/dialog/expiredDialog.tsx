import { useAuth } from '@/hooks/useAuth';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

const SessionExpiredContext = createContext({
    showDialog: () => { },
});

export const useSessionExpired = () => useContext(SessionExpiredContext);

export const ExpiredDialog = ({ children }: { children: ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const { logout } = useAuth();
    const showDialog = () => setVisible(true);

    const handleConfirm = () => {
        setVisible(false);
        logout();
    };

    return (
        <SessionExpiredContext.Provider value={{ showDialog }}>
            {children}
            <Portal>
                <Dialog visible={visible} dismissable={false} onDismiss={() => { }}>
                    <Dialog.Title>Phiên đăng nhập hết hạn</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">Vui lòng đăng nhập lại để tiếp tục sử dụng ứng dụng.</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={handleConfirm}>Đăng nhập lại</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </SessionExpiredContext.Provider>
    );
};
