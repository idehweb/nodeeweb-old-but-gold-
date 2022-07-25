import Media from '#models/media';
import _ from 'lodash';
import fs from "fs";
import path from "path";

var self = ( {
    all: function (req, res, next) {
        // console.log('fetch all...');
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};

        // console.log('search', search);
        Media.find(search, function (err, medias) {
            // console.log('err', err);
            // console.log('medias', medias);
            if (err || !medias) {
                res.json({
                    success: false,
                    message: 'error!',
                    medias: medias
                });
                return 0;
            }
            Media.countDocuments({}, function (err, count) {
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
                res.json(medias);
                return 0;


            });

        }).skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
    },
    allS: function (req, res, next) {
        return new Promise(function (resolve, reject) {
            let offset = 0;
            if (req.params.offset) {
                offset = parseInt(req.params.offset);
            }

            let search = {};

            Media.find(search, function (err, medias) {
                if (err || !medias) {
                    resolve([]);

                }
                Media.countDocuments({}, function (err, count) {
                    // console.log('countDocuments', count);
                    if (err || !count) {
                        resolve([]);

                    }
                    res.setHeader(
                        "X-Total-Count",
                        count
                    );
                    _.forEach(medias, (c) => {
                        c.name = c['name'][req.headers.lan];
                        // console.log(c);
                    });
                    resolve(medias);


                });

            }).skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
        });
    },

    viewOne: function (req, res, next) {

        Media.findById(req.params.id,
            function (err, media) {
                if (err || !media) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                res.json(media);
                return 0;

            });
    }
    ,
    create: function (req, res, next) {
        // console.log('creating media...', req.body);

        Media.create(req.body, function (err, media) {
            if (err || !media) {
                res.json({
                    err: err,
                    success: false,
                    message: 'error!'
                });
                return 0;
            }
            res.json(media);
            return 0;

        });
    }
    ,
    destroy: function (req, res, next) {

        Media.findByIdAndDelete(req.params.id,
            function (err, media) {
                if (err || !media) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                let fghyu=path.join("../","public",media.url);
                fs.unlink(fghyu,(errf,result)=> {
                    if (errf) {
                        res.json({
                            dfgh:fghyu,
                            success: false,
                            message: 'error!',
                            errf:errf,
                            result:result
                        });
                        return 0;
                    }
                    res.json({
                        success: true,
                        result:result,
                        message: 'Deleted!'
                    });
                    return 0;

                });


            }
        );
    }
    ,
    edit: function (req, res, next) {
        Media.findByIdAndUpdate(req.params.id, req.body, function (err, media) {
            if (err || !media) {
                res.json({
                    success: false,
                    message: 'error!'
                });
                return 0;
            }

            res.json(media);
            return 0;

        });
    }
    ,
    count: function (req, res, next) {
        Media.countDocuments({}, function (err, count) {
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