import { Request, Response } from "express";


// Type for express req with session info
export type ExpressContext = {
    req: Request & { session: { [key: string]: any } };
    res: Response;
}

export type PendingCache = {
    id: string,
    value: any,
}