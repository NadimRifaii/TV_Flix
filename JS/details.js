import { sidebar } from "./sidebar.js";
import {
  imageBaseURL,
  genresAPI,
  movieDetailsAPI,
  fetchDataFromServer,
} from "./api.js";
import { search } from './search.js';
let genresObj = {
  toString: function () {
    let array = [];
    for (let prop in genresObj) {
      if (prop != "toString") array.push(genresObj[prop]);
    }
    return array.join(", ");
  },
};
sidebar();
search();
let movieInfo = document.querySelector(".page-content .info");
let movieDetails = document.querySelector(".movie-details");
fetchDataFromServer(movieDetailsAPI, function (data) {
  let {
    poster_path,
    genres,
    original_title,
    vote_average,
    overview,
    release_date,
    status,
    videos: { results },
    casts: { cast, crew },
  } = data;
  showGenres(genres);
  filterVideos(results);
  movieInfo.innerHTML = `
  <div class="poster">
  <img src="${imageBaseURL}w342${poster_path}" class="img-cover" alt="">
  </div>
  <div class="content txt-c">
  <h2 class="title">${original_title}</h2>
  <p class="achievments d-flex gap-20 center-flex">
  <span class="rating d-flex">
  <img src="./images/star.png" class="x24" alt="">${vote_average.toFixed(
    1
  )}</span>
  <span class="release">${release_date.split("-")[0]}</span>
          </p>
          <p class="genres">${genresObj.toString()}</p>
          <p class="preview">${overview}</p>
          <hr>
          <div style="text-align:left" class="mt-10 cast d-flex gap-10">
          <p  >Starring:</p>
          <p>${filterActors(cast)}</p>
          </div>
          <div class="status mt-10 d-flex gap-10">
          <p>Status:</p>
          <p>${status}</p>
          </div>
          <div class="director mt-10 d-flex gap-10">
          <p>Directed by:</p>
          <p>${filterDirectors(crew)}</p>
          </div>
          </div>
          `;
  pageSections();
});
function filterVideos(videoList) {
  let filtered = videoList.filter((elem) => {
    return elem.site == "YouTube" && (elem.type == 'Trailer' || elem.type == "Clip");
  });
  let videosContainer = document.querySelector(".yt-videos");
  for (let video of filtered) {
    let sliderItem = document.createElement('div');
    sliderItem.classList.add('slider-item');
    sliderItem.innerHTML = `
    <iframe width="500" height="294" src="https://www.youtube.com/embed/${video['key']}?&amp;theme=dark&amp;color=white&amp;rel=0" frameborder="0" allowfullscreen="1" title="Now Streaming on Disney+" class="img-cover" loading="lazy"></ifram>
    </iframe>
    `;
    videosContainer.append(sliderItem);
  }
}
function filterActors(actors) {
  let ac = actors.filter((elem) => {
    return elem["known_for_department"] == "Acting";
  });
  let array = [];
  let i = 0;
  for (let name of ac) {
    if (i++ < 10) array.push(name["name"]);
    else break;
  }
  return array.join(", ");
}
function filterDirectors(directors) {
  let dir = directors.filter((dir) => dir["job"] == "Director");
  let array = [];
  for (let i = 0; i < dir.length; i++) {
    let { name } = dir[i];
    array.push(name);
  }
  return array.join(", ");
}
function showGenres(arrayObj) {
  for (let genre of arrayObj) {
    genresObj[genre.id] = genre.name;
  }
}
function pageSections() {
  let pageSections = document.querySelector('.page-sections');
  let sectionBox = document.createElement('section');
  sectionBox.classList.add('mt-20')
  sectionBox.innerHTML = `
    <h1 class="genre-title mb-10">You may also like</h1>
        <div class="container d-flex gap-20">
        </div>
    `;
  fetchDataFromServer(`https://api.themoviedb.org/3/movie/${localStorage.getItem('movieId')}/recommendations?api_key=ad1a2a4cb80d72ec16fe712446738ea8&language=en-US&page=1`,
    function ({ results: movieList }) {
      for (let movie of movieList) {
        let a = document.createElement('a');
        a.classList.add('movie-card');
        let {
          poster_path,
          id,
          title,
          vote_average,
          release_date,
          original_language
        } = movie;
        a.setAttribute('href', 'movie-details.html');
        a.onclick = function () {
          saveIdToLocalStorage(id, original_language);
        }
        a.innerHTML = `
        <div class="poster">
          <img src="${imageBaseURL}w342${poster_path}" class="img-cover" alt="${title}">
        </div>
        <h3 class="title">${title}</h3>
        <div class="info">
          <span class="release">${release_date.split('-')[0]}</span>
          <span class="rating d-flex"><img src="./images/star.png" class="x24" alt="">${vote_average.toFixed(1)}</span>
        </div>
        `;
        sectionBox.querySelector('.container').append(a);
      }
    })
  pageSections.append(sectionBox);
}