import { Cache, DataFields, QueryInput, ResolveInfo, Variables } from "@urql/exchange-graphcache";

// Update query with types
export const betterUpdateQuery = <Result, Query>(
    cache: Cache,
    qi: QueryInput,
    result: any,
    fn: (r: Result, q: Query) => Query
) => {
    return cache.updateQuery(qi, data => fn(result, data as any) as any)
}

// Invalidate all caches of a certain type
export const invalidateAll = (cache: Cache, fieldName: string) => {
    const allFields = cache.inspectFields("Query");
    console.log(allFields)
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    console.log(fieldInfos)
    fieldInfos.forEach((fi) => {
        cache.invalidate("Query", fieldName, fi.arguments);
    });
}

// Type for exchange objects
type ExchangeFn = (result: DataFields, args: Variables, cache: Cache, info: ResolveInfo) => void;
export type CacheExchange = Record<string, ExchangeFn>; 