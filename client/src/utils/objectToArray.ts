// Takes an object and turns it into an array of values

export const objectToArray = <T>(object: Record<string, T>): T[] => {
    const keys = Object.keys(object);
    const array = [];
    for (let i = 0; i < keys.length; i++) {
        array.push(object[keys[i]])
    }
    return array;
}