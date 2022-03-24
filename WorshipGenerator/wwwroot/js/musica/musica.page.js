const EAcao = {
    CRIAR: 1,
    EDITAR: 2
}

const gerenciamento = {
    acao: EAcao.CRIAR
}

var musicas = [];

$(document).ready(() => {

    listarMusicas();

    $('#adicionar-editar-musica-button').on('click', () => {

        if (gerenciamento.acao == EAcao.CRIAR)
            salvarMusica();
        else
            editarMusica();
    });

    $('#adicionar-musica-button').on('click', () => abrirGerenciarMusicaModal('', EAcao.CRIAR));

    $('.editar-musica-button').on('click', () => {

        const id = getMusicaIdFromTable();

        abrirGerenciarMusicaModal(id, EAcao.EDITAR);
    });
    $('.remover-musica-button').on('click', () => removerMusica(event.target));

    $('#confirmar-datas-relacao-musicas').on('click', () => carregarItensRelacao());
});

initSelect2 = () => $('.musica-relacao-select').select2();

const salvarMusica = () => {

    let musica = gerarMusicaRequestObject();

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

const editarMusica = () => {

    let musica = gerarMusicaRequestObject();

    if (musica.nome.length > 0 && musica.autor.length > 0 && musica.pagina.length > 0 && musica.pagina.length > 0) {

        $.post(getAppRoot() + 'Musica/EditarMusica', musica, (result) => {

            if (result.success) {

                Swal.fire({
                    icon: 'success',
                    title: 'Música atualizada!',
                    text: 'A música foi atualizada com sucesso.'
                }).then(() => {

                    limparCamposNovaMusica();
                    $('#adicionar-musica-modal').modal('toggle');
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

const gerarMusicaRequestObject = () => {

    let request = {};

    request.id = $('#id-musica').val();
    request.nome = $('#nome-musica').val();
    request.autor = $('#autor-musica').val();
    request.pagina = $('#pagina-musica').val();
    request.edicao = $('#edicao-musica').val();

    return request;
}

const removerMusica = (target) => {

    const id = getMusicaIdFromTable();

    if (id.length > 0) {

        $.post(getAppRoot() + 'Musica/RemoverMusica', { id: id }, (response) => {

            if (response != null && response.success) {

                Swal.fire({
                    icon: 'success',
                    title: 'Música removida!',
                    text: 'A música foi removida com sucesso.'
                }).then(() => {


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

const getMusicaIdFromTable = () => $(event.target).parentsUntil($('tbody'), 'tr').find('td.musica-id').text();

const limparCamposNovaMusica = () => {

    $('#id-musica').val('');
    $('#nome-musica').val('');
    $('#autor-musica').val('');
    $('#pagina-musica').val('');
    $('#edicao-musica').val('1');
}

const carregarItensRelacao = () => {

    let de = $('#de-relacao').val();
    let ate = $('#ate-relacao').val();

    if (de.length > 0 && ate.length > 0) {

        $.post(getAppRoot() + 'Musica/CarregarItensRelacao', { deRequest: de, ateRequest: ate }, (itensRelacao) => {

            $('#itens-relacao-musicas').empty();

            $('#itens-relacao-musicas').append(itensRelacao);

            listarMusicasDropdown();

            initSelect2();
            initAdicionarMusicaAction();
            initRemoverMusicaAction();
            initSalvarRelacaoMusicalAction();
        });
    }
}

const listarMusicasDropdown = () => {

    $.get(getAppRoot() + 'Musica/ListarMusicas', (musicas) => {

        if (musicas != null && musicas.$values.length > 0) {

            $.each(musicas.$values, (index, musica) => {

                let option = new Option(musica.nome + ' (' + musica.autor + ') ' + ' p. ' + musica.pagina + ' [' + musica.edicao + 'º edição]', musica.id, false, false);

                $('.musica-relacao-select').append(option);
            });
        }
    });
}

const listarMusicas = () => {

    $.get(getAppRoot() + 'Musica/ListarMusicas', (response) => {
        musicas = response.$values;
    });
}

const abrirGerenciarMusicaModal = (id, acao) => {

    gerenciamento.acao = acao;

    if (gerenciamento.acao == EAcao.CRIAR)
        $('#gerenciar-musica-modal-title').text('Criar Música');
    else {

        $('#gerenciar-musica-modal-title').text('Editar Música');

        let musica = musicas.filter(i => i.id == id)[0];

        $('#id-musica').val(id);
        $('#nome-musica').val(musica.nome);
        $('#autor-musica').val(musica.autor);
        $('#pagina-musica').val(musica.pagina);
        $('#edicao-musica').val(musica.edicao);
    }

    $('#adicionar-musica-modal').modal('toggle');
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

    $('.relacao-musical').each((index, relacaoMusicalElement) => {

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

//const listarRelacoesMusicais = () => {

    
//}