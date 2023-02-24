// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// Helper - Returns the user's home directory path or `undefined`
function getUserHomeDir() {
    return process.env['HOME'];
}

// Helper - Returns the current opened(actived) file Document or `undefined`
function getCurrentFileDocument() {
    // The return value
    var retDocument = undefined;

    // Find the current editor
    let currentEditor = vscode.window.activeTextEditor;
    if (currentEditor) {
        if (!(currentEditor.document.isUntitled)) {
            retDocument = currentEditor.document;
        }
    }

    return retDocument;
}

// Helper Get Current Working Directory path or `undefined`
function getUserCwdDir() {
    // The return value, default to user home.
    var retDirPath = getUserHomeDir();

    let curFileDoc = getCurrentFileDocument();
    if (curFileDoc) {
        let curWorkspaceFolder = vscode.workspace.getWorkspaceFolder(curFileDoc.uri);
        if (curWorkspaceFolder) {
            retDirPath = curWorkspaceFolder.uri.fsPath;
        }
    }

    // Returns
    return retDirPath;
}

// Helper - Execute a command in Terminal
function executeCommandInTerminal(commandText) {
    let currentTerminal = vscode.window.activeTerminal;
    if (currentTerminal) {
        // There is an active Terminal here, execute the command in this Terminal
        currentTerminal.sendText(commandText);
    }
    else {
        // No active Terminal found, just show a message to user.
        vscode.window.showInformationMessage('HNB: Command not executed in terminal (No active terminal).');
    }
}

// Run a given `Terminal Command` with `Current File Path` as its argument.
function runTerminalCommandWithCurrentFilePath(commandName) {
    let currentFileDoc = getCurrentFileDocument();
    if (currentFileDoc) {
        let currentFilePath = currentFileDoc.fileName;
        let commandWithArgument = commandName + ' ' + '"' + currentFilePath + '"';
        executeCommandInTerminal(commandWithArgument);
    }
    else {
        vscode.window.showInformationMessage('HNB: Failed to get current file (No active editor, untitled, etc).');
    }
}

// Run a given `Terminal Command` with `Current Working Directory`, `Current File Path` as its arguments.
function runTerminalCommandWithCwdAndCurrentFilePath(commandName) {
    let curCwdDir = getUserCwdDir();
    if (curCwdDir)
    {
        let curFileDoc = getCurrentFileDocument();
        if (curFileDoc) {
            let currentFilePath = curFileDoc.fileName;
            let commandWithArgument = commandName + ' ' + '"' + curCwdDir + '"' + ' ' + '"' + currentFilePath + '"';
            executeCommandInTerminal(commandWithArgument);
        }
        else {
            vscode.window.showInformationMessage('HNB: Failed to get current doc (No active editor, untitled, etc).');
        }
    }
    else {
        vscode.window.showInformationMessage('HNB: Failed to get CWD directory (No Home, No workspace, etc).');
    }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "customcommandbuttons" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

    // The shell checker terminal command
    context.subscriptions.push(
        vscode.commands.registerCommand('customcommandbuttons.command.hnbShellChecker', function () {
            // The code you place here will be executed every time your command is executed
            runTerminalCommandWithCurrentFilePath('hnb-shell-checker');
        })
    );

    // The linter terminal command
    context.subscriptions.push(
        vscode.commands.registerCommand('customcommandbuttons.command.hnbLinter', function () {
            // The code you place here will be executed every time your command is executed
            runTerminalCommandWithCwdAndCurrentFilePath('hnb-linter');
        })
    );
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
