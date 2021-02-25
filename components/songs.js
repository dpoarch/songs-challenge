import { request, gql } from 'graphql-request';
import useSWR from 'swr';
import Link from 'next/link';

import Song from './song';

const MEILISEARCH_ENDPOINT = "http://localhost:7700";
const PER_PAGE = 15;

const fetcher = (page, query, limit) => {
  limit = limit || PER_PAGE;
  const offset = limit * (page - 1);

  let params = { offset, limit }
  if (query) params.q = query
  const queryParams = (new URLSearchParams(params)).toString()

  return fetch(`${MEILISEARCH_ENDPOINT}/indexes/songs/search?${queryParams}`).then((r) => {
    return r.json()
      .then(data => {
        return {
          "Songs": {
            songs: data.hits,
            pageInfo: {
              current_page: page,
              per_page: limit,
              total: data.nbHits,
              has_more: (data.offset + limit) < data.nbHits
            }
          }
        }
      });
  })
}

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
  const currentPage = pageInfo.currentPage || 1;

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination mt-5 d-flex justify-content-center">
        <li className={currentPage === 1 ? 'page-item disabled' : 'page-item'}>
          {currentPage === 1 ? (
            <span className="page-link">Previous</span>
          ) : (
            <Link
              passHref
              href={`/${[search, currentPage - 1]
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
              href={`/${[search, currentPage + 1]
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
