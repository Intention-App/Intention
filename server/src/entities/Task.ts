import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Tasklist from "./Tasklist";
import User from "./User";
import Board from "./Board";

@ObjectType()
@Entity()
export default class Task extends BaseEntity {

    // Unique ID for the task
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    // Title of the task
    @Field()
    @Column({ default: "Untitled" })
    title: string;

    // Description of the task
    @Field({ nullable: true })
    @Column({ nullable: true })
    description: string;

    // Due date of the task
    @Field({ nullable: true })
    @Column({ type: "timestamp", nullable: true })
    dueAt: Date;

    // Archived date of the task
    @Field(() => Date, { nullable: true })
    @Column({ type: "timestamp", nullable: true })
    archivedAt: Date | null;

    // Created date of the task
    @Field()
    @CreateDateColumn()
    createdAt: Date;

    // Updated date of the task
    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    /*
        Relationships
    */

    @Field()
    @Column({ type: "uuid" })
    tasklistId!: string;

    @ManyToOne(() => Tasklist, tasklist => tasklist.tasks)
    tasklist: Tasklist;

    @Field()
    @Column({ type: "uuid" })
    boardId!: string;

    @ManyToOne(() => Board, board => board.tasks)
    board: Board;

    @Field()
    @Column({ type: "uuid" })
    userId!: string;

    @ManyToOne(() => User, user => user.tasks)
    user!: User;

}