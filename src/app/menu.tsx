import FormWrapper from '@/components/formWrapper';
import { VcGroupButton } from '@/components/vcGroupButton';
import { useDataApp } from '@/hooks/zustand/useDataApp';
import { router } from 'expo-router';
import { useMemo } from 'react';

export default function MenuScreen({ menuMain, keyMenuWin }: { menuMain: string, keyMenuWin: IKeyMenuWin }) {
    const dataMenuWin = useDataApp((state) => state.dataMenuWin);

    const dataMenu = useMemo(() => {
        return dataMenuWin[menuMain][keyMenuWin];
    }, [keyMenuWin]);

    const onPress = (item: IMenuWin) => {
        router.navigate({ pathname: `/(window)`, params: { menuWin: JSON.stringify(item) } });
    };

    return (
        <FormWrapper style={{ flex: 1, padding: 20 }}>
            {dataMenu && dataMenu.map((item, idx) => {
                return (
                    <VcGroupButton key={idx} title={item.title} data={item.data} icon={item.icon} disable={item.disable} onPress={onPress} />
                )
            })}
        </FormWrapper>
    );
}
