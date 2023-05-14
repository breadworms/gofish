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

  return text;
}
