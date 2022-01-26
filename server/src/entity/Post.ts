import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";


@Entity()
export class Post {
  @PrimaryColumn({ unique: true })
  id_post: string;

  @Column({unique: false})
  description: string;

  @Column({ unique: false, nullable: true })
  photo: string;

  @Column({ nullable: false })  
  created: string;

  @Column({ unique: false, default: false })
  private: boolean;

  @ManyToOne(() => User, user => user.posts)
  user: User;
}

