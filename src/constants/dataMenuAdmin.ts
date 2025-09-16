import { theme } from "@/theme/theme";
import { IConfigDateMenuWin } from "./vcData";
const colors = theme.colors, nameIcon = "arrow-right-thin";
const icon: any = { type: "M", name: nameIcon, color: colors.secondary };
export const DataMenuAdmin: Record<string, Partial<Record<IKeyMenuWin, IConfigDateMenuWin[]>>> = {
    system: {
        systemAdmin: [
            {
                title: 'Danh mục', titleE: 'Catalogs',
                data: [
                    {
                        id: 'WIN00115', typeWin: "(window)", tableWin: "LSTDVCS", label: 'Danh mục đơn vị', labelE: 'Category of units',
                        icon: icon, row: 1, col: 1
                    },
                ]
            }
        ]
    }
}
