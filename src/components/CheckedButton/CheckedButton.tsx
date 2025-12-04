import {memo, useCallback, useEffect, useState} from 'react';
import {PressableProps, StyleProp, View, ViewStyle, StyleSheet} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {LogService} from '../../services/Log/LogService';
import {ButtonWTIcon} from '../ButtonWTIcon';
import {ColorConstants, FontConstants, SizeConstants} from '../../constants/StyleConstants';

export interface CheckedButtonProps extends PressableProps {
  defaultValue?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  onChangeValue: (isChecked: boolean) => void;
}

function CheckedButtonInner(props: CheckedButtonProps) {
  const {defaultValue, style, contentStyle, onChangeValue, ...restProps} = props;
  const [isChecked, setIsChecked] = useState(defaultValue ?? false);

  const handleOnPress = useCallback(() => {
    setIsChecked(value => !value);
  }, []);

  useEffect(() => {
    onChangeValue(isChecked);
  }, [isChecked]);

  LogService.debugFormat('rerender CheckedButtonInner');
  return (
    <ButtonWTIcon
      isPressAnimationActive={true}
      containerStyle={[style, styles.container]}
      overlayStyle={styles.overlayStyle}
      {...restProps}
      onPress={handleOnPress}>
      <View style={[styles.content, contentStyle]}>
        {isChecked && (
          <MaterialCommunityIcon
            name="checkbox-outline"
            size={FontConstants.sizeLargeXX}
            color={ColorConstants.analogous2}
          />
        )}
        {!isChecked && (
          <MaterialCommunityIcon
            name="checkbox-blank-outline"
            size={FontConstants.sizeLargeXX}
            color={ColorConstants.analogous2}
          />
        )}
      </View>
    </ButtonWTIcon>
    //
  );
}

export const CheckedButton = memo(CheckedButtonInner);

const styles = StyleSheet.create({
  text: {
    color: ColorConstants.onBackground,
    // backgroundColor: 'grey',
    // flexDirection: 'column',
  },
  content: {
    flexDirection: 'row',
    paddingHorizontal: SizeConstants.paddingLarge,
    paddingVertical: SizeConstants.paddingSmall,
    alignSelf: 'stretch',
    justifyContent: 'center',
    // alignContent: 'center',
    alignItems: 'center',
    minHeight: SizeConstants.clickableSizeMin,
    minWidth: SizeConstants.clickableSizeMin,
  },
  container: {
    // flex: 1,
    // alignSelf: 'stretch',
    // backgroundColor: 'red',
  },
  overlayStyle: {
    backgroundColor: ColorConstants.analogous2,
  },
});
