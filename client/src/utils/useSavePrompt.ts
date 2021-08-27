import _ from "lodash";
import { useDeepCompareEffect } from "./useDeepCompareEffect";

export const useSavePrompt = (comparison: [any, any], saveFn?: (...args: any) => any) => {

    const unloadFn = (e: BeforeUnloadEvent) => {

        if (saveFn) {

            saveFn();

        }
        else {

            e = e || window.event;


            // For IE and Firefox prior to version 4
            if (e) {
                e.returnValue = 'Progress may not be saved, close anyway?';
            }

            // For Safari
            return 'Progress may not be saved, close anyway?';

        }

    }

    useDeepCompareEffect(() => {

        if (!_.isEqual(comparison[0], comparison[1])) {
            window.addEventListener('beforeunload', unloadFn);
        }

        return () => {
            window.removeEventListener('beforeunload', unloadFn);
        }

    }, [comparison[0], comparison[1]])
}