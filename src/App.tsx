import React, { useState, useEffect } from "react";
import './App.css';
import BaseContainer from './components/Container/BaseContainer';
import { Movie, fetchMovies } from "./services/movies.service";
import { MoviesContext } from "./services/context";
import MoviePage from './components/MoviePage/MoviePage';

var Router = require("react-router-dom").BrowserRouter;
var Route = require("react-router-dom").Route;
var Switch = require("react-router-dom").Switch;

function App() {
  useEffect(() => {
    fetchMovies()
      .then(setMovies)
      .catch(() => setMovies([]));
  }, []);

  const [movies, setMovies] = useState<Movie[]>([]);

  return (
    <Router>

      <Switch>
          <Route  path="/movieid" >
            <div>
              <MoviePage/>
            </div>
          </Route>
          <Route path="/" >
            <MoviesContext.Provider value={{ movies }}>
              <div className="App">
                <div className="container">
                  <BaseContainer></BaseContainer>           
                </div>
              </div>
            </MoviesContext.Provider>
          </Route>
      </Switch>
    </Router>
  );
}

export default App;

/*
<MoviesContext.Provider value={{ movies }}>
<div className="App">
  <div className="container">
    <BaseContainer></BaseContainer>           
  </div>
</div>
</MoviesContext.Provider>
*/