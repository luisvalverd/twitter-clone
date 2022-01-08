import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import { Post } from "./Post";

@Entity()
export class User {
  @PrimaryColumn({ unique: true })
  id_user: string;

  @Column({ unique: false , default: '../uploads/avatars/default-avatar.jpg'})
  avatar: string;

  @Column({ unique: true})
  nickname: string;

  @Column({ unique: false, nullable: false })
  password: string;  

  @Column({ unique: false, type: "text", default: ''})
  description: string;

  @Column({ unique: false, default: ''})
  location: string;  

  @Column('timestamp with time zone', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })  
  created: Date;

  @OneToMany(() => Post, post => post.user)
  posts: Post[];
}
