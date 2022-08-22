import express from 'express';
const router = express.Router();
import postCategoryController from '#controllers/postCategory';
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

router.get('/level', postCategoryController.level);
router.get('/sidebar', postCategoryController.sidebar);
router.get('/level/:catId', postCategoryController.level);
router.get('/sidebar/:catId', postCategoryController.sidebar);
// router.get('/level3/:catId', postCategoryController.level);
router.get('/', postCategoryController.all);
router.get('/:offset/:limit', postCategoryController.all);
router.get('/all/:offset/:limit', postCategoryController.all);
router.get('/all/:offset/:limit/:search', postCategoryController.all);
router.get('/:id', postCategoryController.viewOne);
router.get('/view/:id', postCategoryController.viewOne);
router.get('/count', postCategoryController.count);
// router.use(loggingMiddleware);
router.post('/', postCategoryController.create);
router.post('/exparty', postCategoryController.exparty);
router.put('/:id', postCategoryController.edit);
router.delete('/:id', postCategoryController.destroy);
export default router;