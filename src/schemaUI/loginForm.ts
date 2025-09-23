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
                requiredKeys: ["lang"],
                label: "Link",
                leftIcon: { name: "web", color: "darkblue" },
                autoCapitalize: "none",
                texRight: ".vaonline.vn"
            },
            {
                type: "input",
                bind: "username",
                leftIcon: { name: "account" },
                autoCapitalize: "characters",
                requiredKeys: ["lang"],
                label: "User Name",
            },
            {
                type: "input",
                bind: "pass",
                requiredKeys: ["lang"],
                label: "Password",
                leftIcon: { name: "key-chain-variant", color: theme.colors.primary },
                typeInput: "password"
            },
            {
                type: "selectList",
                tableWin: "Empty",
                clean: false,
                fDisplay: { fId: 'id', fValue: "value", field: "id" },
                bind: "dvcs",
                requiredKeys: ["lang"],
                label: "Select OrgUnit"
            },
            {
                type: "rows",
                style: { justifyContent: "space-between", alignItems: "center" },
                fields: [
                    {
                        type: "checkbox",
                        requiredKeys: ["lang"],
                        label: "Remember",
                        bind: "remember",
                        typeView: "switch",
                        actionName: "remember",
                        textStyle: { fontWeight: "bold" }
                    },
                    {
                        type: "button",
                        requiredKeys: ["lang"],
                        label: "Forgot Password",
                        actionName: "forgotPass"
                    }
                ]
            },
            {
                type: "button",
                mode: "contained",
                requiredKeys: ["lang"],
                label: "Login",
                actionName: "login",
                style: { width: 200, alignSelf: "center" }
            }
        ]
    },
    dataDefault: { domain: '', username: '', pass: '', dvcs: '', captcha_token: '', remember: true, lang: 'vi' },
    zod: z.object({
        domain: zRequiredString('...'),
        username: zRequiredString('...'),
        pass: zRequiredString('...'),
    })
}