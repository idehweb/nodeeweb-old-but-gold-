import express from 'express';
const router = express.Router();
import linkController from '#controllers/link';
import global from '#root/global';
// var _id;

function loggingMiddleware(req, res, next) {
  // console.log('==>loggingMiddleware', req.headers.token);
  if (req.headers.token) {
    global.checkCustomerAuthentication(req.headers.token).then(function (response) {
      // console.log('response',response);
      req.headers.customer_id=response.customer._id;
      next();

    }).catch(function (err) {
      // console.log('err',err)
      res.status(401).json({success: false, message: 'auth!'});
    });
  } else {
    // console.log('err','no token')

    res.status(401).json({success: false, message: 'auth!'});

  }
}
// router.get('/level', linkController.level);
// router.get('/sidebar', linkController.sidebar);
// router.get('/level/:catId', linkController.level);
// router.get('/sidebar/:catId', linkController.sidebar);
// router.get('/level3/:catId', linkController.level);
// router.get('/', linkController.all);
// router.get('/:offset/:limit', linkController.all);
// router.get('/all/:offset/:limit', linkController.all);
// router.get('/all/:offset/:limit/:search', linkController.all);
router.get('/:id', linkController.viewOne);
router.get('/view/:id', linkController.viewOne);
router.get('/count', linkController.count);
router.use(loggingMiddleware);
router.post('/', linkController.create);
router.get('/myLinks/mine/:offset/:limit', linkController.allWLinks);

// router.put('/:id', linkController.edit);
router.delete('/:id', linkController.destroy);
export default router;