import { Logger } from "winston";
import { Response } from "express";
import { DataStoreService } from "../shared/services/datastore";
import { SqlService } from "../shared/services/sql";
import { SpotifyService } from "../shared/services/spotify";

export interface GenericHandlerParams {
  triggerEvent: {
    data: Record<string, unknown>;
    attributes: Record<string, unknown>;
  };
  logger: Logger;
  accessToken?: string | null;
  services: {
    datastoreService?: DataStoreService;
    sqlService?: SqlService;
    spotifyService?: SpotifyService;
  };
}
export interface HandlerConfig {
  withDatastoreService?: boolean;
  withSqlService?: boolean;
  withSpotifyService?: boolean;
}

export type GenericHandler = (params: GenericHandlerParams) => Promise<unknown>;

export type PushSubscriptionHandler = (
  incomingMessage: {
    body: {
      message: {
        data: string;
        attributes: Record<string, unknown>;
      };
    };
  },
  res: Response
) => Promise<unknown>;

export type PushSubscriptionHandlerWrapper = (
  handler: GenericHandler
) => PushSubscriptionHandler;
