import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Board } from "./Board";
import { Entry } from "./Entry";
import { Folder } from "./Folder";
import { Task } from "./Task";
import { Tasklist } from "./Tasklist";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field()
    @Column({ unique: true })
    username!: string;

    @Field()
    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @OneToMany(() => Entry, entry => entry.user)
    entries: Entry[];

    @OneToMany(() => Folder, folder => folder.user)
    folders: Folder[];

    @OneToMany(() => Board, board => board.user)
    boards: Board[];

    @OneToMany(() => Board, tasklist => tasklist.user)
    tasklists: Tasklist[];

    @OneToMany(() => Board, task => task.user)
    tasks: Task[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
