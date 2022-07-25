import express from 'express';
const router = express.Router();
import postController from '#controllers/post';
import global from '#root/global';
// var _id;

function loggingMiddleware(req, res, next) {
    // console.log('==>loggingMiddleware', req.headers.token);
    if (req.headers.token) {
        global.checkAdminAuthentication(req.headers.token).then(function (response) {
            next();

        }).catch(function (err) {
            res.status(401).json({success: false, message: 'auth!'});
        });
    } else {
        res.status(401).json({success: false, message: 'auth!'});

    }
}
router.use(loggingMiddleware);

router.get('/', postController.all);
router.get('/:offset/:limit', postController.all);
router.get('/all/:offset/:limit', postController.all);
router.get('/all/:offset/:limit/:search', postController.all);
router.get('/:id', postController.viewOneAdmin);
router.get('/view/:id', postController.viewOneAdmin);
router.get('/count', postController.count);
router.post('/', postController.create);
router.post('/copy/:id', postController.copy);
router.put('/:id', postController.editAdmin);
router.delete('/:id', postController.destroy);
export default router;