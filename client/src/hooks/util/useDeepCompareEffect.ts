import _ from "lodash";
import React, { useEffect, useRef } from "react";

// Memoizes values array of dependencies
const useDeepCompareMemoize = (value: any) => {
    // Ref to hold previous object
    const ref = useRef()

    
    // If new object is different, object to return (equality functions return false)
    if (!_.isEqual(value, ref.current)) {
        ref.current = value
    }

    // If new object is the same, return old object (equality functions return true)
    return ref.current
}

// useEffect, but works with objects and arrays by memoizing values
export const useDeepCompareEffect = (callback: React.EffectCallback, dependencies: React.DependencyList) => {
    useEffect(
        callback,
        dependencies.map(useDeepCompareMemoize)
    )
}