import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/users";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import * as dotenv from "dotenv";
import cors from "cors";
import { COOKIE_NAME, __prod__ } from "./constants";
import { MyContext } from "./types";
import { EntryResolver } from "./resolvers/entries";
import { FolderResolver } from "./resolvers/folders";
import { createConnection } from "typeorm";
import { Entry } from "./entities/Entry";
import { Folder } from "./entities/Folder";
import { User } from "./entities/User";

const main = async () => {
    dotenv.config();

    const conn = await createConnection({
        type: "postgres",
        database: "intention",
        username: process.env.USER,
        password: process.env.PASSWORD,
        logging: true,
        synchronize: true,
        entities: [User, Entry, Folder]
    });

    const app = express();

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    )

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redisClient,
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
            resolvers: [UserResolver, EntryResolver, FolderResolver],
            validate: false
        }),
        context: ({ req, res }): MyContext => ({ req, res })
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