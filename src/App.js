//  STYLES
import { useState, useEffect } from 'react';
import './App.css';


// ASSETS
import cinema from './assets/cinema.png'


// API KEY
const KEY = "684daf52";

let open = false;

function App() {

  const [movies, setMovies] = useState([]);
  // const [isOpen, setIsOpen] = useState(open);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(""); 
  const [query, setQuery] = useState("interstellar");
  const [selectedId, setSelectedId] = useState(null);

  // function handleIsOpen(open){
  //   setIsOpen((open) => !open)
  //   console.log(isOpen)
  // }

  function HandleSelectedMovie(id){
    setSelectedId((selectedId) => id === selectedId? null : id);
  }

  function HandleCloseMovie(){
    setSelectedId(null);
  }

  useEffect(function (){
    async function fetchMovies(){
      try{

        setLoading(true);
  
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`)
  
        if(!res.ok) throw new Error("Something went wrong while fetching movies");
        
        const data = await res.json();
        setMovies(data.Search);

        // if(data.Response === "False")throw new Error("Movie not found");
  
        
      }catch(err){
        setError(err.message)
      }finally{
        setLoading(false);
        
      }

    }
    fetchMovies();
  }, [query]);

  return (
    <div className="App">
      <NavBar query={query} setQuery={setQuery}/>
      <Main movies = {movies} isLoading={isLoading} error={error} selectedId={selectedId} onSelectedMovie={HandleSelectedMovie} onCloseMovie={HandleCloseMovie}/>
    </div>
  );
}

function NavBar({query, setQuery}){
  return(
    <div className='NavBar'>
      <img src={cinema} alt="popcorn" />
      <h3>YourMovies</h3>
      <SearchBar query={query} setQuery={setQuery}/>
    </div>
  )
  
}

function SearchBar({query, setQuery}){
  return(
    <div className='SearchBar'>
      <input type="text" placeholder='Search...' value={query} onChange={(e) => setQuery(e.target.value)}/>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="iconSearch">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>

    </div>
  )
}


function Main({movies, isLoading, error, onSelectedMovie, selectedId, onCloseMovie}){
  return(
    <div className='Main'>
      <MoviesList movies = {movies} isLoading={isLoading} error={error} selectedId={selectedId} onSelectedMovie={onSelectedMovie} />
      <MoviesWatched selectedId={selectedId} onCloseMovie={onCloseMovie}/>
    </div>
  )
}


function MoviesList({movies, isLoading, error, onSelectedMovie, selectedId}){
  return(
    <div className='MoviesList'>
      {isLoading && <Loading/>}
      {!isLoading && !error && movies?.map((movie) => (
        <MovieCard movie={movie} key={movie.imdbID} onSelectedMovie={onSelectedMovie}/>
      ))}
      {error && <ErrorMessage message={error}/>}
      {/* {isLoading? <Loading/> : movies?.map((movie) => (
        <MovieCard movie={movie} key={movie.imdbID}/>
      ))} */}
    
    </div>
  )
}


function MoviesWatched({selectedId, onCloseMovie}){
  return(
    <div className='MoviesWatched'>
      {selectedId? <MovieDetails selectedId={selectedId} onCloseMovie={onCloseMovie}/> : <BoxWatched/>}
      
    </div>
  )
}

function MovieDetails({selectedId, onCloseMovie}){

  const [movies, setMovies] = useState({});

  useEffect(function (){
    async function getMovieDetails(){

      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`)

      const data = await res.json();
      setMovies(data);
      console.log(data);
    }
    getMovieDetails();
  }, [selectedId])

  return(
    <div className='MovieDetails'>
      <button className='btn-close' onClick={onCloseMovie}>&larr;</button>
      <BoxMovie movies = {movies}/>
    </div>
  )
}

function BoxMovie({movies}){
  return(
    <div className='movieBox'>
      <img src={movies.Poster} alt={movies.Title} />
      <div className='movieBoxInfo'>
        <p className='movie-box-title'>{movies.Title}</p>
        <p>📅 {movies.Released}</p>
        <p>{movies.Genre}</p>
        <p>⭐ {movies.imdbRating} IMDB Rating</p>
        
      </div>
      <p className='plot'>{movies.Plot}</p>

    </div>
  )
}

function BoxWatched(){
  return(
    <div className='BoxWatched'>
      <p>MOVIES YOU WATCHED</p>
      <div className='box-info'>
        <p>🎃0 movies </p>
        <p>⭐ 0</p>
        <p>⏳ 0 min</p>
      </div>
    </div>
  )
}

function ErrorMessage({message}){
  return(
    <p className='error'>
      <span>{message}</span>
    </p>
  )
}

function Loading(){
  return(
    <div className='Loading'>
      <h3>LOADING...</h3>
    </div>
  )
}

function MovieCard({movie, onSelectedMovie}){
  return(
    <div className='MovieCard' onClick={() => onSelectedMovie(movie.imdbID)}>
        <img src={movie.Poster} alt={movie.Title} />
        <div className='Info-Container'>
          <p>{movie.Title}</p>
          <p>{movie.Year}</p>
        </div>
    </div>
  )

}

export default App;
