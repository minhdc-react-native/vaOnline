import { create } from 'zustand';

interface IDataApp {
    paramSystem: IParamSystem | null;
    setParamSystem: (paramSystem: IParamSystem | null) => void;

    shouldRefresh: string | null;
    setShouldRefresh: (shouldRefresh: string | null) => void;

    backHandlerQuestion: { title: string; message: string } | null;
    setBackHandlerQuestion: (backHandlerQuestion: { title: string; message: string } | null) => void;

    years: IData[];
    setYears: (years: IData[]) => void;
    currentYear: string | null,
    setCurrentYear: (currentYear: string) => void
    reset: () => void;
}

const initialState: Omit<IDataApp,
    'setParamSystem' | 'setShouldRefresh' | 'setBackHandlerQuestion' | 'setYears' | 'setCurrentYear' | 'reset'
> = {
    paramSystem: null,
    shouldRefresh: null,
    backHandlerQuestion: null,
    currentYear: null,
    years: [],
};

export const useDataApp = create<IDataApp>()(
    (set) => ({
        ...initialState,
        setParamSystem: (paramSystem) => set({ paramSystem }),
        setShouldRefresh: (shouldRefresh) => set({ shouldRefresh }),
        setBackHandlerQuestion: (backHandlerQuestion) => set({ backHandlerQuestion }),
        setYears: (years) => set({ years }),
        setCurrentYear: (currentYear) => set({ currentYear }),
        reset: () => set(initialState),
    })
);
