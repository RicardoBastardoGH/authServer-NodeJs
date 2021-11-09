const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fileds');
const { validateJWT } = require('../middlewares/validate-jwt');


const router = Router();

// Crear un nuevo usuario
router.post( '/new',[
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6 }),
    validateFields
], createUser)

// Login de usuario
router.post( '/login', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6 }),
    validateFields
], loginUser)

// Validar y revalidar token
router.get( '/renew', [ validateJWT ], renewToken)




module.exports = router;