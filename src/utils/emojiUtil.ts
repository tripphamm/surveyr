import * as emojione from 'emojione';

const defaultImageSrc = 'https://cdn.jsdelivr.net/emojione/assets/3.1/png/32/2753.png';

export function convertUnicodeOrShortNameToShortName(unicodeOrShortName: string) {
  // per the emojione api: this will convert unicode to a shortName
  // if the input is already a shortName, it will leave it alone
  return emojione.toShort(unicodeOrShortName);
}

export function isValidUnicodeOrShortName(unicodeOrShortName: string) {
  const shortName = convertUnicodeOrShortNameToShortName(unicodeOrShortName);

  // must start with a colon
  if (shortName[0] !== ':') {
    return false;
  }

  // must end with a colon
  const indexOfLastChar = shortName.length - 1;
  if (shortName[indexOfLastChar] !== ':') {
    return false;
  }

  // must have exactly 2 colons
  if (shortName.slice(1, indexOfLastChar).includes(':')) {
    return false;
  }

  // try to fetch the image from emojione
  const emojioneImageResult = emojione.shortnameToImage(shortName);

  // per the emojione api: if the search didn't work, result will just contain the string that we searched for
  if (emojioneImageResult === shortName) {
    return false;
  }

  return true;
}

function parseSrcFromImageHTMLString(imageHTMLString: string) {
  const srcRegex = new RegExp(/src="(.*)"/);
  const match = srcRegex.exec(imageHTMLString);

  if (match !== null && match.length >= 2) {
    return match[1];
  }

  return defaultImageSrc;
}

const emojiImageSrcCache = new Map();
function addToCache(unicodeOrShortName: string, imageSrc: string) {
  emojiImageSrcCache.set(unicodeOrShortName, imageSrc);
}

function getFromCache(unicodeOrShortName: string): string | null {
  if (!emojiImageSrcCache.has(unicodeOrShortName)) {
    return null;
  }

  return emojiImageSrcCache.get(unicodeOrShortName);
}

type EmojiSize = 32 | 64 | 128;
function resize(imageSrc: string, size: EmojiSize) {
  return imageSrc.replace('/32/', `/${size}/`);
}

interface GetImageSrcByUnicodeOrShortNameOptions {
  size?: EmojiSize;
}

export function getImageSrcByUnicodeOrShortName(
  unicodeOrShortName: string,
  options: GetImageSrcByUnicodeOrShortNameOptions = {},
) {
  const { size = 64 } = options;
  const cachedImageSrc = getFromCache(unicodeOrShortName);

  if (cachedImageSrc !== null) {
    return resize(cachedImageSrc, size);
  }

  if (isValidUnicodeOrShortName(unicodeOrShortName)) {
    const shortName = convertUnicodeOrShortNameToShortName(unicodeOrShortName); // 10ms

    const imageHTMLString = emojione.shortnameToImage(shortName); // 0.1ms
    const imageSrc = parseSrcFromImageHTMLString(imageHTMLString);

    addToCache(unicodeOrShortName, imageSrc);

    return resize(imageSrc, size);
  }

  // if the shortName is invalid (hopefully we didn't let it get this far) return the '?' emoji
  return defaultImageSrc;
}
