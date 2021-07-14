import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import argon2 from "argon2";
import { COOKIE_NAME } from "../constants";
import { isAuth } from "../middleware/isAuth";

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    email: string;
    @Field()
    password: string;
}

@InputType()
class UsernameOrEmailInput {
    @Field()
    username: string;
    @Field()
    password: string;
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
    users(): Promise<User[]> {
        return User.find({});
    }

    @Query(() => User, { nullable: true })
    user(
        @Arg("id") id: string
    ): Promise<User | undefined> {
        return User.findOne({ id });
    }

    @Query(() => User, { nullable: true })
    @UseMiddleware(isAuth)
    async me(
        @Ctx() { req }: MyContext
    ): Promise<User | undefined> {

        const user = await User.findOne({ id: req.session.userId })

        return user;
    }

    @Mutation(() => UserResponse)
    async register(
        @Ctx() { req }: MyContext,
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
        const user = await User.create( {
            username: options.username,
            email: options.email,
            password: hashedPassword
        });
        try {
            await user.save()
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
        @Ctx() { req }: MyContext,
        @Arg("options") options: UsernameOrEmailInput,
    ): Promise<UserResponse> {
        const user = await User.findOne({ username: options.username });
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

    @Mutation(() => Boolean)
    logout(
        @Ctx() { req, res }: MyContext,
    ): Promise<Boolean> {
        return new Promise(resolve => req.session.destroy(err => {
            res.clearCookie(COOKIE_NAME);
            if (err) {
                resolve(false);
                return;
            }
            resolve(true);
        })) 
    }
}