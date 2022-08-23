const express = require('express');
const passport = require('passport');
const { Router } = express;
const Ruta1 = new Router;

const bcrypt = require('bcrypt');
const { Strategy: LocalStrategy } = require('passport-local')
const usersList = require('../controllers/contenedorUsers.js')

function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
}

//----------------------------------------------------//
// FUNCION BCRYPT

const salt = () => bcrypt.genSaltSync(10);
const createHash = (password) => bcrypt.hashSync(password, salt());
async function isValidPassword(hashPass, password) {
    const result = await bcrypt.compare(JSON.stringify(password), hashPass)
    return result;
}

//----------------------------------------------------//
// FUNCIONES VALIDACION PASSPORT

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {

    const user = await usersList.getUser(email);
    const hashPass = user.password
    
    if (user.email != email) {
        return done(null, false);
    }
    if (isValidPassword(hashPass, password)) {
        return done(null, user);
    }
    return done(null, false);
}));

passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, pass, done) => {
    const usuario = await usersList.getUser(email)
    if (usuario) {
        return done(null, false);
    } else {
        const user = req.body.user
        const direccion = req.body.direccion
        const password = createHash(pass)
        const edad = req.body.edad
        const celular = req.body.celular
        const imagen = req.body.imagen
        const saved = await usersList.saveUser({ user, email, password, direccion, edad, celular, imagen });
        done(null, saved);
    }
}));

//---------------------------------------------------//
// RUTAS REGISTER

Ruta1.get('/register', async (req, res) => {
    res.render('register')
})

Ruta1.post('/register', passport.authenticate('register', { failureRedirect: '/failregister', successRedirect: '/login' }))

Ruta1.get('/failregister', async (req, res) => {
    res.render('register-error')
})

//---------------------------------------------------//
// RUTAS LOGIN

Ruta1.get('/login', async (req, res) => {
    res.render('login')
})

Ruta1.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin', successRedirect: '/datos' }))

Ruta1.get('/faillogin', async (req, res) => {
    res.render('login-error')
})
Ruta1
//---------------------------------------------------//
// RUTAS DATOS

Ruta1.get('/datos', isAuth, async (req, res) => {
    const user = req.user.user
    const email = req.user.email
    const datos = { user, email }
    res.render('index', {datos})
})

Ruta1.get('/delete/:num', async (req, res) => {
    const prodBorrado = await Container.deleteById(req.params.num)
    res.redirect('/datos')
    return prodBorrado
})

//---------------------------------------------------//
// RUTAS LOGOUT

Ruta1.get('/logout', async (req, res) => {
    req.logout(err => {
        req.session.destroy()
        res.redirect('/login')
    })
})

//---------------------------------------------------//
// RUTAS INICIO

Ruta1.get('/', async(req, res) => {
    res.redirect('/datos')
})

//---------------------------------------------------//
// RUTAS INFO

Ruta1.get('/info', async(req, res) => {
    const processId = process.pid
    const nodeVersion = process.version
    const operativeSystem = process.platform
    const usedMemory = process.memoryUsage().rss
    const currentPath = process.cwd()

    const info = { processId, nodeVersion, operativeSystem, usedMemory, currentPath }
    res.render('info', {info})
})

//Serializacion
passport.serializeUser(function (user, done) {
    done(null, user);
});

//Deserializacion
passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = Ruta1;
