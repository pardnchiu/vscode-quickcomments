# QuickComments

QuickComments is a VSCode extension that automatically generates comments for selected code using the **OpenAI API**. When users select code and run the command quickcomments.addCodeComments, it sends a request to the OpenAI API and inserts the generated comments before the selected code.

## Features

- Automatically generates code comments.
- Uses OpenAI API for comment generation.
- Comments are inserted directly into the code.

## How to use

- Open the settings and add your OpenAI API key under `quickcomments.api_key`:
    ```Shell
    "quickcomments.api_key": "YOUR_OPENAI_API_KEY"
    ```
- Select the code you want to add comments to.
- Use the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) to run the command QuickComments: Add Code Comments.

## Configuration

- ### `quickcomments.api_key`:
    Your OpenAI API key.
- ### `quickcomments.model`: 
    The OpenAI model to use for generating comments (default: `gpt-4o`).
- ### `quickcomments.max_tokens`: 
    The maximum number of tokens for the response (default: `80`).

## Keybindings

The default keybindings for the extension are:

- ### Windows/Linux:
    `Ctrl+Alt+C`
- ### Mac: 
    `Cmd+Option+C`

## License

This project is licensed under the MIT License. See the LICENSE file for details.

***

*All translations powered by ChatGPT*

***

©️ 2024 [邱敬幃 Pardn Chiu](https://www.linkedin.com/in/pardnchiu)