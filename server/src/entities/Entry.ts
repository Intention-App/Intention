import { Field, ObjectType } from "type-graphql";
import { GraphQLJSON } from 'graphql-type-json';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import User from "./User";
import Folder from "./Folder";

@ObjectType()
@Entity()
export default class Entry extends BaseEntity {

    // Unique ID of the entry
    @Field(() => String)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    // Title of the entry
    @Field()
    @Column({ default: "Untitled" })
    title!: string;

    // Content of the entry stored as an object
    @Field(() => GraphQLJSON)
    @Column({ type: "jsonb", default: [{ type: 'paragraph', children: [{ text: '' }] }] })
    content: {}[];

    // Creating date of the entry
    @Field()
    @CreateDateColumn()
    createdAt!: Date;

    // Modifation date of the entry
    @Field()
    @UpdateDateColumn()
    updatedAt!: Date;

    /*
        Relationships
    */

    @Column({ type: "uuid" })
    userId!: string;

    @ManyToOne(() => User, user => user.entries)
    user: User;

    // Parent folder id
    @Field({ nullable: true })
    @Column({ type: "uuid", nullable: true })
    rootFolderId: string;

    @ManyToOne(() => Folder, folder => folder.entries)
    rootFolder: Folder;

}