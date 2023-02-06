import type DankDebug from 'supibot-package-manager/commands/dankdebug/sandbox';

declare global {
  type SupibotStoreValue = DankDebug.SupibotStoreValue;

  const channelCustomData = DankDebug.channelCustomData;
  const customData = DankDebug.customData;
  const utils = DankDebug.utils;
  const executor = DankDebug.executor;

  interface Array<T> {
    // This isn't in esnext yet for some reason.
    findLastIndex(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): number;
  }
}
