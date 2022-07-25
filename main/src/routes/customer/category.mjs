import express from 'express';
const router = express.Router();
import categoryController from '#controllers/category';
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
// router.get('/importcats', categoryController.importcats);

router.get('/level', categoryController.level);
router.get('/sidebar', categoryController.sidebar);
router.get('/level/:catId', categoryController.level);
router.get('/sidebar/:catId', categoryController.sidebar);
// router.get('/level3/:catId', categoryController.level);
router.get('/', categoryController.all);
router.get('/:offset/:limit', categoryController.all);
router.get('/all/:offset/:limit', categoryController.all);
router.get('/all/:offset/:limit/:search', categoryController.all);
router.get('/:id', categoryController.viewOne);
router.get('/view/:id', categoryController.viewOne);
router.get('/count', categoryController.count);
// router.use(loggingMiddleware);
router.post('/', categoryController.create);
router.post('/exparty', categoryController.exparty);
router.put('/:id', categoryController.edit);
router.delete('/:id', categoryController.destroy);
export default router;