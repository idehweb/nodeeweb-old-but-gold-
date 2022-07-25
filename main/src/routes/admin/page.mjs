import express from 'express';
const router = express.Router();
import pageController from '#controllers/post';
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

router.get('/', pageController.all);
router.get('/:offset/:limit', pageController.all);
router.get('/all/:offset/:limit', pageController.all);
router.get('/all/:offset/:limit/:search', pageController.all);
router.get('/:id', pageController.viewOneAdmin);
router.get('/view/:id', pageController.viewOneAdmin);
router.get('/count', pageController.count);
router.post('/', pageController.create);
router.post('/copy/:id', pageController.copy);
router.put('/:id', pageController.editAdmin);
router.delete('/:id', pageController.destroy);
export default router;