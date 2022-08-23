const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
const socket = io();

stop_loading();

numero_a_filtrar.focus()

chaves.addEventListener('dblclick', event=>{
  event.path.forEach(i=>{
   try {
    if (i.id.includes('k-')) {
      card_number = i.id.slice(2)
      background.style.display = 'block'
      container.style.display = 'block'
      card_title.innerText = card_number

      socket.emit('keys')
      socket.once('keys return', (obj)=>{
        obj.forEach(key=>{
          if (key.key.numero == card_number) {
            input_numero.value = key.key.numero
            input_quantidade_painel.value = key.key.painel
            input_quantidade_estoque.value = key.key.estoque
            console.log(key.key.altura)
            input_altura.value = key.key.altura
            input_comprimento.value = key.key.comprimento
          }
        })
      })
    }
   } catch (error) {
   }
  })
})

const fechar_popup = ()=>{
  background.style.display = 'none'
  container.style.display = 'none'
  document.querySelector(`#k-${card_title.innerText}`).scrollIntoView();
}

window.onclick = event=>{
  if (event.target == background) {
    fechar_popup()
  }
}
fechar_popup2.addEventListener('click', fechar_popup)

resetar_filtro.addEventListener('click', ()=>{
  altura.value = ''
  comprimento.value = ''
  numero_a_filtrar.value = ''
  ordem.value = 'painel'
  tranca.value = 'todas'
  tranca_marca.value = 'todas'
  document.querySelector('[name="formato"][value="todos"]').checked = true
  filtrar.click()
})

const filtrar_numero = ()=>{
  if (numero_a_filtrar.value.includes('-')) {
    numero_a_filtrar.value = ''
  }
  document.querySelectorAll('.card-container').forEach(element=>{
    card_body = element.querySelector('.card-body')
    if (card_body.id.includes(numero_a_filtrar.value)) {
      element.style.display = ''
    } else {
      element.style.display = 'none'
    }
  })

}

numero_a_filtrar.addEventListener('input', filtrar_numero)

// filtrar_numero()

// -------------------------------------------------------------
const $ = (selector)=>{
    const elements = document.querySelectorAll(selector)
    if (elements.length == 1) {
        return elements[0]
    } else {
        return elements
    }
}

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

// -------------------------------------------------------------

const filtrar = ()=>{
  socket.emit('keys')
  socket.once('keys return', (json)=>{

    let nova_ordem;
    switch (ordem.value) {
      case 'crescente':
        nova_ordem = json.sort(crescente);
        break;
      case 'decrescente':
        nova_ordem = json.sort(decrescente);
        break;
      case 'saidas':
        nova_ordem = json.sort(saidas);
        break;
      case 'formatos':
        nova_ordem = json.sort(formatos);
        break;
      case 'painel':
        nova_ordem = json;
        break;
      default:
        break;
    };

    let element = '';
    nova_ordem.forEach(obj=>{

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
      element += `
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
    });

  chaves.innerHTML = element;

  ['cadeado', 'fechadura']
    .forEach(i=>{
      if (i == tranca.value) {
        $(`.card-body:not([data-tranca_tipo="${i}"])`).forEach(card_body=>{
          card_body.closest('.card-container').remove();
        });
      }
    });

  ['Stam', 'Aliança', 'Haga', 'Imab', 'Gold', 'Amelco', 'HDL', 'Fama', '3F', 'Hela', 'Papaiz', 'Pado', 'Soprano', 'Arouca', 'La Fonte', 'MGM', 'Pacri', 'Brasil', 'kwikset', 'Lockwell', 'Globe']
    .forEach(i=>{
      if (i.toLowerCase() == tranca_marca.value) {
        $(`.card-body:not([data-tranca_marca="${i}"])`).forEach(card_body=>{
          card_body.closest('.card-container').remove();
        });
      };
    });

  ['a', 'b', 'c', 'outros']
    .forEach(i=>{
      let formato = $('[name="formato"]:checked').value
      if (i == formato) {
        $(`.card-body:not([data-formato^="${i}"])`).forEach(card_body=>{
          card_body.closest('.card-container').remove();
        });
      }
    });

  if (altura.value != '') {
    console.log(altura.value)

  }

  if (comprimento.value != '') {
    console.log(comprimento.value)

  }


  // $('#altura').val(filtro.altura)
  // if (filtro.altura != '') {
  //   console.log(filtro.altura)
  //   $('.card-body').not((i, element)=>{
  //     const altura = Number($(element).data('altura'))
  //     filtro.altura = Number(filtro.altura)
  //     if (altura >= filtro.altura && altura <= filtro.altura + 0.3) {
  //       return $(element).data('altura')
  //     }
  //   }).parent().parent().remove()
  // }

  // $('#comprimento').val(filtro.comprimento)
  // if (filtro.comprimento != '') {
  //   console.log(filtro.comprimento)
  //   $('.card-body').not((i, element)=>{
  //     const comprimento = Number($(element).data('comprimento'))
  //     filtro.comprimento = Number(filtro.comprimento)
  //     if (comprimento >= filtro.comprimento) {
  //       return $(element).data('comprimento')
  //     }
  //   }).parent().parent().remove()
  // }

  })

}

