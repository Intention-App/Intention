import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Entry } from "./Entry";
import { User } from "./User";

@ObjectType()
@Entity()
export class Folder extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({default: "Untitled"})
    title: string;

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

    @OneToMany(() => Entry, entry => entry.rootFolder)
    content: Entry[];
    
    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}