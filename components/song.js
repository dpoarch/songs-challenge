import styles from './song.module.css';
import Image from 'next/image';

export default function Song({ song }) {
  const badgeDance = [ "badge" ];
  const genres = [ song.playlist_genre, song.playlist_subgenre ].filter(e => {
    return e != null;
  });

  if (song.danceability > 0.6) {
    badgeDance.push(styles['badge-danceable']);
  }

  return (
    <div className="col">
      <div className="card shadow-sm">
        {song.album_cover_art_url && (
          <Image
            src={song.album_cover_art_url}
            alt={`Cover art of ${song.track_album_name}`}
            className="card-img-top"
            width={640}
            height={640}
          />
        )}

        <div className="card-body">
          <p className="card-text">{song.track_name}</p>
          <div className="d-flex">
            <div className="text-muted">{song.track_artist}</div>
            <div className={ badgeDance.join(' ') }>Danceable!</div>
          </div>
        </div>

        <ul class="list-group list-group-flush">
          {genres.map(genre => (
            <li class="list-group-item">{ genre }</li>
          ))}
        </ul>
      </div>  
    </div>
  );
}
