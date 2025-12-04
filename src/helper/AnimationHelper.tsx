export const convertToRadian = (paramInDegree: number) => {
  'worklet';
  const result = (paramInDegree / 180) * Math.PI;
  return result;
};
