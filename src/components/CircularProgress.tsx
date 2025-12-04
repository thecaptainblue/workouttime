import {StyleSheet, View} from 'react-native';
import Animated, {SharedValue, useAnimatedProps} from 'react-native-reanimated';
import {Circle, Svg} from 'react-native-svg';
import {LogService} from '../services/Log/LogService';
import {memo} from 'react';

const DefaultStrokeShadowColor = 'gray';
const DefaultStrokeOpacity = 0.1;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type CircularProgressProps = {
  children?: React.ReactNode;
  strokeWidth: number;
  radius: number;

  progressColor: string;
  percentage: SharedValue<number>;
  strokeShadowColor?: string;
  strokeOpacity?: number;
};

function CircularProgressInner(props: CircularProgressProps) {
  const {
    children,
    radius,
    strokeWidth,
    progressColor,
    percentage,
    strokeShadowColor = DefaultStrokeShadowColor,
    strokeOpacity = DefaultStrokeOpacity,
  } = props;
  const innerRadius = radius - strokeWidth / 2;
  const circumfrence = 2 * Math.PI * innerRadius;

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumfrence * ((100 - percentage.value) / 100),
    };
  });

  LogService.debug('rerender CircularProgress');
  return (
    <View style={[styles.container, {width: radius * 2, height: radius * 2}]}>
      <Svg style={[styles.svgContainer]}>
        <Circle
          cx={radius}
          cy={radius}
          fill={'transparent'}
          r={innerRadius}
          stroke={strokeShadowColor}
          strokeOpacity={strokeOpacity}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          animatedProps={animatedProps}
          cx={radius}
          cy={radius}
          fill={'transparent'}
          r={innerRadius}
          stroke={progressColor}
          // dash (dolu alana) ve gapler (bosluk) burada belirtiliyor
          //sadece 1 eleman o kadar dash ve gap demek
          // cift eleman 1. eleman kadar dash ikinci eleman kadar bosluk
          // tek sayidaki elemanlar cift oluncaya kadar uzatilir ornegin 2 1 3 => 2 1 3 2 1 3 gibi
          // strokeDasharray={`${circumfrence - strokeLineCapOffset} ${circumfrence}`}
          // strokeDasharray={' 361 361'}
          strokeDasharray={`${circumfrence} ${circumfrence}`}
          strokeWidth={strokeWidth}
          //strokeDashOffest pozitif oldugunda cizilen pathi o miktar geri ceker. negatif oldugunda ileri iter.
          //   dikkat pattern (dashArray) devam ediyor sonsuza kadar. duz cizgi oldugunda bir fark gorulmez
          // strokeDashoffset={circumfrence * ((100 - percentageComplete) / 100)}
          // strokeDashoffset={-30}
          // strokeDashoffset={-60}
          //   strokeDashoffset={100}
          // baslingi ve bitisleri yuvarlak yapiyor.
          // strokeLinecap="round"
          // rotation={0} // bu deger x,y 00 da rotate ediyor bunun yerine svgContaineri dondurdum.
        />
        {/* <Line x1="0" y1={radius} x2={radius * 2} y2={radius} stroke="blue" strokeWidth="1" /> */}
      </Svg>
      {children}
    </View>
  );
}

export const CircularProgress = memo(CircularProgressInner);

const styles = StyleSheet.create({
  container: {
    // absoluteFill (position: 'absolute', left: 0, right: 0, top: 0, bottom: 0)
    // ...StyleSheet.absoluteFillObject,

    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: 'red',
    // borderWidth: 1,
  },
  svgContainer: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'orange',
    transform: [{rotate: '-90deg'}],
  },
});
