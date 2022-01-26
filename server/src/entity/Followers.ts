import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";

// segidores que tengo y usuarios a que sigo

@Entity()
export class Followers {
  @PrimaryColumn()
  id_follower: string;

  // mi id para referenciarme
  @ManyToOne(() => User, user => user.following, { onDelete: "CASCADE" })
  user: User;

  // usuario a quien yo sigo
  @ManyToOne(() => User, user => user.followers, { onDelete: "CASCADE" })
  followUser: User;
}
