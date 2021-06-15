import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { __prod__ } from "./constants";
import { User } from "./entities/User";
import * as dotenv from "dotenv";

dotenv.config();

export default {
    migrations: {
        path: path.join(__dirname + "/migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [User],
    dbName: "intention",
    type: "postgresql",
    debug: !__prod__,
    user: process.env.USER,
    password: process.env.PASSWORD

} as Parameters<typeof MikroORM.init>[0];