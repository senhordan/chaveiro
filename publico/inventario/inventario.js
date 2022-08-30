// -------------------------SETUP-------------------------

const socket = io();

const $ = (selector)=>{
    const elements = document.querySelectorAll(selector)
    if (elements.length == 1) {
        return elements[0]
    } else {
        return elements
    }
}

window.scrollTo(0,0)

stop_loading();

numero_a_filtrar.focus()

let ordem_status = 'painel'

// -------------------------Functions-------------------------

const fechar_popup = ()=>{
  background.style.display = 'none'
  container.style.display = 'none'
  document.querySelector(`#k-${card_title.innerText}`).scrollIntoView();
}

const toggle_image = (div)=>{
  element_img = div.querySelector('[id^="key-"]')
  const display = element_img.style.display
  if (display == 'block') {
    element_img.style.display = 'none'
  } else {
    element_img.style.display = 'block'
  }

}

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
  if (numero_a_filtrar.value == 'update*') {
    console.log('update')
    numero_a_filtrar.value = ''
    socket.emit('update-chaves-html', $('#chaves').innerHTML)
    socket.once('reload', ()=>{location.reload(true);})
  }
}
// -------------------------Listeners-------------------------

$('#ordem').addEventListener('change', ()=>{
  ordem_status = ordem.value
})

$('[name="formato"]:not([value="todos"])').forEach(element=>{element.addEventListener('click', ()=>{ordem.value = 'formatos'})})

$('[name="formato"]:not([value="a"]):not([value="b"]):not([value="c"])').forEach(element=>{element.addEventListener('click', ()=>{ordem.value = ordem_status})})

window.onclick = event=>{
  if (event.target == background) {
    fechar_popup()
  }
}

fechar_popup2.addEventListener('click', fechar_popup)

resetar_filtro.addEventListener('click', ()=>{
  altura.value = ''
  comprimento.value = ''
  altura_exato.checked = false
  comprimento_exato.checked = false
  numero_a_filtrar.value = ''
  ordem.value = 'painel'
  tranca.value = 'todas'
  tranca_marca.value = 'todas'
  document.querySelector('[name="formato"][value="todos"]').checked = true
  filtrar.click()
})

numero_a_filtrar.addEventListener('input', filtrar_numero)

filtrar_numero()
// -------------------------SORT FUNCTIONS-------------------------

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

// -------------------------FILTRAR-------------------------

filtrar.onclick = ()=>{
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

      let key_images = '';

      if (key_tipo == 'yale' && !key_number.includes('vago') && key_number != '27') {
        key_images = `<div class="text-center mb-2 image-container" onclick="toggle_image(this)">
          <img src="../publico/shape/${key_number}.svg" alt="" id="shape-${key_number}">
          <img src="../publico/keys/${key_number}.svg" alt="" id="key-${key_number}">
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
              ${key_images}
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
      };
    });

  [altura, comprimento]
    .forEach((element, i)=>{
      if (element.value != '') {
        const tamanho_da_chave = Number(element.value)
        const menor_tamanho = (tamanho_da_chave - 0.05).toFixed(2)
        const maior_tamanho = (tamanho_da_chave + 0.05).toFixed(2)
        const t = ['altura', 'comprimento'][i]

        if ($(`#${t}_exato`).checked) {
          $('.card-body').forEach(card_body=>{
            card_tamanho = Number(card_body.dataset[t]);
            if (card_tamanho < menor_tamanho || card_tamanho > maior_tamanho) {
              card_body.closest('.card-container').remove();
            };
          });
        } else {
          $('.card-body').forEach(card_body=>{
            card_tamanho = Number(card_body.dataset[t]);
            if (card_tamanho < menor_tamanho) {
              card_body.closest('.card-container').remove();
            };
          });
        };

      };
    });

  filtrar_numero()

  })

}

