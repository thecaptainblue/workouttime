import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ColorConstants, FontConstants } from '../../constants/StyleConstants';
import { SettingStackParamList } from '../../@types/SettingStack';
import SettingsHome from '../Setting/SettingsHome';
import SettingsLanguage from '../Setting/SettingsLanguage';
import { useTranslation } from 'react-i18next';
import { ResKey } from '../../lang/ResKey';
import { ScreenNames } from './ScreenNames';
// import SettingsExport from '../Setting/SettingsExport'; //TODO yukseltme 

const SettingStack = createNativeStackNavigator<SettingStackParamList>();
export const SettingStackScreen = () => {
  const { t } = useTranslation();
  return (
    <SettingStack.Navigator
      // initialRouteName={ScreenNames.SettingsTest} // acilis ekrani, testo
      screenOptions={{
        headerStyle: {
          backgroundColor: ColorConstants.surfaceEl6,
        },
        headerTintColor: ColorConstants.onSurfaceDepth5,
        headerTitleStyle: { fontWeight: FontConstants.weightBold },
        // statusBarColor: ColorConstants.background, //TODO yukseltme 
        // statusBarStyle: 'dark',
        // navigationBarColor: ColorConstants.backgroundNew,
      }}>
      <SettingStack.Screen
        name={ScreenNames.SettingsHome}
        component={SettingsHome}
        options={{ title: t(ResKey.Settings) }}
      />
      <SettingStack.Screen
        name={ScreenNames.SettingsLanguage}
        component={SettingsLanguage}
        options={{ title: t(ResKey.SelectLanguage) }}
      />
      {/* //TODO yukseltme */}
      {/* <SettingStack.Screen
        name={ScreenNames.SettingsExport}
        component={SettingsExport}
        options={{ title: t(ResKey.SettingsExport) }}
      /> */}
      {/* <SettingStack.Screen
        name="WorkoutPlayer"
        component={WorkoutPlayer}
        options={{title: 'Workout'}}
      /> */}
    </SettingStack.Navigator>
  );
};
