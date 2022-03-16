$(document).ready(() => {

    init();

    initTooltip();

    initAdicionarAction();
    initRemoverAction();

    $('.mover-cima-momento').on('click', () => {

        let divMomento = getDivMomento(event.target);

        mover(divMomento, EMovimentoDirecao.CIMA);
    });

    $('.mover-baixo-momento').on('click', () => {

        let divMomento = getDivMomento(event.target);

        mover(divMomento, EMovimentoDirecao.BAIXO);
    });

    $('#gerar-programacao-button').on('click', () => salvarProgramacao());
    $('#gerar-pdf').on('click', () => gerarPDF());

    $('#duplicar').on('click', () => {

        let mainSection = $('.programacao-section')[0];

        clonedSection = $(mainSection).clone(true, true);

        $(clonedSection).insertAfter($('.programacao-section')[0]);
    });
});

const init = () => { }

const initTooltip = () => $('[data-toggle="tooltip"]').tooltip();

const getDivMomento = (target) => $(target).parentsUntil($('fieldset.momento'), '.linha-momento')[0];

const initAdicionarAction = () => {

    $('.adicionar-momento').on('click', () => {

        let divMomento = getDivMomento(event.target);

        adicionarMomento(divMomento);
    });
}

const initRemoverAction = () => {

    $('.remover-momento').on('click', () => {

        let divMomento = getDivMomento(event.target);

        removerMomento(divMomento);
    });
}

const adicionarMomento = (divMomento) => {

    $('[data-toggle="tooltip"]').tooltip('dispose');

    cloned = $(divMomento).clone(true, true);

    $(cloned).find('input').val('');

    $(cloned).insertAfter(divMomento);

    initTooltip();

    handleMovimentos();
}

const removerMomento = (divMomento) => {

    $('[data-toggle="tooltip"]').tooltip('dispose');

    $(divMomento).remove();

    initTooltip();

    handleMovimentos();
}

const mover = (divMomento, direcao) => {

    let index = $('.linha-momento').toArray().indexOf(divMomento);

    if (index > -1) {

        $('[data-toggle="tooltip"]').tooltip('dispose');

        if (direcao == EMovimentoDirecao.CIMA) {

            let linhaAnterior = $('.linha-momento')[index - 1]

            $(divMomento).insertBefore(linhaAnterior);

        } else {

            let linhaPosterior = $('.linha-momento')[index + 1]

            $(divMomento).insertAfter(linhaPosterior);
        }

        initTooltip();

        handleMovimentos();
    }
}

const handleMovimentos = () => {

    if ($('.linha-momento').length > 1) {

        $('.remover-momento').attr('disabled', false);
        $('.mover-cima-momento').attr('disabled', false);
        $('.mover-baixo-momento').attr('disabled', false);

        let primeiro = $('.linha-momento')[0];
        let ultimo = $('.linha-momento')[$('.linha-momento').length - 1];

        $(primeiro).find('.mover-cima-momento').attr('disabled', true);
        $(ultimo).find('.mover-baixo-momento').attr('disabled', true);

    } else if ($('.linha-momento').length == 1) {

        $('.remover-momento').attr('disabled', true);
        $('.mover-cima-momento').attr('disabled', true);
        $('.mover-baixo-momento').attr('disabled', true);
    }
}

const EMovimentoDirecao = {
    CIMA: 1,
    BAIXO: 2
}

const salvarProgramacao = () => {

    let programacao = gerarProgramacaoObject();

    if (programacao != null) {

        $.post(getAppRoot() + 'Programacao/SalvarProgramacao', programacao, (result) => {

            if (result != null && result.key != null && result.key.length > 0)
                redirecionar(result.key);
            else
                alert('Ocorreu um erro. Tente novamente mais tarde ou contate o desenvolvedor');
        });
    }
}

const gerarProgramacaoObject = () => {

    let request = null;

    if ($('.linha-momento').length > 0) {

        request = {};

        request.momentos = [];

        $('.linha-momento').each((index, element) => {

            let momento = {
                nome: $(element).find('.nome-momento').val(),
                responsavel: $(element).find('.responsavel-momento').val()
            }

            request.momentos.push(momento);
        });

        request.local = $('.local-programacao').val();
        request.data = $('.data-programacao').val();
        request.hora = $('.hora-programacao').val();
    }

    return request;
}

const redirecionar = (key) => window.location = getAppRoot() + 'Programacao/Detalhes/' + key;

const gerarPDF = () => {

    let path = window.location.pathname.split('/');

    let id = path[path.length - 1];

    window.location = getAppRoot() + 'Programacao/GerarPDF?id=' + id + '&url=' + window.location.href;
}