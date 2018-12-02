const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const Producto = require('../models/producto');

const app = express();

app.get('/productos', (req, res) => {
    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productos
            })
        })
})
app.get('/producto/:id', (req, res) => {
    var id = req.params.id;
    Producto.findById(id, (err, producto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto
        })
    })
})
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    })
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            productoDB
        })
    })
})
app.delete('/producto/:id', (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndRemove(id, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            productoDB
        })
    })
})

module.exports = app;