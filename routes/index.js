const express = require('express');
const router = express.Router();
const {
    check
} = require('express-validator');

const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const groupController = require('../controllers/groupsController');

module.exports = function() {
    router.get('/', homeController.home);

    router.get('/create-account', userController.formCreateAccount);
    router.post('/create-account', [
        check('repeatPassword').not().isEmpty().trim().escape().withMessage('El confirmar password no puede estar vacio'),
        check('repeatPassword', 'No coincide con el password').custom((value, {
            req
        }) => (value === req.body.password))
    ], userController.createAccount);
    router.get('/confirm-account/:email', userController.confirmAccount);

    router.get('/login', userController.formLogin);
    router.post('/login', authController.authenticateUser);

    router.get('/admin', authController.isAuthenticated, adminController.panelAdmin);
    router.get('/new-group', authController.isAuthenticated, groupController.formNewGroup);
    router.post('/new-group', [
        check('name').trim().escape(),
        check('url').trim().escape()
    ], groupController.uploadImage, groupController.newGroup);

    router.get('/edit-group/:groupId', authController.isAuthenticated, groupController.formEditGroup);
    router.post('/edit-group/:groupId', authController.isAuthenticated, [
        check('name').trim().escape(),
        check('url').trim().escape()
    ], groupController.editGroup);
    router.get('/image-group/:groupId', authController.isAuthenticated, groupController.formImageGroup);
    router.post('/image-group/:groupId', authController.isAuthenticated, groupController.uploadImage, groupController.imageGroup);


    return router;
}