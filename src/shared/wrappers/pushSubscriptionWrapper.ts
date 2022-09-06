import { Response } from "express";
import { v4 } from "uuid";
import { logger } from "../logger";
import { GenericHandler, PushSubscriptionHandler } from "../../fns/types";

export function pushSubscriptionHandlerWrapper(
  handler: GenericHandler
): PushSubscriptionHandler {
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
    const correlationId = v4();
    const fnLogger = logger.child({
      correlationId,
    });
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
      logger.error(
        `Failed to parse incoming message into data and attributes`,
        {
          incomingMessage_body_message: incomingMessage.body.message,
        }
      );
      throw error;
    }
    try {
      await handler({
        triggerEvent: { data, attributes },
        logger: fnLogger,
        done: (response) => {
          res.json(response);
        },
      });
    } catch (error) {
      logger.error(`Failed to handle message`, {
        error,
      });
      throw error;
    }
  };
}
