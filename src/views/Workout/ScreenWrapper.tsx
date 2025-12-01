import { useEffect, useState } from 'react';
// import {LogService} from '../../services/Log/LogService';
// import FloatingButtonMultiChoice from '../../components/FloatingButtonMultiChoice';
import React from 'react';
import { typedMemo } from '../../components/helper/utils';

// type WrapperProps = NativeStackScreenProps<MainStackParamList, 'Wrapper'>;

type GenericComponentProps<TComponent extends React.ComponentType<any>> = {
  component: TComponent;
  componentProps: React.ComponentProps<TComponent>;
  willDelayRender?: boolean;
};

function ScreenWrapperInner<
  TComponent extends React.ComponentType<any>,
// , TProps
>(props: GenericComponentProps<TComponent>) {
  const { component: Component, componentProps, willDelayRender } = props;
  const [willComponentRendered, setWillComponentRendered] = useState(willDelayRender == true ? false : true);
  // const tsHandleAddClicked = useSelector(state => selectTS(state, ProfilingTSNames.HandleAddClicked));

  useEffect(() => {
    if (!willComponentRendered) {
      setWillComponentRendered(true);
    }
  }, []);

  // LogService.debugFormat('rerender ScreenWrapperInner');

  return (
    <>
      {/* {!willComponentRendered && <Text style={{color: 'white'}}> Hello kitty</Text>} */}
      {willComponentRendered && <Component {...componentProps} />}
      {/* {<Component {...componentProps} />} */}
    </>
  );
}

export const ScreenWrapper = typedMemo(ScreenWrapperInner);
