import * as vscode from 'vscode';

import { JestRunner } from './jestRunner';
import { Lens } from './lens';
import { Config } from './config/config';

type Argument = Record<string, unknown> | string;

export function activate(context: vscode.ExtensionContext): void {
  const config = new Config();
  const jestRunner = new JestRunner(config);
  const codeLensProvider = new Lens(config.codeLensOptions);

  const runJest = vscode.commands.registerCommand('extension.runJest', async (argument: Argument) => {
    const currentTestName = typeof argument === 'string' ? argument : undefined;
    return jestRunner.runTest(false, currentTestName);
  });

  const debugJest = vscode.commands.registerCommand('extension.debugJest', async (argument: Argument) => {
    if (typeof argument === 'string') {
      return jestRunner.runTest(true, argument);
    } else {
      return jestRunner.runTest(true, undefined);
    }
  });

  const codeLensProviderDisposable = vscode.languages.registerCodeLensProvider(
    [
      {
        pattern: vscode.workspace.getConfiguration().get('jestrunner.codeLensSelector'),
      },
    ],
    codeLensProvider,
  );

  context.subscriptions.push(codeLensProviderDisposable);
  context.subscriptions.push(runJest);
  context.subscriptions.push(debugJest);
}

export function deactivate(): void {
  // deactivate
}
