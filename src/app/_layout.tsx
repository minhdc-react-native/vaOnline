// app/_layout.tsx
import { ExpiredDialog, useSessionExpired } from '@/components/dialog/expiredDialog';
import { LoadingProvider } from '@/components/dialog/loadingProvider';
import { PopupProvider, usePopup } from '@/components/dialog/popupProvider';
import LayoutStack from '@/components/layoutStack';
import { TranslationProvider } from '@/context/TranslationContext';
import { useDataApp } from '@/hooks/zustand/useDataApp';
import { theme } from '@/theme/theme';
import '@/utils/globalFunctions';
import { attachInterceptors } from '@/utils/vcAxios';
import { PortalProvider } from '@gorhom/portal';
import { useBackHandler } from '@react-native-community/hooks';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { RootSiblingParent } from 'react-native-root-siblings';
import { enableScreens } from 'react-native-screens';
enableScreens();

export default function RootLayout() {
  return (
    <TranslationProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootSiblingParent>
          <PaperProvider theme={theme}>
            <PopupProvider >
              <LoadingProvider>
                <PortalProvider>
                  <ExpiredDialogWrapper>
                    <BackHandlerView />
                    <StackApp />
                  </ExpiredDialogWrapper>
                </PortalProvider>
              </LoadingProvider>
            </PopupProvider>
          </PaperProvider>
        </RootSiblingParent>
      </GestureHandlerRootView>
    </TranslationProvider>
  );
}
const StackApp = () => {
  return (
    <LayoutStack data={{
      '(auth)': { headerShown: false },
      '(window)': { headerShown: false },
      'list-app': { headerShown: false },
      admin: { headerShown: false },
      accounting: { headerShown: false },
      hkd: { headerShown: false },
      index: { headerShown: false },
      menu: { headerShown: false },
      welcome: { headerShown: false }
    }} />
  )
}
const BackHandlerView = () => {
  const { showPopup } = usePopup();
  const backHandlerQuestion = useDataApp((state) => state.backHandlerQuestion);
  const setBackHandlerQuestion = useDataApp((state) => state.setBackHandlerQuestion);
  useBackHandler(() => {
    if (router.canGoBack()) {
      if (backHandlerQuestion) {
        showPopup({
          title: backHandlerQuestion.title,
          message: backHandlerQuestion.message,
          confirmText: "Thoát",
          showCancel: true,
          onConfirm: () => {
            setBackHandlerQuestion(null);
            router.back();
          },
        });
      } else {
        router.back();
      }
      return true;
    } else {
      showPopup({
        title: "Thoát ứng dụng",
        message: "Bạn có chắc muốn thoát?",
        showCancel: true,
        onConfirm: () => BackHandler.exitApp(),
        iconType: "question"
      });
      return true;
    }
  });
  return null;
}
function ExpiredDialogWrapper({ children }: { children: React.ReactNode }) {
  const { showDialog } = useSessionExpired();

  useEffect(() => {
    attachInterceptors(showDialog);
  }, []);

  return <ExpiredDialog>{children}</ExpiredDialog>;
}
