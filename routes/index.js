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
const meetiController = require('../controllers/meetiController');

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
    router.get('/logout', authController.isAuthenticated ,authController.logout);

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
    router.get('/delete-group/:groupId', authController.isAuthenticated, groupController.formDeleteGroup);
    router.post('/delete-group/:groupId', authController.isAuthenticated, groupController.deleteGroup);

    router.get('/new-meeti', authController.isAuthenticated, meetiController.formNewMeeti);
    router.post('/new-meeti', authController.isAuthenticated, [
        check('title').trim().escape(),
        check('invited').trim().escape(),
        check('cupo').trim().escape(),
        check('date').trim().escape(),
        check('hour').trim().escape(),
        check('address').trim().escape(),
        check('city').trim().escape(),
        check('state').trim().escape(),
        check('country').trim().escape(),
        check('lat').trim().escape(),
        check('lng').trim().escape(),
        check('groupId').trim().escape()
    ], meetiController.createMeeti);

    router.get('/edit-meeti/:id', authController.isAuthenticated, meetiController.formEditMeeti);
    router.post('/edit-meeti/:id', authController.isAuthenticated, meetiController.editMeeti)

    router.get('/delete-meeti/:id', authController.isAuthenticated, meetiController.formDeleteMeeti);
    router.post('/delete-meeti/:id', authController.isAuthenticated, meetiController.deleteMeeti);
    
    router.get('/edit-profile', authController.isAuthenticated, userController.formEditProfile);
    router.post('/edit-profile', authController.isAuthenticated,[
        check('name').trim().escape(),
        check('email').trim().escape()
    ], userController.editProfile);

    router.get('/change-password', authController.isAuthenticated, userController.formChangePassword);
    router.post('/change-password', authController.isAuthenticated, userController.changePassword);

    router.get('/image-profile', authController.isAuthenticated, userController.formImageProfile);
    router.post('/image-profile', authController.isAuthenticated, userController.uploadImage ,userController.imageProfile);
    
    return router;
}