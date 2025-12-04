import {Pressable, PressableProps, Text} from 'react-native';
import {FormStyles} from './FormStyles';
import {ButtonWTIcon} from '../ButtonWTIcon';
import {ColorConstants, FontConstants} from '../../constants/StyleConstants';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

interface StdButtonCancelProps extends PressableProps {
  // title: string;
}
export default function StdButtonCancel(props: StdButtonCancelProps) {
  const {...restInputs} = props;
  return (
    <ButtonWTIcon
      isPressAnimationActive={true}
      {...restInputs}
      containerStyle={FormStyles.buttonAdd}
      // onPress={onPress}
    >
      <MaterialIcon name="close" size={FontConstants.sizeLargeXXX} color={ColorConstants.primary} />
    </ButtonWTIcon>
  );
}
