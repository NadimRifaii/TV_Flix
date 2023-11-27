let imageBaseURL = 'https://image.tmdb.org/t/p/';
let API_KEY = `ad1a2a4cb80d72ec16fe712446738ea8`;
let genresAPI = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
let popularMoviesAPI = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=1`;
let languageListAPI = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_original_language=en`;
let movieId = localStorage.getItem('movieId');
let movieDetailsAPI = `https://api.themoviedb.org/3/movie/${localStorage.getItem('movieId')}?api_key=${API_KEY}&language=en-US&append_to_response=casts,videos,images,releases`;
function fetchDataFromServer(apiLink, callBack) {
  fetch(apiLink).then(data => data.json()).then(data => callBack(data));
}
export { imageBaseURL, fetchDataFromServer, genresAPI, popularMoviesAPI, movieDetailsAPI };