import React from 'react';
import { SafeAreaView, ScrollView, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { ColorConstants, SizeConstants } from '../constants/StyleConstants';
// import { SafeAreaView } from 'react-native-safe-area-context'; // TODO yukseltme bunu ekleyince bir miktar bosluk gozukuyor

interface ScrollContainerProps {
  children: React.ReactNode;
  scrollViewRef?: React.MutableRefObject<ScrollView | null>;
  scrollViewContainerStyle?: StyleProp<ViewStyle>;
  scrollContentContainerStyle?: StyleProp<ViewStyle>;
}

const ScrollContainer = (props: ScrollContainerProps) => {
  const { children, scrollViewRef, scrollViewContainerStyle, scrollContentContainerStyle } = props;
  return (
    <SafeAreaView style={[styles.backgroundStyle, scrollViewContainerStyle]}>
      <ScrollView
        ref={scrollViewRef}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.contentContainer, scrollContentContainerStyle]}
        style={[styles.backgroundStyle, scrollViewContainerStyle]}
      // nested scrolla da gerekli
      // keyboardShouldPersistTaps={'handled'}
      // nestedScrollEnabled={true}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    // backgroundColor: ColorConstants.background,
    // backgroundColor: 'white',
    // borderColor: 'red',
    // borderWidth: 1,
  },
  contentContainer: {
    padding: SizeConstants.paddingLarge,
    // backgroundColor: ColorConstants.background,
    // backgroundColor: 'white',
  },
});

export default ScrollContainer;
