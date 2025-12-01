import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ColorConstants, HeaderSizeConstants } from '../../constants/StyleConstants';
import { MainStackParamList } from '../../@types/MainStackParamList';
// import WorkoutPlayer from '../WorkoutPlayer/WorkoutPlayer';
import Home from '../Home/Home';
// import WorkoutAddEdit from '../Workout/WorkoutAddEdit';
// import ExerciseAddEdit from '../Workout/ExerciseAddEdit';
// import GroupAddEdit from '../Workout/GroupAddEdit';
// import { PageType } from '../../@types/PageType';
// import { useTranslation } from 'react-i18next';
// import { ResKey } from '../../lang/ResKey';
// import WorkoutPlayerEnd from '../WorkoutPlayer/WorkoutPlayerEnd';
import { HeaderBackButtonProps } from '@react-navigation/elements';
import { ScreenNames } from './ScreenNames';
// import WarningBack from '../Workout/WarningBack';
// import { HeaderBackButtonWT } from '../../components/HeaderBackButtonWT';
import React, { useCallback, ReactNode } from 'react';
// import NotificationList from '../Workout/NotificationList';
// import NotificationAddEdit from '../Workout/NotificationAddEdit';
import { ScreenWrapper } from '../Workout/ScreenWrapper';
// import Statistic from '../Workout/Statistic';
// import Goal from '../Workout/Goal';
// import { CustomHeaderTitle } from '../../components/header/CustomHeaderTitle';
// import Dialog from '../Workout/Dialog';

const MainStack = createNativeStackNavigator<MainStackParamList>();
// const customHeaderTitle = ({
//   children,
//   tintColor,
//   title,
// }: {
//   children: string;
//   tintColor?: string;
//   title: string;
// }): ReactNode => {
//   return <CustomHeaderTitle titleText={title} tintColor={tintColor} />;
// };

