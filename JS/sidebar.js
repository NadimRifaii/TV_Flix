let menu=document.querySelector('.sidebar');
let menuToggler=document.querySelector('.menu-togglers');
let overlay=document.querySelector('.overlay');
let listGenre=document.querySelector('.list.genre');
import { fetchDataFromServer,imageBaseURL,genresAPI } from "./api.js";
export function sidebar(){
  addEventOnElements([overlay,menuToggler],'click',function(){
    menuToggler.querySelectorAll('img').forEach(img=>img.classList.toggle('active'));
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
  })
  fetchDataFromServer(genresAPI,function({genres}){
    genreLink(genres);
  })
}
function genreLink(genres){
  for(let obj of genres){
    let {id,name}=obj;
    let li=document.createElement('li');
    let a=document.createElement('a');
    a.textContent=obj.name;
    a.setAttribute('href','./movie-list.html');
    a.onclick=function(){
      localStorage.setItem('urlParam',`with_genres=${id}`)
    }
    li.append(a);
    listGenre.querySelector('ul').append(li);
  }
  let languageLinks=document.querySelectorAll('.list.languages ul a');
  for(let i=0;i<languageLinks.length;i++)
    languageLinks[i].setAttribute('href','movie-list.html');
  addEventOnElements(languageLinks,'click',function(){
    localStorage.setItem('urlParam',`with_original_language=${this.getAttribute('data-language')}`);
    if(localStorage.getItem('currentPage'))
    localStorage.setItem('currentPage',1);
  })
}