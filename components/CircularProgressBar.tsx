import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Svg, Circle} from 'react-native-svg';
import {GlobalThemeType, useTheme} from '../lib';

interface CircularProgressBarProps {
  size: number;
  strokeWidth: number;
  progressPercent: number;
  children: JSX.Element;
  foregroundStrokeColor?: string;
  backgroundStrokeColor?: string;
}

export const CircularProgressBar = (props: CircularProgressBarProps) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const {size, strokeWidth} = props;
  const radius = (size - strokeWidth) / 2;
  const circum = radius * 2 * Math.PI;
  const svgProgress =
    100 - props.progressPercent < 0 ? 0 : 100 - props.progressPercent;

  return (
    <View style={styles.circleContainer}>
      <View style={{height: size, width: size}}>
        <Svg width={size} height={size}>
          {/* Background Circle */}
          <Circle
            stroke={props.backgroundStrokeColor ?? theme.color.lightGrey2}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            {...{strokeWidth}}
          />
          {/* Progress Circle */}
          <Circle
            stroke={props.foregroundStrokeColor ?? theme.color.red}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeDasharray={`${circum} ${circum}`}
            strokeDashoffset={radius * Math.PI * 2 * (svgProgress / 100)}
            strokeLinecap="round"
            transform={`rotate(-90, ${size / 2}, ${size / 2})`}
            {...{strokeWidth}}
          />
        </Svg>
        <View style={styles.circle}>{props.children}</View>
      </View>
    </View>
  );
};

const makeStyles = (_theme: GlobalThemeType) =>
  StyleSheet.create({
    circleContainer: {
      width: '100%',
      alignItems: 'center',
      marginVertical: 40,
    },
    circle: {
      width: 220,
      height: 220,
      borderRadius: 220,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
      marginRight: 2,
      position: 'absolute',
    },
  });
