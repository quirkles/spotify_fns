import { pushSubscriptionHandlerWrapper } from "../../../shared";
import { GenericHandlerParams } from "../../types";

async function handler(params: GenericHandlerParams): Promise<null> {
  const { triggerEvent, logger, accessToken, services } = params;
  logger.info("IN THE FUNCTION");
  return null;
}
export const main = pushSubscriptionHandlerWrapper(handler, {
  withSpotifyService: true,
  withSqlService: true,
  withDatastoreService: true,
});
