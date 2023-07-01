import { useState, useEffect } from "react";
import "./App.css";
import { movies } from "./movieData.jsx";
import axios from "axios";

import rightGif from "./gifs/right/d.gif";
import wrongGif from "./gifs/wrong/c.gif";

function App() {
  const [movieData, setMovieData] = useState({});
  const [guess, setGuess] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [correctGuess, setCorrectGuess] = useState(null);
  const [hide, setHide] = useState(false);
  const [randomMovie, setRandomMovie] = useState(
    movies[Math.floor(Math.random() * movies.length)]
  );

  const [indicator, setIndicator] = useState(true);
  const [index, setIndex] = useState(0);
  const [src, setSrc] = useState(randomMovie.path[index]);

  function handleClick() {
    if (index < randomMovie.path.length - 1) {
      setIndex(index + 1);
      setSrc(randomMovie.path[index + 1]);
    } else {
      setHide(true);
    }
  }

  const fetchData = async (randomMovie) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${
          import.meta.env.VITE_MOVIE_API_KEY
        }&query=${randomMovie.title}&year=${randomMovie.year}`
      );
      setMovieData(response.data.results[0]);
      console.log(response.data.results[0]);
      console.log(movieData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchMovieSuggestions = async (query) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${
          import.meta.env.VITE_MOVIE_API_KEY
        }&query=${query}`
      );

      const movieSuggestions = response.data.results
        .slice(0, 10)
        .map((result) => result.title);
      setSuggestions(movieSuggestions);
    } catch (error) {
      console.error("Error fetching movie suggestions:", error);
    }
  };

  useEffect(() => {
    // console.log(randomMovie);
    fetchData(randomMovie);
  }, [randomMovie]);

  function checkGuess() {
    if (guess === randomMovie.title) {
      setGuess("");
      setIndicator(null);
      setCorrectGuess(true);
    } else {
      setCorrectGuess(false);
      setIndicator(true);
    }
  }

  const handleInputChange = (event) => {
    setGuess(event.target.value);
    const value = event.target.value;
    fetchMovieSuggestions(value);
  };

  function defeat() {
    setHide(null);
    setIndicator(null);
  }

  return (
    <>
      <div className="search-bar">
        <div className="search-btn">
          <input
            placeholder="Type & select movie title"
            type="text"
            value={guess}
            onChange={handleInputChange}
          />
          {indicator === null && (
            <button onClick={() => window.location.reload()}>Next Movie</button>
          )}
          {indicator === true && <button onClick={checkGuess}>Submit</button>}
        </div>
        {guess.length > 0 && suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((title) => (
              <li
                key={title}
                onClick={() => {
                  setGuess(title);
                  setSuggestions([]);
                }}
              >
                {title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {correctGuess === true && (
        <img className="gif" src={rightGif} alt="Correct GIF" />
      )}
      {correctGuess === false && (
        <img className="gif" src={wrongGif} alt="Wrong GIF" />
      )}

      <div className="movie-container">
        {movieData && (
          <div className="still-container" key={movieData.id}>
            {hide === false && (
              <button onClick={handleClick}>Next Frame</button>
            )}
            {hide === true && (
              <div className="prompt">
                <span>Out of skips!&nbsp;&nbsp;</span>
                <a onClick={defeat}>Give up?</a>
              </div>
            )}
            {hide === null && <h1>{movieData.title}</h1>}
            {/* <h2>{randomMovie.title}</h2> */}
            <img
              className="still"
              // src={`https://image.tmdb.org/t/p/w500${movieData.backdrop_path}`}
              src={src}
              alt="Movie Backdrop"
            />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
