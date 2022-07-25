import Sms from '#models/sms';

var self = ( {
    all: function (req, res, next) {
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};

        Sms.find(search, function (err, smss) {
            if (err || !smss) {
                res.json({
                    success: false,
                    message: 'error!'
                });
                return 0;
            }
            Sms.countDocuments({}, function (err, count) {
                // console.log('countDocuments', count);
                if (err || !count) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                res.setHeader(
                    "X-Total-Count",
                    count
                );
                res.json(smss);
                return 0;


            });

        }).populate('customer', 'firstName _id lastName phoneNumber').skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
    },

    viewOne: function (req, res, next) {
        console.log('hgfgh');
        Sms.findById(req.params.id,
            function (err, sms) {
                if (err || !sms) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                res.json(sms);
                // console.log('hg')
                // res.redirect('https://zoomiroom.com/p/5e8e13a546341b5d60fe01b8/%D8%A7%DB%8C%D8%B1%D9%BE%D8%A7%D8%AF_-_airpod_-_%D9%87%D9%86%D8%AF%D8%B2%D9%81%D8%B1%DB%8C_%D8%A8%D9%84%D9%88%D8%AA%D9%88%D8%AB%DB%8C');
                return 0;

            });
    },

    create: function (req, res, next) {
        // console.log('creating sms...', req.body);
        // res.json(req.body.data);
        // return 0;
        req.body.customer = req.headers.customer_id;

        let p_number = req.body.phoneNumber
        if (p_number) {
            p_number = p_number.replace(/\s/g, '');
            // console.log('==> addCustomer() 1.11');
            p_number = persianJs(p_number).arabicNumber().toString().trim();
            p_number = persianJs(p_number).persianNumber().toString().trim();
            p_number = parseInt(p_number);
            // console.log('==> addCustomer() 1.15');
            req.body.phoneNumber = p_number;
            if (p_number.toString().length < 12) {
                console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
                if (p_number.toString().length === 10) {
                    p_number = "98" + p_number.toString();
                }
            }
            console.log(p_number);

            if (isNaN(p_number)) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: 'something wrong in sending sms!'
                });
                return;
            }
        } else {
            res.json({
                success: false,
                message: 'error!',
                err: 'something wrong in sending sms! : phoneNumber is not entered!'
            });
            return;

        }
        let NUMBER = parseInt(p_number).toString();
        var strFirstTwo = NUMBER.substring(0, 2);
        if (!(strFirstTwo === "98" || strFirstTwo === "90")) {
            res.json({
                success: false,
                message: 'error!',
                strFirstTwo: strFirstTwo,
                err: 'something wrong in creating customer : phoneNumber is not entered strFTT!'
            });
            return;
        }
        console.log('this is phone number:', NUMBER);
        req.body.phoneNumber = NUMBER;
        req.body.status = 'send';
        if (req.body.customer && req.body.phoneNumber && req.body.message)
            Sms.create(req.body, function (err, sms) {
                if (err || !sms) {
                    res.json({
                        err: err,
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                let objd = {};
                let sender = req.headers.customer_phoneNumber;
                $tz = req.body.phoneNumber + "\n";
                $tz += req.body.message;
                $tz += "\nsender: " + sender;


                objd.message = $tz;
                console.log('objd', objd);
                global.notifateToTelegram(objd).then(function (f) {
                    console.log('f', f);
                    // res.json({success: true});
                    // return 0;
                });

                let $text;
                $text = req.body.message;
                console.log('sender is: ', sender);
                console.log('receiver is: ', req.body.phoneNumber);
                let x = '10002625252525';
                if (sender.toString() === "989015820919" && req.body.phoneNumber.toString() !== "989015820919") {
                    console.log('h')
                    $text = "تبلیغات با بازدهی بالا و ثبت آگهی رایگان در";
                    $text += "\n" + "https://zoomiroom.com";
                    x = '300088103373';
                } else if (sender.toString() === "989015820919" && req.body.phoneNumber.toString() === "989015820919") {
                    console.log('as')
                    $text = req.body.message;
                }
                global.sendSms(NUMBER, $text, x).then(function (uid) {

                });

                res.json({success: true});

            });
        else {
            res.json({
                err: err,
                success: false,
                message: 'error!'
            });
            return 0;
        }
    },
    createByAdmin: function (req, res, next) {
        console.log('creating sms...', req.body);
        // res.json(req.body.data);
        // return 0;
        // req.body.customer = req.headers.customer_id;
        let p_number = req.body.phoneNumber;
        if (p_number) {
            p_number = p_number.replace(/\s/g, '');
            // console.log('==> addCustomer() 1.11');
            p_number = persianJs(p_number).arabicNumber().toString().trim();
            p_number = persianJs(p_number).persianNumber().toString().trim();
            p_number = parseInt(p_number);
            // console.log('==> addCustomer() 1.15');
            req.body.phoneNumber = p_number;
            if (p_number.toString().length < 12) {
                console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
                if (p_number.toString().length === 10) {
                    p_number = "98" + p_number.toString();
                }
            }
            console.log(p_number);

            if (isNaN(p_number)) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: 'something wrong in sending sms!'
                });
                return;
            }
        } else {
            res.json({
                success: false,
                message: 'error!',
                err: 'something wrong in sending sms! : phoneNumber is not entered!'
            });
            return;

        }
        let NUMBER = parseInt(p_number).toString();
        console.log('NUMBER', NUMBER);
        var strFirstTwo = NUMBER.substring(0, 2);
        if (!(strFirstTwo === "98" || strFirstTwo === "90")) {
            res.json({
                success: false,
                message: 'error!',
                strFirstTwo: strFirstTwo,
                err: 'something wrong in creating customer : phoneNumber is not entered strFTT!'
            });
            return;
        }
        console.log('this is phone number:', NUMBER);
        req.body.phoneNumber = NUMBER;
        req.body.status = 'unsend';
        // req.body.message = 'unsend';
        // Sms.create(req.body, function (err, sms) {
        //     if (err || !sms) {
        //         res.json({
        //             err: err,
        //             success: false,
        //             success: false,
        //             message: 'error!'
        //         });
        //         return 0;
        //     }
        let objd = {};
        let $text;
        $text = req.body.message;
        let x = '300088103373';
        global.sendSms(NUMBER, $text, x, null, '98').then(function (uid) {

        });

        res.json({success: true});

        // });

    },
    createAdmin: function (obj) {
        return new Promise(function (resolve, reject) {

            Sms.create(obj, function (err, sms) {
                if (err || !sms) {
                    reject(err);
                    // res.json({
                    //     err: err,
                    //     success: false,
                    //     message: 'error!'
                    // });
                    // return 0;
                }
                resolve(sms);
                // return 0;
                // res.json({success: true});

            });

        });
    },
    editByAdmin: function (_id, obj) {
        return new Promise(function (resolve, reject) {
            obj['updatedAt'] = new Date();

            Sms.findByIdAndUpdate(_id, obj, function (err, sms) {
                if (err || !sms) {
                    reject(err);
                    // res.json({
                    //     err: err,
                    //     success: false,
                    //     message: 'error!'
                    // });
                    // return 0;
                }
                resolve(sms);
                // return 0;
                // res.json({success: true});

            });

        });
    },
    destroy: function (req, res, next) {
        Sms.findByIdAndDelete(req.params.id,
            function (err, sms) {
                if (err || !sms) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                res.json({
                    success: true,
                    message: 'Deleted!'
                });
                return 0;


            }
        );
    },
    edit: function (req, res, next) {
        Sms.findByIdAndUpdate(req.params.id, req.body, function (err, sms) {
            if (err || !sms) {
                res.json({
                    success: false,
                    message: 'error!'
                });
                return 0;
            }

            res.json(sms);
            return 0;

        });
    },
    editAdmin: function (req, res, next) {
        console.log('editAdmin')
        if (!req.headers.lan) {
            req.headers.lan = 'fa';
        }
        Sms.findByIdAndUpdate(req.params.id, req.body, function (err, sms) {
            if (err || !sms) {
                res.json({
                    success: false,
                    message: 'error!'
                });
                return 0;
            }
            if (req.body.status === 'send') {
                let $text;
                $text = sms.message;
                global.sendSms(sms.phoneNumber, $text, '10002625252525').then(function (uid) {

                });

            }


            res.json(sms);
            return 0;

        }).populate('customer');
    },

    count: function (req, res, next) {
        Sms.countDocuments({}, function (err, count) {
            // console.log('countDocuments', count);
            if (err || !count) {
                res.json({
                    success: false,
                    message: 'error!'
                });
                return 0;
            }

            res.json({
                success: true,
                count: count
            });
            return 0;


        });
    },


});
export default self;