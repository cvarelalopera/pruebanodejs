const express = require('express');
const router = express.Router();
const multer = require ('multer');
const mimeTypes =require ('mime-types');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function(req,file,cb){
        cb("", Date.now () + "." +  mimeTypes.extension(file.mimetype));
    }
});

const upload = multer({
    storage: storage
});

router.get(("/"), (req,res)=>{
    console.log(__dirname)
    res.sendFile(__dirname + "/links/add")
});

const pool = require('../database');

router.get('/add', (req, res) => {
    res.render('./links/add');
    
});

router.post('/add', upload.single('file'), async (req, res) => {
    const { nombre, apellido, tipodoc, documento, email, celular, fecha, file }=req.body;
    const newUser = {
        nombre,
        apellido,
        tipodoc, 
        documento,
        email,
        celular,
        fecha,
        file
    };
    await pool.query('INSERT INTO users set ?', [newUser]);
    console.log(req.body);
    res.send('received');
});

router.get('/', async (req, res) => {
    
    const users = await pool.query('SELECT * FROM users');
    res.render('links/list', { users });
});

router.get('/delete/:documento', async (req, res) => {
    const { documento } = req.params;
    await pool.query('DELETE FROM users WHERE documento = ?', [documento]);
    req.flash('success', 'Usuario eliminado con éxito');
    res.redirect('/links');
});

router.get('/edit/:documento', async (req, res) => {
    const { documento } = req.params;
    const users = await pool.query('SELECT * FROM users WHERE documento = ?', [documento]);
    console.log(users);
    res.render('links/edit', {link: users[0]});
});

router.post('/edit/:documento', async (req, res) => {
    const { documento } = req.params;
    const { nombre, apellido, tipodoc, documento, email, celular, fecha, file } = req.body; 
    const newUser= {
        nombre,
        apellido,
        tipodoc, 
        documento,
        email,
        celular,
        fecha,
        file
    };
    await pool.query('UPDATE users set ? WHERE documento = ?', [newUser, documento]);
    req.flash('success', 'Usuario actualizado con éxito');
    res.redirect('/links');
});

module.exports = router ;