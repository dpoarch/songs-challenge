import songs from '../songs.json';

const PER_PAGE = 15;

export default {
  Query: {
    async Songs(root, { page, search }) {
      const offsetStart = PER_PAGE * (page - 1);
      const offsetEnd = offsetStart + PER_PAGE;

      const matchingSongs = search
        ? songs.filter(song =>
            ['track_name', 'track_artist', 'track_album_name'].find(field =>
              (song[field] || '').toLowerCase().includes(search.toLowerCase())
            )
          )
        : songs;

      return {
        songs: matchingSongs.slice(offsetStart, offsetEnd),
        pageInfo: {
          current_page: page,
          per_page: PER_PAGE,
          total: matchingSongs.length,
          has_more: offsetEnd < matchingSongs.length
        }
      };
    }
  }
};
