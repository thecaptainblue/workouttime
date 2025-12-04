import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {HeaderSizeConstants, SizeConstants} from '../../constants/StyleConstants';

export interface CustomHeaderTitleProps {
  titleText: string;
  tintColor?: string;
}

function CustomHeaderTitleInner(props: CustomHeaderTitleProps) {
  const {titleText, tintColor} = props;
  //   const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.title, {color: tintColor}]}>
        {
          titleText
          // +                    'long1 long2 long3 long4 long5 long6 small smal2 small3 small4 long long long long long long small smal2 small3 small4'
        }
      </Text>
    </View>
  );
}
////////////////////////////////////////////////// modal versiyonu
// <View style={styles.container}>
//   <View
//     style={{
//       flex: 1,
//       // marginRight: 75,
//     }}>
//     <TouchableOpacity onPress={() => setModalVisible(true)}>
//       <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.title, {color: tintColor}]}>
//         {
//           titleText
//           // +                    'long1 long2 long3 long4 long5 long6 small smal2 small3 small4 long long long long long long small smal2 small3 small4'
//         }
//       </Text>
//     </TouchableOpacity>
//   </View>

//   <Modal transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
//     <View style={styles.modalOverlay}>
//       <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
//         <View style={styles.modalContent}>
//           <Text style={styles.fullText}>{titleText}</Text>
//         </View>
//       </TouchableOpacity>
//     </View>
//   </Modal>
// </View>
////////////////////////////////////////////////// sadece text hali
// headerTitle: () => (
//   <Text
//   numberOfLines={1}
//   ellipsizeMode="tail"
//   style={{
//     fontSize: 18,
//     fontWeight: 'bold',
//     backgroundColor: 'red',
//     // marginRight: 75,
//     // marginRight: '15%',
//   }}>
//   {t(ResKey.GoalTitle) +
//     ' - ' +
//     route.params.workoutName +
//     'long1 long2 long3 long4 long5 long6 small smal2 small3 small4 long long long long long long small smal2 small3 small4'}
// </Text>
// ),
// headerLeft: props => warningBackEditingWorkout(props, navigation),

export const CustomHeaderTitle = React.memo(CustomHeaderTitleInner);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // paddingHorizontal: 16,
  },
  title: {
    flex: 1,
    // flexDirection: 'row',
    fontSize: HeaderSizeConstants.fontSize,
    fontWeight: HeaderSizeConstants.fontWeight,
    width: '80%',
    // backgroundColor: 'yellow',
    textAlignVertical: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // width: '100%',
  },
  modalContent: {
    // backgroundColor: 'white',
    backgroundColor: HeaderSizeConstants.backgroundColor,
    paddingHorizontal: SizeConstants.paddingRegular,
    // borderRadius: 10,
    alignItems: 'flex-start',
    minHeight: 50,
    // alignContent: 'center',
    justifyContent: 'center',
    // width: '100%',
  },
  modalButton: {
    flex: 1,
    width: '100%',
  },
  fullText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
