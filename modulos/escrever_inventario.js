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
  const a_total =  a.key.painel+a.key.estoque
  const b_total =  b.key.painel+b.key.estoque

  if ( a_total < b_total ){
    return -1;
  }
  if ( a_total > b_total ){
    return 1;
  }
  return 0;
}


module.exports = (obj, filtro)=>{

  html = fs.readFileSync('./publico/inventario.html', 'utf-8')

  const $ = cheerio.load(html)

  // ###################################################
  let ordem
  switch (filtro.ordenar) {
    case 'crescente':
      ordem = obj.sort(crescente)
      break;
    case 'decrescente':
      ordem = obj.sort(decrescente)
      break;
    case 'saidas':
      ordem = obj.sort(saidas)
      break;
    case 'painel':
      ordem = obj
      break;
    default:

      break;
  }

  let chaves = ''

  ordem.forEach(obj=>{

    let key_number = obj.key.numero
    let key_posição = `${obj.key.linha}${obj.key.coluna}`
    let key_quantidade = obj.key.painel+obj.key.estoque
    let key_painel = obj.key.painel
    let key_estoque = obj.key.estoque
    let key_marca = obj.key.marca
    let key_saidas = obj.key.saidas
    let key_tipo = obj.key.tipo
    let key_tranca_tipo = obj.key.tranca[0]
    let key_tranca_marca = obj.key.tranca[1]

    let key_formato = ''
    if (key_tipo == 'yale' && !key_number.includes('vago') && key_number != '27') {
      key_formato = `<div class="text-center mb-2">
        <img src="../publico/shape/${key_number}.svg" alt="">
      </div>`
    }
    let element = `
    <div class="mb-2 me-2 w-auto card-container">
      <div class="card">
        <div class="card-body" id="k-${key_number}" data-tranca_tipo="${key_tranca_tipo}" data-tranca_marca="${key_tranca_marca}" >
          <div class="text-center mb-2">
            <h2 class="card-title d-inline"><strong>${key_number}</strong></h2>
            <h6 class="d-inline">${key_marca}</h6>
          </div>
          <div class="card-text">
            ${key_formato}
            <p class="mb-0 text-decoration-underline">Tipo: <strong>${key_tipo}</strong></p>
            <p class="mb-0 text-decoration-underline">Posição: <strong>${key_posição}</strong></p>
            <p class="mb-0 text-decoration-underline">Quantidade: <strong>${key_quantidade}</strong></p>
            <p class="mb-0 text-decoration-underline">Painel:<strong>${key_painel}</strong> Estoque:<strong>${key_estoque}</strong></p>
            <p class="mb-0 text-decoration-underline">Saidas: <strong>${key_saidas}</strong></p>
            <p class="mb-0 text-decoration-underline">${key_tranca_tipo} ${key_tranca_marca}</p>
          </div>
        </div>
      </div>
    </div>
`
    chaves += element
  })


  // ###################################################
  // Set selected

  if ($('#ordenar').attr('value') != filtro.ordenar) {
    $('#ordenar').val(filtro.ordenar)
  }

  if ($('#tranca').attr('value') != filtro.tranca) {
    $('#tranca').val(filtro.tranca)
  }

  if ($('#tranca_marca').attr('value') != filtro.tranca_marca) {
    $('#tranca_marca').val(filtro.tranca_marca)
  }
  // ###################################################

  $('#numero_a_filtrar').attr('value', filtro.numero_a_filtrar)
  $('#chaves').replaceWith(`<div id="chaves">${chaves}</div>`)

  // ###################################################
  // Filtrar tranca

  switch (filtro.tranca) {
    case 'cadeado':
      $('.card-body').not('[data-tranca_tipo="cadeado"]').parent().parent().remove()
      // $('[data-tranca_tipo="fechadura"]').parent().parent().remove()
      break;
    case 'fechadura':
      $('.card-body').not('[data-tranca_tipo="fechadura"]').parent().parent().remove()
      // $('[data-tranca_tipo="cadeado"]').parent().parent().remove()
      break;
    default:
      break;
  }

  // ###################################################
  // Filtrar marca da tranca

  switch (filtro.tranca_marca) {
    case 'stam':
      $('.card-body').not('[data-tranca_marca="Stam"]').parent().parent().remove()
      break;
    case 'aliança':
      $('.card-body').not('[data-tranca_marca="Aliança"]').parent().parent().remove()
      break;
    case 'haga':
      $('.card-body').not('[data-tranca_marca="Haga"]').parent().parent().remove()
      break;
    case 'imab':
      $('.card-body').not('[data-tranca_marca="Imab"]').parent().parent().remove()
      break;
    case 'gold':
      $('.card-body').not('[data-tranca_marca="Gold"]').parent().parent().remove()
      break;
    case 'amelco':
      $('.card-body').not('[data-tranca_marca="Amelco"]').parent().parent().remove()
      break;
    case 'hdl':
      $('.card-body').not('[data-tranca_marca="HDL"]').parent().parent().remove()
      break;
    case 'fama':
      $('.card-body').not('[data-tranca_marca="Fama"]').parent().parent().remove()
      break;
    case '3f':
      $('.card-body').not('[data-tranca_marca="3F"]').parent().parent().remove()
      break;
    case 'hela':
      $('.card-body').not('[data-tranca_marca="Hela"]').parent().parent().remove()
      break;
    case 'papaiz':
      $('.card-body').not('[data-tranca_marca="Papaiz"]').parent().parent().remove()
      break;
    case 'pado':
      $('.card-body').not('[data-tranca_marca="Pado"]').parent().parent().remove()
      break;
    case 'soprano':
      $('.card-body').not('[data-tranca_marca="Soprano"]').parent().parent().remove()
      break;
    case 'arouca':
      $('.card-body').not('[data-tranca_marca="Arouca"]').parent().parent().remove()
      break;
    case 'la fonte':
      $('.card-body').not('[data-tranca_marca="La Fonte"]').parent().parent().remove()
      break;
    case 'mgm':
      $('.card-body').not('[data-tranca_marca="MGM"]').parent().parent().remove()
      break;
    case 'pacri':
      $('.card-body').not('[data-tranca_marca="Pacri"]').parent().parent().remove()
      break;
    case 'brasil':
      $('.card-body').not('[data-tranca_marca="Brasil"]').parent().parent().remove()
      break;
    case 'kwikset':
      $('.card-body').not('[data-tranca_marca="kwikset"]').parent().parent().remove()
      break;
    case 'lockwell':
      $('.card-body').not('[data-tranca_marca="Lockwell"]').parent().parent().remove()
      break;
    case 'globe':
      $('.card-body').not('[data-tranca_marca="Globe"]').parent().parent().remove()
      break;
    default:
      break;
  }
  fs.writeFileSync('./publico/inventario.html', $.html())

  exec(`python3 ./modulos/formatar_html.py`, (error, stdout, stderr) => {
      console.log(stdout);
      fs.writeFileSync('./publico/inventario.html', stdout)
    });

}