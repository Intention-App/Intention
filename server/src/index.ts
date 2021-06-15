import "reflect-metadata"
import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { User } from "./entities/User";
import mikroConfig from "./mikro-orm.config";
import { UserResolver } from "./resolvers/users";

const main = async () => {
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();

    const app = express();
    app.listen(4000, () => {
        console.log("server started on localhost:4000");
    })

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver],
            validate: false
        }),
        context: () => ({ em: orm.em })
    });

    apolloServer.applyMiddleware({ app });

    console.log(await orm.em.find(User, {}));
}

main().catch(err => {
    console.error(err);
});