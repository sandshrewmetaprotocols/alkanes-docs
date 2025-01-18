import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

const characters = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

interface ScrambleTextProps {
  text: string;
}

export default function ScrambleText({ text }: ScrambleTextProps): JSX.Element {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const finalText = 'You are building the alpha';

  const scrambleText = (targetText: string) => {
    let iteration = 0;
    const maxIterations = 6;

    const interval = setInterval(() => {
      setDisplayText(prev =>
        prev
          .split('')
          .map((char, idx) => {
            if (char === ' ') return ' ';
            if (idx < iteration) return targetText[idx] || ' ';
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      iteration += 1 / 2;

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(targetText);
      }
    }, 30);

    return () => clearInterval(interval);
  };

  // Initial scramble on mount
  useEffect(() => {
    scrambleText(text);
  }, []);

  // Scramble on hover
  useEffect(() => {
    if (!isHovering) {
      scrambleText(text);
      return;
    }

    return scrambleText(finalText);
  }, [isHovering, text]);

  return (
    <a
      href="https://twitter.com/oylwallet"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.scrambleText}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {displayText}
    </a>
  );
}
