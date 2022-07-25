import Menu from '#models/menu';
import Post from '#models/post';
import _ from 'lodash';
import request from '#root/request';
import Mongoose from 'mongoose';
var self = ( {
    all: function (req, res, next) {
        if (req.query.f) {
            self.s(req, res, next);
        } else {
            console.log('fetch all...');
            let offset = 0;
            if (req.params.offset) {
                offset = parseInt(req.params.offset);
            }

            let search = {};
            // search["name." + req.headers.lan] = {
            //   $exists: true
            // };
            if (req.query.Search) {

                search["name." + req.headers.lan] = {
                    $exists: true,
                    "$regex": req.query.Search,
                    "$options": "i"
                };
            }
            // console.log('search', search);
            Menu.find(search, function (err, menus) {
                // console.log('err', err);
                // console.log('menus', menus);
                if (err || !menus) {
                    res.json({
                        success: false,
                        message: 'error!',
                        menus: menus
                    });
                    return 0;
                }
                Menu.countDocuments({}, function (err, count) {
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
                    res.json(menus);
                    return 0;


                });

            }).skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
        }
    },
    f: function (req, res, next) {
        // console.log('fetch all f...');
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        search["parent"] = {
            $exists: false
        };
        // console.log('search', search);
        Menu.find(search, function (err, menus) {
            // console.log('err', err);
            // console.log('menus', menus);
            if (err || !menus) {
                res.json({
                    success: false,
                    message: 'error!',
                    menus: menus
                });
                return 0;
            }
            Menu.countDocuments({}, function (err, count) {
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
                res.json(menus);
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
            search["name." + req.headers.lan] = {
                $exists: true
            };
            Menu.find(search, function (err, menus) {
                if (err || !menus) {
                    resolve([]);

                }
                Menu.countDocuments({}, function (err, count) {
                    // console.log('countDocuments', count);
                    if (err || !count) {
                        resolve([]);

                    }
                    res.setHeader(
                        "X-Total-Count",
                        count
                    );
                    _.forEach(menus, (c) => {
                        c.name = c['name'][req.headers.lan];
                        // console.log(c);
                    });
                    resolve(menus);


                });

            }).skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
        });
    },
    level:

        function (req, res, next) {
            let offset = 0;
            if (req.params.offset) {
                offset = parseInt(req.params.offset);
            }

            let search = {};
            if (!req.params.catId) {
                search['parent'] = null;
            } else {
                search['parent'] = req.params.catId;
            }
            search["name." + req.headers.lan] = {
                $exists: true
            };
            // console.log(search);
            Menu.find(search, function (err, menus) {
                if (err || !menus) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                Menu.countDocuments({}, function (err, count) {
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
                    _.forEach(menus, (c) => {
                        c.name = c['name'][req.headers.lan];
                        // console.log(c);
                    });
                    res.json(menus);
                    return 0;


                });

            }).skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
        }

    ,
    s: function (req, res, next) {
        // console.log('s()...');
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        if (!req.params._id) {
            search['parent'] = null;
        } else {
            search['parent'] = req.params._id;
        }
        // search["name." + req.headers.lan] = {
        //     $exists: true
        // };

        console.log('jhgfghj', search);
        Menu.find(search, function (err, menus) {
            if (err) {
                res.json({
                    err:err,
                    success: false,
                    message: 'error!',
                    menus
                });
                // res.json([]);
                return 0;
            }
            if (!menus) {
                menus = [];
                // res.json({
                //     success: true,
                //     message: 'error!'
                // });
                // return 0;
            }
            // console.log(menus);
            _.forEach(menus, (c) => {
                c.name = c['name'][req.headers.lan];
                // console.log(c);
            });
            // menus.push({});
            Menu.countDocuments({}, function (err, count) {
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
                if (req.params._id)
                    Menu.findById(req.params._id, function (err, mainCat) {
                        // console.log('here');
                        // if (menus && menus.length >= 0) {
                        //   if (mainCat) {
                        //     mainCat.back = true;
                        //     mainCat.name = mainCat['name'][req.headers.lan];
                        //     menus[menus.length] = mainCat;
                        //   }
                        // }
                        res.json(menus.reverse());
                        return 0;
                    }).lean();
                else {
                    res.json(menus.reverse());
                    return 0;
                }


            });

        }).skip(offset).sort({_id: -1}).limit(req.params.limit).lean();
    },
    sidebar: function (req, res, next) {
        // console.log('sidebar()...');
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        if (!req.params.catId) {
            search['parent'] = null;
        } else {
            search['parent'] = req.params.catId;
        }
        search["name." + req.headers.lan] = {
            $exists: true
        };
        // console.log('jhgfghj', search);
        Menu.find(search, function (err, menus) {
            if (err) {
                res.json({
                    success: false,
                    message: 'error!'
                });
                return 0;
            }
            if (!menus) {
                menus = [];
                // res.json({
                //     success: true,
                //     message: 'error!'
                // });
                // return 0;
            }
            // console.log(menus);
            _.forEach(menus, (c) => {
                c.name = c['name'][req.headers.lan];
                // console.log(c);
            });
            Menu.countDocuments({}, function (err, count) {
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
                if (req.params.catId)
                    Menu.findById(req.params.catId, function (err, mainCat) {
                        // console.log('here');
                        if (menus && menus.length >= 0) {
                            if (mainCat) {
                                mainCat.back = true;
                                mainCat.name = mainCat['name'][req.headers.lan];
                                menus[menus.length] = mainCat;
                            }
                        }
                        res.json(menus.reverse());
                        return 0;
                    }).lean();
                else {
                    res.json(menus.reverse());
                    return 0;
                }


            });

        }).skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
    }
    ,
    sidebarS: function (req, res, next) {
        return new Promise(function (resolve, reject) {

            let offset = 0;
            if (req.params.offset) {
                offset = parseInt(req.params.offset);
            }

            let search = {};
            if (!req.params.catId) {
                search['parent'] = null;
            } else {
                search['parent'] = req.params.catId;
            }
            search["name." + req.headers.lan] = {
                $exists: true
            };
            // console.log('jhgfghj', search);
            Menu.find(search, function (err, menus) {
                if (err) {
                    resolve([]);
                    return 0;
                }
                if (!menus) {
                    menus = [];

                }
                _.forEach(menus, (c) => {
                    c.name = c['name'][req.headers.lan];
                });
                Menu.countDocuments({}, function (err, count) {
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
                    if (req.params.catId)
                        Menu.findById(req.params.catId, function (err, mainCat) {
                            // console.log('here');
                            if (menus && menus.length >= 0) {
                                if (mainCat) {
                                    mainCat.back = true;
                                    mainCat.name = mainCat['name'][req.headers.lan];
                                    menus[menus.length] = mainCat;
                                }
                            }
                            resolve(menus.reverse());
                            return 0;
                        }).lean();
                    else {
                        resolve(menus.reverse());
                        return 0;
                    }


                });

            }).skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
        });
    }
    ,
    viewOne: function (req, res, next) {

        Menu.findById(req.params.id,
            function (err, menu) {
                if (err || !menu) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                res.json(menu);
                return 0;

            });
    }
    ,
    exparty: function (req, res, next) {
    }
    ,
    create: function (req, res, next) {
        if(req.body.parent=="")
            delete req.body.parent;
        console.log('creating menu...', req.body);

        Menu.create(req.body, function (err, menu) {
            if (err || !menu) {
                res.json({
                    err: err,
                    success: false,
                    message: 'error!'
                });
                return 0;
            }
            res.json(menu);
            return 0;

        });
    }
    ,
    destroy: function (req, res, next) {
        Menu.findByIdAndDelete(req.params.id,
            function (err, menu) {
                if (err || !menu) {
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
    }
    ,
    edit: function (req, res, next) {
        if(req.body.parent=="")
            delete req.body.parent;
        console.log('editing menu...', req.body);

        Menu.findByIdAndUpdate(req.params.id, req.body, function (err, menu) {
            if (err || !menu) {
                res.json({
                    success: false,
                    message: 'error!',
                    err:err
                });
                return 0;
            }

            res.json(menu);
            return 0;

        });
    }
    ,
    count: function (req, res, next) {
        Menu.countDocuments({}, function (err, count) {
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
