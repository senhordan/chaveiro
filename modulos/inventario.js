const fs = require('fs')

const file = fs.readFileSync('../publico/inventario.html', 'utf-8')

console.log(file.split('main')[2])

