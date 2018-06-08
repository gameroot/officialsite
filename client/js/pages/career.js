import $ from 'jquery';

$(document).ready(() => {
  const $headerDom = $('.header-container .container .navbar');

  $headerDom.find('.navbar-nav #career').addClass('active');
});
