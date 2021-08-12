import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Board } from "./Board";
import { Tasklist } from "./Tasklist";
import { User } from "./User";

@ObjectType()
@Entity()
export class Task extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field()
    @Column({ default: "Untitled" })
    title: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    description: string;

    @Field({ nullable: true })
    @Column({ type: "timestamp", nullable: true })
    dueAt: Date;

    @Field(() => Date, { nullable: true })
    @Column({ type: "timestamp", nullable: true })
    archivedAt: Date | null;

    @Field()
    @Column({ type: "uuid" })
    tasklistId: string;

    @ManyToOne(() => Tasklist, tasklist => tasklist.tasks, { onDelete: "CASCADE" })
    tasklist: Tasklist;
    
    @Field()
    @Column({ type: "uuid" })
    boardId!: string;

    @ManyToOne(() => Board, board => board.tasks)
    board: Tasklist;

    @Field()
    @Column({ type: "uuid" })
    userId!: string;

    @ManyToOne(() => User, user => user.tasks)
    user!: User;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

}