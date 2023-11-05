import Svg, { Path } from "react-native-svg";

const PinSVG = ({ color }: { color: "red" | "orange" | "green" }) => (
  <Svg height="50" width="50" viewBox="0 0 91 91">
    <Path
      d="M66.9,41.8c0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,11.3,20.4,32.4,20.4,32.4S66.9,53.1,66.9,41.8zM37,41.4c0-5.2,4.3-9.5,9.5-9.5s9.5,4.2,9.5,9.5c0,5.2-4.2,9.5-9.5,9.5C41.3,50.9,37,46.6,37,41.4z"
      fillRule="evenodd"
      fill={color}
    />
  </Svg>
);

export default PinSVG;
