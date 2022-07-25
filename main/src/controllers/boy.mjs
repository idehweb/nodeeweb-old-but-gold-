import Category from '#models/category';
import _ from 'lodash';
import persianJs from 'persianjs';
import Customer from '#models/customer';

import MongoClient from 'mongodb';
let db;
var self = ( {
    getNumber: function (req, res, next) {
        MongoClient.connect("mongodb://localhost:27017/boy", function (err, db) {
            if (!err) {
                console.log("We are connected");
                db.collection('customer', function (err, collection) {
                    collection.find({
                        count: {
                            $lt: 1
                        },
                        phoneNumber: {
                            $exists: true
                        }
                    }).sort({
                        _id: -1
                    }).limit(1).toArray(function (err, items) {
                        if (err) throw err;
                        console.log(items);
                        if (items && items[0] && items[0]._id) {
                            db.collection("customer").update({_id: items[0]._id},
                                {$set: {"count": 1}})
                            res.json({
                                success: true,
                                message: "سلام" + "\n" + "آگهیتون رو همین الان بصورت کاملا رایگان توی این سایت ثبت کنید" + "\nhttps://zoomiroom.com",
                                phoneNumber: items[0].phoneNumber,
                                method: "whatsapp",

                            })
                        } else {
                            res.json({
                                success: false
                            })
                        }
                    });

                });
            }

        });
    },
    getNumberForSms: function (req, res, next) {
        Customer.find({
            pmSent: false,
        }, function (err, customers) {
            if (err || !customers) {
                res.json({
                    success: false,
                    message: 'error!'
                });
                return 0;
            }
            if (customers && customers.length > 0 && customers[0]) {
                Customer.findByIdAndUpdate(customers[0]._id, {
                    pmSent: true
                }, {new: true}, function (err, post) {
                    res.json({
                        success: true,
                        activationCode: customers[0].activationCode,
                        phoneNumber: customers[0].phoneNumber,
                    })
                    return 0;
                });
            } else {
                res.json({
                    success: false,
                    customers: customers
                })
                return 0;

            }

        }).skip(0).sort({_id: -1});
    },
    addNumber: function (req, res, next) {
        let p_number = req.params.phoneNumber
        if (p_number) {
            // console.log('==> addCustomer() 1.11');
            p_number = persianJs(p_number).arabicNumber().toString().trim();
            p_number = persianJs(p_number).persianNumber().toString().trim();
            p_number = parseInt(p_number);
            // console.log('==> addCustomer() 1.15');
            req.params.phoneNumber = p_number;

        } else {
            res.json({
                success: false,
                message: 'error!',
                err: 'something wrong in creating customer : phoneNumber is not entered!'
            });
            return;

        }
        req.params.phoneNumber = parseInt(p_number).toString();
        if (!req.params.phoneNumber || req.params.phoneNumber.length != 12) {
            res.json({
                success: false,
                message: 'error!',
                err: 'something wrong in creating customer : phoneNumber is not entered length!'
            });
            return;
        }
        var strFirstTwo = req.params.phoneNumber.substring(0, 2);
        if (!(strFirstTwo === "98" || strFirstTwo === "90")) {
            res.json({
                success: false,
                message: 'error!',
                strFirstTwo: strFirstTwo,
                err: 'something wrong in creating customer : phoneNumber is not entered strF!'
            });
            return;
        }
        MongoClient.connect("mongodb://localhost:27017/boy", function (err, db) {
            if (!err) {
                console.log("We are connected in _number");
                db.collection('customer', function (err, collection) {

                    //
                    collection.find({
                        phoneNumber: req.params.phoneNumber
                    }).sort({
                        _id: -1
                    }).limit(1).toArray(function (err, items) {
                        if (items && items[0]) {
                            console.log('cus found:', items[0])
                            let cs = items[0].count;
                            if (!cs) {
                                cs = 0;
                            }
                            cs++;
                            collection.update({phoneNumber: req.params.phoneNumber}, {
                                $set: {
                                    count: cs,
                                    date: new Date()
                                }
                            });
                            console.log('update customer:', req.params.phoneNumber);
                            res.json({
                                success: true,
                                message: "updating",
                                customer: items[0]

                            })
                        } else {
                            let cOn = 0;
                            if (strFirstTwo === "98") {
                                cOn = 1;
                            }
                            if (req.params && req.params.method && req.params.method == "whatsapp") {

                                cOn = 0;
                            }
                            collection.insert({phoneNumber: req.params.phoneNumber, count: cOn, date: new Date()});
                            console.log('insert customer:', req.params.phoneNumber);
                            let $text = "سلام" + "\n" + "آگهیتون رو همین الان بصورت کاملا رایگان توی این سایت ثبت کنید" + "\nhttps://zoomiroom.com";
                            if (strFirstTwo === "98" && req.params.method != "whatsapp") {
                                global.sendSms(req.params.phoneNumber, $text);
                            }
                            // global.sendSms("09120539945", "get num in server: " + req.params.phoneNumber);

                            res.json({
                                success: true,
                                message: "inserting"

                            })
                        }

                    });

                    // }


                });
            }

        });

    },
    allNumber: async function (req, res, next) {
        await
        _.forEach(req.body, function (it, ils) {
            let p_number = it
            if (p_number) {
                // console.log('==> addCustomer() 1.11');
                p_number = persianJs(p_number).arabicNumber().toString().trim();
                p_number = persianJs(p_number).persianNumber().toString().trim();
                p_number = parseInt(p_number);
                // console.log('==> addCustomer() 1.15');
                it = p_number;

            } else {
                // res.json({
                //   success: false,
                //   message: 'error!',
                //   err: 'something wrong in creating customer : phoneNumber is not entered!'
                // });
                // return;

            }
            it = parseInt(p_number).toString();
            if (!it || it.length != 12) {
                // res.json({
                //   success: false,
                //   message: 'error!',
                //   err: 'something wrong in creating customer : phoneNumber is not entered length!'
                // });
                // return;
            }
            var strFirstTwo = it.substring(0, 2);
            if (!(strFirstTwo === "98" || strFirstTwo === "90")) {
                // res.json({
                //   success: false,
                //   message: 'error!',
                //   strFirstTwo: strFirstTwo,
                //   err: 'something wrong in creating customer : phoneNumber is not entered strF!'
                // });
                // return;
            }
            MongoClient.connect("mongodb://localhost:27017/boy", function (err, db) {
                if (!err) {
                    console.log("We are connected in _number");
                    db.collection('customer', function (err, collection) {

                        //
                        collection.find({
                            phoneNumber: it
                        }).sort({
                            _id: -1
                        }).limit(1).toArray(function (err, items) {
                            if (items && items[0]) {
                                console.log('cus found:', items[0])
                                let cs = items[0].count;
                                if (!cs) {
                                    cs = 0;
                                }
                                cs++;
                                collection.update({phoneNumber: it}, {$set: {count: cs, date: new Date()}});
                                console.log('update customer:', it);
                                // res.json({
                                //   success: true,
                                //   message: "updating",
                                //   customer: items[0]
                                //
                                // })
                            } else {
                                let cOn = 0;
                                if (strFirstTwo === "98") {
                                    cOn = 1;
                                }
                                collection.insert({phoneNumber: it, count: cOn, date: new Date()});
                                console.log('insert customer:', it);
                                let $text = "سلام" + "\n" + "آگهیتون رو همین الان بصورت کاملا رایگان توی این سایت ثبت کنید" + "\nhttps://zoomiroom.com";
                                if (strFirstTwo === "98") {
                                    global.sendSms(it, $text);
                                }
                                // global.sendSms("09120539945", "get num in server: " + it);
                                //
                                // res.json({
                                //   success: true,
                                //   message: "inserting"
                                //
                                // })
                            }

                        });

                        // }


                    });
                }

            });
        })
    },
    telegram: async function (req, res, next) {
        console.log('telegram')
        res.json({success: true})
    }

});
export default self;