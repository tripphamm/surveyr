import React from 'react';
import EmojiIcon from './EmojiIcon';
import Shell from './Shell';

export default function Loading() {
  return (
    <Shell>
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <EmojiIcon emojiShortName=":bar_chart:" size={64} />
      </div>
    </Shell>
  );
}
