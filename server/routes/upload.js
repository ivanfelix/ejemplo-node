const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/user');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No hay archivo'
            }
        })
    }

    // Valida tipo
    let tiposValidos = ['usuarios', 'productos'];
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.json({
            ok: false,
            err: {
                message: 'El tipo no es valido, debe ser: ' + tiposValidos.join(', ')
            }
        })
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    let extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.json({
            ok: false,
            err: {
                message: 'La extension no es valida. Archivos ' + extensionesValidas.join(', ')
            }
        })
    }

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.json({
                ok: false,
                err
            })
        }
        imagenUsuario(id, res, nombreArchivo);
    });
})

imagenUsuario = (id, res, nombreArchivo) => {
    Usuario.findById(id, (err, UsuarioDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            })
        }
        if (!UsuarioDB) {
            return res.json({
                ok: false,
                err: {
                    message: 'El usuario no existe en la base de datos.'
                }
            })
        }
        UsuarioDB.img = nombreArchivo;
        UsuarioDB.save((err, usuarioActualizado) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                usuarioActualizado,
                nombreArchivo,
                message: 'Archivo cargado con exito'
            })
        })
    })
}

module.exports = app;