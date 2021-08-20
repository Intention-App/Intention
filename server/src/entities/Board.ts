import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Task } from "./Task";
import { Tasklist } from "./Tasklist";
import { User } from "./User";

@ObjectType()
@Entity()
export class Board extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field()
    @Column({ default: "Untitled" })
    title!: string;

    @Field(() => [Tasklist], {nullable: true})
    @OneToMany(() => Tasklist, tasklist => tasklist.board, {onDelete: "CASCADE"})
    tasklists: Tasklist[];

    @Field(() => [Task], {nullable: true})
    @OneToMany(() => Task, task => task.board, {onDelete: "CASCADE"})
    tasks: Task[];

    @Field(() => [String], { nullable: true })
    @Column({ type: "jsonb", nullable: true })
    tasklistOrder: string[];

    @Field()
    @Column({ type: "uuid" })
    userId!: string;

    @ManyToOne(() => User, user => user.boards)
    user!: User;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}