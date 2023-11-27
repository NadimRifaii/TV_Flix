import { imageBaseURL, fetchDataFromServer } from './api.js';
import { sidebar } from './sidebar.js';
sidebar();
import { search } from './search.js';
search();
let currentPage = 1;
pageSections();
function pageSections() {
  if (localStorage.getItem('currentPage'))
    currentPage = localStorage.getItem('currentPage');
  fetchDataFromServer(`https://api.themoviedb.org/3/discover/movie?api_key=ad1a2a4cb80d72ec16fe712446738ea8&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${currentPage}&${localStorage.getItem('urlParam')}`,
    function ({ results: movieList }) {
      console.log(movieList);
      let gridList = document.querySelector('.grid-list');
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
        gridList.append(a);

        loadMoreBtn.classList.remove('loading');
      }
    })
}
let loadMoreBtn = document.querySelector('.load-more');
document.querySelector('.page-content').append(loadMoreBtn);
loadMoreBtn.onclick = loadMore;
loadMoreBtn.classList.remove('loading');
function loadMore() {
  document.querySelector('.load-more').classList.add('loading');
  currentPage++;
  localStorage.setItem('currentPage', currentPage);
  pageSections();
}