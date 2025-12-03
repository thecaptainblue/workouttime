import {memo} from 'react';
import {Pressable, PressableProps, Text, StyleSheet} from 'react-native';
import {ColorConstants, FontConstants, SizeConstants} from '../../constants/StyleConstants';
import {KeyValuePair} from '../../@types/KeyValuePair';
import {OverlayState, OverlayView} from '../OverlayView';
import {useDerivedValue} from 'react-native-reanimated';

export interface LanguageItemButtonProps extends PressableProps {
  item: KeyValuePair<string, string>;
  isSelected: boolean;
  handleSelectLanguage: (languagePrefix: string) => void;
}

function LanguageItemButtonInner(props: LanguageItemButtonProps) {
  const {item, isSelected, handleSelectLanguage} = props;

  const itemOverlayState = useDerivedValue<OverlayState>(() => {
    let result = OverlayState.None;
    if (isSelected) {
      result = OverlayState.Selected;
    }
    // console.log('overlayState: ', result);
    return result;
  }, [isSelected]);

  return (
    <Pressable key={item.key} style={styles.settingsItem} onPress={() => handleSelectLanguage(item.key)}>
      <Text style={[styles.settingsItemValue, isSelected ? styles.settingsItemValueSelected : null]}>{item.value}</Text>
      <OverlayView state={itemOverlayState} viewStyle={styles.overlay} />
    </Pressable>
  );
}

export const LanguageItemButton = memo(LanguageItemButtonInner);

const styles = StyleSheet.create({
  settingsItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SizeConstants.paddingRegular,
    padding: SizeConstants.paddingRegular,
    backgroundColor: ColorConstants.surface,
    borderRadius: SizeConstants.borderRadius,
    minHeight: SizeConstants.clickableSizeMin,
  },

  // settingsItemKey: {
  //   color: ColorConstants.font,
  // },
  settingsItemValue: {
    fontSize: FontConstants.sizeRegular,
    color: ColorConstants.onSurfaceDepth10,
    fontWeight: FontConstants.weightBold,
  },
  settingsItemValueSelected: {
    color: ColorConstants.analogous2,
    textDecorationLine: 'underline',
  },
  overlay: {
    borderRadius: SizeConstants.borderRadius,
  },
});
