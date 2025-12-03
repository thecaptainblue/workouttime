import { useEffect, useRef } from "react";

export default function useWhatChanged(props: any, prefix?: string) {
    const previousProps = useRef(props);

    useEffect(() => {
        const keys: string[] = Object.keys(props)

        // console.log('props changed keys', keys)
        const changedPropNames = keys.filter(propName => {
            const currentValue = props[propName as keyof typeof props];
            const previousValue = previousProps.current[propName as keyof typeof props];
            // if (currentValue !== previousValue) {
            //     console.log('propName:%s current:%s previous:%s', propName, currentValue, previousValue);
            // }

            return currentValue !== previousValue;
        })
        if (changedPropNames !== null && changedPropNames.length > 0) {
            console.log(` ${prefix} changedPropNames `, changedPropNames);
        }

        previousProps.current = props;
    }, [props]);
}
