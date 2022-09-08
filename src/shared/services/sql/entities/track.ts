import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Mood } from "./mood";
import { Artist } from "./artist";
import { Album } from "./album";

@Entity()
export class Track {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 100, unique: true })
  externalSpotifyUrl!: string;

  @Column({ length: 100, unique: true })
  spotifyUri!: string;

  @Column({ length: 100, unique: true })
  spotifyId!: string;

  @Column({ length: 100 })
  imageUrl!: string;

  @ManyToOne(() => Album, (album: Album) => album.tracks)
  album!: Album;

  @ManyToMany(() => Mood, (mood) => mood.artists)
  moods!: Mood[];

  @ManyToMany(() => Artist, (artist) => artist.tracks)
  artists!: Artist[];
}
