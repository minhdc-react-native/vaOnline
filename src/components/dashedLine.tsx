import React from 'react';
import { DimensionValue, StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Line } from 'react-native-svg';
interface IProgs {
    width?: DimensionValue,
    color?: string,
    style?: StyleProp<ViewStyle>
}
// component này để không bị lỗi trên iOS... borderStyle: 'dashed' chỉ hỗ trợ trên Android.
const DashedLine = ({ style, width = '100%', color = 'gray' }: IProgs) => (
    <View style={[{ width, height: 1 }, style]}>
        <Svg height="1" width="100%">
            <Line
                x1="0"
                y1="0"
                x2="100%"
                y2="0"
                stroke={color}
                strokeWidth="4"
                strokeDasharray="4"
            />
        </Svg>
    </View>
);

export default DashedLine;