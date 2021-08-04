import _ from "lodash";
import React, { useEffect, useRef } from "react";

// Compares equality of objects & arrays even if reference is different
const deepCompareEquals = (a: any, b: any) => {
    return _.isEqual(a, b);
}


// Memoizes values array of dependencies
const useDeepCompareMemoize = (value: any) => {
    const ref = useRef()

    if (!deepCompareEquals(value, ref.current)) {
        ref.current = value
    }

    return ref.current
}

// useEffect, but works with objects and arrays by memoizing values
export const useDeepCompareEffect = (callback: React.EffectCallback, dependencies: React.DependencyList) => {
    useEffect(
        callback,
        dependencies.map(useDeepCompareMemoize)
    )
}