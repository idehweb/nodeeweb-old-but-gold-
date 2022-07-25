import express from 'express';
const router = express.Router();
import productController from '#controllers/product';
import global from '#root/global';
// var _id;

function loggingMiddleware(req, res, next) {
    // console.log('==>loggingMiddleware', req.headers.token);
    if (req.headers.token) {
        global.checkAdminAuthentication(req.headers.token).then(function (response) {
            req.headers.user=response.user;
            // console.log('req.headers',req.headers,response);
            next();

        }).catch(function (err) {
            res.status(401).json({success: false, message: 'auth!'});
        });
    } else {
        res.status(401).json({success: false, message: 'auth!'});

    }
}

router.get('/autoChangePrices', productController.autoChangePrices);

router.use(loggingMiddleware);

router.get('/', productController.all);
// router.get('/bycat/:_id/:offset/:limit', productController.bycat);

router.get('/:offset/:limit', productController.all);
router.get('/:offset/:limit/:search', productController.all);
router.get('/all/:offset/:limit', productController.all);
router.get('/all/:offset/:limit/:search', productController.all);

router.get('/:id', productController.viewOneA);
router.get('/view/:id', productController.viewOneA);
router.get('/count', productController.count);

router.post('/', productController.create);
router.post('/copy/:id', productController.copy);
router.post('/telegram/:id', productController.telegram);
router.post('/fileUpload', productController.fileUpload);
router.post('/importproductsfromcsv', productController.importproductsfromcsv);

router.put('/:id', productController.editAdmin);
router.put('/modifyPriceByCat/:_id', productController.modifyPriceByCat);
router.delete('/:id', productController.destroy);
export default router;