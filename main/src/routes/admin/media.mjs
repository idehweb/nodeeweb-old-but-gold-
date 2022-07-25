import express from 'express';
const router = express.Router();
import mediaController from '#controllers/media';
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

router.get('/', mediaController.all);
router.get('/:offset/:limit', mediaController.all);
router.get('/all/:offset/:limit', mediaController.all);
router.get('/all/:offset/:limit/:search', mediaController.all);
router.get('/:id', mediaController.viewOne);
router.get('/view/:id', mediaController.viewOne);
router.get('/count', mediaController.count);
router.post('/', mediaController.create);
router.put('/:id', mediaController.edit);
router.delete('/:id', mediaController.destroy);
export default router;