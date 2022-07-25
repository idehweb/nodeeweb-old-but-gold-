import express from 'express';
const router = express.Router();
import storyController from '#controllers/story';
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

router.get('/', storyController.all);
router.get('/:offset/:limit', storyController.all);
router.get('/all/:offset/:limit', storyController.all);
router.get('/all/:offset/:limit/:search', storyController.all);
router.get('/:id', storyController.viewOne);
router.get('/view/:id', storyController.viewOne);
router.get('/count', storyController.count);
router.post('/', storyController.create);
router.post('/fileUpload', storyController.fileUpload);
router.post('/telegram/:id', storyController.telegram);
router.put('/:id', storyController.editAdmin);
router.delete('/:id', storyController.destroy);
export default router;