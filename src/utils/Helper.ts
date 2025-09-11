import { ISchemaWinValue } from '@/schema';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const ERROR_MESSAGES = {
    UNKNOWN: "Đã xảy ra lỗi không xác định",
    NETWORK: "Lỗi kết nối mạng",
    SERVER: "Lỗi máy chủ",
    TIMEOUT: "Yêu cầu hết thời gian"
} as const;
const filterTimeMonthQuarter = [
    { value: 'Tháng 1', id: 'month_1', type: 'M' },
    { value: 'Tháng 2', id: 'month_2', type: 'M' },
    { value: 'Tháng 3', id: 'month_3', type: 'M' },
    { value: 'Tháng 4', id: 'month_4', type: 'M' },
    { value: 'Tháng 5', id: 'month_5', type: 'M' },
    { value: 'Tháng 6', id: 'month_6', type: 'M' },
    { value: 'Tháng 7', id: 'month_7', type: 'M' },
    { value: 'Tháng 8', id: 'month_8', type: 'M' },
    { value: 'Tháng 9', id: 'month_9', type: 'M' },
    { value: 'Tháng 10', id: 'month_10', type: 'M' },
    { value: 'Tháng 11', id: 'month_11', type: 'M' },
    { value: 'Tháng 12', id: 'month_12', type: 'M' },

    // ===== 4 quý =====
    { value: 'Quý 1', id: 'quarter_1', type: 'Q' },
    { value: 'Quý 2', id: 'quarter_2', type: 'Q' },
    { value: 'Quý 3', id: 'quarter_3', type: 'Q' },
    { value: 'Quý 4', id: 'quarter_4', type: 'Q' },
];
const filterTime = [
    { value: 'Hôm nay', id: 'today' },
    { value: 'Hôm qua', id: 'yesterday' },
    { value: '7 ngày qua', id: '7days' },
    { value: 'Tháng này', id: 'thismonth' },
    { value: 'Tháng trước', id: 'lastmonth' },

    // ===== 12 tháng =====
    { value: 'Tháng 1', id: 'month_1' },
    { value: 'Tháng 2', id: 'month_2' },
    { value: 'Tháng 3', id: 'month_3' },
    { value: 'Tháng 4', id: 'month_4' },
    { value: 'Tháng 5', id: 'month_5' },
    { value: 'Tháng 6', id: 'month_6' },
    { value: 'Tháng 7', id: 'month_7' },
    { value: 'Tháng 8', id: 'month_8' },
    { value: 'Tháng 9', id: 'month_9' },
    { value: 'Tháng 10', id: 'month_10' },
    { value: 'Tháng 11', id: 'month_11' },
    { value: 'Tháng 12', id: 'month_12' },

    // ===== 4 quý =====
    { value: 'Quý 1', id: 'quarter_1' },
    { value: 'Quý 2', id: 'quarter_2' },
    { value: 'Quý 3', id: 'quarter_3' },
    { value: 'Quý 4', id: 'quarter_4' },
];

