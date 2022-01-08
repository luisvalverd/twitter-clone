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

  @Column('timestamp with time zone', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })  
  created: Date;

  @ManyToOne(() => User, user => user.posts)
  user: User;
}

