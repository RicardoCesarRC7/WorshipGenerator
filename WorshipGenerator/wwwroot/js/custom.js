$(document).ready(() => {

    $(() => $('[data-toggle="tooltip"]').tooltip());

    $(() => $('.datepicker').datepicker({
        changeMonth: true,
        changeYear: true,
        autoclose: true,
        format: 'dd/mm/yyyy',
        buttonImageOnly: true,
        nextText: '>',
        prevText: '<'
    }));

    $(() => $('.clockpicker').clockpicker({
        placement: 'top',
        donetext: 'Pronto',
        autoclose: true
    }));

    if (window.location.search == '') {

        getProgramacoesList();
        getRelacoesMusicaisList();
    }

    initialize();
});

const initialize = () => {

    //if (window.location.pathname.includes('Login')) {
    //    $('nav').hide();
    //}
}

const getAppRoot = () => window.location.protocol + '//' + window.location.host + '/';

$('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
    if (!$(this).next().hasClass('show'))
        $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");

    var $subMenu = $(this).next(".dropdown-menu");

    $subMenu.toggleClass('show');

    $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
        $('.dropdown-submenu .show').removeClass("show");
    });

    return false;
});

const getProgramacoesList = () => {

    $.get(getAppRoot() + 'Programacao/ListarProgramacoes', (result) => {

        $('#ultimas-programacoes-section').append(result);
    });
}
const getRelacoesMusicaisList = () => {

    $.get(getAppRoot() + 'Musica/ListarRelacoes', (result) => {

        $('#ultimas-relacoes-musicais-section').append(result);
    });
}

const showLoader = (text) => {

    Swal.fire({
        icon: 'info',
        title: 'Carregando...',
        text: text,
        showConfirmButton: false
    });
}
