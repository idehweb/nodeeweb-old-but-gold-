import express from 'express';
const router = express.Router();
import storyController from '#controllers/story';
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
// console.log('here');
// router.get('/myPost/:id', storyController.viewOneMyPost);
// router.get('/f/:id', storyController.viewOneF);
// router.get('/', storyController.allW);
// router.get('/postsByCat/:_id/:offset/:limit', storyController.postsByCat);
// router.get('/postsByCat/:_id/:offset/:limit/:search', storyController.postsByCat);
// router.get('/all/:offset/:limit', storyController.allW);
// router.get('/all/:offset/:limit/:search', storyController.allW);

router.get('/view/:id', storyController.viewOne);
router.get('/getContactData/:id', storyController.getContactData);
// router.get('/:offset/:limit/', storyController.allW);
// router.get('/:offset/:limit/:search', storyController.allW);
router.get('/:id', storyController.viewOne);


router.get('/count', storyController.count);
// router.post('/fileUpload', storyController.fileUpload);
// router.post('/estekhdam', storyController.estekhdam);
// router.post('/login', userController.login);
// router.get('/all/:offset/:limit', storyController.all);
router.use(loggingMiddleware);
// router.get('/myPosts/mine/:offset/:limit', storyController.allWCustomer);
// router.post('/', storyController.createByCustomer);

//
//
router.put('/:id', storyController.edit);
// router.delete('/:id', storyController.deleteByCustomer);

export default router;