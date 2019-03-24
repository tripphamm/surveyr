import * as React from 'react';

import { getImageSrcByShortName } from '../utils/emojiUtil';

interface EmojiIconProps {
  emojiShortName: string;
  size: number;
}

const EmojiIcon: React.FunctionComponent<EmojiIconProps> = (props: EmojiIconProps) => {
  const { emojiShortName, size } = props;

  let emojiImageSize: 32 | 64 | 128 = 128;
  if (size < 32) {
    emojiImageSize = 32;
  } else if (size <= 64) {
    emojiImageSize = 64;
  } else if (size <= 128) {
    emojiImageSize = 128;
  } else {
    console.warn(
      `Maximum emoji image size is 128px. ${size} is too large and the image quality will suffer`,
    );
  }

  return (
    <img
      style={{
        height: size,
        width: size,
      }}
      src={getImageSrcByShortName(emojiShortName, { size: emojiImageSize })}
      alt={emojiShortName}
    />
  );
};

export default EmojiIcon;
