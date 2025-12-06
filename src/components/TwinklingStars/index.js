import React from 'react';
import './index.scss';

const STAR_COUNT = 120;
const STAR_MIN_SIZE = 1;
const STAR_MAX_SIZE = 3;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const TwinklingStars = () => {
  const stars = Array.from({ length: STAR_COUNT }).map((_, i) => {
    const size = getRandomInt(STAR_MIN_SIZE, STAR_MAX_SIZE);
    const style = {
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      width: `${size}px`,
      height: `${size}px`,
      animationDelay: `${Math.random() * 2}s`,
    };
    return <div className="star" style={style} key={i} />;
  });

  return <div className="twinkling-stars">{stars}</div>;
};

export default TwinklingStars;
