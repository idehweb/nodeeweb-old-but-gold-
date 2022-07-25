import express from 'express';
const router = express.Router();
import orderController from '#controllers/order';
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

router.get('/', orderController.all);
router.get('/:offset/:limit', orderController.all);
router.get('/all/:offset/:limit', orderController.all);
router.get('/all/:offset/:limit/:search', orderController.all);
router.get('/:id', orderController.viewOne);
router.get('/view/:id', orderController.viewOne);
router.get('/count', orderController.count);
router.post('/', orderController.createAdmin);
router.put('/:id', orderController.edit);
router.delete('/:id', orderController.destroy);
export default router;