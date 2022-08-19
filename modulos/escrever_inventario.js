const fs = require('fs')
const cheerio = require('cheerio')
const { exec } = require("child_process");

const decrescente = ( a, b )=>{
  const a_total =  a.key.painel+a.key.estoque
  const b_total =  b.key.painel+b.key.estoque

  if ( a_total > b_total ){
    return -1;
  }
  if ( a_total < b_total ){
    return 1;
  }
  return 0;
}

const saidas = ( a, b )=>{
  const a_total =  a.key.saidas
  const b_total =  b.key.saidas

  if ( a_total > b_total ){
    return -1;
  }
  if ( a_total < b_total ){
    return 1;
  }
  return 0;
}

const crescente = ( a, b )=>{
  const a_total =  a.key.painel+a.key.estoque;
  const b_total =  b.key.painel+b.key.estoque;

  if ( a_total < b_total ){
    return -1;
  }
  if ( a_total > b_total ){
    return 1;
  }
  return 0;
}

const formatos = ( a, b )=>{

  if ( a.key.formato < b.key.formato ){
    return -1;
  }
  if ( a.key.formato > b.key.formato ){
    return 1;
  }
  return 0;
}

module.exports = (json, filtro)=>{

  html = fs.readFileSync('./publico/inventario.html', 'utf-8');

  const $ = cheerio.load(html);

  // ###################################################
  $('#ordem').val(filtro.ordem);

  let ordem;
  switch (filtro.ordem) {
    case 'crescente':
      ordem = json.sort(crescente);
      break;
    case 'decrescente':
      ordem = json.sort(decrescente);
      break;
    case 'saidas':
      ordem = json.sort(saidas);
      break;
    case 'formatos':
      ordem = json.sort(formatos);
      break;
    case 'painel':
      ordem = json;
      break;
    default:
      break;
  };

  let chaves = '';
  ordem.forEach(obj=>{

    let key_number = obj.key.numero;
    let key_posição = `${obj.key.linha}${obj.key.coluna}`;
    let key_quantidade = obj.key.painel+obj.key.estoque;
    let key_painel = obj.key.painel;
    let key_estoque = obj.key.estoque;
    let key_marca = obj.key.marca;
    let key_saidas = obj.key.saidas;
    let key_tipo = obj.key.tipo;
    let key_tranca_tipo = obj.key.tranca[0];
    let key_tranca_marca = obj.key.tranca[1];
    let key_formato = obj.key.formato;
    let key_altura = obj.key.altura;
    let key_comprimento = obj.key.comprimento;

    let key_icon = '';

    if (key_tipo == 'yale' && !key_number.includes('vago') && key_number != '27') {
      key_icon = `<div class="text-center mb-2">
        <img src="../publico/shape/${key_number}.svg" alt="">
      </div>`
    };
    let element = `
    <div class="mb-2 me-2 w-auto card-container">
      <div class="card">
        <div class="card-body" id="k-${key_number}" data-tranca_tipo="${key_tranca_tipo}" data-tranca_marca="${key_tranca_marca}" data-altura=${key_altura} data-comprimento="${key_comprimento}" data-formato="${key_formato}">
          <div class="text-center mb-2">
            <h2 class="card-title d-inline"><strong>${key_number}</strong></h2>
            <h6 class="d-inline">${key_marca}</h6>
          </div>
          <div class="card-text">
            ${key_icon}
            <p class="mb-0 card-line tipo">Tipo: <strong>${key_tipo}</strong></p>
            <p class="mb-0 card-line posição">Posição: <strong>${key_posição}</strong></p>
            <p class="mb-0 card-line quantidade">Quantidade: <strong>${key_quantidade}</strong></p>
            <p class="mb-0 card-line painel">Painel:<strong>${key_painel}</strong> Estoque:<strong>${key_estoque}</strong></p>
            <p class="mb-0 card-line saidas">Saidas: <strong>${key_saidas}</strong></p>
            <p class="mb-0 card-line tranca">${key_tranca_tipo} ${key_tranca_marca}</p>
            <p class="mb-0 card-line altura">Altura: <strong>${key_altura}</strong></p>
            <p class="mb-0 card-line comprimento">Comprimento: <strong>${key_comprimento}</strong></p>
          </div>
        </div>
      </div>
    </div>
`;
    chaves += element;
  });

$('#chaves').replaceWith(`<div id="chaves">${chaves}</div>`);

  $('#tranca').val(filtro.tranca);
  // ###################################################
  // Filtrar tranca
  ['cadeado', 'fechadura']
    .forEach(tranca=>{
      if (tranca == filtro.tranca) {
        $('.card-body').not(`[data-tranca_tipo="${tranca}"]`).parent().parent().remove();
      };
    });

  $('#tranca_marca').val(filtro.tranca_marca);
  // ###################################################
  // Filtrar marca da tranca
  ['Stam', 'Aliança', 'Haga', 'Imab', 'Gold', 'Amelco', 'HDL', 'Fama', '3F', 'Hela', 'Papaiz', 'Pado', 'Soprano', 'Arouca', 'La Fonte', 'MGM', 'Pacri', 'Brasil', 'kwikset', 'Lockwell', 'Globe']
    .forEach(marca=>{
    if (marca.toLowerCase() == filtro.tranca_marca) {
      $('.card-body').not(`[data-tranca_marca="${marca}"]`).parent().parent().remove();
    };
  });

  $('[name="formato"][checked=""]').removeAttr('checked');
  $(`[name="formato"][value="${filtro.formato}"]`).attr('checked', '');
  // ###################################################
  // Filtrar formato
  ['a', 'b', 'c', 'outros']
    .forEach(formato=>{
    if (formato == filtro.formato) {
      $('.card-body').not(`[data-formato^="${formato}"]`).parent().parent().remove();
    };
  });
// filtro.altura = filtro.altura.replace(',', '.')

  $('#altura').val(filtro.altura)
  if (filtro.altura != '') {
    console.log(filtro.altura)
    $('.card-body').not((i, element)=>{
      const altura = Number($(element).data('altura'))
      filtro.altura = Number(filtro.altura)
      if (altura >= filtro.altura && altura <= filtro.altura + 0.3) {
        return $(element).data('altura')
      }
    }).parent().parent().remove()
  }

  $('#comprimento').val(filtro.comprimento)
  if (filtro.comprimento != '') {
    console.log(filtro.comprimento)
    $('.card-body').not((i, element)=>{
      const comprimento = Number($(element).data('comprimento'))
      filtro.comprimento = Number(filtro.comprimento)
      if (comprimento >= filtro.comprimento) {
        return $(element).data('comprimento')
      }
    }).parent().parent().remove()
  }

  $('#numero_a_filtrar').attr('value', filtro.numero_a_filtrar);


  fs.writeFileSync('./publico/inventario.html', $.html());

  exec(`python3 ./modulos/formatar_html.py`, (error, stdout, stderr) => {
      // console.log(stdout);
      fs.writeFileSync('./publico/inventario.html', stdout);
    });

}