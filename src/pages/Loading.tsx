import React from 'react';
import EmojiIcon from '../components/EmojiIcon';
import Shell from '../components/Shell';

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
