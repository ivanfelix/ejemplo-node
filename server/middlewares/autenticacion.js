var jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }
        req.usuario = decoded.data;
        next();
    })
}
let verificaRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Rol no válido'
            }
        })
    }
    next();
}

module.exports = {
    verificaToken,
    verificaRole
}