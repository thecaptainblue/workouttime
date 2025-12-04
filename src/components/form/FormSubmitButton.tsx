import React from 'react';
import {Pressable, Text} from 'react-native';
import {useFormikContext} from 'formik';
import {FormStyles} from './FormStyles';
interface FormSubmitButtonProps {
  title: string;
}
export default function FormSubmitButton({title}: FormSubmitButtonProps) {
  const {handleSubmit, isValid} = useFormikContext();
  return (
    // <Button
    //   onPress={() => {
    //     handleSubmit();
    //   }}
    //   title={title}
    //   disabled={!isValid}
    // />
    <Pressable
      style={FormStyles.buttonAdd}
      onPress={() => {
        // console.log('submit pressed');
        handleSubmit();
      }}
      // disabled={!isValid} // invalid hale gelince butona basamadigindan hata mesajlari gozukmuyor.
    >
      <Text style={FormStyles.buttonText}>{title}</Text>
    </Pressable>
  );
}