export const Helper = {
    getMessageError: (error: any) => {
        let msgError: string;
        if (!error) msgError = ERROR_MESSAGES.UNKNOWN;
        if (error.error) {
            if (error.error.validationErrors) {
                const _errors = error.error.validationErrors;
                msgError = "";
                _errors.forEach((e: { message: string }) => {
                    msgError += e.message + "\n";
                });
                return msgError;
            } else if (error.error.message) {
                return error.error.message;
            } else if (error.error.details) {
                return error.error.details;
            } else {
                return ERROR_MESSAGES.UNKNOWN;
            }
        }
    },
    getError: (error: any) => {
        if (!error) {
            return { message: ERROR_MESSAGES.UNKNOWN };
        }

        if (error.response?.data?.error) {
            return error.response.data.error;
        }

        if (error.response?.data) {
            return error.response.data;
        }

        if (error.message) {
            return { message: error.message };
        }

        return { message: ERROR_MESSAGES.UNKNOWN };
    },
    round: (num: number, digits: number) => {
        const factor = Math.pow(10, digits);
        return Math.round(num * factor) / factor;
    },
    checkHaveNum: (value: number | null | undefined, isZero = false) => {
        return (value !== null && value !== undefined && (!isZero && value !== 0));
    },
    rmTone(str: string): string {
        return (str ?? '').toString()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Xoá dấu thanh
            .replace(/đ/g, "d")              // Thay chữ đ
            .replace(/Đ/g, "D");             // Thay chữ Đ
    },
    formatFullNumber: (value: number, maximumFractionDigits = 2) => {
        if (isNaN(value)) return null;
        const units = [
            { value: 1e12, label: 'ngàn tỷ' },
            { value: 1e9, label: 'tỷ' },
            { value: 1e6, label: 'triệu' },
            { value: 1e3, label: 'ngàn' },
            { value: 1, label: 'đ' }
        ];

        for (const unit of units) {
            if (value >= unit.value) {
                let num = value / unit.value;
                // Làm tròn tối đa 3 chữ số thập phân, bỏ số 0 dư thừa
                num = Math.floor(num * 1000) / 1000;
                // Định dạng số, dùng dấu phẩy cho thập phân
                let str = num.toLocaleString('vi-VN', {
                    maximumFractionDigits: maximumFractionDigits,
                    minimumFractionDigits: Math.min(num % 1 === 0 ? 0 : 2, maximumFractionDigits)
                });
                // Nếu là đơn vị nhỏ nhất (đ), không thêm dấu phẩy
                if (unit.value === 1) str = num.toLocaleString('vi-VN', { maximumFractionDigits: 0 });
                return { textNum: str, label: unit.label };
            }
        }
        return { textNum: '0', label: 'đ' };
    },
    formatAmount: (
        value: number | null | undefined,
        showSymbol: boolean = false,
        fractionDigits: number = 0 // 👈 thêm tùy chọn số chữ số sau dấu phẩy
    ): string => {
        if (value === null || value === undefined) return '';
        const formatted = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
        }).format(value);
        return showSymbol ? formatted : formatted.replace(/\s?₫/, '');
    },
    formatNumber(input: any, decimalSeparator = ".", thousandSeparator = " ", decimalPlaces = 2) {
        if (typeof input === "number") {
            if (input === 0) return null;
            input = input.toString();
        }
        if (!input) return null; // Trả về null nếu không có giá trị
        // Loại bỏ tất cả ký tự không hợp lệ trừ số và dấu thập phân `.`
        let rawValue = input.replace(/[^0-9.]/g, "");

        // Đảm bảo chỉ có 1 dấu `.`
        const countDecimals = (rawValue.match(/\./g) || []).length;
        if (countDecimals > 1) {
            rawValue = rawValue.replace(/\.(?=.*\.)/g, ""); // Giữ lại dấu `.` đầu tiên
        }

        const isEnd = rawValue.slice(-1) === "." && rawValue.slice(-2) !== ".";
        // Chia phần nguyên và phần thập phân
        let parts = rawValue.split(decimalSeparator);
        let integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
        let decimalPart = parts[1] ? parts[1].substring(0, decimalPlaces) : "";
        return decimalPart ? `${integerPart}${decimalSeparator}${decimalPart}` : integerPart + (isEnd ? "." : "");
    },
    filterTimeMonthQuarter: filterTimeMonthQuarter,
    filterTime: filterTime,
    getDateRange: (filterValue: string) => {
        const today = dayjs.utc();
        let fromDate;
        let toDate;
        switch (filterValue) {
            case 'today':
                fromDate = today.startOf('day');
                toDate = today.endOf('day');
                break;
            case 'yesterday':
                fromDate = today.subtract(1, 'day').startOf('day');
                toDate = today.subtract(1, 'day').endOf('day');
                break;
            case '7days':
                fromDate = today.subtract(6, 'day').startOf('day'); // 6 ngày trước + hôm nay = 7 ngày
                toDate = today.endOf('day');
                break;
            case 'thismonth':
                fromDate = today.startOf('month');
                toDate = today.endOf('month');
                break;
            case 'lastmonth':
                fromDate = today.subtract(1, 'month').startOf('month');
                toDate = today.subtract(1, 'month').endOf('month');
                break;
            // ===== 12 tháng =====
            case 'month_1': case 'month_2': case 'month_3':
            case 'month_4': case 'month_5': case 'month_6':
            case 'month_7': case 'month_8': case 'month_9':
            case 'month_10': case 'month_11': case 'month_12': {
                const month = parseInt(filterValue.split('_')[1], 10) - 1; // tháng trong dayjs tính từ 0
                fromDate = today.month(month).startOf('month');
                toDate = today.month(month).endOf('month');
                break;
            }

            // ===== 4 quý =====
            case 'quarter_1':
                fromDate = today.month(0).startOf('month');  // Jan
                toDate = today.month(2).endOf('month');      // Mar
                break;
            case 'quarter_2':
                fromDate = today.month(3).startOf('month');  // Apr
                toDate = today.month(5).endOf('month');      // Jun
                break;
            case 'quarter_3':
                fromDate = today.month(6).startOf('month');  // Jul
                toDate = today.month(8).endOf('month');      // Sep
                break;
            case 'quarter_4':
                fromDate = today.month(9).startOf('month');  // Oct
                toDate = today.month(11).endOf('month');     // Dec
                break;
            case 'custom':
                // custom thì thường bạn sẽ cho user chọn tay, nên để null
                fromDate = null;
                toDate = null;
                break;
            default:
                fromDate = null;//today.startOf('day');
                toDate = null; //today.endOf('day');
        }

        return {
            fromDate: fromDate ? fromDate.format("YYYY-MM-DD HH:mm:ss") : null,
            toDate: toDate ? toDate.format("YYYY-MM-DD HH:mm:ss") : null
        };
    },
    getFormattedDate: (strDate?: string, format: 'dd/MM/yyyy HH:mm:ss' | 'yyyy-MM-dd HH:mm:ss' = 'dd/MM/yyyy HH:mm:ss', removeTime = false) => {
        if (!strDate) return '';
        const date = strDate ? new Date(strDate) : new Date();
        // const d = dayjs.utc(date);
        const d = dayjs(date);
        const day = d.format('DD');
        const month = d.format('MM');
        const year = d.format('YYYY');
        const hours = d.format('HH');
        const minutes = d.format('mm');
        const seconds = d.format('ss');
        switch (format) {
            case "dd/MM/yyyy HH:mm:ss":
                return `${day}/${month}/${year}` + (removeTime ? `` : ` ${hours}:${minutes}:${seconds}`);
            default:
                return `${year}-${month}-${day}` + (removeTime ? `` : ` ${hours}:${minutes}:${seconds}`);
        }
    },

    isEmpty: (value: unknown): boolean => {
        // undefined | null
        if (value === null || value === undefined) return true;
        // String
        if (typeof value === 'string') return value.trim().length === 0;
        // Number
        if (typeof value === 'number') return Number.isNaN(value);
        // Array
        if (Array.isArray(value)) return value.length === 0;
        // Map & Set
        if (value instanceof Map || value instanceof Set) return value.size === 0;
        // Date
        if (value instanceof Date) return Number.isNaN(value.getTime());
        // Plain Object (loại bỏ Array, Function, Date, v.v.)
        if (
            typeof value === 'object' &&
            Object.prototype.toString.call(value) === '[object Object]'
        ) {
            return Object.keys(value as Record<string, unknown>).length === 0;
        }
        // Các kiểu còn lại (boolean, function, symbol, bigint, v.v.)
        return false;
    },
    sortTreeFlat: (data: IData[], codeField?: string): IData[] => {
        const grouped = new Map<string | null, IData[]>();
        data.forEach(item => {
            if (!grouped.has(item.parentId)) {
                grouped.set(item.parentId, []);
            }
            grouped.get(item.parentId)!.push(item);
        });

        codeField && grouped.forEach((arr, key) => {
            arr.sort((a, b) => {
                const codeA = a[codeField] ?? "";
                const codeB = b[codeField] ?? "";
                return String(codeA).localeCompare(String(codeB));
            });
        });

        const result: IData[] = [];
        function traverse(parentId: string | null) {
            const children = grouped.get(parentId) || [];
            for (const child of children) {
                result.push(child);
                traverse(child.id.toString());
            }
        }
        traverse(null);
        return result;
    },
    deepMerge: (target: any, source?: any): ISchemaWinValue => {
        if (!source) return target;
        for (const key of Object.keys(source)) {
            if (
                source[key] instanceof Object &&
                key in target &&
                target[key] instanceof Object &&
                !Array.isArray(source[key])
            ) {
                Helper.deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
        return target;
    }
};