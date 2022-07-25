import express from 'express';
import category_controller from '#controllers/notification';
import global from '#root/global';

const router = express.Router();

function loggingMiddleware(req, res, next) {
    // console.log('==>loggingMiddleware', req.headers.token);
    if (req.headers.token) {
        global.checkPlayerAuthentication(req.headers.token).then(function (response) {
            // console.log('user auth pass:', response.player._id);

            next();

        }).catch(function (err) {
            res.status(401).json({success: false, message: 'auth!'});
        });
    } else {
        res.status(401).json({success: false, message: 'auth!'});

    }
}

router.get('/all/:offset/:limit', category_controller.all);
router.get('/all/:offset/:limit/:search', category_controller.all);
router.get('/view/:id', category_controller.viewOne);
router.get('/count', category_controller.count);
// router.use(loggingMiddleware);
router.post('/', category_controller.create);
router.put('/:id', category_controller.edit);
router.delete('/:id', category_controller.destroy);
export default router;