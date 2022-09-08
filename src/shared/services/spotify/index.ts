import axios, { AxiosError } from "axios";
import { HTTPRequestError } from "../../errors";
import { Artist } from "../sql";
export * from "./responses";

export class SpotifyService {
  private accessToken: string | null = null;
  constructor(accessToken?: string) {
    if (accessToken) {
      this.accessToken = accessToken;
    }
  }

  private async getUrl<T>(url: string): Promise<T> {
    if (!this.accessToken) {
      throw new Error("No access token configured");
    }
    try {
      const response = await axios.get(url, {
        headers: { Authorization: "Bearer " + this.accessToken },
        responseType: "json",
      });
      return response.data;
    } catch (err) {
      throw new HTTPRequestError(err as AxiosError);
    }
  }

  private async fetchArtistByIds<T>(ids: string[]): Promise<Artist[]> {
    if (!this.accessToken) {
      throw new Error("No access token configured");
    }
    try {
      const response = await axios.get(url, {
        headers: { Authorization: "Bearer " + this.accessToken },
        responseType: "json",
      });
      return response.data;
    } catch (err) {
      throw new HTTPRequestError(err as AxiosError);
    }
  }
}
