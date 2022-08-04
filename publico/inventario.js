const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
const socket = io();

chaves.addEventListener('click', event=>{
  event.path.forEach(i=>{
   try {
    if (i.id.includes('k-')) {
	    card_number = i.id.slice(2)
		  background.style.display = 'block'
		  container.style.display = 'block'
		  filtro.style.display = 'none'
		  chaves.style.display = 'none'
		  card_title.innerText = card_number
    }
   } catch (error) {
   }
  })
})
background.addEventListener('click', ()=>{
  background.style.display = 'none'
  container.style.display = 'none'
  filtro.style.display = ''
  chaves.style.display = ''
})

// chaves.addEventListener('click', event=>{
//   event.path.forEach(i=>{
//    try {
//     if (i.id.includes('k-')) {
// 	    console.log(i.id.slice(2))

// 	    // document.createElement()
// 			// <input type="button" class="btn btn-primary mt-4 w-auto" id="serviços" data-bs-toggle="modal" data-bs-target="#services" value="Serviços">

//     }
//     }
//    } catch (error) {
//    }
//   })
//    } catch (error) {
//    }
//   })
// })

function decrescente( a, b ) {
	const a_total =  Object.values(a)[0].painel+Object.values(a)[0].estoque
	const b_total =  Object.values(b)[0].painel+Object.values(b)[0].estoque

  if ( a_total > b_total ){
    return -1;
  }
  if ( a_total < b_total ){
    return 1;
  }
  return 0;
}

function saidas( a, b ) {
	const a_total =  Object.values(a)[0].saidas
	const b_total =  Object.values(b)[0].saidas

  if ( a_total > b_total ){
    return -1;
  }
  if ( a_total < b_total ){
    return 1;
  }
  return 0;
}

function crescente( a, b ) {
	const a_total =  Object.values(a)[0].painel+Object.values(a)[0].estoque
	const b_total =  Object.values(b)[0].painel+Object.values(b)[0].estoque

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
			// console.log(Object.keys(obj)[0])
			// console.log(Object.values(obj)[0])
			key_number = Object.keys(obj)[0]
			key_posição = `${Object.values(obj)[0].linha}${Object.values(obj)[0].coluna}`
			// key_linha = Object.values(obj)[0].linha
			// key_coluna = Object.values(obj)[0].coluna
			key_quantidade = Object.values(obj)[0].painel+Object.values(obj)[0].estoque
			key_painel = Object.values(obj)[0].painel
			key_estoque = Object.values(obj)[0].estoque
			key_marca = Object.values(obj)[0].marca
			key_saidas = Object.values(obj)[0].saidas
			let element = `
			<div class="mb-2 me-2 d-inline-block w-auto">
			  <div class="card">
			    <div class="card-body" id="k-${key_number}">
			    	<div class="text-center mb-2">
			        <h2 class="card-title d-inline"><strong>${key_number}</strong></h2>
			        <h6 class="d-inline">${key_marca}</h6>
			    	</div>
			      <div class="card-text">
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