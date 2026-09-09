function toggleLang(){
  var b=document.body,n=b.dataset.lang==='tr'?'en':'tr';
  b.dataset.lang=n;document.documentElement.lang=n;
  var btn=document.querySelector('.lang');if(btn)btn.textContent=n==='tr'?'EN':'TR';
  try{localStorage.setItem('agiturk_lang',n)}catch(e){}
}
(function(){
  var s=null;try{s=localStorage.getItem('agiturk_lang')}catch(e){}
  if(s==='en'){document.body.dataset.lang='en';document.documentElement.lang='en';
    var btn=document.querySelector('.lang');if(btn)btn.textContent='TR'}
})();

/* Product-tour screenshot: scroll distance = rendered image height minus
   the visible window, so the animation always stops exactly at the
   image's bottom edge regardless of viewport width. */
function setupShotScroll(){
  var img=document.querySelector('.shot-scroll');
  var win=document.querySelector('.shot-window');
  if(!img||!win) return;
  function measure(){
    var winH=win.clientHeight;
    var renderedH=img.clientWidth*(img.naturalHeight/img.naturalWidth);
    var dist=Math.max(0, renderedH-winH);
    img.style.setProperty('--scroll-end', (-dist)+'px');
  }
  if(img.complete) measure(); else img.addEventListener('load', measure);
  window.addEventListener('resize', measure);
}
setupShotScroll();
