import { SharedValue } from 'react-native-reanimated';

/**
 * @summary Select a point where the animation should snap to given the value of the gesture and it's velocity.
 * @worklet
 */
export const snapPoint = (value: number, velocity: number, points: ReadonlyArray<number>): number => {
  'worklet';
  const point = value + 0.2 * velocity;
  const deltas = points.map(p => Math.abs(point - p));
  const minDelta = Math.min.apply(null, deltas);
  return points.filter(p => Math.abs(point - p) === minDelta)[0];
};

export const snapPointByMod = (value: number, velocity: number, modStep: number): number => {
  'worklet';
  const point = value + 0.1 * velocity;
  const remaining = point % modStep;
  const remainingAbsolute = Math.abs(remaining);
  const sign = remaining >= 0 ? 1 : -1;
  let pointSnapped: number;
  if (remainingAbsolute <= modStep / 2) {
    pointSnapped = point - remaining; // % modOverall;
  } else {
    const complement = modStep - remainingAbsolute;
    pointSnapped = point + sign * complement; //% modOverall;
  }
  return pointSnapped;
};

export const translateZ = (perspective: SharedValue<number>, z: SharedValue<number>) => ({
  // scale: divide(perspective, sub(perspective, z)),
  scale: perspective.value / perspective.value - z.value,
});
