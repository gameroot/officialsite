import $ from 'jquery';

$('.lan-list a').click(function() {
  console.log('click');
  const newLan = $(this).attr('value');
  const oldLan = window.LOCALE_LAN;
  let pathName = window.location.pathname;
  const origin = window.location.origin;
  let newHref;
  if(pathName.indexOf(`/${oldLan}/`) > -1) {
    newHref = `${origin}${pathName.replace(`/${oldLan}/`, `/${newLan}/`)}`;
  } else {
    newHref = `${origin}/${newLan}${pathName}`;
  }
  window.location.href = newHref;
  console.log(newHref);
})