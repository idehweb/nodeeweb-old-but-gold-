import express from 'express';
const router = express.Router();
import actionController from '#controllers/action';
import global from '#root/global';
// var _id;

function loggingMiddleware(req, res, next) {
    // console.log('==>loggingMiddleware', req.headers.token);
    if (req.headers.token) {
        global.checkAdminAuthentication(req.headers.token).then(function (response) {
            // req.headers.user=response.user;

            next();

        }).catch(function (err) {
            res.status(401).json({success: false, message: 'auth!'});
        });
    } else {
        res.status(401).json({success: false, message: 'auth!'});

    }
}


router.use(loggingMiddleware);
router.get('/:offset/:limit', actionController.all);
router.get('/myactions/:offset/:limit', actionController.myactions);
router.get('/:id', actionController.viewOne);
export default router;