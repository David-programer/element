const { ipcMain } = require('electron');
const user = require('../database/models/user');

ipcMain.on('create-user', async (e, args)=>{
    try {
        const newUser = new user(args);
        const userSave = await newUser.save();
        e.reply('new-user-created', JSON.stringify(userSave));
    } catch (error) {
        console.error(error);
    }
});

ipcMain.on('read-laboratorios', async (e, args)=>{
    const laboratorios = await user.find({type: 'laboratorio'});
    let filter = [];
    for (const key in laboratorios) {
        let name = laboratorios[key].name
        filter.push(name)
    }
    e.reply('laboratorios-read', JSON.stringify(filter));
});

ipcMain.on('read-users', async (e, args)=>{
    const users = await user.find();
    let filter = [];
    for (const key in users) {
        if(users[key].type !== 'admin') filter.push(users[key])
    }
    e.reply('users-read', JSON.stringify(filter));
});