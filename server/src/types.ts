import { Request, Response } from "express";

export type MyContext = {
    req: Request & { session: { [key: string]: any } };
    res: Response;
}