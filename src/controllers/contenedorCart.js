const mongoose = require('mongoose');

const models = require('../models/schemaCart.js');

const contenedorProd = require('./contenedorProd.js');

const moment = require('moment');

mongoose.connect('mongodb+srv://ValentinVicente:kpoctmaster470@cluster0.4hxnz.mongodb.net/Cluster0?retryWrites=true&w=majority')

class Contenedor {
    constructor() {
        this.coleccion = models
    }

    async getAllCarritos(){
        try{

            const objs = await this.coleccion.find();
            return objs;

        }
        catch(err){
            console.log(`${err} Error en la funcion getAllCarritos`);
        }
    }
    
    // async getCarritoByID(num){
    //     try{

    //         const obj = await this.coleccion.find({id: num});
    //         return obj;

    //     }
    //     catch(err){
    //         console.log(`${err} Error en la funcion getCarritoByID`)
    //     }
    // }

    async crearCarrito(user){
        try{

            const newCarrito ={
                id: user,
                timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                productos:[],
            }

            const add = await this.coleccion.insertMany(newCarrito)
           
            const objs2 = await this.getAllCarritos();
            const carritonuevoID = objs2[objs2.length -1].id;
            console.log(`Carrito ${carritonuevoID} creado exitosamente`);

            return add;

        }
        catch(err){
            console.log(`${err} Error en la funcion crearCarrito`);
        }
    }

    // async deleteCarritoByID(num){
    //     try{

    //         const deleted = await this.coleccion.findOneAndDelete({id:num});
    //         return deleted; 

    //     }
    //     catch(err){
    //         console.log(`${err} Error en la funcion deleteCarritoByID`)
    //     }
    // }

    async prodAlCarrito(id_carrito, id_prod){
        try{

            const producto = await contenedorProd.getProdById(id_prod);

            const string = JSON.stringify(producto)

            const agregado = await this.coleccion.updateOne( {id: id_carrito}, {$push: {productos: string} } );
            return agregado;

        }
        catch(err){
            console.log(`${err} Error en la funcion prodAlCarrito`)
        }
    }

    async deleteProdDeCarrito(id_carrito, id_prod){
        try{

            const producto = await contenedorProd.getProdById(id_prod);

            const string = JSON.stringify(producto);
            
            const hecho = await this.coleccion.updateOne( {id_carrito}, {$pull: {productos: string} } );
            return hecho;
        }
        catch(err){
            console.log(`${err} Error en la funcion deleteProdDeCarrito`)
        }
    }

};

const Cart = new Contenedor();

module.exports = Cart;