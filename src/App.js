import React from 'react';
import './App.css';
import MovieList from './components/movieslist.js';

function App() {
  return (
    <div className="App">
      <h1>Upcoming Movies</h1>
      <MovieList />
    </div>
  );
}

export default App;
