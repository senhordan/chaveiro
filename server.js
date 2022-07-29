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

const print = require('./modulos/print')

usuario = 'senhor_dan'
senha = '33417dan'

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

const read_file = ()=>{
	let file = fs.readFileSync('./estoque/estoque.json', 'utf-8')
	let keys = JSON.parse(file)
	return keys
}

app.get('/', (req, res)=>{
	if (true) {

		io.on('connection', (socket) => {
		  // console.log(`usuario ${socket.id}`);
		  let keys = read_file()

			socket.on('key number', (key_number)=>{
				let key_founded
			  keys.forEach(i=>{
			  	if (key_number == Object.keys(i)[0]) {
						key_founded = i[Object.keys(i)[0]]

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
		// res.redirect('/login')
	}
})

app.get('/teste', (req, res)=>{
	if (req.session.usuario == usuario && req.session.senha == senha) {
		res.render('teste')
	} else {
		res.redirect('/login')
	}

})

app.get('/inventario', (req, res)=>{
	if (req.session.usuario == usuario && req.session.senha == senha) {
		io.on('connection', (socket) => {
		  // console.log(`usuario ${socket.id}`);
		  let keys = read_file()
			socket.on('keys', ()=>{
				let keys = read_file()
				socket.emit('keys return', keys)
			})
		})

		res.render('inventario')
	} else {
		res.redirect('/login')
	}

})

const porta = 4000
ip = "0.0.0.0"

http.listen(porta, ip, ()=>{
	print(`Rodando servidor em http://${ip}:${porta}`)
})






