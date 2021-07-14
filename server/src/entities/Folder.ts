import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Entry } from "./Entry";
import { User } from "./User";

@ObjectType()
@Entity()
export class Folder extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field()
    @Column({ default: "Untitled" })
    title: string;

    @Field({ nullable: true })
    @Column({type: "uuid", nullable: true })
    rootFolderId: string;

    @ManyToOne(() => Folder, folder => folder.content)
    rootFolder: Folder;

    @Field(() => [Entry], { nullable: true })
    @OneToMany(() => Entry, entry => entry.rootFolder)
    content: Entry[];
    
    @Field(() => [Folder], { nullable: true })
    @OneToMany(() => Folder, folder => folder.rootFolder)
    children: Folder[];

    @Field()
    @Column({ type: "uuid" })
    userId!: string;

    @ManyToOne(() => User, user => user.folders)
    user: User;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}