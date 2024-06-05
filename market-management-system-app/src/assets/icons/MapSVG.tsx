import * as React from "react"
import Svg, { Path } from "react-native-svg"

function MapSvgIcon() {
  return (
    <Svg
      height={100}
      viewBox="0 -960 960 960"
      width={100}
    >
      <Path fill={"#ffffff"} d="M600-120l-240-84-186 72q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v560q0 13-7.5 23T812-192l-212 72zm-40-98v-468l-160-56v468l160 56zm80 0l120-40v-474l-120 46v468zm-440-10l120-46v-468l-120 40v474zm440-458v468-468zm-320-56v468-468z" />
    </Svg>
  )
}

export default MapSvgIcon
