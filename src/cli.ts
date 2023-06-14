async function render(text: string): Promise<string> {
  // On available platforms, shiny fish will be displayed as an emote.
  // Elsewhere, they will be displayed as their original text,
  // i.e. '<emoji>*'.

  // Quick-match for shinies.
  if (text.includes('*')) {
    await Promise.all(Object.keys(SHINIES).map(emoji => {
      const original = `${emoji}*`;

      return utils.getEmote([SHINIES[emoji]], original).then(emote => {
        text = text.replaceAll(original, `${emote} `);
      });
    }));
  }

  // Check for jellyfish. If the chat has a `Jellyfish` emote enabled,
  // show it. Otherwise, fall back on the currently-not-that-supported
  // emoji.
  //
  // Iterating over the string twice feels a little redundant but there
  // isn't really a smarter way.
  if (text.includes('🪼')) {
    const jellyfish = await utils.getEmote(['Jellyfish'], '🪼');

    text = text.replaceAll('🪼', `${jellyfish} `);
  }

  return text;
}
