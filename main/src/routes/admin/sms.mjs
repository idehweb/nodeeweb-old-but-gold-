import express from 'express';
const router = express.Router();
import smsController from '#controllers/sms';
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

router.get('/', smsController.all);
router.get('/:offset/:limit', smsController.all);
router.get('/all/:offset/:limit', smsController.all);
router.get('/all/:offset/:limit/:search', smsController.all);
router.get('/:id', smsController.viewOne);
router.get('/view/:id', smsController.viewOne);
router.get('/count', smsController.count);
router.post('/', smsController.createByAdmin);
// router.post('/telegram/:id', smsController.telegram);
router.put('/:id', smsController.editAdmin);
router.delete('/:id', smsController.destroy);
export default router;