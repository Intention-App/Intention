import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import mikroConfig from "./mikro-orm.config";
import { UserResolver } from "./resolvers/users";
import session from "express-session";
import connectPg from "connect-pg-simple";
import * as dotenv from "dotenv";
import cors from "cors";
import { __prod__ } from "./constants";
import { MyContext } from "./types";

const main = async () => {
    dotenv.config();

    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();

    const app = express();

    const pgSession = connectPg(session)

    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    )

    app.use(
        session({
            name: "qid",
            store: new pgSession({
                conObject: {
                    database: "intention",
                    user: process.env.USER,
                    password: process.env.PASSWORD
                }
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: true,
                secure: __prod__,
                sameSite: "lax"
            },
            saveUninitialized: false,
            secret: process.env.SECRET!,
            resave: false
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver],
            validate: false
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
    });

    apolloServer.applyMiddleware({
        app,
        cors: false
    });

    app.listen(4000, () => {
        console.log("server started on localhost:4000");
    })
}

main().catch(err => {
    console.error(err);
});