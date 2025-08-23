import { ISchemaForm } from "@/components/UIEngine/types";
import { theme } from "@/theme/theme";
import * as z from "zod";
import { zRequiredString } from "./zodHelpers";

export const loginForm: ISchemaForm = {
    view: {
        type: "cols",
        fields: [
            {
                type: "input",
                bind: "domain",
                label: "Liên kết",
                leftIcon: { name: "web", color: "darkblue" },
                autoCapitalize: "none",
                texRight: ".vaonline.vn"
            },
            {
                type: "input",
                bind: "username",
                leftIcon: { name: "account" },
                autoCapitalize: "characters",
                label: "Tên truy cập"
            },
            {
                type: "input",
                bind: "pass",
                label: "Mật khẩu",
                leftIcon: { name: "key-chain-variant", color: theme.colors.primary },
                typeInput: "password"
            },
            {
                type: "selectList",
                tableWin: "Empty",
                fDisplay: { fId: 'id', fValue: "value", field: "id" },
                bind: "dvcs",
                label: "Chọn đơn vị"
            },
            {
                type: "rows",
                style: { justifyContent: "space-between", alignItems: "center" },
                fields: [
                    {
                        type: "checkbox",
                        label: "Ghi nhớ",
                        bind: "remember",
                        typeView: "switch",
                        actionName: "remember",
                        textStyle: { fontWeight: "bold" }
                    },
                    {
                        type: "button",
                        label: "Quên mật khẩu",
                        actionName: "forgotPass"
                    }
                ]
            },
            {
                type: "button",
                mode: "contained",
                label: "Đăng nhập",
                actionName: "login",
                style: { width: 200, alignSelf: "center" }
            }
        ]
    },
    dataDefault: { domain: '', username: '', pass: '', dvcs: '', captcha_token: '', remember: false },
    zod: z.object({
        domain: zRequiredString('Link truy cập'),
        username: zRequiredString('Nhập tên truy cập'),
        pass: zRequiredString('Nhập mật khẩu'),
    })
}