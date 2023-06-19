import { useState, useEffect } from "react";
import "./App.css";
import { movies } from "./movieData.jsx";
import axios from "axios";

function App() {
  const [movieData, setMovieData] = useState({});
  const [guess, setGuess] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [randomMovie, setRandomMovie] = useState(
    movies[Math.floor(Math.random() * movies.length)]
  );

  // const [index, setIndex] = useState(0);
  // const [src, setSrc] = useState(
  //   `${randomMovie.path}${randomMovie.stills[index]}.jpg`
  // );
  const [index, setIndex] = useState(0);
  const [src, setSrc] = useState(randomMovie.path[index]);

  function reload() {
    if (index < randomMovie.path.length - 1) {
      setIndex(index + 1);
      // setSrc(`${movies[0].path}${movies[0].stills[index + 1]}.jpg`);
      setSrc(randomMovie.path[index + 1]);
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
  }, []);

  function checkGuess() {
    if (guess === randomMovie.title) {
      setRandomMovie(movies[Math.floor(Math.random() * movies.length)]);
      setGuess("");
    } else alert("Try Again");
  }

  const handleInputChange = (event) => {
    setGuess(event.target.value);
    const value = event.target.value;

    // Fetch movie title suggestions based on input value
    fetchMovieSuggestions(value);
  };

  return (
    <>
    <input type="text" value={guess} onChange={handleInputChange} />
      {guess.length > 0 && suggestions.length > 0 && (
        <ul>
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
      <button onClick={reload}>🔄</button>
      <div>
        {movieData && (
          <div key={movieData.id}>
            {/* <h2>{randomMovie.title}</h2> */}
            <img
              // src={`https://image.tmdb.org/t/p/w500${movieData.backdrop_path}`}
              src={src}
              alt="Movie Backdrop"
            />
          </div>
        )}
      </div>
      
      <button onClick={checkGuess}>Check</button>
    </>
  );
}

export default App;
