import express from 'express';
const router = express.Router();
import attributesController from '#controllers/attributes';
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

router.get('/', attributesController.all);
router.get('/s/:catId', attributesController.s);

router.get('/:offset/:limit', attributesController.all);
router.get('/all/:offset/:limit', attributesController.all);
router.get('/all/:offset/:limit/:search', attributesController.all);
router.get('/:id', attributesController.viewOne);
router.get('/view/:id', attributesController.viewOne);
router.get('/count', attributesController.count);
router.get('/f/:offset/:limit', attributesController.s);
router.post('/', attributesController.create);
router.put('/:id', attributesController.edit);
router.delete('/:id', attributesController.destroy);
export default router;