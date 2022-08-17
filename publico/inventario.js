const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
const socket = io();

stop_loading();


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
            console.log(key.key.numero)
            input_numero.value = key.key.numero
            input_quantidade_painel.value = key.key.painel
            input_quantidade_estoque.value = key.key.estoque
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

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// }

const filtrar_numero = ()=>{
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

filtrar_numero()
// numero_a_filtrar.addEventListener('input', filtrar_numero)

