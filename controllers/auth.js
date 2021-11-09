const { response } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req,res = response) => {
    
    const { email, name, password } = req.body;
    
    try {
        // Verificar Email
        const usuario = await User.findOne({ email });
    
        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El email ya se encuentra en uso'
            })
        }

        // Crear usuario con el modelo
        const dbUser = new User( req.body );

        // Hashear el password
        const salt = bcrypt.genSaltSync( 10 );
        dbUser.password = bcrypt.hashSync( password.toString(), salt )
    
        // Generar JWT
        const token = await generateJWT( dbUser.id, name );

        // Crear usuario de la BD
        dbUser.save();
        
        // Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            token

        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
    
}

const loginUser = async (req,res = response) => {

    const { email, password } = req.body;

    try {

        const dbUser = await User.findOne({ email })
        if ( !dbUser ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            })
        }
        
        const validPassword = bcrypt.compareSync( password.toString(), dbUser.password )
        if ( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'El password no coincide'
            })
        }

        // Generar JWT
        const token = await generateJWT( dbUser.id, dbUser.name );

        // Respuesta
        return res.status(200).json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            token
        })
         
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
        
    }

    
}

const renewToken = async (req,res) => {

    const { uid, name } = req;
    
    // Generar JWT
    const token = await generateJWT( uid, name );

    return res.json({
        ok: true,
        uid,
        name,
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    renewToken
}