export const MainStackScreen = () => {
  // const { t } = useTranslation();

  // const warningBackEditingWorkout = useCallback((props: HeaderBackButtonProps, navigation: any) => {
  //   return (
  //     <HeaderBackButtonWT
  //       tintColor={props.tintColor}
  //       onPress={() =>
  //         navigation.navigate(ScreenNames.MainWarningBack, { message: t(ResKey.WarningConfirmationEditing) })
  //       }
  //     />
  //   );
  // }, []);

  // const warningBackWorkoutPlayer = useCallback((props: HeaderBackButtonProps, navigation: any) => {
  //   return (
  //     <HeaderBackButtonWT
  //       tintColor={props.tintColor}
  //       onPress={() =>
  //         navigation.navigate(ScreenNames.MainWarningBack, { message: t(ResKey.WarningConfirmationTerminatingWP) })
  //       }
  //     />
  //   );
  // }, []);

  return (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: HeaderSizeConstants.backgroundColor,
        },
        // animation: 'none',
        // animationDuration: 5000, // ise yaramiyor androidde gecerli degil.
        headerTintColor: ColorConstants.onSurfaceDepth5,
        headerTitleStyle: {
          fontWeight: HeaderSizeConstants.fontWeight,
          fontSize: HeaderSizeConstants.fontSize,
        },
        // statusBarColor: ColorConstants.background, // todo yukseltme ; compile error ; bunun icin react native'in statusbarini kullanabilirmisim sonra bakacagim.

        // statusBarStyle: 'dark',
        // statusBarHidden: true,
        // aktif oldugunda  acilista altta beyaz bolge gozukuyor kapatinca orasi siyah oluyor,
        // garip olan bunu kapali tutunca ve baska bir sekmede bu set edilmiste tekrar bu sayfaya geldiginde guncellenmiyor :(
        // navigationBarColor: ColorConstants.backgroundNew,
        // navigationBarHidden: true,
        // contentStyle: {backgroundColor: ColorConstants.backgroundNew},
      }}>
      <MainStack.Group>
        <MainStack.Screen
          name={ScreenNames.MainHome}
          // component={Home}
          children={props => {
            return <ScreenWrapper component={Home} componentProps={props} willDelayRender={true} />;
          }}
          options={{
            title:
              "Home"
            //t(ResKey.WorkoutHomeTitle) // TODO  resourdan alinacak
            , headerTintColor: ColorConstants.primary
          }}
        />

        {
          /*
  <MainStack.Screen
            name={ScreenNames.MainWorkoutPlayer}
            component={WorkoutPlayer}
            options={({route, navigation}) => ({
              // title: t(ResKey.WorkoutPlayerTitle),
              headerTitle: ({children, tintColor}) =>
                customHeaderTitle({
                  children,
                  tintColor,
                  title: t(ResKey.WorkoutPlayerTitle) + ' - ' + route.params.workout.name,
                }),
              headerBackVisible: false, // headerTitle verince kendi back butonunu gosteriyor , ilave olara headerLeft geldiginde iki tane back butonu oluyor.
              headerLeft: props => warningBackWorkoutPlayer(props, navigation),
            })}
          />
          <MainStack.Screen
            name={ScreenNames.MainWorkoutPlayerEnd}
            component={WorkoutPlayerEnd}
            options={({route, navigation}) => ({
              headerTitle: ({children, tintColor}) =>
                customHeaderTitle({
                  children,
                  tintColor,
                  title: t(ResKey.WorkoutPlayerTitle) + ' - ' + route.params.workoutName,
                }),
              headerBackVisible: false, // headerTitle verince kendi back butonunu gosteriyor , ilave olara headerLeft geldiginde iki tane back butonu oluyor.
              headerLeft: ({tintColor}) => (
                <HeaderBackButtonWT tintColor={tintColor} onPress={() => navigation.navigate(ScreenNames.MainHome)} />
              ),
            })}
          />
          <MainStack.Screen
            // name={'Wrapper'}
            name={ScreenNames.MainWorkoutAddEdit}
            // component={WorkoutAddEdit}
            children={props => {
              return <ScreenWrapper component={WorkoutAddEdit} componentProps={props} willDelayRender={true} />;
            }}
            options={({route, navigation}) => ({
              title: route.params.pageType == PageType.Add ? t(ResKey.WorkoutAddTitle) : t(ResKey.WorkoutEditTitle),
              // animation: 'slide_from_right',
              // headerLeft: ({tintColor}) => (
              //   <HeaderBackButton
              //     tintColor={tintColor}
              //     style={{marginRight: SizeConstants.paddingLargeX}}
              //     onPress={() => navigation.navigate(ScreenNames.MainWarningBackEditingWorkout)}
              //   />
              // ),
              // headerLeft: ({tintColor}) => (
              //   <HeaderBackButtonWT
              //     tintColor={tintColor}
              //     onPress={() => navigation.navigate(ScreenNames.MainWarningBackEditingWorkout)}
              //   />
              // ),
              headerLeft: props => warningBackEditingWorkout(props, navigation),
            })}
          />
          <MainStack.Screen
            name={ScreenNames.MainExerciseAddEdit}
            // component={ExerciseAddEdit}
            children={props => {
              return <ScreenWrapper component={ExerciseAddEdit} componentProps={props} willDelayRender={true} />;
            }}
            options={({route, navigation}) => ({
              title: route.params.pageType == PageType.Add ? t(ResKey.ExerciseAddTitle) : t(ResKey.ExerciseEditTitle),
              headerLeft: props => warningBackEditingWorkout(props, navigation),
            })}
          />
          <MainStack.Screen
            name={ScreenNames.MainGroupAddEdit}
            // component={GroupAddEdit}
            children={props => {
              return <ScreenWrapper component={GroupAddEdit} componentProps={props} willDelayRender={true} />;
            }}
            options={({route, navigation}) => ({
              title: route.params.pageType == PageType.Add ? t(ResKey.GroupAddTitle) : t(ResKey.GroupEditTitle),
              headerLeft: props => warningBackEditingWorkout(props, navigation),
            })}
          />
          <MainStack.Screen
            name={ScreenNames.MainWorkoutNotifications}
            // component={NotificationList}
            children={props => {
              return <ScreenWrapper component={NotificationList} componentProps={props} willDelayRender={true} />;
            }}
            options={({route, navigation}) => ({
              title: t(ResKey.NotificationListTitle),
              headerLeft: ({tintColor}) => (
                <HeaderBackButtonWT tintColor={tintColor} onPress={() => navigation.goBack()} />
              ),
            })}
          />
          <MainStack.Screen
            name={ScreenNames.MainWorkoutNotificationAddEdit}
            // component={NotificationAddEdit}
            children={props => {
              return <ScreenWrapper component={NotificationAddEdit} componentProps={props} willDelayRender={true} />;
            }}
            options={({route, navigation}) => ({
              title:
                route.params.pageType == PageType.Add ? t(ResKey.NotificationAddTitle) : t(ResKey.NotificationEditTitle),
              headerLeft: ({tintColor}) => (
                <HeaderBackButtonWT tintColor={tintColor} onPress={() => navigation.goBack()} />
              ),
            })}
          />
          <MainStack.Screen
            name={ScreenNames.MainStatistic}
            children={props => {
              return <ScreenWrapper component={Statistic} componentProps={props} willDelayRender={false} />;
            }}
            options={({route, navigation}) => ({
              headerTitle: ({children, tintColor}) =>
                customHeaderTitle({
                  children,
                  tintColor,
                  title: t(ResKey.StatisticTitle) + ' - ' + route.params.workoutName,
                }),
              // headerLeft: props => warningBackEditingWorkout(props, navigation),
            })}
          />
          <MainStack.Screen
            name={ScreenNames.MainGoal}
            children={props => {
              return <ScreenWrapper component={Goal} componentProps={props} willDelayRender={false} />;
            }}
            options={({route, navigation}) => ({
              headerTitle: ({children, tintColor}) =>
                customHeaderTitle({children, tintColor, title: t(ResKey.GoalTitle) + ' - ' + route.params.workoutName}),
            })}
          />
                  */
        }
      </MainStack.Group>

      {
        /*
      <MainStack.Group
        screenOptions={{
          // presentation: 'transparentModal',
          presentation: 'containedTransparentModal',
          animation: 'fade',
          headerShown: false,
        }}>
        <MainStack.Screen
          name={ScreenNames.MainWarningBack}
          component={WarningBack}
          // options={({route}) => ({})}
        />
        <MainStack.Screen
          name={ScreenNames.MainDialog}
          component={Dialog}
          // options={({route}) => ({})}
        />
      </MainStack.Group>
        */
      }
    </MainStack.Navigator>
  );
};
