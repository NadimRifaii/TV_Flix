import { sidebar } from './sidebar.js';
import { search } from './search.js';
import { imageBaseURL, fetchDataFromServer, genresAPI, popularMoviesAPI } from './api.js';
let homePageSections = [
  {
    title: 'Upcoming Movies',
    path: '/movie/upcoming'
  },
  {
    title: 'Today\'s Trending Movies',
    path: '/trending/movie/week'
  },
  {
    title: 'Top Rated Movies',
    path: '/movie/top_rated'
  }
];
let genresObj = {
  toString: function (...ids) {
    let array = [];
    for (let i = 0; i < ids.length; i++) {
      array.push(genresObj[ids[i]]);
    }
    return array.join(', ');
  }
};
genre();
search();
sidebar();
showData();
pageSections();
function showData() {
  let mainBox = document.querySelector('.main-box');
  let slider = document.querySelector('.slider');

  fetchDataFromServer(popularMoviesAPI, function ({ results: movieList }) {
    for (let movie of movieList) {
      let {
        poster_path,
        backdrop_path,
        id,
        overview,
        title,
        vote_average,
        genre_ids,
        release_date,
        original_language
      } = movie;
      // console.log([poster_path,backdrop_path,id,overview,title,vote_average,genre_ids,release_date]);
      let movieInfo = document.createElement('div');
      movieInfo.classList.add('movie-info');
      movieInfo.innerHTML = `
      <img draggable='false' src="https://image.tmdb.org/t/p/w1280${backdrop_path}" class="img-cover" alt="">
        <div class="content">
          <h2 class="title mb-5">${title}</h2>
          <div class="year-rating d-flex gap-10 mb-5">
            <span class="year">${release_date.split('-')[0]}</span>
            <span class="rating d-flex"><img src="./images/star.png" class="x24" alt="">${vote_average}</span>
          </div>
          <p class="genres">${genresObj.toString(...genre_ids)}</p>
          <p class="desc">${overview}</p>
          <a onclick='saveIdToLocalStorage(${id}, "${original_language}")' href="movie-details.html"  class="watch-now mt-10" >
          <img src="./images/play_circle.png" class="x24" alt="${title}">
          Watch Now
          </a>
        </div>
      `;
      mainBox.append(movieInfo);
      let imageContainer = document.createElement('div');
      imageContainer.classList.add('image');
      let img = document.createElement('img');
      img.setAttribute('src', `${imageBaseURL}w342${poster_path}`);
      img.classList.add('img-cover');
      img.setAttribute('draggable', 'false');
      imageContainer.append(img);
      slider.append(imageContainer);
    }
    mainBox.querySelector('.movie-info').classList.add('active');
    slider.querySelector('.image').classList.add('active');
    let allMovieInfo = mainBox.querySelectorAll('.movie-info');
    let allPosters = slider.querySelectorAll('.image');
    addEventOnElements(allPosters, 'click', function (e) {
      let index = 0;
      allPosters.forEach((poster, i) => {
        poster.classList.remove('active');
        allMovieInfo[i].classList.remove('active');
        if (this == poster)
          index = i;
      });
      this.classList.add('active');
      allMovieInfo[index].classList.add('active');
    })
  })
}
function pageSections() {
  let pageSections = document.querySelector('.page-sections');
  for (let section of homePageSections) {
    let sectionBox = document.createElement('section');
    sectionBox.classList.add('mt-20')
    sectionBox.innerHTML = `
    <h1 class="genre-title mb-10">${section.title}</h1>
        <div class="container d-flex gap-20">
        </div>
    `;
    fetchDataFromServer(`https://api.themoviedb.org/3${section.path}?api_key=ad1a2a4cb80d72ec16fe712446738ea8&language=en-US&page=1`,
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
          <img src="${imageBaseURL}w342${poster_path}" class="img-cover" alt="">
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
}
export function genre() {
  fetchDataFromServer(genresAPI, function ({ genres }) {
    for (let genre of genres) {
      genresObj[genre.id] = genre.name;
    }
  })
}