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
        req.usuario = decoded.usuario;
        next();
    })
    res.json({
        token
    })
}

module.exports = {
    verificaToken
}