import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Tasklist from "./Tasklist";
import Task from "./Task";
import User from "./User";

@ObjectType()
@Entity()
export default class Board extends BaseEntity {

    // Unique ID of the board
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    // Title of the board with default name of "Untitled"
    @Field()
    @Column({ default: "Untitled" })
    title!: string;

    // List of tasklist IDs to maintain order/arrangement
    @Field(() => [String], { nullable: true })
    @Column({ type: "jsonb", nullable: true })
    tasklistOrder: string[];

    // Creation date of the board
    @Field()
    @CreateDateColumn()
    createdAt: Date;

    // Modified date of the board
    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    /*
        Relationships
    */

    @Column({ type: "uuid" })
    userId!: string;

    @ManyToOne(() => User, user => user.boards)
    user!: User;

    // Once the board is destroyed, also destroy the tasklists
    @Field(() => [Tasklist], {nullable: true})
    @OneToMany(() => Tasklist, tasklist => tasklist.board, {onDelete: "CASCADE"})
    tasklists: Tasklist[];

    @Field(() => [Task], {nullable: true})
    @OneToMany(() => Task, task => task.board, {onDelete: "CASCADE"})
    tasks: Task[];
}