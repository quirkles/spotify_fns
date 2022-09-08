import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Mood } from "./mood";
import { Track } from "./track";
import { Album } from "./album";

@Entity()
export class Artist {
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

  @Column({ length: 100, nullable: true })
  imageUrl?: string;

  @ManyToMany(() => Mood, (mood) => mood.artists)
  moods!: Mood[];

  @ManyToMany(() => Track, (track) => track.artists)
  tracks?: Track[];

  @ManyToMany(() => Album, (album) => album.artists)
  albums?: Album[];
}
