const express = require('express');
const Usuario = require('../models/user');
const bcrypt = require('bcrypt');
const { verificaToken, verificaRole } = require('../middlewares/autenticacion');

const app = express();

app.get('/', function(req, res) {
    res.send('Hello world');
})

// Obtener usuarios
app.get('/usuarios', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find({}, 'nombre email img role estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                })
            })
        })
})

// Obtener usuario
app.get('/usuario/:id', verificaToken, function(req, res) {
    var id = req.params.id;
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuarioDB
        })
    })
})

// Creacion del usuario.
app.post('/usuario', [verificaToken, verificaRole], (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
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

// Actualizar usuario
app.put('/usuario/:id', verificaToken, (req, res) => {
    var id = req.params.id;
    var actualizacion = req.body;
    Usuario.findByIdAndUpdate(id, actualizacion, { new: true }, (err, usuarioactualizado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuarioactualizado
        })
    })
})

app.delete('/usuario/:id', [verificaToken, verificaRole], (req, res) => {
    var id = req.params.id;
    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { -- Actualmente edita el usuario como false para no eliminarlo d ela base de datos. si quiere eliminar descomentar esta linea.
    var estado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, estado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuarioBorrado
        })
    })
})
module.exports = app;