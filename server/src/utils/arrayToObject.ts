// Takes an array of objects and turns it into a record based on the object's properties
// Provides indexing via ids

export const arrayToObject = <
    T extends Record<string, any>,
    K extends keyof T
>(array: T[], key: K): Record<string, T> => {
    const initialValue = {};
    return array.reduce((obj, item) => {
        return {
            ...obj,
            [item[key]]: item,
        };
    }, initialValue);
}