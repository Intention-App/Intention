import _ from "lodash";
import { useDeepCompareEffect } from "./useDeepCompareEffect";

// Asks to save when user closes window before saving is done
export const useSavePrompt = (
    comparison: [any, any], // Comparison of debounce and actual value to check whether it is saved
    saveFn?: (...args: any) => any // Function to run when saving
) => {

    const unloadFn = (e: BeforeUnloadEvent) => {
        // If save function exists, run save function
        if (saveFn) {
            saveFn();
        }
        else {
            // Returns confirmation when user attempts to close window while saving

            e = e || window.event;
            // For IE and Firefox prior to version 4
            if (e) {
                e.returnValue = 'Progress may not be saved, close anyway?';
            }
            // For Safari
            return 'Progress may not be saved, close anyway?';

        }
    }

    // Run whenever value or debounce value changes
    useDeepCompareEffect(() => {
        // If values are different (not saved), then warn before window closes
        if (!_.isEqual(comparison[0], comparison[1])) {
            window.addEventListener('beforeunload', unloadFn);
        }
        // Unmount whenver reloaded to prevent memory leaks
        return () => {
            window.removeEventListener('beforeunload', unloadFn);
        }

    }, [comparison[0], comparison[1]])
}