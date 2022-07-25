import express from 'express';
const router = express.Router();
import commentController from '#controllers/comment';
import global from '#root/global';

function loggingMiddleware(req, res, next) {
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

router.get('/', commentController.all);
router.get('/:offset/:limit', commentController.all);
router.get('/:offset/:limit/:search', commentController.all);
router.get('/all/:offset/:limit', commentController.all);
router.get('/all/:offset/:limit/:search', commentController.all);
router.get('/:id', commentController.viewOne);
router.get('/view/:id', commentController.viewOne);
router.get('/count', commentController.count);
router.post('/', commentController.create);
router.put('/:id', commentController.edit);
router.delete('/:id', commentController.destroy);
export default router;