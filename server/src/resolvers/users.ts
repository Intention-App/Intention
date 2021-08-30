import User from "../entities/User";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { ExpressContext } from "../types";
import argon2 from "argon2";
import crypto from "crypto";
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
class RegisterInput {
    @Field()
    firstName: string;
    @Field()
    lastName: string;
    @Field()
    email: string;
    @Field()
    password: string;
}

@InputType()
class LoginInput {
    @Field()
    email: string;
    @Field()
    password: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true, defaultValue: [] })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

/*
    Resolver
*/

const relations: string[] = [/*"tasklists", "tasklists.tasks", "tasks", "boards", "boards.tasklists", "boards.tasklists.tasks", "folders", "folders.entries", "entries"*/];

@Resolver()
export default class UserResolver {

    // Get all users
    @Query(() => [User], {description: "DEV TOOL | Get all users"})
    users(): Promise<User[]> {
        return User.find({ where: {}, relations });
    }

    // Get specific user by ID
    @Query(() => User, { nullable: true, description: "DEV TOOL | Get user by id" })
    async user(
        @Arg("id") id: string
    ): Promise<User | undefined> {
        const user = await User.findOne({ where: { id }, relations });
        return user;
    }

    // Get self user
    @Query(() => User, { nullable: true, description: "Get self authenticated user" })
    @UseMiddleware(isAuth)
    async me(
        @Ctx() { req }: ExpressContext
    ): Promise<User | undefined> {
        const user = await User.findOne({ where: { id: req.session.userId } })
        return user;
    }

    // Register new user
    @Mutation(() => UserResponse, { description: "Register a new user" })
    async register(
        @Ctx() { req }: ExpressContext,
        @Arg("options") options: RegisterInput, // { first name, last name, password, email }
    ): Promise<UserResponse> {

        // Verify first name
        if (!options.firstName) {
            return {
                errors: [{
                    field: "firstName",
                    message: "First name has to be 1 or more character"
                }]
            };
        };
        
        // Verify last name
        if (!options.lastName) {
            return {
                errors: [{
                    field: "lastName",
                    message: "Last name has to be 1 or more character"
                }]
            };
        };

        // Verify the min & max password size
        if (options.password.length <= 6 && options.password.length <= 50) {
            return {
                errors: [{
                    field: "password",
                    message: "Password has to be between 6 to 50 characters"
                }]
            };
        }
        
        // Hash password
        const salt = await crypto.randomBytes(32);
        const hashedPassword = await argon2.hash(options.password, {salt});


        // Create new user
        const user = await User.create( {
            firstName: options.firstName,
            lastName: options.lastName,
            email: options.email,
            password: hashedPassword
        });

        // Attempt to save created user
        try {
            await user.save()
        }
        catch (err) {
            
            // Error for email that already exists
            if (err.code === "23505") {
                return {
                    errors: [{
                        field: "email",
                        message: "Email already exists"
                    }]
                };
            };

        }

        
        req.session!.userId = user.id;
        
        return { errors: [], user };
    }

    // User Login
    @Mutation(() => UserResponse, { description: "Authenticate a user" }) 
    async login(
        @Ctx() { req }: ExpressContext,
        @Arg("options") options: LoginInput,
    ): Promise<UserResponse> {

        // Find user in database by email
        const user = await User.findOne({ where: { email: options.email } });

        // If not email is found, return error
        if (!user) {
            return {
                errors: [{
                    field: "email",
                    message: "Incorrect email or password"
                },{
                    field: "password",
                    message: "Incorrect email or password"
                }]
            };
        };

        // Verify password
        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [{
                    field: "email",
                    message: "Incorrect email or password"
                },{
                    field: "password",
                    message: "Incorrect email or password"
                }]
            };
        };

        req.session!.userId = user.id;

        return { errors: [], user };
    }

    // Logout user
    @Mutation(() => Boolean, { description: "Disconnect user" })
    logout(
        @Ctx() { req, res }: ExpressContext,
    ): Promise<Boolean> {

        return new Promise(resolve => req.session.destroy(err => {

            res.clearCookie(COOKIE_NAME); // Clear cookie

            // Handle error
            if (err) {
                resolve(false);
            } else {
                resolve(true); 
            }
            
        })) 

    }
}