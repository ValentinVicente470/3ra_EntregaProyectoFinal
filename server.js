const express = require('express')
const session = require('express-session')
const connectMongo = require('connect-mongo')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const config = require('./src/config/config.js')

const ConteinerMsgs = require('./src/controllers/contenedorMsg.js')
const ContainerProds = require('./src/controllers/contenedorProd.js')
const ContainerCart = require('./src/controllers/contenedorCart.js')

const RutaPassport = require('./src/routes/router-passport.js')
const RutaCarrito = require('./src/routes/router-carrito.js')



//SERVER--------------------------------------------------------------
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
const MongoStorage = connectMongo.create({
    mongoUrl: config.MONGO_URL,
    mongoOptions: advancedOptions,
    ttl: 600
})
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./src/public'))
app.use(
    session({
        store: MongoStorage,
        secret: config.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000 * 30
        },
    })
);
app.use(passport.initialize())
app.use(passport.session())
app.use(RutaPassport)
app.use('/carrito', RutaCarrito)


//ENGINES------------------------------------------------------------
app.set('view engine', 'ejs')

//SOCKETS------------------------------------------------------------
io.on('connection', async (sockets) => {
    sockets.emit('product', await ContainerProds.getProds())
    console.log('Un cliente se ha conectado!: ' + sockets.id)
    
    sockets.emit('messages', await ConteinerMsgs.getMsg())

    sockets.on('new-product', async data => {
        console.log(data)
        const name = data.name
        const description = data.description
        const price = data.price
        const stock = data.stock
        const thumbnail = data.thumbnail
        await ContainerProds.saveProd({ name, description, price, stock, thumbnail })


        io.sockets.emit('product', await ContainerProds.getProds())
    })
    sockets.on('new-message', async dato => {
        console.log(dato)
        const email = dato.email
        const text = dato.text
        const fecha = dato.fecha
        const hora = dato.hora

        await ConteinerMsgs.saveMsj(email, text, fecha, hora)

        io.sockets.emit('messages', await ConteinerMsgs.getMsg())
    })
})


const PORT = 8080
httpServer.listen(PORT, () => console.log('Iniciando en el puerto: ' + PORT))