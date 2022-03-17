$(document).ready(() => {

    $('#adicionar-musica-button').on('click', () => salvarMusica());

    $('#confirmar-datas-relacao-musicas').on('click', () => carregarItensRelacao());
});

initSelect2 = () => $('.musica-relacao-select').select2();

const salvarMusica = () => {

    let musica = {};

    musica.nome = $('#nome-nova-musica').val();
    musica.autor = $('#autor-nova-musica').val();
    musica.pagina = $('#pagina-nova-musica').val();
    musica.edicao = $('#edicao-nova-musica').val();

    if (musica.nome.length > 0 && musica.autor.length > 0 && musica.pagina.length > 0 && musica.pagina.length > 0) {

        $.post(getAppRoot() + 'Musica/AdicionarMusica', musica, (result) => {

            if (result.success) {

                Swal.fire({
                    icon: 'success',
                    title: 'Música adicionada!',
                    text: 'A música foi adicionada com sucesso.'
                }).then(() => {

                    limparCamposNovaMusica();
                });

            } else {

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo deu errado. Tente novamente mais tarde.'
                });
            }
        });

    } else {

        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Insira todas as informações: nome, autor, página e edição'
        });
    }
}

const limparCamposNovaMusica = () => {

    $('#nome-nova-musica').val('');
    $('#autor-nova-musica').val('');
    $('#pagina-nova-musica').val('');
    $('#edicao-nova-musica').val('1');
}

const carregarItensRelacao = () => {

    let de = $('#de-relacao').val();
    let ate = $('#ate-relacao').val();

    if (de.length > 0 && ate.length > 0) {

        $.post(getAppRoot() + 'Musica/CarregarItensRelacao', { deRequest: de, ateRequest: ate }, (itensRelacao) => {

            $('#itens-relacao-musicas').empty();

            $('#itens-relacao-musicas').append(itensRelacao);

            listarMusicas();

            initSelect2();
            initAdicionarMusicaAction();
            initRemoverMusicaAction();
            initSalvarRelacaoMusicalAction();
        });
    }
}

const listarMusicas = () => {

    $.get(getAppRoot() + 'Musica/ListarMusicas', (musicas) => {

        if (musicas != null && musicas.$values.length > 0) {

            $.each(musicas.$values, (index, musica) => {

                let option = new Option(musica.nome + ' (' + musica.autor + ') ' + ' p. ' + musica.pagina + ' [' + musica.edicao + 'º edição]', musica.id, false, false);

                $('.musica-relacao-select').append(option);
            });
        }
    });
}

const adicionarLinhaMusica = (divMusica) => {

    $(divMusica).find('select').select2('destroy');

    cloned = $(divMusica).clone(true, true);

    $(cloned).find('select').val('');
    $(cloned).addClass('mt-3');

    $(cloned).insertAfter(divMusica);

    initSelect2();
}

const removerLinhaMusica = (divMusica) => $(divMusica).remove();

const initAdicionarMusicaAction = () => {

    $('.adicionar-linha-musica').on('click', () => {

        let divMusica = getDivMusica(event.target);

        adicionarLinhaMusica(divMusica);

        handleMovimentosRelacaoMusica(event.target);
    });
}

const initRemoverMusicaAction = () => {

    $('.remover-linha-musica').on('click', () => {

        let divMusica = getDivMusica(event.target);

        removerLinhaMusica(divMusica);

        handleMovimentosRelacaoMusica(event.target);
    });
}

const initSalvarRelacaoMusicalAction = () => $('#adicionar-relacao-button').on('click', () => salvarRelacaoMusical());

const getDivMusica = (target) => $(target).parentsUntil($('div.card-body'), '.musica-relacao-row')[0];

const handleMovimentosRelacaoMusica = (target) => {

    //let cardBody = $(target).parentsUntil('div.card', 'div.card-body');
    //let linhasMusica = $('div.musica-relacao-row', cardBody).length;

    //if (linhasMusica > 1)
    //    $('.remover-linha-musica').attr('disabled', false);
    //else if (linhasMusica == 1)
    //    $('.remover-linha-musica').attr('disabled', true);
}

const salvarRelacaoMusical = () => {

    let request = generateRelacaoMusicalRequestObject();

    if (request != null && request.relacoesMusicais.length > 0) {

        $.post(getAppRoot() + 'Musica/AdicionarRelacaoMusical', request, (result) => {

            if (result.success) {

                Swal.fire({
                    icon: 'success',
                    title: 'Relação adicionada!',
                    text: 'A relação musical foi adicionada com sucesso.'
                }).then(() => {

                    window.location.reload();
                });

            } else {

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo deu errado. Tente novamente mais tarde.'
                });
            }
        });
    }
}

const generateRelacaoMusicalRequestObject = () => {

    let request = {};

    request.de = $('#de-relacao').val();
    request.ate = $('#ate-relacao').val();

    request.relacoesMusicais = [];

    $('.relacao-musical').each((index, relacaoMusicalElement) => {asdasdasdasdsadasdsad

        let musicas = [];

        $('.musica-relacao-row', relacaoMusicalElement).each((index, musicaElement) => {

            let musica = { id: $('.musica-relacao-select', musicaElement).val() };

            musicas.push(musica);
        });

        let relacaoMusical = {
            data: $('.data-relacao-musical', relacaoMusicalElement).text(),
            musicas: musicas
        }

        request.relacoesMusicais.push(relacaoMusical);
    });

    return request;
}