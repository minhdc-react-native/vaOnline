import { create } from 'zustand';
interface IDataApp {
    paramSystem: IParamSystem | null,
    setParamSystem: (paramSystem: IParamSystem | null) => void;
    shouldRefresh: string | null,
    setShouldRefresh: (shouldRefresh: string | null) => void,
}
export const useDataApp = create<IDataApp>((set) => ({
    paramSystem: null,
    setParamSystem: (paramSystem: IParamSystem | null) =>
        set((state) => ({
            paramSystem: paramSystem
        })),
    shouldRefresh: null,
    setShouldRefresh: (shouldRefresh: string | null) =>
        set((state) => ({
            shouldRefresh: shouldRefresh
        })),

}));