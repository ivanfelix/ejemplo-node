const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const Categoria = require('../models/categoria');

const app = express();

app.get('/categorias', (req, res) => {
    Categoria.find({})
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categorias
            })
        })
})
app.get('/categoria/:id', (req, res) => {
    var id = req.params.id;
    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria
        })
    })
})
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })
    categoria.save((err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria
        })
    })
})
app.delete('/categoria/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaEliminada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoriaEliminada
        })
    })
})

module.exports = app;