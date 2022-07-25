import express from 'express';
const router = express.Router();
import transactionController from '#controllers/transaction';
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
router.get('/', transactionController.all);
router.get('/:offset/:limit', transactionController.all);
router.get('/all/:offset/:limit', transactionController.all);
router.get('/all/:offset/:limit/:search', transactionController.all);
router.get('/:id', transactionController.viewOne);
router.get('/view/:id', transactionController.viewOne);
router.get('/count', transactionController.count);
router.post('/', transactionController.create);
router.put('/:id', transactionController.edit);
router.delete('/:id', transactionController.destroy);
export default router;