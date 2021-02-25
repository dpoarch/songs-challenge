import { request, gql } from 'graphql-request';
import useSWR from 'swr';
import Link from 'next/link';

import Song from './song';

const SONGS_QUERY = gql`
  query HomePage($page: Int!, $search: String) {
    Songs(page: $page, search: $search) {
      songs {
        track_id
        track_name
        track_artist
        track_popularity
        track_album_id
        track_album_name
        track_album_release_date
        playlist_name
        playlist_id
        playlist_genre
        playlist_subgenre
        danceability
        energy
        key
        loudness
        mode
        speechiness
        acousticness
        instrumentalness
        liveness
        valence
        tempo
        duration_ms
        album_cover_art_url
      }
      pageInfo {
        per_page
        current_page
        total
        has_more
      }
    }
  }
`;

const fetcher = (page, search) =>
  request('http://localhost:3000/api/graphql', SONGS_QUERY, { page, search });

export default function Songs({ page, search }) {
  const { data, error } = useSWR([page, search], fetcher);

  if (!data && !error)
    return (
      <div className="mt-5 d-flex justify-content-center">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error) {
    console.error(error);
    return (
      <div className="mt-5 d-flex justify-content-center">
        <div className="alert alert-danger" role="alert">
          Something bad happened!
        </div>
      </div>
    );
  }

  return (
    <>
      {data.Songs.songs.length ? (
        <div className="row row-cols-1 row-cols-sm-3 row-cols-lg-5 g-3">
          {data.Songs.songs.map(song => (
            <Song key={song.track_id} song={song} />
          ))}
        </div>
      ) : (
        <p className="text-center">No Results!</p>
      )}
      <Pagination search={search} pageInfo={data.Songs.pageInfo} />
    </>
  );
}

function Pagination({ pageInfo, search }) {
  const current_page = pageInfo.current_page || 1;

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination mt-5 d-flex justify-content-center">
        <li className={current_page === 1 ? 'page-item disabled' : 'page-item'}>
          {current_page === 1 ? (
            <span className="page-link">Previous</span>
          ) : (
            <Link
              passHref
              href={`/${[search, current_page - 1]
                .filter(part => part)
                .join('/')}`}>
              <a className="page-link">Previous</a>
            </Link>
          )}
        </li>

        <li className={pageInfo.has_more ? 'page-item' : 'page-item disabled'}>
          {pageInfo.has_more ? (
            <Link
              passHref
              href={`/${[search, current_page + 1]
                .filter(part => part)
                .join('/')}`}>
              <a className="page-link">Next</a>
            </Link>
          ) : (
            <span className="page-link">Next</span>
          )}
        </li>
      </ul>
    </nav>
  );
}
