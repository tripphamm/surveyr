import React from 'react';
import { useSpring, animated } from 'react-spring';

export default function AnimatedBar({
  value,
  color,
  borderColor,
}: {
  value: number;
  color: string;
  borderColor: string;
}) {
  if (value > 100) {
    console.warn('AnimatedBar value set to > 100');
  }

  const animatedProps = useSpring({ width: `${value}%` });

  return (
    <div
      style={{
        height: 40,
        width: 'inherit',
        border: `1px solid ${borderColor}`,
      }}
    >
      <animated.div
        style={{
          height: 'inherit',
          backgroundColor: color,
          ...animatedProps,
        }}
      />
    </div>
  );
}
