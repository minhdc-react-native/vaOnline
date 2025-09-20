import LayoutStack from "@/components/layoutStack";

const LayoutWindow = () => {
    return (
        <LayoutStack data={{
            index: { headerShown: false },
            newEditWin: { headerShown: false },
            newEditWinMaster: { headerShown: false },
            tabMultiList: { headerShown: false }
        }} />
    );
}
export default LayoutWindow;