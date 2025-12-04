import {PressableProps} from 'react-native';
import {FormStyles} from './FormStyles';
import {ButtonWTIcon} from '../ButtonWTIcon';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ColorConstants, FontConstants} from '../../constants/StyleConstants';
interface StdAlternativeButtonIconProps extends PressableProps {}

export default function StdAlternativeButtonIcon(props: StdAlternativeButtonIconProps) {
  const {...restInputs} = props;
  return (
    <ButtonWTIcon isPressAnimationActive={true} {...restInputs} containerStyle={[FormStyles.buttonAdd]}>
      <MaterialCommunityIcon name="directions-fork" size={FontConstants.sizeLargeXXX} color={ColorConstants.primary} />
    </ButtonWTIcon>
  );
}
