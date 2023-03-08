import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

/**
 * 
    width?: NumberProp;
    height?: NumberProp;
    viewBox?: string;
    preserveAspectRatio?: string;
    color?: ColorValue;
    title?: string;
 */

const SvgComponent = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="90 60 420 644" {...props}>
    <Path d="M302.313 83.563c-128.776 193.962-172.209 391.466-187.25 594.906 83.506-106.555 157.007-176.4 211-208.844 59.61-35.82 110.951 20.837 161.406 160.719C453.99 447.802 430.842 269.17 302.313 83.562zm1.03 73.5 18.72 153 45.062 15.343-40.969 21.75 5.406 48.813-27.718-47.281-29.188 49.062 5.906-51.375-41.687-21 45.25-15 19.219-153.313z" />
  </Svg>
);

export default SvgComponent;
