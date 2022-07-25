import express from 'express';
const router = express.Router();
import productController from '#controllers/product';
import global from '#root/global';

function loggingMiddleware(req, res, next) {
    // console.log('==>loggingMiddleware', req.headers.token);
    if (req.headers.token) {
        global.checkCustomerAuthentication(req.headers.token).then(function (response) {
            req.headers.customer = response.customer;
            // console.log('user auth pass:', response.customer._id);
            next();
        }).catch(function (err) {
            res.status(401).json({success: false, message: 'auth!'});
        });
    } else {
        res.status(401).json({success: false, message: 'auth!'});

    }
}
//console.log('we are here');
// router.get('/myPost/:id', productController.viewOneMyPost);
router.get('/importproducts/:offset/:limit', productController.importproducts);
router.get('/importproducts3/:offset/:limit', productController.importproducts3);
// router.get('/importproducts', productController.importproducts);
// router.get('/modifyproducts/:offset/:limit', productController.modifyproducts);
router.get('/modifydes', productController.modifydes);

router.get('/f/:id', productController.viewOneF);
router.get('/', productController.allW);
router.get('/productsByCat/:_id/:offset/:limit', productController.productsByCat);
router.get('/productsByCat/:_id/:offset/:limit/:search', productController.productsByCat);
router.get('/all/:offset/:limit', productController.allW);
router.get('/all/:offset/:limit/:search', productController.allW);
router.get('/torob/:offset/:limit', productController.torob);

router.get('/view/:id', productController.viewOne);
router.get('/story/:offset/:limit/', productController.allStory);
router.get('/:offset/:limit/', productController.allW);
router.get('/:offset/:limit/:search', productController.allW);
router.get('/:id', productController.viewOne);


router.get('/count', productController.count);
router.use(loggingMiddleware);
router.post('/like/:_id', productController.like);


export default router;