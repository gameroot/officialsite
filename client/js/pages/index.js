import $ from 'jquery';

$(document).ready(() => {
  const $headerDom = $('.header-container .container .navbar');

  $headerDom.find('.navbar-nav #home').addClass('active');
});


function goToByScroll(id){
  id = id.replace("link", "");
  $('html,body').animate({
    scrollTop: $(`#${id}`).offset().top
  }, 'slow');
}

$("#jumpToSubscribe").click((e) => { 
    // Prevent a page reload when a link is pressed
  e.preventDefault(); 
    // Call the scroll function
  goToByScroll('subscribeForm');           
});