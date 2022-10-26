const socket = io();

// serviços.addEventListener('click', ()=>{

// })

// popup_localizar_chave.addEventListener('click', ()=>{
// 	localização_da_chave.innerHTML = ''
// })

// numero_da_chave.addEventListener('keyup', (event)=>{
// 	if (event.keyCode == 13) {
// 		localizar_chave.click()
// 	} 
// })

const locate = ()=>{
	let to_search = numero_da_chave.value
	let key_number = to_search

	numero_da_chave.value = ''
	socket.emit('key number', to_search)
	socket.once('key number return', (key_founded)=>{
		console.log(key_founded)
		if (key_founded) {
  		let linha = key_founded.linha
  		let coluna = key_founded.coluna
  		let painel = key_founded.painel
  		let estoque = key_founded.estoque
  		let marca = key_founded.marca

  		if (painel == 0) {
  			localização_da_chave.innerHTML = `<p><label>A chave ${key_number} não está no painel</label></p>`
  			if (estoque == 0) {
	  			localização_da_chave.innerHTML = `<p><label>Não há chaves ${key_number} no estoque</label></p>`
  			}	else {
  			localização_da_chave.innerHTML += `<p><label>Quantidade de chaves no estoque: ${estoque}</label></p>`
  			localização_da_chave.innerHTML += `<p><label>Marca da chave: ${marca}</label></p>`
  			}
  		} else {
  			localização_da_chave.innerHTML = `<p>A chave ${key_number} está na posição: <label>${linha}${coluna}</label></p>`
  			localização_da_chave.innerHTML += `<p>Quantidade de chaves no painel: ${painel}</p>`
  			localização_da_chave.innerHTML += `<p>Quantidade de chaves no estoque: ${estoque}</p>`
  			localização_da_chave.innerHTML += `<p>Marca: ${marca}</p>`

  		}
		} else {
			localização_da_chave.innerHTML = `<label>Chave ${key_number} não encontrada</label>`
		}
	})
}
