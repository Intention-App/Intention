import { Request, Response } from "express";
import { Redis } from "ioredis";


// Type for express req with session info
export type ExpressContext = {
    req: Request & { session: { [key: string]: any } };
    res: Response;
    redis: Redis;
}

export type PendingCache = {
    id: string,
    value: any,
}