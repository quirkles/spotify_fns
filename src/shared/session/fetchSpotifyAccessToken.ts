import { Logger } from "winston";
import axios, { AxiosRequestConfig } from "axios";

import { DataStoreService } from "../services/datastore";
import { asyncRetry } from "../asyncRetry";
import { SECRETS } from "../../secrets";
import { handleAxiosError } from "../errors";
import { UserSessionDataKind } from "../services/datastore/kinds";

async function refreshAccessToken(
  refreshToken: string,
  logger: Logger
): Promise<{
  newToken: string;
  tokenExpiryDate: Date;
}> {
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);
  const authOptions: AxiosRequestConfig = {
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(SECRETS.clientId + ":" + SECRETS.clientSecret).toString(
          "base64"
        ),
    },
    data: params,
    responseType: "json",
  };

  const authPostResponse = await axios(authOptions).catch(handleAxiosError);
  const authPostResponseData = authPostResponse.data;
  logger.info("authPostResponseData", authPostResponseData);
  const { access_token, expires_in } = authPostResponseData;
  const tokenExpiryDate = new Date(Date.now() + expires_in * 1000);

  return {
    newToken: access_token,
    tokenExpiryDate: tokenExpiryDate,
  };
}

export async function fetchSpotifyAccessToken(
  userSpotifyId: string,
  dataStoreService: DataStoreService,
  logger: Logger
): Promise<string> {
  const userSessionDataRepository =
    dataStoreService.getRepository("userSessionData");

  const userSessionData = await asyncRetry(userSessionDataRepository.getByKey, {
    thisArg: userSessionDataRepository,
  })(userSpotifyId);
  // if we are within one minute of the token expiring, refresh

  if (
    !userSessionData ||
    !userSessionData.refreshToken ||
    !userSessionData.accessToken
  ) {
    throw new Error(`Invalid entity for user ${userSpotifyId} found`);
  }
  const { accessToken, refreshToken, accessTokenExpiryDateTime } =
    userSessionData;

  if (
    new Date(Number(accessTokenExpiryDateTime)).getTime() - Date.now() <
    1000 * 60 * 500000
  ) {
    logger.debug("Refreshing token");
    const { newToken, tokenExpiryDate } = await refreshAccessToken(
      refreshToken,
      logger
    );
    await asyncRetry(userSessionDataRepository.update, {
      thisArg: userSessionDataRepository,
    })(
      new UserSessionDataKind({
        userSpotifyId,
        accessToken: newToken,
        accessTokenExpiryDateTime: tokenExpiryDate,
      })
    );
  }
  return accessToken;
}
