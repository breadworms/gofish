import type DankDebug from 'supibot/commands/dankdebug/sandbox';

declare global {
  type SupibotStoreValue = DankDebug.SupibotStoreValue;

  const channelCustomData = DankDebug.channelCustomData;
  const customData = DankDebug.customData;
  const utils = DankDebug.utils;
  const executor = DankDebug.executor;
  const channel = DankDebug.channel;
  const command = DankDebug.command;

  interface Array<T> {
    // This isn't in esnext yet for some reason.
    findLastIndex(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): number;
  }
}
