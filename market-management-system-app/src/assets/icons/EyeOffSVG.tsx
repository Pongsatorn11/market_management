import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function EyeOffSvgIcon() {
  return (
    <Svg
      height={24}
      viewBox="0 -960 960 960"
      width={24}
    >
      <Path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200z" />
    </Svg>
  );
}

export default EyeOffSvgIcon;
