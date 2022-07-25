import express from 'express';
const router = express.Router();
import customerController from '#controllers/customer';
import Order from "#models/order";
import global from '#root/global';
// var _id;
import request from "#root/request";

function loggingMiddleware(req, res, next) {
    // console.log('==>loggingMiddleware', req.headers.token);
    if (req.headers.token) {
        global.checkCustomerAuthentication(req.headers.token).then(function (response) {
            // console.log('response',response);
            req.headers.customer_id = response.customer._id;
            req.headers.customer = response.customer;

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

router.post('/chapar', (req, res, next) => {
    Order.findById(
        "626e615d35102f7ac76066d5",
        function (err, order) {
            console.log('chapar', order.deliveryDay.theid );
            if (order.deliveryDay && order.deliveryDay.theid == 'chapar') {
                let sumTitles = '', theTotal = 0;
                order.package.map((car) => {
                    sumTitles += car.product_name + ' , ';
                    theTotal += car.total_price;
                });
                let ddd=new Date();
                let string='{"user": {"username": "vira.tejarat","password": "42528000"},"bulk": [{"cn": {"reference": ' + order.orderNumber + ',"date": "' + ddd.getUTCFullYear()+'-0'+ddd.getMonth()+'-0'+ddd.getUTCDate() + '","assinged_pieces": "' + order.card.length + '","service": "1","value": "' + theTotal + '","payment_term": 0,"weight": "1","content":"' + sumTitles + '","change_state_url":""},"sender": {"person": "حسین محمدی","company": "شرکت گارانتی آروند","city_no": "10866","telephone": "+982142528000","mobile": "989024252802","email": "info@localhost:3001","address": "تهران، کاووسیه، بلوار میرداماد، پلاک ۴۹۶، مجتمع پایتخت، بلوک A، طبقه ۹، واحد ۹۰۱","postcode": "1969763743"},"receiver": {"person": "' + (order.customer.firstName + ' ' + order.customer.lastName) + '","company": "","city_no": "' + order.billingAddress.City_no + '","telephone": "' + order.billingAddress.PhoneNumber + '","mobile": "' + order.customer.phoneNumber + '","email": "test@test.com","address": "' + (order.billingAddress.State + ' ' + order.billingAddress.City + ' ' + order.billingAddress.StreetAddress) + '","postcode": "' + order.billingAddress.PostalCode + '"}}]}';
                var options = {
                    method: 'POST',
                    url: 'https://app.krch.ir/v1/bulk_import',
                    headers: {'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'},
                    formData: {input: string}
                };
                // options = { method: 'POST',
                //     url: 'https://app.krch.ir/v1/bulk_import',
                //     headers: { 'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
                //     formData: { input: '{\n\t"user": {\n\t\t"username": "vira.tejarat",\n\t\t"password": "42528000"\n\t},\n\t"bulk": [{\n\t\t"cn": {\n\t\t\t"reference": 12555,\n\t\t\t"date": "2019-05-13",\n\t\t\t"assinged_pieces": "1",\n\t\t\t"service": "1",\n\t\t\t"value": "3350000.00",\n\t\t\t"payment_term": 0,\n\t\t\t"weight": "1",\n                       "content":"شیشه و سنگ",\n                       "change_state_url":""\n\t\t},\n\t\t"sender": {\n\t\t\t"person": "آزمایشی فرستنده",\n\t\t\t"company": "شرکت فرستنده",\n\t\t\t"city_no": "10866",\n\t\t\t"telephone": "+9888288475",\n\t\t\t"mobile": "989123181638",\n\t\t\t"email": "sender@test.com",\n\t\t\t"address": "آزمایشی فرستنده",\n\t\t\t"postcode": "10770"\n\t\t},\n\t\t"receiver": {\n\t\t\t"person": "آزمایشی گیرنده",\n\t\t\t"company": "شرکت گیرنده",\n\t\t\t"city_no": "10770",\n\t\t\t"telephone": "+9888269464",\n\t\t\t"mobile": "989034538660",\n\t\t\t"email": "test@test.com",\n\t\t\t"address": "آزمایشی گیرنده",\n\t\t\t"postcode": "10770"\n\t\t}\n\t}]\n}' } };

                request(options, function (error, response, body) {
                    if (error) throw new Error(error);
                    console.log("chaparBody:", body);

                    res.json({"body":body,"options":(string)});
                });
            }
        }).populate('customer', '_id firstName lastName phoneNumber');

});

router.get('/getNumber', customerController.getNumber);

router.post('/authCustomer', customerController.authCustomer);
router.post('/authCustomerForgotPass', customerController.authCustomerForgotPass);
router.post('/setPasswordWithPhoneNumber', customerController.setPasswordWithPhoneNumber);
router.post('/authCustomerWithPassword', customerController.authCustomerWithPassword);
router.post('/activateCustomer', customerController.activateCustomer);
router.get('/loginWithGoogle', customerController.loginWithGoogle);
router.get('/validateWithGoogle', customerController.validateWithGoogle);
router.post('/validateTokenWithGoogle', customerController.validateTokenWithGoogle);
router.get('/getContactData', customerController.getContactData);
router.use(loggingMiddleware);
router.post('/setPassword', customerController.setPassword);

router.get('/view', customerController.viewOneCustomerByCus);
// router.get('/viewHistory/:offset/:limit', customerController.viewHistory);
// router.get('/chancesCode/:offset/:limit', customerController.chancesCode);
router.get('/wishlist', customerController.getWishlist);
router.post('/wishlist/:_id', customerController.wishlist);
router.put('/photo', customerController.photo);
router.put('/updateAddress', customerController.updateAddress);
router.post('/updateNotifToken/:notification_token', customerController.updateNotifToken);
router.put('/', customerController.editWL);
export default router;
