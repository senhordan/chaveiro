const express = require('express')
const session = require('express-session')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
const path = require('path')
let ip = require('ip').address()
const fs = require('fs')
// const puppeteer = require('puppeteer-core');

usuario = 'admin'
senha = '1sda51d1zxc31z5'

app.use(session({
  secret: 'djasndzxczxnjadkudasudnzlcmk',
  resave: true,
  saveUninitialized: true,
}))

app.use(bodyParser.urlencoded({extended: true}))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use('/publico', express.static(path.join(__dirname, 'publico')))

app.set('views', path.join(__dirname, 'publico'))

const read_backups = ()=>{
  const estoque = fs.readdirSync('./estoque/backups')
  return estoque.length
}

const read_file = ()=>{
  let file = fs.readFileSync('./estoque/estoque.json', 'utf-8')
  let keys = JSON.parse(file)
  return keys
}

const editar_html = require('./modulos/escrever_inventario.js')

const create_backup = (arg)=>{
  const backups = read_backups()
  let file_name = 'bkp'
  if (arg) {file_name = arg}
  fs.copyFile('./estoque/estoque.json', `./estoque/backups/${backups+1}_${arg}_estoque.json`, ()=>{})
};

app.get('/', (req, res)=>{
  if (req.session.usuario == usuario && req.session.senha == senha) {

    io.on('connection', (socket) => {
      // console.log(`usuario ${socket.id}`);
      let keys = read_file()

      socket.on('key number', (key_number)=>{
        let key_founded
        keys.forEach(i=>{
          if (key_number == i.key.numero) {
            key_founded = i.key

          }
        })

        socket.emit('key number return', key_founded)
      })
    });

    res.render('index')
  } else {
    res.redirect('/login')
  }
})

app.get('/login', (req, res)=>{
  if (req.session.usuario == usuario && req.session.senha == senha) {
    res.redirect('/index')
  } else {
    res.render('login')
    // res.render('index')
  }
})

app.post('/login', (req, res)=>{
  if (req.body.usuario == usuario && req.body.senha == senha) {
    
    req.session.usuario = usuario
    req.session.senha = senha
    
    res.redirect('/')
  } else {
    res.render('login')
  }
})


app.get('/inventario', (req, res)=>{
  // if (req.session.usuario == usuario && req.session.senha == senha) {
    io.once('connection', (socket) => {

      socket.on('keys', ()=>{
        let keys = read_file()

        socket.emit('keys return', keys)
      });

      socket.on('update-chaves-html', (chaves)=>{
        editar_html(chaves)
        socket.emit('reload')
      })

      socket.once('disconnect', ()=>{
        // console.log(socket.id)
      })
    })

    res.render('inventario')
  // } else {
  //   res.redirect('/login')
  // }

})

app.post('/inventario', (req, res)=>{
  // if (req.session.usuario == usuario && req.session.senha == senha) {
    let keys = read_file()
    switch (req.body.form) {
      case 'form1':
        // criar_inventario(keys, req.body)
        res.redirect('inventario')
        break;
      case 'form2':
        console.log(req.body.numero)
        keys.forEach(key=>{
          if (key.key.numero == req.body.numero) {
            create_backup(key.key.numero)
            console.log(key.key)
            key.key.numero = req.body.numero
            key.key.painel = Number(req.body.quantidade_painel)
            key.key.estoque = Number(req.body.quantidade_estoque)
            key.key.saidas = Number(req.body.saidas)
            console.log(key.key)
            fs.writeFileSync('./estoque/estoque.json', JSON.stringify(keys))  
          }
        })
        res.redirect('inventario')
        break;
      default:
        // statements_def
        break;
    }
  // } else {
  //   res.redirect('/login')
  // }
})

const porta = 4000
// ip = "0.0.0.0"

http.listen(porta, ip, ()=>{
  console.log(`Rodando servidor em http://${ip}:${porta}`)
})







