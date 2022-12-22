function compareSanitized(emoji1: string, emoji2: string): boolean {
  const re = /[\ufe0f\u200d\u{e0002}]/gu;

  return emoji1.replace(re, '') === emoji2.replace(re, '');
}
