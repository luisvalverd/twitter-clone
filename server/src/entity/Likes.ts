import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Likes {
  @PrimaryColumn({ unique: true })
  id_like: string;

  @ManyToOne(() => Post, (post) => post.likes_post)
  post: Post;

  @ManyToOne(() => User, (user) => user.likes)
  user_like: User;
}
