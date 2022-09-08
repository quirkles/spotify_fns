import { Response } from "express";
import { v4 } from "uuid";
import { logger } from "../logger";
import {
  GenericHandler,
  GenericHandlerParams,
  HandlerConfig,
  PushSubscriptionHandler,
} from "../../fns/types";
import { DataStoreService } from "../services/datastore";
import { Datastore } from "@google-cloud/datastore";
import { fetchSpotifyAccessToken } from "../session";
import { dataSource, SqlService } from "../services/sql";
import { Logger } from "winston";
import { SpotifyService } from "../services/spotify";

async function initializeSqlService(logger: Logger): Promise<SqlService> {
  if (dataSource.isInitialized) {
    logger.info("Datasource is already initialized");
  } else {
    await dataSource
      .initialize()
      .then(() => {
        logger.info("Initialized data source");
      })
      .catch((error) => logger.error("Failed to initialize datasource", error));
  }

  return new SqlService(logger.child({ service: "sqlService" }), dataSource);
}

function getDataAndAttributesFromIncomingMessage(
  incomingMessage: {
    body: {
      message: {
        data: string;
        attributes: Record<string, unknown>;
      };
    };
  },
  logger: Logger
): {
  data: Record<string, unknown>;
  attributes: Record<string, unknown>;
} {
  let data;
  let attributes;
  try {
    data = JSON.parse(
      Buffer.from(incomingMessage.body.message.data, "base64").toString()
    );
    attributes = incomingMessage.body.message.attributes;
    logger.info(`Parsed incoming message into data and attributes`, {
      data,
      attributes,
    });
  } catch (error) {
    logger.error(`Failed to parse incoming message into data and attributes`, {
      incomingMessage_body_message: incomingMessage.body.message,
    });
    throw error;
  }
  return { attributes, data };
}

export function pushSubscriptionHandlerWrapper(
  handler: GenericHandler,
  handlerConfig: HandlerConfig
): PushSubscriptionHandler {
  const wrapperLogger = logger.child({
    service: "wrapper",
    correlationId: v4(),
  });
  const functionLogger = logger.child({ service: "function" });
  let { withDatastoreService = false } = handlerConfig;
  const { withSpotifyService = false, withSqlService = false } = handlerConfig;

  if (withSpotifyService) {
    // spotify service needs an access token which we need to get from the data store
    withDatastoreService = true;
  }

  const handlerParams: GenericHandlerParams = {
    logger: functionLogger,
    services: {},
    triggerEvent: {
      attributes: {},
      data: {},
    },
  };

  if (withDatastoreService) {
    handlerParams.services["datastoreService"] = new DataStoreService(
      new Datastore(),
      functionLogger.child({
        service: "datastoreService",
      })
    );
  }

  return async function (
    incomingMessage: {
      body: {
        message: {
          data: string;
          attributes: Record<string, unknown>;
        };
      };
    },
    res: Response
  ) {
    if (withSqlService) {
      handlerParams.services["sqlService"] = await initializeSqlService(
        functionLogger
      );
    }

    handlerParams.triggerEvent = getDataAndAttributesFromIncomingMessage(
      incomingMessage,
      wrapperLogger
    );

    if (withSpotifyService) {
      if (
        !handlerParams.triggerEvent.data["requestSpotifyId"] ||
        typeof handlerParams.triggerEvent.data["requestSpotifyId"] !== "string"
      ) {
        throw new Error(
          "Functions configured to use the spotify service must be passes a requestSpotifyId string in the data"
        );
      } else if (!handlerParams.services.datastoreService) {
        throw new Error(
          "Functions configured to use the spotify service must have a datastore service to get the access token"
        );
      } else {
        try {
          handlerParams.accessToken = await fetchSpotifyAccessToken(
            handlerParams.triggerEvent.data["requestSpotifyId"],
            handlerParams.services.datastoreService,
            logger
          );
          logger.info("HERE");
          handlerParams.services.spotifyService = new SpotifyService(
            handlerParams.accessToken
          );
          logger.info("after spotify");
        } catch (error) {
          logger.error(`Failed to fetchSpotifyAccessToken`, {
            error,
          });
          throw error;
        }
      }
    }
    try {
      const result = await handler(handlerParams);
      return res.send(result);
    } catch (error) {
      logger.error(`Failed to handle message`, {
        error,
      });
      throw error;
    }
  };
}
