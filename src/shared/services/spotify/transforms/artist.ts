import { TopArtist, TopTrackArtist } from "../apiResponseTypeDefinitions";
import { Artist } from "../../sql";

export function fromTopItemResponseItem(
  item: TopArtist | TopTrackArtist
): Omit<Artist, "id" | "moods"> {
  const artist: Omit<Artist, "id" | "moods"> = {
    name: item.name,
    externalSpotifyUrl: item.external_urls.spotify,
    spotifyId: item.id,
    spotifyUri: item.uri,
  };
  if ((item as TopArtist).images) {
    artist.imageUrl = (item as TopArtist).images.reduce((largest, curr) => {
      return (largest.width || Number.NEGATIVE_INFINITY) > curr.width
        ? largest
        : curr;
    }).url;
  }
  return artist;
}
