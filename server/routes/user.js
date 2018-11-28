const express = require('express');
const app = express();
const Usuario = require('../models/user');


app.get('/', function(req, res) {
    res.send('Hello world');
})

app.get('/usuario', function(req, res) {
    res.send('Hello usuario');
})

app.post('/usuario', (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        role: body.role
    })
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

module.exports = app;