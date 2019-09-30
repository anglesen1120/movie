import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Movie } from "./Movie";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  content: string;

  @ManyToOne(type => Movie, movie => movie.id)
  movie: Movie;
}
