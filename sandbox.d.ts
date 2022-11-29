import type DankDebug from 'supibot-package-manager/commands/dankdebug/sandbox';

declare global {
	const aliasStack = DankDebug.aliasStack;
	const args = DankDebug.args;
	const channel = DankDebug.channel;
	const executor = DankDebug.executor;
	const platform = DankDebug.platform;
	const tee = DankDebug.tee;
	const _teePush = DankDebug._teePush;
	const channelCustomData = DankDebug.channelCustomData;
	const customData = DankDebug.customData;
	const utils = DankDebug.utils;

  // This isn't in esnext yet for some reason.
  interface Array<T> {
    findLastIndex(
      predicate: (value: T, index: number, obj: T[]) => unknown,
      thisArg?: any
    ): number
  }
}
