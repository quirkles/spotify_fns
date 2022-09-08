import { DataSource, DataSourceOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

import { CONFIG } from "../../../config";
import { SECRETS } from "../../../secrets";
import { Artist, Mood, Album, Track } from "./entities";

const typeOrmConfig: DataSourceOptions = {
  type: "postgres",
  host: CONFIG.postgresHost,
  port: parseInt(CONFIG.postgresPort, 10),
  username: SECRETS.pgUser,
  password: SECRETS.pgPwd,
  database: "spotify",
  entities: [Mood, Artist, Album, Track],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
};

console.log("typeorm config", typeOrmConfig) //eslint-disable-line

export const dataSource = new DataSource(typeOrmConfig);
