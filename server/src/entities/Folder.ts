import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent, UpdateDateColumn } from "typeorm";
import Entry from "./Entry";
import User from "./User";

@ObjectType()
@Entity()
@Tree("closure-table")
export default class Folder extends BaseEntity {

    // Primary unique ID of the folder
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    // Title of the folder
    @Field()
    @Column({ default: "Untitled" })
    title: string;

    // Creation date of the folder
    @Field()
    @CreateDateColumn()
    createdAt: Date;

    // Modifiation date of the folder
    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    /*
        Relationships
    */

    @Column({ type: "uuid" })
    userId!: string;

    @ManyToOne(() => User, user => user.folders)
    user: User;

    // Parent folder unique ID
    @Field({ nullable: true })
    @Column({type: "uuid", nullable: true })
    rootFolderId: string;

    @TreeParent()
    rootFolder: Folder | undefined;

    // Entries in the folder
    // Once the folder is destroyed, it also destroys entries it contains
    @Field(() => [Entry], { nullable: true })
    @OneToMany(() => Entry, entry => entry.rootFolder, { onDelete: "CASCADE" })
    entries: Entry[];
    
    // Other subdirectories inside the folder
    // Once the folder is destroyed, it also destroys its inner folders
    @Field(() => [Folder], { nullable: true })
    @TreeChildren({ cascade: true })
    folders: Folder[];

}