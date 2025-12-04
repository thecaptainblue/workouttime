import {useFormikContext} from 'formik';
import StdSubmitButtonIcon from './StdSubmitButtonIcon';
interface FormSubmitButtonIconProps {}

export default function FormSubmitButtonIcon(props: FormSubmitButtonIconProps) {
  const {...restInputs} = props;
  const {handleSubmit, isValid} = useFormikContext();
  return (
    <StdSubmitButtonIcon
      {...restInputs}
      onPress={() => {
        // console.log('submit pressed');
        handleSubmit();
      }}
    />
  );
}
