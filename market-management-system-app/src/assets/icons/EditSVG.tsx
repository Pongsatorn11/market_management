import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';

interface Props {
  size?: number;
}

function EditSvgIcon(props: Props) {
  const {size = 30} = props;
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <G data-name="Layer 2">
        <Path
          d="M19.4 7.34L16.66 4.6A2 2 0 0014 4.53l-9 9a2 2 0 00-.57 1.21L4 18.91a1 1 0 00.29.8A1 1 0 005 20h.09l4.17-.38a2 2 0 001.21-.57l9-9a1.92 1.92 0 00-.07-2.71zM9.08 17.62l-3 .28.27-3L12 9.32l2.7 2.7zM16 10.68L13.32 8l1.95-2L18 8.73z"
          data-name="edit"
        />
      </G>
    </Svg>
  );
}

export default EditSvgIcon;
