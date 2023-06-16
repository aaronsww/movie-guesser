import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [movieData, setMovieData] = useState({});
  const [guess, setGuess] = useState("");

  function checkGuess() {
    if (guess === movieData.title) alert("You are correct!");
    else alert("Try Again");
  }

  const movies = [
    { title: "Avatar", year: 2009 },
    { title: "Avengers: Endgame", year: 2019 },
    { title: "Titanic", year: 1997 },
    { title: "Star Wars: Episode VII - The Force Awakens", year: 2015 },
    { title: "Jurassic World", year: 2015 },
    { title: "The Lion King", year: 2019 },
    { title: "The Avengers", year: 2012 },
    { title: "Inception", year: 2010 },
    { title: "Blade Runner 2049", year: 2017 },
    { title: "Avengers: Infinity War", year: 2018 },
  ];

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

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * movies.length);
    const randomMovie = movies[randomIndex];
    console.log(randomMovie.title);
    fetchData(randomMovie);
  }, []);

  return (
    <>
      <div>
        {movieData && (
          <div key={movieData.id}>
            <h2>{movieData.title}</h2>
            <img
              src={`https://image.tmdb.org/t/p/w500${movieData.backdrop_path}`}
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
