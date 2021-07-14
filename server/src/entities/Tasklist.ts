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

    @Field({nullable: true})
    @Column({ nullable: true })
    color: string;

    @Field(()=>[Task])
    @OneToMany(() => Task, task => task.tasklist)
    tasks: Task;

    @Field(() => [String])
    @Column({ type: "jsonb", nullable: true })
    taskOrder: string[];

    @Field()
    @Column({ type: "uuid" })
    boardId: string;

    @ManyToOne(() => Board, board => board.tasklists)
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