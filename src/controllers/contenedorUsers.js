const mongoose = require('mongoose');

const models = require('../models/schemaUser');

const contenedorCart = require('../controllers/contenedorCart.js')

mongoose.connect('mongodb+srv://ValentinVicente:kpoctmaster470@cluster0.4hxnz.mongodb.net/Cluster0?retryWrites=true&w=majority')


class Contenedor {
    constructor(){
        this.collection = models;
    }

    async saveUser({user, email, password, direccion, edad, celular, imagen}){

        const newUser = {
            user: user,
            email: email,
            password: password,
            direccion: direccion,
            edad: edad,
            celular: celular,
            imagen: imagen,
        }

        const saveUser = await this.collection.insertMany(newUser);
        const createCart = await contenedorCart.crearCarrito(user);
        const hecho = (saveUser, createCart);
        return hecho
    };

    
    async getUser(email) {
        try {
            const obj = await this.getUsers()
            for (const user of obj) {
                if (user.email === email){
                    return user;
                }
            }
            return false
        } catch (err) {
            console.log('Error en la funcion getUser ', err);
        }
    }

    async getUsers(){
        const gets = await this.collection.find()
        return gets
    }
};


const users = new Contenedor()
module.exports = users;