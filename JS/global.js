let addEventOnElements=function(elements,eventType,callBack){
  elements.forEach(elem=>{
    elem.addEventListener(eventType,callBack);
  })
}
function saveIdToLocalStorage(id='',originalLanguage=''){
  if(id!='')
  localStorage.setItem('movieId',String(id));
  localStorage.setItem('movieLanguage',originalLanguage);
}