import { theme } from "@/theme/theme";

const colors = theme.colors;

export const getColor = (item: IData): string => {
    let color = colors.backdrop;
    switch (item.id) {
        case 1:
            color = 'blue'
            break;
        case 2:
            color = 'purple'
            break;
        case 3:
            color = 'green'
            break;
    }
    return color;
}

export const getColorHv = (item: IData): string => {
    let color = colors.backdrop;
    switch (item.id) {
        case 'H':
            color = 'purple'
            break;
        case 'V':
            color = 'green'
            break;
        case 'T':
            color = 'blue'
            break;
        case 'D':
            color = 'red'
            break;
    }
    return color;
}