import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {LogService} from '../services/Log/LogService';
import {ColorConstants, FontConstants} from '../constants/StyleConstants';
import {useState} from 'react';
import useWhatChanged from '../hooks/useWhatChanged';
import {typedMemo} from './helper/utils';
import {useTranslation} from 'react-i18next';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

interface SelectionListProps<T> {
  keyNameExtractor: (item: T, index: number) => [itemKey: string, itemName: string];
  data: T[];
  onSelectionChanged: (itemKey: string) => void;
  initialSelectedKey: string;
}

function SelectionListInner<T>(props: SelectionListProps<T>) {
  const {t} = useTranslation();
  const {keyNameExtractor, data, onSelectionChanged, initialSelectedKey} = props;
  const [selectedKey, setSelectedKey] = useState(initialSelectedKey);
  useWhatChanged(props, 'SelectionList');
  LogService.debug('rerender SelectionList');
  return (
    <View style={styles.scrollContainer}>
      {data.map((item, index) => {
        const [itemKey, itemName] = keyNameExtractor(item, index);
        return (
          <TouchableHighlight
            underlayColor={ColorConstants.surfaceEl15}
            key={itemKey}
            style={[styles.itemContainer, itemKey === selectedKey ? styles.selectedItemContainer : null]}
            onPress={() => {
              setSelectedKey(itemKey);
              onSelectionChanged(itemKey);
            }}>
            <View style={styles.itemContent}>
              <Text style={[styles.text, , itemKey === selectedKey ? styles.textSelected : null]}>{t(itemName)}</Text>
              <MaterialIcon
                name="done"
                size={FontConstants.sizeRegular}
                style={[styles.textSelected, {marginLeft: 5, opacity: itemKey === selectedKey ? 1 : 0}]}
              />
            </View>
          </TouchableHighlight>
        );
      })}
    </View>
  );
}
export const SelectionList = typedMemo(SelectionListInner);
const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    // backgroundColor: 'cyan',
    // alignItems: 'center',
    // alignContent: 'space-around',
    // justifyContent: 'space-around',
    // alignSelf: 'center',
    // borderColor: 'red',
    // borderWidth: 1,
  },
  itemContainer: {
    flex: 1,
    // alignItems: 'center',
    // backgroundColor: 'red',
    // marginVertical: 5,
    // paddingVertical: 5,
    borderRadius: 5,
    paddingVertical: 7,
    paddingHorizontal: 5,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // alignContent: 'space-between',
    justifyContent: 'space-between',
  },
  selectedItemContainer: {
    backgroundColor: ColorConstants.surfaceEl11,
    borderRadius: 5,
  },
  text: {
    // flex: 1,
    color: ColorConstants.onSurfaceDepth10,
    fontSize: FontConstants.sizeRegular,
  },
  textSelected: {
    // color: ColorConstants.onSurface,
    color: ColorConstants.primary,
  },
});
