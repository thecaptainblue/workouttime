import {PressableProps} from 'react-native';
import {FormStyles} from './FormStyles';
import {ButtonWTIcon} from '../ButtonWTIcon';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {ColorConstants, FontConstants} from '../../constants/StyleConstants';
interface StdSubmitButtonIconProps extends PressableProps {}

export default function StdSubmitButtonIcon(props: StdSubmitButtonIconProps) {
  const {...restInputs} = props;
  return (
    <ButtonWTIcon isPressAnimationActive={true} {...restInputs} containerStyle={FormStyles.buttonAdd}>
      <MaterialIcon name="check" size={FontConstants.sizeLargeXXX} color={ColorConstants.primary} />
    </ButtonWTIcon>
  );
}
