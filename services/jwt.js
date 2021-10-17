'use strict'

const jwt = require ('jwt-simple')
const moment = require('moment')
const config = require ('../config')

//CrearToken devuelve un JWT, el formato posee una estructura: HEADER.PAYLOAD.VERIFU_SIGNATURE donde el header(Object Json, algoritmo y base64urlencoded)
function createToken( user ){
    const payload = {
        sub: user._id,
        name: user.name,
        email: user.email,
        surname: user.surname,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(config.TOKEN_TIME, 'minutes').unix()
    };
    return jwt.encode(payload, config.SECRET_TOKEN);
}

function decodeToken(token){          
    const payload = jwt.decode(token, config.SECRET_TOKEN, true);

    return payload.sub;

}

module.exports = {
    createToken,
    decodeToken
}