import { Appearance, ViewStyle } from 'react-native';

const isDarkMode = Appearance.getColorScheme() === 'dark';
// const isDarkMode = true; // Appearance.getColorScheme() === 'dark';

type FontType = 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | undefined;

const FontConstants: {
  familyRegular: string;
  sizeTitle: number;
  sizeRegular: number;
  sizeRegularX: number;
  sizeLarge: number;
  sizeLargeX: number;
  sizeLargeXX: number;
  sizeLargeXXX: number;
  sizeLargeXXXX: number;
  weightBold: FontType;
  weightRegular: FontType;
} = {
  familyRegular: 'sans-serif',
  sizeTitle: 22,
  sizeRegular: 14,
  sizeRegularX: 16,
  sizeLarge: 18,
  sizeLargeX: 24,
  sizeLargeXX: 28,
  sizeLargeXXX: 40,
  sizeLargeXXXX: 50,
  weightBold: 'bold',
  weightRegular: 'normal',
};

const ColorConstants: {
  transparent: string;
  disabled: string;
  background: string;
  backgroundOverlay: string;
  surface: string;
  surfaceEl1: string;
  surfaceEl2: string;
  surfaceEl3: string;
  surfaceEl4: string;
  surfaceEl5: string;
  surfaceEl6: string;
  surfaceEl7: string;
  surfaceEl8: string;
  surfaceEl9: string;
  surfaceEl10: string;
  surfaceEl11: string;
  surfaceEl12: string;
  surfaceEl13: string;
  surfaceEl14: string;
  surfaceEl15: string;
  primary: string;
  onPrimary: string;
  onPrimaryDepth: string;
  primaryOverlayColor: string;
  primaryVariant: string;
  secondary: string;
  analogous1: string;
  onAnalogous1: string;
  analogous2: string;
  onAnalogous2: string;
  onBackground: string;
  onSurface: string;
  onSurfaceDepth: string;
  onSurfaceDepth1: string;
  onSurfaceDepth2: string;
  onSurfaceDepth3: string;
  onSurfaceDepth4: string;
  onSurfaceDepth5: string;
  onSurfaceDepth6: string;
  onSurfaceDepth7: string;
  onSurfaceDepth8: string;
  onSurfaceDepth9: string;
  onSurfaceDepth10: string;
  onSurfaceDepth11: string;
  onSurfaceDepth12: string;
  onSurfaceDepth13: string;
  onSurfaceDepth14: string;
  onSurfaceDepth15: string;
  onSurfaceDepth16: string;
  onSurfaceDepth17: string;
  onSurfaceDepth18: string;
  onSurfaceDepth19: string;
  onSurfaceDepth20: string;
  onSecondary: string;
  error: string;
  errorEl1: string;
  errorSoft: string;


  backgroundMedium: string;
  backgroundLight: string;
  font: string;
  fontSecond: string;
  dragButtonBackgroundActive: string;
  dragButtonBackgroundPassive: string;
  underlayColor: string;
  chartSuccess: string;
  chartTransition: string;
  chartFailure: string;
  chartEmptyText: string;
} = {

  transparent: 'transparent',
  background: '#000000',
  backgroundOverlay: 'rgba(0, 0, 0, 0.5)',
  surface: '#121212ff',
  surfaceEl1: '#171717ff',
  surfaceEl2: '#1c1c1cff',
  surfaceEl3: '#212121ff',
  surfaceEl4: '#262626ff',
  surfaceEl5: '#2b2b2bff',
  surfaceEl6: '#303030ff',
  surfaceEl7: '#363636ff',
  surfaceEl8: '#3b3b3bff',
  surfaceEl9: '#404040ff',
  surfaceEl10: '#454545ff',
  surfaceEl11: '#4a4a4aff',
  surfaceEl12: '#4f4f4fff',
  surfaceEl13: '#545454ff',
  surfaceEl14: '#595959ff',
  surfaceEl15: '#5e5e5eff',
  disabled: '#808080ff', //  onSurfaceDepth20
  primary: '#a1abe7ff',
  onPrimary: '#121212ff',
  onPrimaryDepth: '#0f0f0fff',
  primaryOverlayColor: "#a2abe71f", // 0.12 opacity
  primaryVariant: '#3442afff',
  secondary: '#e7dda1ff',
  analogous1: '#a1cfe7ff',
  onAnalogous1: '#121212ff',
  analogous2: '#b9a1e7ff',
  onAnalogous2: '#121212ff',
  onBackground: '#ffffffff',
  onSurface: '#ffffffff',
  onSurfaceDepth: '#e5e5e5ff',
  onSurfaceDepth1: '#e0e0e0ff',
  onSurfaceDepth2: '#dbdbdbff',
  onSurfaceDepth3: '#d6d6d6ff',
  onSurfaceDepth4: '#d1d1d1ff',
  onSurfaceDepth5: '#ccccccff',
  onSurfaceDepth6: '#c7c7c7ff',
  onSurfaceDepth7: '#c2c2c2ff',
  onSurfaceDepth8: '#bdbdbdff',
  onSurfaceDepth9: '#b8b8b8ff',
  onSurfaceDepth10: '#b2b2b2ff',
  onSurfaceDepth11: '#adadadff',
  onSurfaceDepth12: '#a8a8a8ff',
  onSurfaceDepth13: '#a3a3a3ff',
  onSurfaceDepth14: '#9e9e9eff',
  onSurfaceDepth15: '#999999ff',
  onSurfaceDepth16: '#949494ff',
  onSurfaceDepth17: '#8f8f8fff',
  onSurfaceDepth18: '#8a8a8aff',
  onSurfaceDepth19: '#858585ff',
  onSurfaceDepth20: '#808080ff',
  onSecondary: '#121212ff',
  error: '#cf6679ff',
  errorEl1: '#d26f82ff',
  errorSoft: '#d47788ff',

  backgroundMedium: isDarkMode ? '#666666' : '#dddddd',
  backgroundLight: isDarkMode ? '#444444' : '#7dadfa',
  underlayColor: isDarkMode ? 'black' : '#3d7fdb',
  font: isDarkMode ? '#eeeeee' : 'white',
  fontSecond: isDarkMode ? '#eeeeee' : 'gray',
  dragButtonBackgroundActive: '#afb5bd',
  dragButtonBackgroundPassive: 'transparent',

  chartSuccess: '#32ED51',
  chartTransition: '#F5EC77',
  chartFailure: '#EA3D65',
  chartEmptyText: 'gray',
};

const SizeConstants: {
  paddingSmall: number;
  paddingSmallX: number;
  paddingRegular: number;
  paddingLarge: number;
  paddingLargeX: number;
  borderRadius: number;
  clickableSizeMin: number;
} = {
  paddingSmall: 2,
  paddingSmallX: 5,
  paddingRegular: 8,
  paddingLarge: 16,
  paddingLargeX: 25,
  borderRadius: 8,
  clickableSizeMin: 48,
};

const FlatSizeConstants: {
  activationDistance: number;

} = {
  activationDistance: 20,

};

const DraggableScrolSizeConstants: {
  itemHeight: number;

} = {
  itemHeight: 70,

};

const HeaderSizeConstants: {
  fontSize: number;
  fontWeight: FontType;
  backgroundColor: string;

} = {
  fontSize: 18,
  fontWeight: FontConstants.weightBold,
  backgroundColor: ColorConstants.surfaceEl6,
};

const NativeComponentStyle: ViewStyle = {
  flex: 1,
}

export { FontConstants, ColorConstants, SizeConstants, FlatSizeConstants, DraggableScrolSizeConstants, HeaderSizeConstants, NativeComponentStyle };
