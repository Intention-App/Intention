import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Board from "./Board";
import Task from "./Task";
import User from "./User";

@ObjectType()
@Entity()
export default class Tasklist extends BaseEntity {

    // Unique ID of the tasklist
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    // Title of the tasklist
    @Field()
    @Column({ default: "Untitled" })
    title!: string;

    // Color property of the tasklist
    @Field({ nullable: true })
    @Column({ nullable: true })
    color: string;

    // List of task IDs to maintain order/arrangement
    @Field(() => [String], { nullable: true })
    @Column({ type: "jsonb", nullable: true })
    taskOrder: string[];

    // Creating date of the tasklist
    @Field()
    @CreateDateColumn()
    createdAt: Date;

    // Mofication date of the tasklist
    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    /*
        Relationships
    */

    // Once the tasklist is destroyed, it also destroy the tasks it contains
    @Field(() => [Task], { nullable: true })
    @OneToMany(() => Task, task => task.tasklist, {onDelete: "CASCADE"})
    tasks: Task;

    @Field()
    @Column({ type: "uuid" })
    boardId: string;

    @ManyToOne(() => Board, board => board.tasklists, {onDelete: "CASCADE"})
    board: Board;

    @Column({ type: "uuid" })
    userId!: string;

    @ManyToOne(() => User, user => user.tasklists)
    user!: User;

}