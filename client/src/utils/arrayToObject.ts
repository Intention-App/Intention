export const arrayToObject = <T extends Record<string, any>, K extends keyof T>(array: T[], key: K): Record<string, T> => {
    const initialValue = {};
    return array.reduce((obj, item) => {
        return {
            ...obj,
            [item[key]]: item,
        };
    }, initialValue);
}