import express from 'express';
const router = express.Router();
import commentController from '#controllers/comment';
import global from '#root/global';

function loggingMiddleware(req, res, next) {
    if (req.headers.token) {
        global.checkCustomerAuthentication(req.headers.token).then(function (response) {
            req.headers.customer = response.customer;
            next();
        }).catch(function (err) {
            res.status(401).json({success: false, message: 'auth!'});
        });
    } else {
        res.status(401).json({success: false, message: 'auth!'});

    }
}

router.get('/all/:offset/:limit', commentController.all);
router.get('/all/:offset/:limit/:search', commentController.all);

router.get('/view/:id', commentController.viewOne);
router.get('/:id', commentController.all);
router.get('/count', commentController.count);
router.use(loggingMiddleware);
router.post('/:id', commentController.create);
router.put('/:id', commentController.edit);
router.delete('/:id', commentController.destroy);
export default router;