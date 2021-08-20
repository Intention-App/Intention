import _ from "lodash";
import { useDeepCompareEffect } from "./useDeepCompareEffect";

export const useSavePrompt = (foo: any, bar: any) => {

    const unloadFn = (e: BeforeUnloadEvent) => {


        e = e || window.event;

        // For IE and Firefox prior to version 4
        if (e) {
            e.returnValue = 'Progress may not be saved, close anyway?';
        }

        // For Safari
        return 'Progress may not be saved, close anyway?';

    }

    useDeepCompareEffect(() => {

        if (!_.isEqual(foo, bar)) {
            window.addEventListener('beforeunload', unloadFn);
        }

        return () => {
            window.removeEventListener('beforeunload', unloadFn);
        }
        
    }, [foo, bar])
}