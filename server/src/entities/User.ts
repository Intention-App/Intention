import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from "typeorm";
import Board from "./Board";
import Tasklist from "./Tasklist";
import Task from "./Task";
import Entry from "./Entry";
import Folder from "./Folder";

@ObjectType()
@Entity()
export default class User extends BaseEntity {

    // Unique ID of the user
    // **IMPORTANT**
    // This value should remain private in production
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    // First name of the user
    @Field()
    @Column()
    firstName!: string;

    // Last name of the user
    @Field()
    @Column()
    lastName!: string;

    // Registered email of ther user
    @Field()
    @Column({ unique: true })
    email!: string;

    // Hashed password of the user
    // No @Field to avoid anyone fetching the password
    @Column()
    password!: string;

    // Account creating date
    @Field()
    @CreateDateColumn()
    createdAt: Date;

    // Account updated date
    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    /*
        Relationships
    */

    // When the user is destroyed, also delete any associated info
    @Field(() => [Board], { nullable: true })
    @OneToMany(() => Board, board => board.user, {onDelete: "CASCADE"})
    boards: Board[];

    @Field(() => [Tasklist], { nullable: true })
    @OneToMany(() => Tasklist, tasklist => tasklist.user)
    tasklists: Tasklist[];

    @Field(() => [Task], { nullable: true })
    @OneToMany(() => Task, task => task.user)
    tasks: Task[];

    @Field(() => [Entry], { nullable: true })
    @OneToMany(() => Entry, entry => entry.user)
    entries: Entry[];

    @Field(() => [Folder], { nullable: true })
    @OneToMany(() => Folder, folder => folder.user, {onDelete: "CASCADE"})
    folders: Folder[];
}