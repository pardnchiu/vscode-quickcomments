import * as vscode from "vscode";
import axios from "axios";

// 此代碼是一個 VSCode 擴充功能，當用戶選擇代碼並運行命令 "quickcomments.addCodeComments" 時，會向 OpenAI API 送出請求，並將生成的註釋插入到選定的代碼之前。
export function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel("QuickComments Logger");

    let disposable = vscode.commands.registerCommand("quickcomments.addCodeComments", async () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showInformationMessage("編輯器不存在.");
            outputChannel.appendLine("編輯器不存在.");
            return;
        };

        const selection = editor.selection;
        const selected_text = editor.document.getText(selection);

        if (!selected_text) {
            vscode.window.showInformationMessage("並未選擇文字.");
            outputChannel.appendLine("並未選擇文字.");
            return;
        };

        // 此代碼從 VS Code 設定中獲取 "quickcomments.api_key" 的值，若未設定則顯示錯誤訊息並停止執行。
        const key = vscode.workspace.getConfiguration().get<string>("quickcomments.api_key");

        if (!key) {
            vscode.window.showErrorMessage("並未設定 `api_key`. 請至設定中添加 \"quickcomments.api_key\"");
            outputChannel.appendLine("並未設定 `api_key`. 請至設定中添加 \"quickcomments.api_key\"");
            return;
        };

        // 這段代碼從VSCode的配置中獲取兩個設置值，分別是"quickcomments.model"和"quickcomments.max_tokens"，若未設置則使用默認值"gpt-4o"和80。這段代碼的主要功能是從VSCode的配置中讀取"quickcomments"擴展的模型
        const model = vscode.workspace.getConfiguration().get<string>("quickcomments.model") || "gpt-4o";
        const max_tokens = vscode.workspace.getConfiguration().get<number>("quickcomments.max_tokens") || 80;

        try {
            outputChannel.appendLine("正在向模型 `" + model + "` 送出請求.");
            // 這段代碼使用axios向OpenAI的API發送POST請求，請求內容是讓AI模型分析給定代碼並生成註釋。這段代碼的主要功能是與OpenAI的聊天模型互動，請求AI生成針對特定代碼的註釋。
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: model,
                messages: [
                    {
                        role: "system",
                        content: "你是一個程式設計專家。"
                    },
                    {
                        role: "user",
                        content: `請你針對以下代碼的類型，使用適合該程式碼語言的註解語法提供80字以內的註釋，不要斷行。註釋內容是分析代碼的整體功能，並針對代碼整體功能寫出100字以內的不斷行概要。回應不要包含任何 Markdown 格式。回應只需要註釋本體。以下是這次需要分析的代碼: [${selected_text}]。`
                    }
                ],
                max_tokens: max_tokens,
                temperature: 0.5
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${key}`
                }
            });

            if (response.data.choices && response.data.choices.length > 0) {
                const comment = response.data.choices[0].message.content.trim();
                const edit = new vscode.WorkspaceEdit();
                const position = selection.start;
                const indent = ' '.repeat(position.character);

                edit.insert(editor.document.uri, position, `${comment}\n${indent}`);

                await vscode.workspace.applyEdit(edit);

                outputChannel.appendLine("已收到來自模型 `" + model + "` 的回應，並插入註釋。");
            }
            else {
                throw new Error("並未收到任何回應。");
            }
        } catch (error: any) {
            vscode.window.showErrorMessage("請求模型 `" + model + "` 過程發生錯誤。");
            outputChannel.appendLine("請求模型 `" + model + "` 過程發生錯誤。 (" + error.message + ")");
        }
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(outputChannel);
};

export function deactivate() { };
