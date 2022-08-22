import User from '#models/user';
import global from '#root/global';

var self = ({
    all: function (req, res, next) {
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        User.find(function (err, users) {

            if (err || !users) {
                res.json({
                    success: false,
                    message: 'error!'
                });
                return 0;
            }
            User.countDocuments({}, function (err, count) {
                console.log('countDocuments', count);
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
                res.json(users);
                return 0;


            });

        }).skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
    },
    viewOne: function (req, res, next) {

        User.findById(req.params.id,
            function (err, user) {
                if (err || !user) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                res.json(user);
                return 0;

            });
    },
    create: function (req, res = {}, next = {}) {
        // console.log('creating user...',req);
        return new Promise(function (resolve, reject) {
            User.create(req.body, function (err, user) {
                if (err) {
                    // console.log('error',err)
                    reject(err);
                } else {
                    // console.log('user',user)
                    resolve(user);
                }
            });
        });

    },
    exists: function (req, res, next) {
        return new Promise(function (resolve, reject) {
            User.exists({}, function (err, user) {
                if (err || !user) {
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        });

    },
    destroy: function (req, res, next) {
        User.findByIdAndDelete(req.params.id,
            function (err, user) {
                if (err || !user) {
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
        User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
            if (err || !user) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: err
                });
                return 0;
            }

            res.json(user);
            return 0;


        });
    },
    count: function (req, res, next) {
        User.countDocuments({}, function (err, count) {
            console.log('countDocuments', count);
            if (err) {
                res.json({
                    success: false,
                    err: err
                })

            }
            res.json({
                success: true,
                count: count
            })


        });
    },
    login: function (req, res, next) {
        if (req.body.identifier && req.body.password) {
            User.authenticate(req.body.identifier, req.body.password, function (error, user) {
                if (error || !user) {
                    let err = new Error('Wrong email or password.');
                    err.status = 401;
                    res.status(401);
                    return res.json({'success': false, 'message': 'نام کاربری یا رمز عبور اشتباه!'});
                } else {
                    // req.session.userId = user._id;
                    return res.json({'success': true, 'message': 'در حال ریدایرکت...', 'user': user});
                }
            });
        } else {
            let err = new Error('All fields required.');
            err.status = 400;
            return res.json({'success': false, 'message': 'لطفا تمامی فیلد ها را تکمیل کنید!'});
        }
    },
    register: function (req, res, next) {
        // console.log('registering user...')
        if (req.body.email &&
            req.body.username &&
            req.body.password) {

            // let userData = req.body;
            req.body.type = 'user';
            req.body.nickname = req.body.username;
            // userData.type = 'user';
            // userData.token = global.generateUnid();
            req.body.token = global.generateUnid();
            // console.log(req)

            self.create(req).then(e => {
                if (res)
                    return res.json({'success': true, 'message': 'ساخته شد'});
                else
                    return ({'success': true, 'message': 'ساخته شد'})
            }).catch(e => {
                if (res)
                    return res.json({err: e});
                else
                    return ({err: e})
            })

            // User.create(userData, function (error, user) {
            //     if (error) {
            //
            //     } else {
            //
            //     }
            // });

        }
    },
});
export default self;