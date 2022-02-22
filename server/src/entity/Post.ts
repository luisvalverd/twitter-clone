import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Likes } from "./Likes";
import { User } from "./User";

@Entity()
export class Post {
  @PrimaryColumn({ unique: true })
  id_post: string;

  @Column({ unique: false })
  description: string;

  @Column({ unique: false, nullable: true })
  photo: string;

  @Column({ nullable: false })
  created: string;

  @Column({ unique: false, default: false })
  private: boolean;

  // @Column({select: false})
  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @OneToMany(() => Likes, (likes) => likes.post)
  likes_post: Likes[];
}
