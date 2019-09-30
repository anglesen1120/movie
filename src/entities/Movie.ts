import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Movie {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  year: string;

  @Column({ nullable: true })
  rated: string;

  @Column("datetime", { nullable: true })
  released: Date;

  @Column({ nullable: true })
  runtime: string;

  @Column({ nullable: true })
  genre: string;

  @Column({ nullable: true })
  director: string;

  @Column({ nullable: true })
  writer: string;

  @Column({ nullable: true })
  actors: string;

  @Column({ nullable: true })
  plot: string;

  @Column({ nullable: true })
  language: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  awards: string;

  @Column({ nullable: true })
  poster: string;

  @Column("json", { nullable: true })
  ratings: string;

  @Column("integer", { nullable: true })
  metascore: number;

  @Column("float", { nullable: true })
  imdbRating: number;

  @Column({ nullable: true })
  imdbVotes: string;

  @Column({ nullable: true })
  imdbID: string;

  @Column({ nullable: true })
  type: string;

  @Column("datetime", { nullable: true })
  dvd: Date;

  @Column({ nullable: true })
  boxOffice: string;

  @Column({ nullable: true })
  production: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  response: boolean;
}
