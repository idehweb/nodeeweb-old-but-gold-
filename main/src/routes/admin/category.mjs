import express from 'express';
const router = express.Router();
import categoryController from '#controllers/category';
import global from '#root/global';
// var _id;

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
router.use(loggingMiddleware);

router.get('/', categoryController.all);
router.get('/s/:_id', categoryController.s);

router.get('/:offset/:limit', categoryController.all);
router.get('/all/:offset/:limit', categoryController.all);
router.get('/all/:offset/:limit/:search', categoryController.all);
router.get('/:id', categoryController.viewOne);
router.get('/view/:id', categoryController.viewOne); 
router.get('/count', categoryController.count);
router.get('/f/:offset/:limit', categoryController.s);
router.post('/', categoryController.create);
router.put('/:id', categoryController.edit);
router.delete('/:id', categoryController.destroy);
export default router;