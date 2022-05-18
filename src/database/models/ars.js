const { model, Schema } = require('mongoose');

const arSchema =  new Schema({
    factura: {type: String, required: true},
    gaveta: String,
    color: String,
    ingreso: String,
    salida: String,
    laboratorio: String,
    estado: String,
    tiempo: String
});

arSchema.methods.setFecha = function(type){
    let fecha = new Date();
    let dia = fecha.getDate(),
        mes = fecha.getMonth() + 1,
        año = fecha.getFullYear();
    this[type] = `${dia}-${mes}-${año}`;
}

module.exports = model('ar', arSchema);