import React, { useEffect, useRef, useCallback, useState } from 'react';
import { AppState, Button, StyleSheet, Text, View } from 'react-native';
// import { DraggableScrolSizeConstants } from '../../constants/StyleConstants';
import { MainStackParamList } from '../../@types/MainStackParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WorkoutService } from '../../services/WorkoutService';
import { LogService } from '../../services/Log/LogService';
import { ServiceRegistry } from '../../services/ServiceRegistry';
import { WorkoutData } from '../../@types/Data/WorkoutData';
import { useDispatch, useSelector } from 'react-redux';
import {
  AddWorkout,
  PayloadAddWorkout,
  RemoveWorkout,
  SetWorkouts,
  selectWorkouts,
} from '../../store/features/workoutsSlice';
import { WorkoutHelper } from '../../@types/Data/WorkoutHelper';
import { v4 } from 'uuid';
import { SetSingleWorkout } from '../../store/features/workoutSingleSlice';
import { PageType } from '../../@types/PageType';
import { FloatingButton } from '../../components/FloatingButton';
import { BottomMenuWorkoutItem, BottomMenuWorkoutItemRefProps } from '../../components/BottomMenu/BottomMenuWorkout';
import { useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { ListInsertionPositionType } from '../../components/BottomMenu/ListInsertionPositionType';
import useUpdatedRef from '../../hooks/useUpdatedRef';
import { ScreenNames } from '../Screens/ScreenNames';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ResKey } from '../../lang/ResKey';
import { useTranslation } from 'react-i18next';
import notifee from '@notifee/react-native';
import { notifDeleteNotificationsByNotificationDatas } from '../../helper/NotificationHelper';
import { useProcessBackgroundNotification } from '../../hooks/notification/useProcessBackgroundNotification';
import { logError } from '../../helper/LogHelper';
import { useProcessForegroundNotification } from '../../hooks/notification/useProcessForegroundNotification';
import { StatisticDocHelper } from '../../persistence/StatisticDocHelper';
import { useRealm } from '@realm/react';
// import FastList, { FastListEventType, FastListItemData, FastListViewRefProps } from '../../components/native/FastList';
// import { FastListHelper } from '../../helper/FastListHelper';
import { StringBuilder } from 'typescript-string-operations';
import { SystemDocHelper } from '../../persistence/SystemDocHelper';
import { scheduleOnRN } from 'react-native-worklets';

type HomeProps = NativeStackScreenProps<MainStackParamList, ScreenNames.MainHome>;

