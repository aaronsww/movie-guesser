import { useState, useEffect } from "react";
import "./App.css";
import { movies } from "./movieData.jsx";
import axios from "axios";

function App() {
  const [movieData, setMovieData] = useState({});
  const [guess, setGuess] = useState("");

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

  return (
    <>
      <button onClick={reload}>🔄</button>
      <div>
        {movieData && (
          <div key={movieData.id}>
            <h2>{randomMovie.title}</h2>
            <img
              // src={`https://image.tmdb.org/t/p/w500${movieData.backdrop_path}`}
              src={src}
              alt="Movie Backdrop"
            />
          </div>
        )}
      </div>
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
      />
      <button onClick={checkGuess}>Check</button>
    </>
  );
}

export default App;
