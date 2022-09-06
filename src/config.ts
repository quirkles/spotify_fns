interface Config {
  environment: string;
}

export const CONFIG: Config = {
  environment: process.env.environment || "development",
};
