import{ useState, useContext, useRef, useEffect } from "react";
import { Card, Grid, CardActionArea, CardActions, CardMedia, Button } from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { MoviesContext } from "../../services/context";
import '../../App.scss';
import './Catalog.scss';
import noImage from '../../images/no-image-available.png';
import loadingSpinner from '../../images/loading-spinner.gif';
import { NavLink } from 'react-router-dom';
import useIntersectionObserver from '../../customHooks/useIntersectionObserver';
import { changeSelectedMovie, isMoviePageOpened, changeCurrentPage } from '../../actions';
import { Movie, fetchMovies } from "../../services/movies.service";
import { RootState } from '../../reducer';
import { Dispatch } from "redux";
import { addHomePageMovies } from '../../actions';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const posterBaseUrl = "https://image.tmdb.org/t/p/w300";

const CatalogCards = () =>  {
  const { movies, updateMovies } = useContext(MoviesContext);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(loadingRef, {})
  const isVisible = !!entry?.isIntersecting;
  const dispatch: Dispatch<any> = useDispatch();
  const searchedMovie = useSelector((state: RootState) => state.searchedMovie);
  const currentPage = useSelector((state: RootState) => state.currentPage);

  const SetSelectedMovieId = (id: number) => {
    dispatch(isMoviePageOpened(true));
    dispatch(changeSelectedMovie(id));
  }

  const [homePageMovies, updateHomePageMovies] = useState<Movie[]>([]);

  useEffect (
    () => {
      if ( isVisible ) {
        if (currentPage <= 500) {
          dispatch(changeCurrentPage(currentPage+1));

          fetchMovies(String(currentPage))
            .then(nextPage => {
              updateMovies([...movies, ...nextPage]);
            })
            .catch(() => updateMovies([]))

          fetchMovies(String(currentPage))
            .then(nextPage => {
              updateHomePageMovies([...movies, ...nextPage]);
            })
            .catch(() => updateHomePageMovies([]))
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isVisible]
  );

  dispatch(addHomePageMovies(homePageMovies));

  return (
    <div >
      <Grid container spacing={1} className="container-content">
        { 
        movies.length > 0 
          ? 
          movies.map((movie) => (
            <Grid item xs={12} sm={6} md={3} lg={2} key={movie.id}>
              <NavLink to={'/movie/' + movie.id}>
                <Card className="card-list" onClick={() => SetSelectedMovieId(movie.id)} >
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      alt={"Poster of " + movie.title}
                      image={movie.poster_path ? posterBaseUrl + movie.poster_path : noImage}
                      title={movie.title}
                    />
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color="primary">
                      <FavoriteBorderIcon />
                    </Button>
                    <Button size="small" color="primary">
                      {movie.vote_average}
                    </Button>
                  </CardActions>
                </Card>
              </NavLink>
            </Grid>
          ))
          :
          searchedMovie ?
          <div className="">Try a different phrase...</div>
          :
          <CardMedia
          component="img"
          image={loadingSpinner}
          className="loading-spinner"
          />
        }
      </Grid>
      <div ref={loadingRef}>{currentPage <= 500 ? '...' : "You've seen all movies;)"}</div>
    </div>
  );
}

export default CatalogCards;