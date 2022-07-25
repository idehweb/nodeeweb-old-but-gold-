import express from 'express';
const router = express.Router();
import customerController from '#controllers/customer';
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

router.get('/', customerController.all);
router.get('/:offset/:limit', customerController.all);
router.get('/all/:offset/:limit', customerController.all);
router.get('/all/:offset/:limit/:search', customerController.all);
router.get('/:offset/:limit/:search', customerController.all);
router.get('/:offset/:limit/:q', customerController.all);

router.get('/:id', customerController.viewOne);
router.get('/view/:id', customerController.viewOne);
router.get('/count', customerController.count);
router.post('/', customerController.create);
router.put('/:id', customerController.edit);
router.delete('/:id', customerController.destroy);
export default router;