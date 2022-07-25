import Notification from '#models/notification';
import _ from 'lodash';
var self = ( {
    all: function (req, res, next) {
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};

        Notification.find(search, function (err, notifications) {
            if (err || !notifications) {
                res.json({
                    success: false,
                    message: 'error!'
                });
                return 0;
            }
            Notification.countDocuments({}, function (err, count) {
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
                res.json(notifications);
                return 0;


            });

        }).skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
    },
    viewOne: function (req, res, next) {

        Notification.findById(req.params.id,
            function (err, notification) {
                if (err || !notification) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return 0;

                }
                res.json(notification);
                return 0;


            });
    },
    create: function (req, res, next) {
        Notification.create(req.body, function (err, notification) {
            if (err || !notification) {
                res.json({
                    success: false,
                    message: 'error!'
                });
                return 0;

            }
            res.json(notification
            );
            return 0;


        });
    },
    destroy: function (req, res, next) {
        Notification.findByIdAndDelete(req.params.id,
            function (err, notification) {
                if (err || !notification) {
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
        Notification.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, notification) {
            if (err || !notification) {
                res.json({
                    success: false,
                    message: 'error!'
                });
                return 0;

            }

            res.json(notification);
            return 0;


        });
    },
    count: function (req, res, next) {
        Notification.countDocuments({}, function (err, count) {
            console.log('countDocuments', count);
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