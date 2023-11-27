import { fetchDataFromServer, imageBaseURL } from './api.js'
export function search() {
  let currentPage;
  let searchBtn = document.querySelector('.search-btn');
  let closeBtn = document.querySelector('.close-btn');
  let searchBox = document.querySelector('.search-box');
  [searchBtn, closeBtn].forEach(btn => {
    btn.onclick = function () {
      searchBox.classList.toggle('active');
    }
  });
  let searchWrapper = document.querySelector('.search-wrapper');
  let input = document.querySelector('.search-wrapper input');
  input.addEventListener('input', function () {
    this.parentElement.classList.add('searching');
    function pageSections() {
      if (localStorage.getItem('currentPage'))
        currentPage = localStorage.getItem('currentPage');
      fetchDataFromServer(`https://api.themoviedb.org/3/search/movie?api_key=ad1a2a4cb80d72ec16fe712446738ea8&language=en-US&query=${input.value}&page=1&include_adult=false`,
        function ({ results: movieList }) {
          console.log(movieList);
          let gridList = document.createElement('div');
          let pageContent = document.querySelector('.page-content');
          gridList.className = 'grid-list p-10 gap-20';
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
            pageContent.innerHTML = '';
            let loadMoreBtn = document.createElement('button');
            loadMoreBtn.className = `load-more`;
            loadMoreBtn.textContent = 'Load More';
            pageContent.append(gridList);
            loadMoreBtn.classList.remove('loading');
            searchWrapper.classList.remove('searching');
          }
        })
    }
    pageSections();
  })

}