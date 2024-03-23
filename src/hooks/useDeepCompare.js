import { useEffect, useRef } from 'react';
import shallowEqual from 'shallowequal';

const useDeepCompare = (valueA, valueB) => {
    const ref = useRef([]);
    useEffect(() => {
        ref.current = valueA;
    }, [valueA]);

    return !shallowEqual(ref.current, valueB); // Replace shallowEqual with a deep comparison library if needed
};

export default useDeepCompare;