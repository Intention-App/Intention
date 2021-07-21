import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Board } from "./Board";
import { Task } from "./Task";
import { User } from "./User";

@ObjectType()
@Entity()
export class Tasklist extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field()
    @Column({ default: "Untitled" })
    title!: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    color: string;

    @Field(() => [Task], { nullable: true })
    @OneToMany(() => Task, task => task.tasklist, {onDelete: "CASCADE"})
    tasks: Task;

    @Field(() => [String], { nullable: true })
    @Column({ type: "jsonb", nullable: true })
    taskOrder: string[];

    @Field()
    @Column({ type: "uuid" })
    boardId: string;

    @ManyToOne(() => Board, board => board.tasklists, {onDelete: "CASCADE"})
    board: Board;

    @Field()
    @Column({ type: "uuid" })
    userId!: string;

    @ManyToOne(() => User, user => user.tasklists)
    user!: User;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

}