import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Mood } from "./mood";
import { Artist } from "./artist";
import { Track } from "./track";

@Entity()
export class Album {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 20 })
  releaseDate!: string;

  @Column({ length: 100, unique: true })
  externalSpotifyUrl!: string;

  @Column({ length: 100, unique: true })
  spotifyUri!: string;

  @Column({ length: 100, unique: true })
  spotifyId!: string;

  @Column({ length: 100 })
  imageUrl!: string;

  @ManyToMany(() => Mood, (mood) => mood.artists)
  moods!: Mood[];

  @ManyToMany(() => Artist, (artist: Artist) => artist.tracks)
  artists!: Artist[];

  @OneToMany(() => Track, (track: Track) => track.album)
  tracks!: Track[];
}
