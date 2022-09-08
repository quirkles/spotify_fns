export interface TopTrackAlbum {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  release_date: string;
  album_group: string;
  release_date_precision: string;
  restrictions: {
    reason: string;
  };
  external_urls: {
    spotify: string;
  };
  followers: { href: string | null; total: number };
  genres: string[];
  href: string;
  id: string;
  images: [
    {
      height: number;
      url: string;
      width: number;
    }
  ];
  name: string;
  popularity: number;
  type: "album";
  uri: string;
  artists: [
    {
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: "artist";
      uri: string;
    }
  ];
}

export interface TopArtist {
  external_urls: {
    spotify: string;
  };
  followers: { href: string | null; total: number };
  genres: string[];
  href: string;
  id: string;
  images: [
    {
      height: number;
      url: string;
      width: number;
    }
  ];
  name: string;
  popularity: number;
  type: "artist";
  uri: string;
}

export type TopTrackArtist = Omit<TopArtist, "images">;

export interface TopTrack {
  album: TopTrackAlbum;
  artists: TopTrackArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: true;
  external_ids: {
    isrc: string;
    ean: string;
    upc: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_playable: true;
  linked_from: Record<string, unknown>;
  restrictions: {
    reason: string;
  };
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}

export interface TopItemsResponse<T extends TopArtist | TopTrack> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  href: string | null;
  previous: string | null;
  next: string | null;
}
