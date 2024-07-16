import { useIMask } from "react-imask"



export function useMask(options) {
    const { ref, maskRef, value, setValue,
        unmaskedValue, setUnmaskedValue, typedValue, setTypedValue } = useIMask(options);

    const maskMainRef = ref;
    const maskMainValue = value;

    return { maskMainRef, maskRef, maskMainValue, setValue, unmaskedValue, setUnmaskedValue, typedValue, setTypedValue };
}

export function useNoMask() {
    return {
        maskMainRef: {}, maskRef: {}, maskMainValue: {}, setValue: {},
        unmaskedValue: {}, setUnmaskedValue: {}, typedValue: {}, setTypedValue: {}
    };
}
