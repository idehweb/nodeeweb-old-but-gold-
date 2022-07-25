import express from 'express';
const router = express.Router();
import orderController from '#controllers/order';
import global from '#root/global';
// var _id;

function loggingMiddleware(req, res, next) {
  // console.log('==>loggingMiddleware', req.headers.token);
  if (req.headers.token) {
    global.checkCustomerAuthentication(req.headers.token).then(function (response) {
      // console.log('response',response);
      req.headers.customer_id=response.customer._id;
        req.headers.customer=response.customer;

        next();

    }).catch(function (err) {
      console.log('err',err)
      res.status(401).json({success: false, message: 'auth!'});
    });
  } else {
    console.log('err','no token')

    res.status(401).json({success: false, message: 'auth!'});

  }
}
router.post('/cart', orderController.createCart);
router.post('/cart/:id', orderController.createCart);

router.use(loggingMiddleware);
router.post('/', orderController.create);

router.get('/chapar', orderController.chapar);

router.get('/view/:id', orderController.viewOneF);
router.get('/myOrders/mine/:offset/:limit', orderController.allWOrders);
router.get('/myOrder/mine/:id', orderController.myOrder);
router.get('/mySells/mine/:offset/:limit', orderController.allWSells);

// router.put('/:id', orderController.edit);
router.delete('/:id', orderController.destroy);
export default router;