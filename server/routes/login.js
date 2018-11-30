const express = require('express');
const Usuario = require('../models/user');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const app = express();

app.post('/login', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe.'
                }
            })
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Contraseña incorrecta.'
                }
            })
        }

        let token = jwt.sign({
            data: usuarioDB
        }, 'secret', { expiresIn: 60 * 60 * 24 * 30 });

        res.json({
            ok: true,
            usuarioDB,
            token
        })
    })

})

module.exports = app;