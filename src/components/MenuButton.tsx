import {memo} from 'react';
import {PressableProps, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import {ColorConstants, SizeConstants} from '../constants/StyleConstants';
import {LogService} from '../services/Log/LogService';
import {ButtonWTIcon} from './ButtonWTIcon';
import {GenHelper} from '../helper/GenHelper';

export interface MenuButtonProps extends PressableProps {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}

function MenuButtonInner(props: MenuButtonProps) {
  const {text, style, textStyle, contentStyle, icon, ...restProps} = props;
  const isThereText = GenHelper.isStringNotEmpty(text);
  LogService.debugFormat('rerender MenuButton {0}', text);
  return (
    <ButtonWTIcon
      isPressAnimationActive={true}
      pressedScale={0.98}
      containerStyle={[style, styles.container]}
      overlayStyle={styles.overlayStyle}
      {...restProps}>
      <View style={[styles.content, contentStyle]}>
        {icon}
        {/* <MaterialIcon name="alarm" size={FontConstants.sizeLargeX} color={ColorConstants.analogous2} /> */}
        {isThereText && <Text style={[styles.text, textStyle]}>{text}</Text>}
      </View>
    </ButtonWTIcon>
  );
}

export const MenuButton = memo(MenuButtonInner);

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
