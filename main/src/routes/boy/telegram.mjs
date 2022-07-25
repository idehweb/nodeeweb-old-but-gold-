import express from 'express';

const router = express.Router();
import boyController from '#controllers/boy';

router.get('/telegram', boyController.telegram);
router.get('/test', function (req,res,next) {
    // global.publishToTelegram('vfc').then(function (f) {
    //     console.log('f',f)
    // });
});



export default router;