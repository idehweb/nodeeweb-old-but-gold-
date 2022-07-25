import express from 'express';
const router = express.Router();
import userController from '#controllers/user';
import global from '#root/global';

function loggingMiddleware(req, res, next) {
    // console.log('==>loggingMiddleware', req.headers.token);
    if (req.headers.token) {
        global.checkAdminAuthentication(req.headers.token).then(function (response) {
            req.headers.user=response.user;

            next();

        }).catch(function (err) {
            res.status(401).json({success: false, message: 'auth!'});
        });
    } else {
        res.status(401).json({success: false, message: 'auth!'});

    }
}
router.post('/login', userController.login);
router.use(loggingMiddleware);
router.get('/', userController.all);
router.get('/:offset/:limit', userController.all);
router.get('/all/:offset/:limit', userController.all);
router.get('/all/:offset/:limit/:search', userController.all);
router.get('/:id', userController.viewOne);
router.get('/view/:id', userController.viewOne);
router.get('/count', userController.count);
router.post('/', userController.register);
router.post('/register', userController.register);
router.put('/:id', userController.edit);
router.delete('/:id', userController.destroy);
export default router;