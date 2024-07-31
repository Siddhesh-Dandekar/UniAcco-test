import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Modal from 'react-modal';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    const filtered = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMovies(filtered);
  }, [searchQuery, movies]);

  const fetchMovies = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=38ea5e7c8561a585923cb35fd520dfa3&page=${page}`);
    setMovies([...movies, ...response.data.results]);
    setPage(page + 1);
    if (response.data.results.length === 0) {
      setHasMore(false);
    }
  };

  const openModal = (movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search movies..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <InfiniteScroll
        dataLength={filteredMovies.length}
        next={fetchMovies}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more movies to show</p>}
      >
        <div className="movie-list">
          {filteredMovies.map(movie => (
            <div key={movie.id} className="movie-card" onClick={() => openModal(movie)}>
              <div className='image-section'><img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} /></div>
              <div className='bottom-section'>
                <div className='movierating'>
                  <h3>{movie.title}</h3>
                  <p><strong>Rating:</strong> {movie.vote_average}</p>
                </div>
                <p>{movie.overview}</p>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>

      {selectedMovie && (
        <Modal
          isOpen={!!selectedMovie}
          onRequestClose={closeModal}
          contentLabel="Movie Details"
        >
          <h2>{selectedMovie.title}</h2>
          <img src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`} alt={selectedMovie.title} />
          <p><strong>Rating:</strong> {selectedMovie.vote_average}</p>
          <p>{selectedMovie.overview}</p>
          <button onClick={closeModal}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default MovieList;

