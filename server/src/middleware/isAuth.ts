import { MiddlewareFn } from "type-graphql";
import { ExpressContext } from "../types";

export const isAuth: MiddlewareFn<ExpressContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("Error: Not authenticated");
  }

  return next();
};