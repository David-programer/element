const mongoose = require('mongoose');
let URI = 'mongodb+srv://Test-admin:test-admin@clustertest.ezgdr.mongodb.net/element_ars?retryWrites=true&w=majority';

mongoose.connect(URI)
    .catch(err => console.log('Error en la conexión: ' + err));

mongoose.connection.on('open', ()=>{
    console.log('database is connected and open');
})
