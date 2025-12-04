import { HeaderBackButton, HeaderBackButtonProps } from '@react-navigation/elements';
import { SizeConstants } from '../constants/StyleConstants';
import { memo } from 'react';

export interface HeaderBackButtonWTProps extends HeaderBackButtonProps { }

function HeaderBackButtonWTInner(props: HeaderBackButtonWTProps) {
  const { ...restInputs } = props;

  return (
    <HeaderBackButton
      {...restInputs}
      //   tintColor={tintColor}
      style={{
        marginRight: SizeConstants.paddingLargeX,
        marginLeft: 0, // bu bilesen tek basina kullanildiginda etkili olmuyor ama headerTitle ile birlikte kullanildiginda fark ediyor.
        // left: 0,
        // backgroundColor: 'red',
      }}
    // onPress={() => navigation.navigate(ScreenNames.MainWarningBackEditingWorkout)}
    />
  );
}

export const HeaderBackButtonWT = memo(HeaderBackButtonWTInner);
