import { useState, useEffect } from "react";
import "./App.css";
import { movies } from "./movieData.jsx";
import axios from "axios";

import rightGif from "./gifs/right/a.gif";
import wrongGif from "./gifs/wrong/c.gif";

// const rightGifs = [
//  "./gifs/right/a.gif",
//   "./gifs/right/b.gif",
//   "./gifs/right/c.gif",
//   "./gifs/right/d.gif",
// ];

// const wrongGifs = [
//   "./gifs/wrong/c.gif",
//  "./gifs/wrong/d.gif",

// ];

function App() {
  const [movieData, setMovieData] = useState({});
  const [guess, setGuess] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [correctGuess, setCorrectGuess] = useState(null);
  const [randomMovie, setRandomMovie] = useState(
    movies[Math.floor(Math.random() * movies.length)]
  );

  const [indicator, setIndicator] = useState(true);

  // const [index, setIndex] = useState(0);
  // const [src, setSrc] = useState(
  //   `${randomMovie.path}${randomMovie.stills[index]}.jpg`
  // );
  const [index, setIndex] = useState(0);
  const [src, setSrc] = useState(randomMovie.path[index]);

  function handleClick() {
    if (index < randomMovie.path.length - 1) {
      setIndex(index + 1);
      // setSrc(`${movies[0].path}${movies[0].stills[index + 1]}.jpg`);
      setSrc(randomMovie.path[index + 1]);
    } else {
      setIndicator(0);
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
      // console.log(response.data.results[0]);
      // console.log(movieData);
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
    console.log(randomMovie);
    fetchData(randomMovie);
  }, [randomMovie]);

  function checkGuess() {
    if (guess === randomMovie.title) {
      setRandomMovie(movies[Math.floor(Math.random() * movies.length)]);
      setGuess("");
      setIndicator(null);
      setCorrectGuess(true);
      console.log(randomMovie);
    } else {
      setCorrectGuess(false);
      setIndicator(true);
    }
  }

  const handleInputChange = (event) => {
    setGuess(event.target.value);
    setIndicator(false);
    const value = event.target.value;
    fetchMovieSuggestions(value);
  };

  // const getRandomGif = (gifs) => {
  //   const randomIndex = Math.floor(Math.random() * gifs.length);
  //   return gifs[randomIndex];
  // };

  return (
    <>
      <div className="search-bar">
        <div className="search-btn">
          <input
            placeholder="Search for a movie"
            type="text"
            value={guess}
            onChange={handleInputChange}
          />
          {indicator === true && (
            <button onClick={handleClick}>Skip Frame</button>
          )}
          {indicator === false && <button onClick={checkGuess}>Submit</button>}
          {indicator === 0 && <button>Out of skips</button>}
          {indicator === null && (
            <button onClick={() => window.location.reload()}>Next Movie</button>
          )}
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

      <div>
        {movieData && (
          <div key={movieData.id}>
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
