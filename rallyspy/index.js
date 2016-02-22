function main() {
  var viewport = document.querySelector("#viewport");
  var all = viewport.getElementsByTagName("*");

  viewport.style.width = "60%";
  for (var i = 0; i < all.length; i++) {
    if (all[i].offsetWidth > viewport.offsetWidth) {
      all[i].style.width = "100%";
    }
  }
  viewport.style.width = "60%";
  viewport.style.float = 'right';

  var sidepan = document.createElement('iframe');
  sidepan.src = 'https://localhost:3001/rallyspy';
  sidepan.style.position = 'fixed';
  sidepan.style.left = '0';
  sidepan.style.top = '0';
  sidepan.style.width = '40%';
  sidepan.style.height = window.innerHeight + 'px';

  document.getElementsByTagName('body')[0].insertBefore(sidepan, viewport);

  document.querySelector('.alm-header-container').style.display = 'none';
  document.querySelector('.footer-container').style.display = 'none';
  document.querySelector('.ribbon-navigation').style.display = 'none';
  document.querySelector('.detailContentRightPanel').style.display = 'none';
}

setTimeout(function doStuff(){
  if (document.querySelector('.detailContentRightPanel')) {
    main();
  }else{
    setTimeout(doStuff, 1000);
  }
}, 1000);