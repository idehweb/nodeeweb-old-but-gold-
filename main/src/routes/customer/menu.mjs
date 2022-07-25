import express from 'express';
const router = express.Router();
import menuController from '#controllers/menu';
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
// router.get('/importcats', menuController.importcats);

router.get('/level', menuController.level);
router.get('/sidebar', menuController.sidebar);
router.get('/level/:catId', menuController.level);
router.get('/sidebar/:catId', menuController.sidebar);
// router.get('/level3/:catId', menuController.level);
router.get('/', menuController.all);
router.get('/:offset/:limit', menuController.all);
router.get('/all/:offset/:limit', menuController.all);
router.get('/all/:offset/:limit/:search', menuController.all);
router.get('/:id', menuController.viewOne);
router.get('/view/:id', menuController.viewOne);
router.get('/count', menuController.count);
// router.use(loggingMiddleware);
router.post('/', menuController.create);
router.put('/:id', menuController.edit);
router.delete('/:id', menuController.destroy);
export default router;