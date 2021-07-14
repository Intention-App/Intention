import { Field, ObjectType } from "type-graphql";
import { GraphQLJSON } from 'graphql-type-json';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Folder } from "./Folder";

@ObjectType()
@Entity()
export class Entry extends BaseEntity {
    @Field(() => String)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field()
    @Column({ default: "Untitled" })
    title!: string;

    @Field(() => GraphQLJSON)
    @Column({ type: "jsonb", default: [{ type: 'paragraph', children: [{ text: '' }] }] })
    content: {}[];

    @Field()
    @Column({ type: "uuid" })
    userId!: string;

    @ManyToOne(() => User, user => user.entries)
    user: User;

    @Field({ nullable: true })
    @Column({ type: "uuid", nullable: true })
    rootFolderId: string;

    @ManyToOne(() => Folder, folder => folder.content)
    rootFolder: Folder;

    @Field()
    @CreateDateColumn()
    createdAt!: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt!: Date;
}