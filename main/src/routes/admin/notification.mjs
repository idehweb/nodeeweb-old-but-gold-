import express from 'express';
const router = express.Router();
import notificationController from '#controllers/notification';
import global from '#root/global';
// var _id;

function loggingMiddleware(req, res, next) {
    // console.log('==>loggingMiddleware', req.headers.token);
    if (req.headers.token) {
        global.checkAdminAuthentication(req.headers.token).then(function (response) {
            next();

        }).catch(function (err) {
            res.status(401).json({success: false, message: 'auth!'});
        });
    } else {
        res.status(401).json({success: false, message: 'auth!'});

    }
}
router.use(loggingMiddleware);

router.get('/', notificationController.all);
router.get('/:offset/:limit', notificationController.all);
router.get('/all/:offset/:limit', notificationController.all);
router.get('/all/:offset/:limit/:search', notificationController.all);
router.get('/:id', notificationController.viewOne);
router.get('/view/:id', notificationController.viewOne);
router.get('/count', notificationController.count);
router.post('/', notificationController.create);
router.put('/:id', notificationController.edit);
router.delete('/:id', notificationController.destroy);
export default router;