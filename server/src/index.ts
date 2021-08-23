import * as dotenv from "dotenv";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
import express from "express";
import cors from "cors";
import express_session from "express-session";
import { ApolloServer } from "apollo-server-express";
import { COOKIE_NAME, __prod__ } from "./constants";
import { ExpressContext } from "./types";
import getResolvers from "./resolvers";
import getEntities from "./entities";

const main = async () => {

    dotenv.config();

    // Initialize Postgres database
    const entities = await getEntities();
    await createConnection({
        type: "postgres",
        database: "intention",
        username: process.env.USER,
        password: process.env.PASSWORD,
        logging: true,
        synchronize: true,
        entities: entities
    });

    const app = express();

    app.use(
        cors({
            // origin: "https://localhost:3000", // Will be renable for production
            credentials: true
        })
    );

    // Init express-session middleware
    // TODO: Replace express-session with custom authentication
    app.use(
        express_session({
            name: COOKIE_NAME,
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
    );

    // Init apollo server
    const resolvers = await getResolvers();
    const apolloServer = new ApolloServer({
        schema: await buildSchema({ resolvers: resolvers, validate: false }),
        context: ({ req, res }): ExpressContext => ({ req, res }),
    });

    // Integrate apollo server to express
    apolloServer.applyMiddleware({ app, cors: false });

    // Start express server on default port 4000
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server is up and running on localhost:${PORT}`));

}

// Print out any initial errors
main().catch(err => console.log(err));