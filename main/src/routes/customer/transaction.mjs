import express from 'express';
const router = express.Router();
import transaction_controller from '#controllers/transaction';
import global from '#root/global';
// const multer  from 'multer')
// const upload = multer();



function loggingMiddleware(req, res, next) {
    // console.log('req',req);
    // console.log('==>loggingMiddleware', req.headers);
    if (req.headers.token) {
        global.checkCustomerAuthentication(req.headers.token).then(function (response) {
            req.headers.customer = response.customer;
            
            // console.log('req.headers.customer_id',response)
            // req.headers.customer_phone_number = response.customer.phone_number;
            // req.headers.customer_question_credit = response.customer.question_credit;
            // req.headers.customer_name = response.customer.name;
            // req.headers.customer_lname = response.customer.lname;
            // req.headers.customer_nickname = response.customer.nickname;
            // console.log('user auth pass:', response.customer._id);

            next();

        }).catch(function (err) {
            res.status(401).json({success: false, message: 'auth!'});
        });
    } else {
        res.status(401).json({success: false, message: 'auth!'});

    }
}
router.post('/status/', transaction_controller.statusZibal);
router.get('/status/', transaction_controller.statusZibal);
router.post('/verify/:bank_token', transaction_controller.verify);
// router.get('/order/:token/:pid', transaction_controller.buyt);
router.get('/buy/:_id', transaction_controller.buyZibal);
router.post('/buy/:_id', transaction_controller.buyZibal);
router.get('/buy/:_id/:_price', transaction_controller.buyZibal);
router.post('/buy/:_id/:_price', transaction_controller.buyZibal);

// router.get('/prepare/', transaction_controller.preparePay);
// app.post('/customer/transaction/prepare/',upload.none(), transaction_controller.preparePay);
// router.post('/customer/transaction/prepare', transaction_controller.preparePay);
// router.post('/customer/transaction/payme', transaction_controller.payme);
// router.post('/payme', transaction_controller.payme);
// router.post('/prepare/', transaction_controller.preparePay);
// router.post('/customer/transaction/complete/', transaction_controller.completePay);
router.use(loggingMiddleware);

// router.get('/all/:offset/:limit', transaction_controller.allW);
// router.get('/all/:offset/:limit/:search', transaction_controller.all);
// router.get('/view/:id', transaction_controller.viewOne);
// router.get('/count', transaction_controller.count);


// router.post('/buywithclick/:_id', transaction_controller.preparePay);

router.post('/update/:_id', transaction_controller.update);
// router.post('/buyWithCredit/:package_id', transaction_controller.buyWithCredit);


// router.post('/', transaction_controller.create);
// router.put('/:id', transaction_controller.edit);
// router.delete('/:id', transaction_controller.destroy);
export default router;