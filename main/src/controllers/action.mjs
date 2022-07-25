import Action from '#models/action';

var self = ( {
    all: function (req, res, next) {
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        if (req.query.user) {

            search['user']=req.query.user;

        }
        if (req.query.product) {

            search['product']=req.query.product;

        }
        Action.find(search,'user , customer , _id , title , createdAt', function (err, actions) {

            if (err || !actions) {
                res.json({
                    success: false,
                    message: 'error!',
                    actions: actions
                });
                return 0;
            }
            Action.countDocuments({}, function (err, count) {
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
                res.json(actions);
                return 0;


            });

        }).populate('customer','phoneNumber firstName lastName _id').populate('product','title _id').populate('user','username _id nickname').skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
    },
    myactions: function (req, res, next) {
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        if (req.headers.user && req.headers.token) {

            search['user']=req.headers.user._id;

        }

        console.log('search',search);
        Action.find(search,'user , customer , _id , title , createdAt', function (err, actions) {

            if (err || !actions) {
                res.json({
                    success: false,
                    message: 'error!',
                    actions: actions
                });
                return 0;
            }
            Action.countDocuments({}, function (err, count) {
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
                res.json(actions);
                return 0;


            });

        }).populate('customer','phoneNumber firstName lastName _id').populate('user','username _id nickname').skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
    },

    viewOne: function (req, res, next) {

        Action.findById(req.params.id,
            function (err, action) {
                if (err || !action) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                res.json(action);
                return 0;

            }).populate('customer','phoneNumber firstName lastName _id').populate('user','username _id nickname');
    },
    create: function (body) {
        return new Promise(function (resolve, reject) {

            Action.create(body, function (err, action) {
                if (err || !action) {
                    reject({
                        err: err,
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                resolve(action);
                return 0;

            });
        });
    },
    count: function (req, res, next) {
        Action.countDocuments({}, function (err, count) {
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
    }
    ,


});
export default self;