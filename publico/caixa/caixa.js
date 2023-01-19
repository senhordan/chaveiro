const socket = io();

const toTitleCase = (string)=>{
  const array = []
  const splitted_string = string.split(' ')
  splitted_string.forEach(word=>{
    const first_letter = word[0].toUpperCase()
    const other_letters = word.slice(1)
    array.push(`${first_letter}${other_letters}`)
  })
  return array.join(' ')
}

const caixa = document.querySelector('#caixa')
socket.emit('caixa')
socket.on('caixa return', caixa_json=>{
  // console.log(caixa_json)
  caixa_json.forEach(entrada=>{
    const tipo = Object.entries(entrada)[0]
    caixa.innerHTML += [
      `<div class="card mt-3">`,
        `<div class="card-body">`,
          `<div class="card-text">`,
            `<p class="p-0 m-0">${toTitleCase(tipo[0])}: ${tipo[1]}</p>`,
            `<p class="p-0 m-0">Preço: R$${entrada.preço}</p>`,
            `<p class="p-0 m-0">Data: ${entrada.data}</p>`,
          `</div>`,
        `</div>`,
      `</div>`,
    ].join('')
  })
})