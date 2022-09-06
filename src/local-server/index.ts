import { startServer } from "./server";
import { Message } from "@google-cloud/pubsub";
import { main as handleArtistFromTopTrackAdd } from "../fns/handleArtistFromTopTrackAdd/fn";

startServer({
  httpPort: 8080,
  pubsubPort: 4040,
  handlerConfigs: [
    {
      id: "handle_artist_from_top_track_add",
      topic: "spotify_api_events",
      filter: (message: Message) =>
        message.attributes.eventType === "ARTISTS_SAVED_FROM_TOP_TRACKS",
      handler: handleArtistFromTopTrackAdd,
    },
  ],
})
  .then(() => {
    console.log('Started dev server.') //eslint-disable-line
  })
  .catch(console.error);
