import { JSX } from 'react';
import { StyleSheet, View } from 'react-native';
import { BaseToast, BaseToastProps, ErrorToast, InfoToast } from 'react-native-toast-message';
import { ColorConstants, FontConstants, SizeConstants } from '../constants/StyleConstants';
import { AppConstants } from '../AppMain';
// import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

function handleLeadingIconInfo() {
  return (
    <View style={styles.iconView}>
      <Ionicons name="information-circle-outline" size={FontConstants.sizeLargeXX} color={ColorConstants.primary} />
    </View>
  );
}

function handleLeadingIconInfoSuccess() {
  return (
    <View style={styles.iconView}>
      <Ionicons name="checkmark-circle-outline" size={FontConstants.sizeLargeXX} color={ColorConstants.chartSuccess} />
    </View>
  );
}

function handleLeadingIconInfoError() {
  return (
    <View style={styles.iconView}>
      <Ionicons name="close-circle-outline" size={FontConstants.sizeLargeXX} color={ColorConstants.error} />
    </View>
  );
}

// todo: info'yu ozellestirdim ama hata ve basarili durumlari ozellestirmedim.
export const toastConfig = {
  /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
  success: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <BaseToast
      {...props}
      renderLeadingIcon={handleLeadingIconInfoSuccess}
      style={styles.baseStyle}
      contentContainerStyle={styles.contentContainerStyle}
      text1Style={[styles.text1Style, styles.text1SuccessStyle]}
      text2Style={styles.text2Style}
    />
  ),
  /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
  error: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <ErrorToast
      {...props}
      renderLeadingIcon={handleLeadingIconInfoError}
      style={styles.baseStyle}
      contentContainerStyle={styles.contentContainerStyle}
      text1Style={[styles.text1Style, styles.text1ErrorStyle]}
      text2Style={styles.text2Style}
    />
  ),

  info: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <InfoToast
      {...props}
      //   touchableContainerProps={}
      // renderLeadingIcon={() => (
      //   <View style={styles.iconView}>
      //     {/* <MaterialIcon name="information-variant" size={FontConstants.sizeXLarge} color={ColorConstants.primary} /> */}
      //     <Ionicons name="information-circle-outline" size={FontConstants.sizeXLarge} color={ColorConstants.primary} />
      //   </View>
      // )}
      renderLeadingIcon={handleLeadingIconInfo}
      style={styles.baseStyle}
      contentContainerStyle={styles.contentContainerStyle}
      text1Style={styles.text1Style}
      text2Style={styles.text2Style}
    />
  ),
};

const styles = StyleSheet.create({
  iconView: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red'
  },
  baseStyle: {
    // borderLeftColor: 'pink',
    // backgroundColor: ColorConstants.surfaceEl4,
    backgroundColor: ColorConstants.surface,
    margin: 0,
    padding: 0,
    borderLeftWidth: 0,
    borderRadius: SizeConstants.borderRadius,
    shadowRadius: SizeConstants.borderRadius,
    // width: AppConstants.windowWidth * 0.9,
    width: null,
    minWidth: AppConstants.windowWidth * 0.5,
    // flexDirection: 'column',
    paddingHorizontal: SizeConstants.paddingSmallX,
  },
  contentContainerStyle: {
    // paddingHorizontal: 15
    // backgroundColor: 'red',
    paddingHorizontal: SizeConstants.paddingSmallX,
    flex: 0,
    // paddingHorizontal: 0,
    // alignItems: 'center',
  },
  text1Style: {
    // fontSize: 17,
    color: ColorConstants.primary,
    fontSize: FontConstants.sizeLarge,
    fontWeight: FontConstants.weightBold,
    // textAlign: 'center',
  },
  text1ErrorStyle: {
    color: ColorConstants.error,
  },
  text1SuccessStyle: {
    color: ColorConstants.chartSuccess,
  },
  text2Style: {
    // fontSize: 15,
    // color: ColorConstants.primary,
    // fontSize: FontConstants.sizeLarge,
    // fontWeight: FontConstants.weightBold,
  },
});
