import express from 'express';
const router = express.Router();
import settingsController from '#controllers/settings';
import global from '#root/global';

function loggingMiddleware(req, res, next) {
    // console.log('==>loggingMiddleware', req.headers.token);
    if (req.headers.token) {
        global.checkAdminAuthentication(req.headers.token).then(function (response) {
            req.headers.user=response.user;

            // console.log(response);
            next();

        }).catch(function (err) {
            res.status(401).json({success: false, message: 'auth!'});
        });
    } else {
        res.status(401).json({success: false, message: 'auth!'});

    }
}
// router.post('/login', settingsController.login);
router.use(loggingMiddleware);
router.get('/update', settingsController.update);
router.get('/dollar', settingsController.dollar);
router.get('/count', settingsController.count);
router.get('/configuration', settingsController.configuration);

router.get('/', settingsController.all);
router.get('/:offset/:limit', settingsController.all);
router.get('/all/:offset/:limit', settingsController.all);
router.get('/all/:offset/:limit/:search', settingsController.all);
router.get('/:id', settingsController.viewOne);
router.get('/view/:id', settingsController.viewOne);
router.post('/', settingsController.create);
router.post('/submitDollarPrice/:price', settingsController.submitDollarPrice);
router.post('/submitDerhamPrice/:price', settingsController.submitDerhamPrice);
// router.post('/register', settingsController.register);
router.post('/fileUpload', settingsController.fileUpload);
router.put('/configuration', settingsController.updateConfiguration);
router.put('/pc', settingsController.updatePrivateConfiguration);

router.put('/:id', settingsController.edit);
router.delete('/:id', settingsController.destroy);
export default router;