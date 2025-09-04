import { IHandleAction } from ".";

export const layoutHandleAction: IHandleAction = {
    printItem: (dataMap: Record<string, any[]>) => {
        return {
            title: "In mẫu",
            dataSource: {
                id: {
                    data: dataMap.printTemplateId ?? []
                }
            },
            values: { id: '', NAME: '', REPORT_FILE: '' },
            view: {
                type: "cols",
                fields: [
                    {
                        type: "selectList",
                        tableWin: "Empty",
                        bind: "id",
                        expression: { NAME: 'value', REPORT_FILE: 'REPORT_FILE' },
                        label: "Chọn mẫu in"
                    }
                ]
            },
            zod: {
                id: { type: "string" }
            }
        }
    },
}