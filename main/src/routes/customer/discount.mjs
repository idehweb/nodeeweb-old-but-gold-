import express from 'express';
const router = express.Router();
import discountController from '#controllers/discount';
import global from '#root/global';

// var _id;

function loggingMiddleware(req, res, next) {
    // console.log('==>loggingMiddleware', req.headers.token);
    if (req.headers.token) {
        global.checkAdminAuthentication(req.headers.token).then(function (response) {
            req.headers.customer=response.customer;

            next();

        }).catch(function (err) {
            res.status(401).json({success: false, message: 'auth!'});
        });
    } else {
        res.status(401).json({success: false, message: 'auth!'});

    }
}
// router.get('/importcats', discountController.importcats);

router.get('/level', discountController.level);
router.get('/sidebar', discountController.sidebar);
router.get('/level/:catId', discountController.level);
router.get('/sidebar/:catId', discountController.sidebar);
// router.get('/level3/:catId', discountController.level);
router.get('/', discountController.all);
router.get('/:offset/:limit', discountController.all);
router.get('/all/:offset/:limit', discountController.all);
router.get('/all/:offset/:limit/:search', discountController.all);
router.get('/:id', discountController.viewOne);
router.get('/view/:id', discountController.viewOne);
router.get('/count', discountController.count);
// router.use(loggingMiddleware);
router.post('/', discountController.create);
router.post('/exparty', discountController.exparty);
router.put('/:id', discountController.edit);
router.delete('/:id', discountController.destroy);
export default router;