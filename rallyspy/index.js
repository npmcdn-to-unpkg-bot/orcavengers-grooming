var Masonry = require('masonry-layout');

var viewport = document.querySelector("#viewport");
var all = viewport.getElementsByTagName("*");

viewport.style.width="60%";
for(var i = 0; i<all.length;i++){
  if (all[i].offsetWidth > viewport.offsetWidth){
    all[i].style.width="100%";
  }
}
viewport.style.width="60%";
viewport.style.float='right';

// viewport.className += ' grooming-grid-item';

var sidepan = document.createElement('iframe');
sidepan.src = 'https://localhost:3001';
sidepan.style.position = 'fixed';
sidepan.style.left = '0';
sidepan.style.top = '0';
sidepan.style.width = '40%';
sidepan.style.height = window.innerHeight + 'px';
// sidepan.className += ' grooming-grid-item';
document.getElementsByTagName('body')[0].insertBefore(sidepan, viewport);

document.querySelector('.alm-header-container').style.display='none';
document.querySelector('.footer-container').style.display='none';
document.querySelector('.ribbon-navigation').style.display='none';
document.querySelector('.detailContentRightPanel').style.display='none';

// var msnry = new Masonry( 'body', {
//   itemSelector: '.grooming-grid-item',
//   columnWidth: '.grooming-grid-item'
// });
