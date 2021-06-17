import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class UserResolver {
    @Query(() => [User])
    users(@Ctx() { em }: MyContext): Promise<User[]> {
        return em.find(User, {});
    }

    @Query(() => User, { nullable: true })
    user(
        @Ctx() { em }: MyContext,
        @Arg("id", () => Int) id: number
    ): Promise<User | null> {
        return em.findOne(User, { id });
    }

    @Query(() => UserResponse, { nullable: true })
    async me(
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse | null> {
        if (!req.session.userId) {
            return null;
        }

        const user = await em.findOne(User, { id: req.session.userId })
        if (!user) {
            return {
                errors: [{
                    field: "id",
                    message: "user id does not exist"
                }]
            };
        };

        return { user };
    }

    @Mutation(() => UserResponse)
    async register(
        @Ctx() { em, req }: MyContext,
        @Arg("options") options: UsernamePasswordInput,
    ): Promise<UserResponse> {
        if (options.username.length <= 3) {
            return {
                errors: [{
                    field: "username",
                    message: "username has to be longer than 3 characters"
                }]
            };
        };


        if (options.password.length <= 6) {
            return {
                errors: [{
                    field: "username",
                    message: "password has to be longer than 6 characters"
                }]
            };
        }

        const hashedPassword = await argon2.hash(options.password)
        const user = em.create(User, {
            username: options.username,
            password: hashedPassword
        });
        try {
            await em.persistAndFlush(user);
        }
        catch (err) {
            if (err.code === "23505") {
                return {
                    errors: [{
                        field: "username",
                        message: "username already exists"
                    }]
                };
            };
        }

        req.session!.userId = user.id;
        
        return { user };
    }

    @Mutation(() => UserResponse)
    async login(
        @Ctx() { em, req }: MyContext,
        @Arg("options") options: UsernamePasswordInput,
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { username: options.username });
        if (!user) {
            return {
                errors: [{
                    field: "username",
                    message: "username cannot be found"
                }]
            };
        };

        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [{
                    field: "password",
                    message: "incorrect password"
                }]
            };
        };

        req.session!.userId = user.id;

        return { user };
    }
}