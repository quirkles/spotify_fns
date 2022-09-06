import { Logger } from "winston";
import { Response } from "express";

export interface GenericHandlerParams {
  triggerEvent: {
    data: Record<string, unknown>;
    attributes: Record<string, unknown>;
  };
  logger: Logger;
  done: (doneValue: unknown) => void;
}

export type GenericHandler = (
  params: GenericHandlerParams
) => Promise<ReturnType<GenericHandlerParams["done"]>>;

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
