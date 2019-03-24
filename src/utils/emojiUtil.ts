const defaultImageSrc = 'https://cdn.jsdelivr.net/emojione/assets/3.1/png/32/2753.png';

type EmojiSize = 32 | 64 | 128;
function resize(imageSrc: string, size: EmojiSize) {
  return imageSrc.replace('/32/', `/${size}/`);
}

interface GetImageSrcByShortNameOptions {
  size?: EmojiSize;
}

const perfOptimizedEmojiMap: { [shortName: string]: string } = {
  ':bar_chart:': 'https://cdn.jsdelivr.net/emojione/assets/4.5/png/64/1f4ca.png',
  ':grimacing:': 'https://cdn.jsdelivr.net/emojione/assets/4.5/png/64/1f62c.png',
  ':thinking:': 'https://cdn.jsdelivr.net/emojione/assets/4.5/png/64/1f914.png',
};

export function getImageSrcByShortName(
  shortName: string,
  options: GetImageSrcByShortNameOptions = {},
) {
  const { size = 64 } = options;

  let imageSrc = perfOptimizedEmojiMap[shortName];
  if (!imageSrc) {
    imageSrc = defaultImageSrc;
  }

  return resize(imageSrc, size);
}