export default function Home(props: HomeProps) {

  // // useWhatChanged(props, 'HomeScreen');
  const workouts = useSelector(selectWorkouts);
  // // const workouts: WorkoutData[] = [];
  const workoutsRef = useUpdatedRef(workouts);
  const navigationRef = useUpdatedRef(props.navigation);
  const dispatch = useDispatch();
  const isDragActive = useSharedValue(false);
  const workoutServiceRef = useRef<WorkoutService | null>(null);
  const bottomMenuRef = useRef<BottomMenuWorkoutItemRefProps | null>(null);
  const selectedItemIdRef = useRef<string | null>(null);
  const bottomMenuOpenStatusObserver = useSharedValue(false);
  const emptyListLabel = useSharedValue('');
  const { t } = useTranslation();
  const realm = useRealm();
  const [isThereNotification, setIsThereNotification] = useState<boolean | null>(null);
  // const fastListRef = useRef<FastListViewRefProps | null>(null);
  // // const tsHandleAppStarted = useSelector(state => selectTS(state, ProfilingTSNames.HandleAppStarted));
  useProcessForegroundNotification();
  useProcessBackgroundNotification(navigationRef.current);
  // // useObserveAppState();

  const checkNotificationsCallback = useCallback(
    async (tmpWorkouts: WorkoutData[] | null): Promise<WorkoutData | null> => {
      LogService.debugFormat('checkNotifications, appState:  {0} ', AppState.currentState);
      const initialNotification = await notifee.getInitialNotification();
      let workout: WorkoutData | null = null;
      if (initialNotification) {
        console.log('Notification caused application to open', initialNotification.notification);
        console.log('Press action used to open the app', initialNotification.pressAction);

        const workoutId = initialNotification.notification.data?.workoutid;
        if (workoutId != null && workoutId !== '') {
          const tmpWorkout = tmpWorkouts?.find(item => item.id === workoutId);
          if (tmpWorkout != null) {
            workout = tmpWorkout;
          }
          // LogService.infoFormat('checkNotifications workout {0}', LogHelper.toString(workout));
        }
      }
      return workout;
    },
    [],
  );

  const setWorkoutsCallback = useCallback((workouts: WorkoutData[] | null) => {
    if (workouts != null) {
      LogService.debug('Home - load workouts with notification');
      dispatch(SetWorkouts(workouts));
      emptyListLabel.value = t(ResKey.WorkoutHomeEmptyListLabel);
    }
  }, []);

  const processWorkoutsAndNotificationCallback = useCallback(
    (tmpWorkouts: WorkoutData[] | null, workoutNotification: WorkoutData | null) => {
      if (workoutNotification != null) {
        navigationRef.current.navigate(ScreenNames.MainWorkoutPlayer, { workout: workoutNotification });
        setTimeout(() => {
          // after screen changes screen rerenders
          setIsThereNotification(false);
          setWorkoutsCallback(tmpWorkouts);
        }, 300);
      } else {
        setIsThereNotification(false);
        if (tmpWorkouts != null) {
          setTimeout(() => {
            // without timeout,  layout(height) changes and causes flicker
            setWorkoutsCallback(tmpWorkouts);
          }, 100);
        }
      }
    },
    [],
  );

  useEffect(() => {

    const systemDoc = SystemDocHelper.getSystem(realm)
    LogService.debug('Home========================checkFirstUsage isFirstUsage', systemDoc?.isFirstUsage);
    if (systemDoc == null || systemDoc.isFirstUsage) {
      LogService.info('Home========================firstUsage');
      const registry = ServiceRegistry.getInstance();
      const workoutService = registry.getService(WorkoutService.Basename) as WorkoutService;
      workoutServiceRef.current = workoutService;
      let tmpWorkouts = workoutService.getWorkouts();
      if (tmpWorkouts == null || tmpWorkouts.length == 0) {
        tmpWorkouts = WorkoutService.getInitialWorkouts();
        workoutService.changeWorkouts(tmpWorkouts)
      }
      SystemDocHelper.addUpdateSystem(realm, false)
    }
  }, []);


  useEffect(() => {
    const registry = ServiceRegistry.getInstance();
    const workoutService = registry.getService(WorkoutService.Basename) as WorkoutService;
    workoutServiceRef.current = workoutService;
    LogService.debug('start========================Home');
    const tmpWorkouts = workoutService.getWorkouts();
    checkNotificationsCallback(tmpWorkouts)
      .then(workoutItem => processWorkoutsAndNotificationCallback(tmpWorkouts, workoutItem))
      .catch(reason => {
        LogService.info('checkNotifications error {0}', reason);
        processWorkoutsAndNotificationCallback(tmpWorkouts, null);
      });
    // .finally(() =>
    //   console.info(
    //     'WorkoutAddEdit useEffect: ',
    //     ProfilingHelper.getDifference(tsHandleAppStarted, ProfilingTSNames.HandleAppStarted),
    //   ),
    // )
  }, []);

  const bottomMenuChangeStatus = useCallback((willOpen: boolean) => {
    // 'worklet';
    bottomMenuRef.current?.changeStatus(willOpen);
  }, []);

  const bottomMenuEnable = useCallback((enable: boolean) => {
    // 'worklet';
    bottomMenuRef.current?.enable(enable);
  }, []);

  const setSelectedItems = useCallback((selectedIds: string[]) => {
    // fastListRef.current?.setSelectedIds(selectedIds) // TODO yukseltme
  }, [])

  useAnimatedReaction(
    () => {
      return bottomMenuOpenStatusObserver.value;
    },
    (isBottemMenuOpen, previous) => {
      if (isBottemMenuOpen !== previous && isBottemMenuOpen === false) {
        scheduleOnRN(setSelectedItems, []);
      }
    },
    [],
  );

  const processReorderedData = useCallback((newWorkouts: WorkoutData[]) => {
    // console.log('processReorderedData');
    if (newWorkouts != null) {
      workoutServiceRef?.current?.changeWorkouts(newWorkouts);
      dispatch(SetWorkouts(newWorkouts));
    }
  }, []);

  const handleOnLongPressRenderItem = useCallback((id: string) => {
    // LogService.debug('handleOnLongPressRenderItem: id: ', id);
    if (!bottomMenuRef.current?.isStatusOpen()) {
      bottomMenuChangeStatus(!bottomMenuRef.current?.isStatusOpen());
    }
    selectedItemIdRef.current = id;
    setSelectedItems([id])
  }, []);

  useAnimatedReaction(
    () => {
      return isDragActive.value;
    },
    (isDragActiveValue, previousValue) => {
      if (isDragActiveValue !== null && isDragActiveValue !== previousValue) {
        scheduleOnRN(bottomMenuEnable, !isDragActiveValue);
        // bottomMenuEnable(!isDragActiveValue);
      }
    },
  );
  const handleAdd = useCallback(() => {
    // dispatch(setTS({key: ProfilingTSNames.HandleAddClicked, ts: ProfilingHelper.createTs()} satisfies PayloadSetTS));
    let workout: WorkoutData = WorkoutHelper.createWorkout(v4(), '');
    dispatch(SetSingleWorkout(workout));
    // LogService.debug('handleAdd navigate request: ' + TimeHelper.timeStampNow());
    // dispatch(
    //   setTS({key: ProfilingTSNames.HandleAddNavigateRequest, ts: ProfilingHelper.createTs()} satisfies PayloadSetTS),
    // );
    props.navigation.navigate(ScreenNames.MainWorkoutAddEdit, { pageType: PageType.Add });
    // LogService.debug('handleAdd navigate requested ts:' + TimeHelper.timeStampNow());
    // dispatch(
    //   setTS({key: ProfilingTSNames.HandleAddNavigateRequested, ts: ProfilingHelper.createTs()} satisfies PayloadSetTS),
    // );
  }, []);

  const handleSwipeLeft = useCallback((id: string) => {
    LogService.debug('handleSwipeLeft: ', id);
    // dispatch(setTS({key: ProfilingTSNames.HandleAddClicked, ts: ProfilingHelper.createTs()} satisfies PayloadSetTS));
    // let workout = workouts.find(workout => workout.id === id);
    // if (workout != null) {
    //   props.navigation.navigate('WorkoutPlayer', {workout: workout});
    // }P
    // props.navigation.navigate('WorkoutAdd', {workoutId: id});
    let workout: WorkoutData = workoutsRef.current.find(item => item.id === id) as WorkoutData;
    // LogService.infoFormat('handleSwipeLeft edited workouts notif length: {0}', LogHelper.toString(workout));

    dispatch(SetSingleWorkout(workout));
    props.navigation.navigate(ScreenNames.MainWorkoutAddEdit, { pageType: PageType.Edit });
  }, []);

  const handleSwipeRight = useCallback((id: string) => {
    LogService.debug('handleSwipeRight: ', id);

    try {
      let workout: WorkoutData = workoutsRef.current.find(item => item.id === id) as WorkoutData;
      // NotificationHelper.de
      // LogService.infoFormat('handleSwipeRight delete notifications: {0}', LogHelper.toString(workout.notifications));
      notifDeleteNotificationsByNotificationDatas(workout.notifications);
      StatisticDocHelper.deleteStatistic(realm, id);
    } catch (error) {
      logError(error);
    }

    let workoutService = workoutServiceRef.current;
    if (workoutService != null) {
      workoutService.removeWorkoutByid(id);
    }
    dispatch(RemoveWorkout(id));
  }, []);

  const handleStatisticBtnPressed = useCallback((id: string) => {
    // LogService.debugFormat('handleStatisticBtnPressed: id :{0}', id);
    const workout: WorkoutData = workoutsRef.current.find(item => item.id === id) as WorkoutData;
    const workoutName = workout.name;

    props.navigation.navigate(ScreenNames.MainStatistic, { workoutId: id, workoutName: workoutName });
  }, []);

  const handleGoalBtnPressed = useCallback((id: string) => {
    // LogService.debugFormat('handleGoalBtnPressed: id :{0}', id);
    const workout: WorkoutData = workoutsRef.current.find(item => item.id === id) as WorkoutData;
    const workoutName = workout.name;

    props.navigation.navigate(ScreenNames.MainGoal, { workoutId: id, workoutName: workoutName });
  }, []);

  const onPressWhenNoDraggingCallback = useCallback((id: string) => {
    // console.log('onPressWhenNoDraggingCallback');
    if (workoutsRef.current != null) {
      const workouts = workoutsRef.current;
      const item = workouts.find(item => item.id == id)
      if (item != null) {
        props.navigation.navigate(ScreenNames.MainWorkoutPlayer, { workout: item });
      }
    }
  }, []);

  const handleOnReorderPressed = useCallback(() => {
    bottomMenuChangeStatus(false);
    // fastListRef.current?.changeDraggable(true) // TODO yukseltme
    isDragActive.value = true;
  }, []);

  const handleOnDuplicatePressed = useCallback((duplicationType: ListInsertionPositionType) => {
    // console.log('handleOnDuplicatePressed id: %s duplicationType:%s', selectedItemIdRef.current, duplicationType);
    bottomMenuChangeStatus(false);
    if (selectedItemIdRef.current && workoutsRef.current) {
      const workouts = workoutsRef.current;
      // const workoutItem = workouts.find(item => {
      //   return item.id === selectedItemIdRef.current;
      // });
      const selectedItemIndex = workouts.findIndex(item => item.id === selectedItemIdRef.current);
      if (selectedItemIndex >= 0) {
        const toBeDuplicatedItem = workouts[selectedItemIndex];
        // console.log('handleOnDuplicatePressed workoutItem: ', workoutItem);
        const workoutService = workoutServiceRef.current;
        if (toBeDuplicatedItem != null && workoutService != null) {
          const duplicateItem = WorkoutHelper.createWorkout(
            v4(),
            toBeDuplicatedItem.name,
            toBeDuplicatedItem.components,
          );
          // console.log('handleOnDuplicatePressed duplicateWorkout: ', duplicateWorkout);
          let insertionPosition: number | undefined;

          if (duplicationType == ListInsertionPositionType.AtStart) {
            insertionPosition = 0;
          } else if (duplicationType == ListInsertionPositionType.JustBelow) {
            insertionPosition = selectedItemIndex + 1;
          }
          workoutService.addWorkout(duplicateItem, insertionPosition);
          dispatch(AddWorkout({ workout: duplicateItem, index: insertionPosition } satisfies PayloadAddWorkout));
        }
      }
    }
  }, []);

  const handleItemClick = useCallback((event: { nativeEvent: { eventType: string, id: string, params: Record<string, any>; } }) => {
    // TODO yukseltme
    // const { eventType, id, params } = event.nativeEvent;
    // console.log(`Item with eventType: ${eventType} ID: ${id} was clicked! params ${params}`);
    // if (eventType == FastListEventType.ItemLongPressed) {
    //   handleOnLongPressRenderItem(id)
    // } else if (eventType == FastListEventType.DraggableChanged) {
    //   let isDraggable = params.isDraggable
    //   console.log(`Item with eventType: ${eventType} ID: ${id} was clicked! params.isDraggable ${isDraggable}`);
    //   isDragActive.value = isDraggable
    // } else if (eventType == FastListEventType.DataChanged) {
    //   let data = params.data as FastListItemData[]
    //   // console.log(`Item with eventType: ${eventType} ID: ${id} was clicked! params.data ${data}`);
    //   const newWorkouts = FastListHelper.reorderByFastList(workoutsRef.current, data)
    //   let text = new StringBuilder("")
    //   newWorkouts.forEach((item, index) => text.append(` ${index} ${item.name},`))
    //   // console.log(`Item with eventType: ${eventType} ID: ${id} was clicked! params.data ${text.toString()}`);
    //   processReorderedData(newWorkouts)
    // } else if (eventType == FastListEventType.DeleteButtonClicked) {
    //   handleSwipeRight(id)
    // }
    // else if (eventType == FastListEventType.EditButtonClicked) {
    //   handleSwipeLeft(id)
    // }
    // else if (eventType == FastListEventType.ItemClicked) {
    //   onPressWhenNoDraggingCallback(id)
    // }
    // else if (eventType == FastListEventType.StatisticButtonClicked) {
    //   handleStatisticBtnPressed(id)
    // }
  }, []);

  const floatingButtonContainerAnimStyle = useAnimatedStyle(() => {
    return { display: isDragActive.value ? 'none' : 'flex' };
  }, []);

  const willDisplay = isThereNotification == false;

  LogService.debugFormat('rerender home willDisplay: {0}', willDisplay);

  if (!willDisplay) {
    return null;
  }

  return (
    <SafeAreaView
      style={styles.containerMain}
      onLayout={event => {
        // console.log('Home-SafeAreaView ', LogHelper.toString(event.nativeEvent.layout));
      }}>
      {/* <StatusBar barStyle="light-content" backgroundColor={ColorConstants.primary} /> */}
      {/* <GestureHandlerRootView
        style={styles.containerGestureHandler}
        onLayout={event => {
          // console.log('Home-containerGestureHandler ', LogHelper.toString(event.nativeEvent.layout));
        }}> */}
      <View style={styles.containerScroll}>
        <Text style={{ color: "white" }}> hello home</Text>
        <Button title='Play' onPress={() => {
          // onPressWhenNoDraggingCallback(workoutsRef.current[0].id)
          props.navigation.navigate(ScreenNames.MainExerciseAddEdit, {
            idLadder: [],
            componentId: null,
            parentGroupId: null,
            pageType: PageType.Add,
            isFromWorkout: true,
            isRepBased: false,
          });
        }

        } />

        {
          /**
        <FastList
          ref={fastListRef}
          data={FastListHelper.convert(workouts)}
          isDraggable={false}
          onClickEventHappened={handleItemClick}
          emptyListLabel={emptyListLabel}
        />
             */
        }
      </View>
      <FloatingButton containerStyle={floatingButtonContainerAnimStyle} onPress={handleAdd} />
      <BottomMenuWorkoutItem
        ref={bottomMenuRef}
        onReorderPressed={handleOnReorderPressed}
        onDuplicatePressed={handleOnDuplicatePressed}
        openStatusObserver={bottomMenuOpenStatusObserver}
        parentName={ScreenNames.MainHome}
      />
      {/* </GestureHandlerRootView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    // backgroundColor: ColorConstants.background,
    // borderColor: 'red',
    // borderWidth: 1,
    // marginBottom: 50,
  },
  containerGestureHandler: { flex: 1 },
  containerScroll: { flex: 1 },
});

// export default Home;
