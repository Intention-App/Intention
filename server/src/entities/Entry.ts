import { Field, Int, ObjectType } from "type-graphql";
import { GraphQLJSON } from 'graphql-type-json';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Folder } from "./Folder";

@ObjectType()
@Entity()
export class Entry extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({ default: "Untitled" })
    title!: string;

    @Field(() => GraphQLJSON)
    @Column({ type: "jsonb", default: [{ type: 'paragraph', children: [{ text: '' }] }] })
    content: {}[];

    @Field(() => Int)
    @Column()
    userId!: number;

    @ManyToOne(() => User, user => user.entries)
    user: User;

    @Field(() => Int, { nullable: true })
    @Column({ nullable: true })
    rootFolderId: number;

    @ManyToOne(() => Folder, folder => folder.content)
    rootFolder: Folder;

    @Field()
    @CreateDateColumn()
    createdAt!: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt!: Date;
}