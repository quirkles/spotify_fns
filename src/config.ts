interface Config {
  environment: string;
  postgresHost: string;
  postgresPort: string;
}

export const CONFIG: Config = {
  environment: process.env.environment || "development",
  postgresHost: process.env.PG_HOST || "localhost",
  postgresPort: process.env.PG_PORT || "5432",
};
