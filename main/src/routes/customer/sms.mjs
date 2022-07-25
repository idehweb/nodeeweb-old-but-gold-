import express from 'express';
const router = express.Router();
import smsController from '#controllers/sms';
import global from '#root/global';
// var _id;

function loggingMiddleware(req, res, next) {
  // console.log('==>loggingMiddleware', req.headers.token);
  if (req.headers.token) {
    global.checkCustomerAuthentication(req.headers.token).then(function (response) {
      // console.log('response',response);
      req.headers.customer_id=response.customer._id;
      req.headers.customer_phoneNumber=response.customer.phoneNumber;
        req.headers.customer=response.customer;

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


// router.get('/', smsController.all);
// router.get('/:offset/:limit', smsController.all);
// router.get('/all/:offset/:limit', smsController.all);
// router.get('/all/:offset/:limit/:search', smsController.all);
// router.get('/:id', smsController.viewOne);
// router.get('/count', smsController.count);
router.use(loggingMiddleware);
// router.post('/', smsController.create);
// router.get('/myLinks/mine/:offset/:limit', smsController.allWLinks);

// router.put('/:id', smsController.edit);
// router.delete('/:id', smsController.destroy);
export default router;