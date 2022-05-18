const { ipcMain } = require('electron');
const ars = require('../database/models/ars.js');

ipcMain.on('readerARS', async (e, args)=>{
    try{
        let ARS = await ars.find({ingreso: args.fecha});
        let filter = []
        if(args.type == 'laboratorio'){
            for (const key in ARS) {
                if(ARS[key].laboratorio == args.name) {
                    filter.push(ARS[key])
                }
            }
        }else{
            filter = ARS
        }
        e.reply('ARS-read', JSON.stringify(filter));
    }catch(error){
        console.log(error)
    }
});

ipcMain.on('create-ar', async (e, args)=>{
    try{
        const newAR= new ars(args);
        newAR.setFecha('ingreso');
        await newAR.save();
        e.reply('AR-saved');
    }catch(error){
        console.log(error);
    }
});

ipcMain.on('read-ars-pending', async (e, args)=>{
    try{
        const arsPending = await ars.find({salida: '--'});
        let filter = []
        if(args.type == 'laboratorio'){
            for (const key in arsPending) {
                if(arsPending[key].laboratorio == args.name) {
                    filter.push(arsPending[key])
                }
            }
        }else{
            filter = arsPending
        }
        e.reply('ARS-pending', JSON.stringify(filter))
    }catch(error){
        console.log(error);
    }
});

ipcMain.on('all-ars', async (e, args)=>{
    try{
        let allARS;
        args.type == 'laboratorio' ? allARS = await ars.find({laboratorio: args.name}) : allARS = await ars.find()
        let fechas = {};
            for (let key in allARS) {
                const nombreGrupo = allARS[key].ingreso;
                if(!fechas[nombreGrupo]) fechas[nombreGrupo] = [];
                fechas[nombreGrupo].push(allARS[key])
            }
            let final = {};
            for (let fecha in fechas) {
                let enviados = 0;
                for (let key in fechas[fecha]) {
                    const nombreGrupo = fechas[fecha][key].ingreso;
                    if(fechas[fecha][key].salida.length > 2) enviados++
                    let ars = fechas[fecha].length;
                    let pendientes = ars - enviados
                    final[nombreGrupo] = {enviados: `${enviados}`, ars: `${ars}`, pendientes: `${pendientes}`}
                }
            }
        e.reply('res-all-ars', JSON.stringify(final));
    }catch(error){
        console.log(error);
    }
});

ipcMain.on('update-ar', async(e, args) =>{
    await ars.findByIdAndUpdate(args.id, {$set: {[args.asunto]: args.valor}});
});

ipcMain.on('salida-ar', async (e, args)=>{
    let fecha = new Date();
    let dia = fecha.getDate(),
        mes = fecha.getMonth() + 1,
        año = fecha.getFullYear();
    const AR = await ars.findOneAndUpdate({factura: args}, {$set: {salida: `${dia}-${mes}-${año}`}});
    e.reply('actualizado');
});

ipcMain.on('reader-one-ar', async(e, args)=>{
    const arRead = await ars.findById(args);
    e.reply('read-one-ar', JSON.stringify(arRead))
})

ipcMain.on('downlad-excel', async (e, args)=>{
    const path = require('path');
    var xl = require('excel4node');
    //libro excel
    const wb = new xl.Workbook();

    //Hoja de trabajo
    const ws = wb.addWorksheet('ARS');

    let style = wb.createStyle({
        font: {
            color: '#040404',
            size: 12
        },
        alignment: {horizontal: 'center'}
    });

    let styleAzul = wb.createStyle({
        font: {
            color: '#FFFFFF',
            size: 12
        },
        alignment: {horizontal: 'center'},
        fill: {type: 'pattern', patternType: 'solid', bgColor: '#008FFF', fgColor: '#008FFF'}
    });

    let styleVerde = wb.createStyle({
        font: {
            color: '#FFFFFF',
            size: 12
        },
        alignment: {horizontal: 'center'},
        fill: {type: 'pattern', patternType: 'solid', bgColor: '16D200', fgColor: '16D200'}
    });

    let title = wb.createStyle({
        font: {
            color: '#013246',
            size: 13,
            bold: true,
            extend: true
        }, 
        alignment: {horizontal: 'center'},
        fill: {type: 'pattern', patternType: 'solid', bgColor: 'E8E8E8', fgColor: 'E8E8E8'}
    });

    ws.column(2).setWidth(20);
    ws.column(6).setWidth(20);
    ws.row(1).setHeight(40);

    ws.cell(1,1,1,6, true).string('INFORME ARS').style({font: {bold: true, size: 20, color: '#013246'}, alignment: {horizontal: 'center', vertical: 'center'}});
    ws.cell(2,1).string('FACTURA').style(title);
    ws.cell(2,2).string('LABORATORIO').style(title);
    ws.cell(2,3).string('GAVETA').style(title);
    ws.cell(2,4).string('INGRESO').style(title);
    ws.cell(2,5).string('SALIDA').style(title);
    ws.cell(2,6).string('ESTADO').style(title);

    for (const key in args) {
        const count = parseInt(key) + 3;
        ws.cell(count,1).string(args[key].factura).style(args[key].color === 'green' ? styleVerde  : styleAzul);
        ws.cell(count,2).string(args[key].laboratorio).style(style);
        ws.cell(count,3).string(args[key].gaveta).style(style);
        ws.cell(count,4).string(args[key].ingreso).style(style);
        ws.cell(count,5).string(args[key].salida).style(style);
        ws.cell(count,6).string(args[key].estado).style(style);
    }

    wb.write(`Informe-${args[0].ingreso}.xlsx`, function(err, stats){
        if(err){
            console.log(err)
        }else{
            e.reply('informe-descargado');
        }
    });
});