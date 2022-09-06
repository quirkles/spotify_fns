import { pushSubscriptionHandlerWrapper } from "../../../shared/wrappers/pushSubscriptionWrapper";
import { GenericHandler, GenericHandlerParams } from "../../types";

async function handler(
  params: GenericHandlerParams
): ReturnType<GenericHandler> {
  const { triggerEvent, logger, done } = params;
  logger.info("data", triggerEvent.data);
  logger.info("attrs", triggerEvent.attributes);
  done({ success: true });
}

export const main = pushSubscriptionHandlerWrapper(handler);
