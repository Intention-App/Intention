import User from "../entities/User";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { ExpressContext } from "../types";
import argon2 from "argon2";
import crypto from "crypto";
import { VERIFY_EMAIL_PREFIX, COOKIE_NAME } from "../constants";
import { isAuth } from "../middleware/isAuth";
import { v4 } from "uuid";
import sgMail from "@sendgrid/mail";

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
    password: string;
    @Field()
    token: string;
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

@ObjectType()
class EmailResponse {
    @Field(() => [FieldError], { nullable: true, defaultValue: [] })
    errors?: FieldError[];

    @Field({ nullable: true })
    success: boolean;
}

/*
    Resolver
*/

const relations: string[] = [/*"tasklists", "tasklists.tasks", "tasks", "boards", "boards.tasklists", "boards.tasklists.tasks", "folders", "folders.entries", "entries"*/];

@Resolver()
export default class UserResolver {

    // Get all users
    @Query(() => [User], { description: "DEV TOOL | Get all users" })
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

    // Verify email of new user
    @Mutation(() => EmailResponse, { description: "Verify email of new user" })
    async verifyEmail(
        @Ctx() { redis }: ExpressContext,
        @Arg("options") options: LoginInput // { email, password }
    ): Promise<EmailResponse> {

        // Checks to see whether email is valid
        if (!/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(options.email)) {
            return {
                success: false,
                errors: [{
                    field: "email",
                    message: "Email address is not valid"
                }]
            }
        }

        // Verify the min & max password size
        if (options.password.length <= 6 && options.password.length <= 50) {
            return {
                success: false,
                errors: [{
                    field: "password",
                    message: "Password has to be between 6 to 50 characters"
                }]
            };
        }

        // Checks to see whether email already exists in application
        const emailExists = await User.findOne({ where: { email: options.email } });

        if (emailExists) {
            return {
                success: false,
                errors: [{
                    field: "email",
                    message: "Email is already associated with an account"
                }]
            }
        }

        // Set token in redis to be sent to email for confirmation
        const token = v4();


        // Hash password
        const salt = await crypto.randomBytes(32);
        const hashedPassword = await argon2.hash(options.password, { salt });

        // Store email and hashed password in redis when token is verified
        const information = JSON.stringify({
            email: options.email,
            password: hashedPassword
        })

        redis.set(
            VERIFY_EMAIL_PREFIX + token,
            information,
            "ex",
            1000 * 60 * 60 * 24 // 24 hours to confirm email
        );



        try {

            // Set API key for sendgrid
            sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

            // Create email to send to registrant
            const msg = {
                to: options.email, // Recipient
                from: 'intention.app.dev@gmail.com', // Verified sender
                subject: 'Intention Email Verification',
                // Html with temporary link and image
                // #WIP
                html: `
                <div style="background-color: #130f26; padding: 4rem; display: flex; align-items: center;">
                    <img src="https://media.discordapp.net/attachments/871463246635343942/884129513506766848/IntentionLogo.png"
                        alt="Intention Logo" style="max-width: 200px;" />
                    <div style="margin-left: 4rem;">
                        <h1 style="font-size: 4em; color: #ffffff; font-family: Roboto, sans-serif; margin-top: 0px;">Intention</h1>
                        <a href="http://localhost:3000/register/create-account/${token}"
                            style="padding: 1rem 3rem; background-color: #6e61f9; color: #ffffff; border-radius: 64px; text-decoration: none; font-family: Roboto, sans-serif; font-size: 1.25em;">Verify
                            Email</a>
                    </div>
                </div>
                `,
            }

            // Send email to registrant
            sgMail.send(msg)

        }
        catch (error) {
            // Return error if there is a problem
            return {
                success: false,
                errors: [{
                    field: "email",
                    message: error
                }]
            }
        }

        // Else, return task is succuessful
        return { success: true };

    }

    // Verify token of email of new user
    @Query(() => String, { nullable: true, description: "Verify token of email verification process" })
    async verifyEmailToken(
        @Ctx() { redis }: ExpressContext,
        @Arg("token") token: string
    ): Promise<string | null> {
        // Fetch email and password information from redis as a JSON string
        const information = await redis.get(VERIFY_EMAIL_PREFIX + token);

        // If information does not exist, return null
        if (!information) return null;

        else {
            try {
                // Parse JSON to return whether email exists or not
                const { email } = JSON.parse(information) as { email: string, password: string };
                return email;
            }
            catch {
                // Return null if JSON is invalid
                return null;
            }
        }
    }

    // Register new user
    @Mutation(() => UserResponse, { description: "Register a new user" })
    async register(
        @Ctx() { req, redis }: ExpressContext,
        @Arg("options") options: RegisterInput, // { first name, last name, password, token }
    ): Promise<UserResponse> {

        // Fetch email and password information from redis as a JSON string
        const information = await redis.get(VERIFY_EMAIL_PREFIX + options.token);

        // If information does not exist, return null
        if (!information) return {
            errors: [{
                field: "firstName",
                message: "The link you are verifying is invalid or expired"
            }]
        };

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

        // Parse email and password from information JSON
        const { email, password } = JSON.parse(information) as { email: string, password: string };

        // Verify if password is the same as stored
        const valid = await argon2.verify(password, options.password);

        // If password typed is invalid, return error
        if (!valid) {
            return {
                errors: [{
                    field: "password",
                    message: "Password is incorrect"
                }]
            };
        }

        // Hash password
        const salt = await crypto.randomBytes(32);
        const hashedPassword = await argon2.hash(options.password, { salt });


        // Create new user
        const user = await User.create({
            firstName: options.firstName,
            lastName: options.lastName,
            email: email,
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
                        field: "firstName",
                        message: "Account with same email already exists"
                    }]
                };
            };

        }

        // Clear token from redis
        redis.del(VERIFY_EMAIL_PREFIX + options.token);

        // Log user in
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
                }, {
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
                }, {
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