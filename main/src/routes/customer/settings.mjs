import express from 'express';
const router = express.Router();
import settingsController from '#controllers/settings';
// global._ from '../../global');
import fs from 'fs';
import path from "path";

function loggingMiddleware(req, res, next) {
    // console.log('==>loggingMiddleware', req.headers.token);
    if (req.headers.token) {
        // global.checkCustomerAuthentication(req.headers.token).then(function (response) {
        //     req.headers.customer = response.customer;
        //     console.log('user auth pass:', response.customer._id);
        //     next();
        // }).catch(function (err) {
        //     res.json({success: false, message: 'auth!'});
        // });
    } else {
        res.status(401).json({success: false, message: 'auth!'});

    }
}
// router.post('/login', userController.login);
// router.use(loggingMiddleware);
// console.log('last');
router.get('/', settingsController.last);
router.get('/status', settingsController.siteStatus);
router.get('/reset', (req, res, next)=>{
    var pf=path.join(__dirname, "../../public");
    fs.rename(pf+'/index.html', pf+'/index0.html', function(err) {
        if ( err ) {
            console.log('ERROR: ' + err);
            res.json({success:false});

            return;
        }
        res.json({success:true});
        return;
    });
});
// router.get('/all/:offset/:limit/:search', userController.all);
// router.get('/view/:id', userController.viewOne);
// router.get('/count', userController.count);
// router.post('/', userController.create);
// router.post('/register', userController.register);
// router.put('/:id', userController.edit);
// router.delete('/:id', userController.destroy);
export default router;