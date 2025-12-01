import { useRef } from "react"

export default function useUpdatedRef<T>(param: T) {
    // console.log('useUpdatedRef ')
    const paramRef = useRef(param);
    paramRef.current = param;
    return paramRef;
}