import express from 'express';
const router = express.Router();
import postController from '#controllers/post';
import global from '#root/global';

function loggingMiddleware(req, res, next) {
    // console.log('==>loggingMiddleware', req.headers.token);
    if (req.headers.token) {
        global.checkCustomerAuthentication(req.headers.token).then(function (response) {
            req.headers.customer = response.customer;
            // console.log('user auth pass:', response.customer._id);
            next();
        }).catch(function (err) {
            res.status(401).json({success: false, message: 'auth!'});
        });
    } else {
        res.status(401).json({success: false, message: 'auth!'});

    }
}
router.get('/', postController.allW);
router.get('/:offset/:limit/', postController.allW);
router.get('/:offset/:limit/:search', postController.allW);
router.get('/home', postController.viewHome);
router.get('/:id', postController.viewOne);

// router.get('/myPost/:id', postController.viewOneMyPost);
// router.get('/f/:id', postController.viewOneF);
// router.get('/', postController.allW);
// router.get('/postsByCat/:_id/:offset/:limit', postController.postsByCat);
// router.get('/postsByCat/:_id/:offset/:limit/:search', postController.postsByCat);
// router.get('/all/:offset/:limit', postController.allW);
// router.get('/all/:offset/:limit/:search', postController.allW);
//
// router.get('/view/:id', postController.viewOne);
// router.get('/getContactData/:id', postController.getContactData);
// router.get('/:offset/:limit/', postController.allW);
// router.get('/:offset/:limit/:search', postController.allW);
// router.get('/:id', postController.viewOne);
//
//
// router.get('/count', postController.count);
// router.post('/fileUpload', postController.fileUpload);
// router.post('/estekhdam', postController.estekhdam);
// // router.post('/login', userController.login);
// // router.get('/all/:offset/:limit', postController.all);
// router.use(loggingMiddleware);
// router.get('/myPosts/mine/:offset/:limit', postController.allWCustomer);
// router.post('/', postController.createByCustomer);
//
// //
// //
// router.put('/:id', postController.edit);
// router.delete('/:id', postController.deleteByCustomer);
export default router;