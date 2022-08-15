const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
const socket = io();

chaves.addEventListener('dblclick', event=>{
  event.path.forEach(i=>{
   try {
    if (i.id.includes('k-')) {
	    card_number = i.id.slice(2)
		  background.style.display = 'block'
		  container.style.display = 'block'
		  filtro.style.display = 'none'
		  chaves.style.display = 'none'
		  card_title.innerText = card_number

			socket.emit('keys')
		  socket.once('keys return', (obj)=>{
		  	obj.forEach(key=>{
		  		if (key.key.numero == card_number) {
		  			console.log(key.key.numero)
		  			input_numero.value = key.key.numero
		  			input_quantidade_painel.value = key.key.painel
		  			input_quantidade_estoque.value = key.key.estoque
						input_similares.value = key.key.similares.toString()
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
  filtro.style.display = ''
  chaves.style.display = ''
  document.querySelector(`#k-${card_title.innerText}`).scrollIntoView();

}

background.addEventListener('click', fechar_popup)
fechar_popup2.addEventListener('click', fechar_popup)




numero_a_filtrar.addEventListener('input', ()=>{
	
	document.querySelectorAll('.card_div').forEach(element=>{
		card_body = element.querySelector('.card-body')

		if (card_body.id.includes(numero_a_filtrar.value)) {
			element.style.display = 'inline-block'
		} else {
			element.style.display = 'none'
		}
	})

})
const filtrar_tranca = ()=>{
	console.log(tranca.value)
	document.querySelectorAll('.card_div').forEach(element=>{
		card_body = element.querySelector('.card-body')
		if (tranca.value == 'todas') {
			element.style.display = 'inline-block'
		} else {
			if (card_body.dataset.tranca_tipo == '' || card_body.dataset.tranca_tipo == tranca.value) {
				console.log(card_body.dataset.tranca_tipo)
				element.style.display = 'inline-block'
			} else {
				element.style.display = 'none'
			}
		}
	})

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

const ordenar_chaves = ()=>{
  socket.emit('keys')
  socket.once('keys return', (obj)=>{
  	let ordem
  	switch (ordenar.value) {
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
  			// statements_def
  			break;
  	}
  	chaves.innerHTML = ''
		ordem.forEach(obj=>{
			console.log()
			// console.log(Object.keys(obj)[0])
			// console.log(Object.values(obj)[0])
			key_number = obj.key.numero
			key_posição = `${obj.key.linha}${obj.key.coluna}`
			// key_linha = obj.key.linha
			// key_coluna = obj.key.coluna
			key_quantidade = obj.key.painel+obj.key.estoque
			key_painel = obj.key.painel
			key_estoque = obj.key.estoque
			key_marca = obj.key.marca
			key_saidas = obj.key.saidas
			key_tipo = obj.key.tipo
			key_tranca_tipo = obj.key.tranca[0]
			key_tranca_marca = obj.key.tranca[1]
			key_similares = obj.key.similares.toString()
			if (key_tipo == 'yale') {

				key_formato = `<div class="text-center mb-2">
	      	<img src="../publico/shape/${key_number}.svg" alt="">
	    	</div>`
			}
			let element = `
			<div class="mb-2 me-2 w-auto card_div">
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
			      </div>
			    </div>
			  </div>
			</div>
`
			chaves.innerHTML += element
		})

	})
}	  