////$(document).ready(() => {

////    $('.see-programacao-button').on('click', () => {

////        window.location = getAppRoot() + 'Programacao/Programacao/' + 
////    });
////});

const getAppRoot = () => window.location.protocol + '//' + window.location.host + '/';

$('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
    if (!$(this).next().hasClass('show')) {
        $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
    }
    var $subMenu = $(this).next(".dropdown-menu");
    $subMenu.toggleClass('show');


    $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
        $('.dropdown-submenu .show').removeClass("show");
    });


    return false;
});