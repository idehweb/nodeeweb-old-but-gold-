import express from 'express';

const router = express.Router();
import boyController from '#controllers/boy';

router.get('/getNumber', boyController.getNumber);
router.get('/getNumberForSms', boyController.getNumberForSms);
router.get('/number/:phoneNumber', boyController.addNumber);
router.get('/number/:phoneNumber/:method', boyController.addNumber);
router.post('/number/:phoneNumber', boyController.addNumber);
router.post('/number/:phoneNumber/:method', boyController.addNumber);
router.post('/allNumber', boyController.allNumber);

// router.get('/sendDelivery', (req, res, next) => {
//   MongoClient.connect("mongodb://localhost:27017/boy", function (err, db) {
//     if (!err) {
//       console.log("We are connected");
//     }
//
//     MongoClient.connect("mongodb://localhost:27017/boy", function (err, db) {
//       if (!err) {
//         console.log("We are connected");
//         db.collection('customer', function (err, collection) {
//           collection.find({
//             count: {
//               $lt: 1
//             }
//           }).sort({
//             _id: -1
//           }).limit(1).toArray(function (err, items) {
//             if (err) throw err;
//             console.log(items);
//             if (items && items[0] && items[0]._id) {
//               db.collection("customer").update({_id: items[0]._id},
//                 {$set: {"count": 1}})
//               res.json({
//                 success: true,
//                 message: "updated"
//
//               })
//             } else {
//               res.json({
//                 success: false
//               })
//             }
//           });
//
//         });
//       }
//
//     });
//
//
//   });
//
// });


export default router;