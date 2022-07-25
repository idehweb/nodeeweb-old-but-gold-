import Post from '#models/post';
import Customer from '#models/customer';
import Media from '#models/media';

import requestIp from 'request-ip';
import _ from 'lodash';
var self = ( {
    all: function (req, res, next) {
        console.log('kjhgfdsdfgh');
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }
        req.query.type = 'story';
        let search = {};
        if (req.query.type) {
            search['type'] = req.query.type
        }
        Post.find(search, function (err, posts) {
            if (err || !posts) {
                res.json({
                    success: false,
                    message: 'error!'
                });
                return 0;
            }
            Post.countDocuments(search, function (err, count) {
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
                res.json(posts);
                return 0;


            });

        }).skip(offset).sort({createdAt: -1}).limit(parseInt(req.params.limit));
    },
    allW: function (req, res, next) {
        console.log('allW', req.query.search);
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        search['status'] = 'published';

        search["title." + req.headers.lan] = {
            $exists: true,
            // "$regex": req.query.search,
            // "$options": "i"
        };
        // search["description." + req.headers.lan] = {
        //     $exists: true
        // };
        if (req.query.search) {


            // search = {"title":{
            //
            //         [req.headers.lan]:{"$regex": req.query.search, "$options": "i"}
            //     }};

            search["title." + req.headers.lan] = {
                $exists: true,
                "$regex": req.query.search,
                "$options": "i"
            };


        }
        if (req.query.country) {

            search["country"] = req.query.country;

        }
        req.query.type = 'story';

        if (req.query.type) {
            search['type'] = req.query.type
        }
        console.log(search);
        Post.find(search, '_id title updatedAt createdAt status catChoosed countryChoosed firstCategory files price type', function (err, posts) {
            if (err || !posts) {
                res.json([]);
                return 0;
            }
            Post.countDocuments(search, function (err, count) {
                console.log('countDocuments', count);
                if (err || !count) {
                    res.json([]);
                    return 0;
                }
                res.setHeader(
                    "X-Total-Count",
                    count
                );
                _.forEach(posts, (c, cx) => {
                    c.title = c['title'][req.headers.lan];
                    // c.firstCategory = {
                    //     _id: c.firstCategory._id,
                    //     name: c['catChoosed'][0]['name']
                    // }
                    delete c.catChoosed;
                // & !c.files[0].type.includes('image')
                    if (c.files && c.files[0] && c.files[0].type && c.files[0].type.includes('video')) {
                        console.log('ji**********');

                        _.forEach(c.files, (f, t) => {
                            if (f && f.type && f.type.includes('image')){
                                console.log('hgfgh',t);
                                let temparr = c.files[0];
                                c.files[0] = c.files[t];
                                c.files[t] = temparr;
                            }
                            // if (f.type === 'image/jpeg' || f.type === 'image/png') {
                            //     c.backgroundImage = f.url;
                            //     delete c.files;
                            //
                            //     return;
                            // }

                        });
                    }else {
                        console.log('ji');
                    }

                });
                // _.forEach(posts, (c) => {
                //     console.log(c.title)
                //     // c.description =c['description'][req.headers.lan];
                // });
                // posts.map(resource => ({ ...resource, id: resource._id }))
                res.json(posts);
                return 0;


            });

        }).skip(offset).sort({createdAt: -1}).limit(parseInt(req.params.limit)).lean();
    },
    allS: function (req, res, next) {
        return new Promise(function (resolve, reject) {
            console.log('jhgfdghjk', req.query.search);
            let offset = 0;
            if (req.params.offset) {
                offset = parseInt(req.params.offset);
            }

            let search = {};
            search['status'] = 'published';

            search["title." + req.headers.lan] = {
                $exists: true,
                // "$regex": req.query.search,
                // "$options": "i"
            };
            search["description." + req.headers.lan] = {
                $exists: true
            };
            if (req.query.search) {


                // search = {"title":{
                //
                //         [req.headers.lan]:{"$regex": req.query.search, "$options": "i"}
                //     }};

                search["title." + req.headers.lan] = {
                    $exists: true,
                    "$regex": req.query.search,
                    "$options": "i"
                };


            }
            req.query.type = 'story';

            if (req.query.type) {
                search['type'] = req.query.type
            }
            console.log(search);
            Post.find(search, '_id title updatedAt status catChoosed firstCategory files price type', function (err, posts) {
                if (err || !posts) {
                    resolve([]);
                    return 0;
                }
                Post.countDocuments(search, function (err, count) {
                    console.log('countDocuments', count);
                    if (err || !count) {
                        resolve([]);

                        return 0;
                    }
                    res.setHeader(
                        "X-Total-Count",
                        count
                    );
                    _.forEach(posts, (c) => {
                        c.title = c['title'][req.headers.lan];
                        c.firstCategory = {
                            _id: c.firstCategory._id,
                            name: c['catChoosed'][0]['name']
                        }
                        delete c.catChoosed;
                        // if (c.files) {
                        //     _.forEach(c.files, (f) => {
                        //         if (f)
                        //             if (f.type === 'image/jpeg' || f.type === 'image/png') {
                        //                 c.backgroundImage = f.url;
                        //
                        //                 delete c.files;
                        //
                        //                 return;
                        //             }
                        //
                        //     });
                        // }
                        // c.firstCategory.name = c['catChoosed'][0]['name'];
                    });
                    // _.forEach(posts, (c) => {
                    //     console.log(c.title)
                    //     // c.description =c['description'][req.headers.lan];
                    // });
                    // posts.map(resource => ({ ...resource, id: resource._id }))
                    resolve(posts);
                    // return 0;


                });

            }).skip(offset).sort({createdAt: -1}).limit(parseInt(req.params.limit)).lean();
        });
    },
    postsByCat: function (req, res, next) {
        console.log('postsByCat...');
        console.log('jhgfdghjk', req.query.search);
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        req.query.type = 'story';

        if (req.query.type) {
            search['type'] = req.query.type
        }
        search['status'] = 'published';
        search['$or'] = [{
            firstCategory: req.params._id
        }, {
            secondCategory: req.params._id
        }, {
            thirdCategory: req.params._id
        }];
        if (req.query.search) {

            search = {"title": {"$regex": req.query.search, "$options": "i"}};


        }
        console.log(search)
        search["title." + req.headers.lan] = {
            $exists: true
        };
        search["description." + req.headers.lan] = {
            $exists: true
        };

        if (req.query.country) {

            search["country"] = req.query.country;

        }
        // '_id title photos updatedAt createdAt status',
        Post.find(search, '_id title updatedAt createdAt status catChoosed countryChoosed firstCategory files price type', function (err, posts) {
            if (err) {
                res.json([]);
                return 0;
            }
            if (!posts) {
                posts = [];
            }
            Post.countDocuments(search, function (err, count) {
                console.log('countDocuments', count);
                if (err) {
                    res.json([]);
                    return 0;
                }
                if (!count) {
                    count = 0;
                }
                res.setHeader(
                    "X-Total-Count",
                    count
                );
                _.forEach(posts, (c) => {
                    //     c.title = c['title'][req.headers.lan];
                    //     c.description = c['description'][req.headers.lan];
                    //     c.firstCategory.name = c['firstCategory']['name'][req.headers.lan];
                    //
                    c.title = c['title'][req.headers.lan];
                    c.firstCategory = {
                        _id: c.firstCategory._id,
                        name: c['catChoosed'][0]['name']
                    }
                    delete c.catChoosed;
                    // if (c.files) {
                    //     _.forEach(c.files, (f) => {
                    //         if (f.type === 'image/jpeg' || f.type === 'image/png') {
                    //             c.backgroundImage = f.url;
                    //             delete c.files;
                    //
                    //             return;
                    //         }
                    //
                    //     });
                    // }
                });

                // posts.map(resource => ({ ...resource, id: resource._id }))
                res.json(posts);
                return 0;


            });

        }).skip(offset).sort({createdAt: -1}).limit(parseInt(req.params.limit)).lean();
    },
    postsByCatS: function (req, res, next) {
        return new Promise(function (resolve, reject) {


            let offset = 0;
            if (req.params.offset) {
                offset = parseInt(req.params.offset);
            }

            let search = {};
            search['status'] = 'published';
            search['$or'] = [{
                firstCategory: req.params._id
            }, {
                secondCategory: req.params._id
            }, {
                thirdCategory: req.params._id
            }];
            if (req.query.search) {

                search = {"title": {"$regex": req.query.search, "$options": "i"}};


            }
            console.log(search)
            search["title." + req.headers.lan] = {
                $exists: true
            };
            search["description." + req.headers.lan] = {
                $exists: true
            };
            req.query.type = 'story';

            if (req.query.type) {
                search['type'] = req.query.type
            }
            // '_id title photos updatedAt createdAt status',
            Post.find(search, '_id title updatedAt createdAt status catChoosed firstCategory files type price', function (err, posts) {
                if (err) {
                    resolve([]);

                }
                if (!posts) {
                    posts = [];
                }
                Post.countDocuments(search, function (err, count) {
                    console.log('countDocuments', count);
                    if (err) {
                        resolve([]);
                    }
                    if (!count) {
                        count = 0;
                    }
                    res.setHeader(
                        "X-Total-Count",
                        count
                    );
                    _.forEach(posts, (c) => {
                        //     c.title = c['title'][req.headers.lan];
                        //     c.description = c['description'][req.headers.lan];
                        //     c.firstCategory.name = c['firstCategory']['name'][req.headers.lan];
                        //
                        c.title = c['title'][req.headers.lan];
                        c.firstCategory = {
                            _id: c.firstCategory._id,
                            name: c['catChoosed'][0]['name']
                        }
                        delete c.catChoosed;
                        if (c.files) {
                            _.forEach(c.files, (f) => {
                                if (f.type === 'image/jpeg' || f.type === 'image/png') {
                                    c.backgroundImage = f.url;
                                    delete c.files;

                                    return;
                                }

                            });
                        }
                    });

                    // posts.map(resource => ({ ...resource, id: resource._id }))
                    resolve(posts);
                    return 0;


                });

            }).skip(offset).sort({createdAt: -1}).limit(parseInt(req.params.limit)).lean();
        });
    },
    allWCustomer: function (req, res, next) {
        console.log('allWCustomer');
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        search["title." + req.headers.lan] = {
            $exists: true
        };
        search["description." + req.headers.lan] = {
            $exists: true
        };
        search["customer"] = req.headers.customer._id;
        // search['status']='published';
        req.query.type = 'story';

        if (req.query.type) {
            search['type'] = req.query.type
        }
        Post.find(search, '_id title photos updatedAt createdAt status views getContactData price type files', function (err, posts) {
            if (err || !posts) {
                res.json([]);
                return 0;
            }

            Post.countDocuments(search, function (err, count) {
                console.log('countDocuments', count);
                if (err || !count) {
                    res.json([]);
                    return 0;
                }
                res.setHeader(
                    "X-Total-Count",
                    count
                );

                _.forEach(posts, (c) => {
                    console.log(c.title)
                    // c.views = 0;
                    c.title = c['title'][req.headers.lan];
                    // console.log('views', c.views);

                    if (c.views) {

                        c.views = c.views.length;
                    } else {
                        c.views = 0;
                    }
                    if (c.getContactData) {

                        c.getContactData = c.getContactData.length;
                    } else {
                        c.getContactData = 0;
                    }
                    // c.description =c['description'][req.headers.lan];
                });
                // posts.map(resource => ({ ...resource, id: resource._id }))
                res.json(posts);
                return 0;


            });

        }).populate('firstCategory', 'name').populate('customer', 'nickname photos').skip(offset).sort({createdAt: -1}).limit(parseInt(req.params.limit)).lean();
    },
    viewOne: function (req, res, next) {

        Post.findById(req.params.id,
            function (err, post) {
                if (err || !post) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                // _.forEach(categorys, (c) => {
                post.title = post['title'][req.headers.lan];
                // post.description = post['description'][req.headers.lan];
                // console.log(c);
                // });
                // delete post.data;
                // if (!post.getContactData) {
                //   post.getContactData = [];
                // }
                let views = post.views;
                if (!views) {
                    views = [];
                }

                views.push({
                    userIp: requestIp.getClientIp(req),
                    createdAt: new Date()
                })
                Post.findByIdAndUpdate(req.params.id, {
                        "$set": {
                            // getContactData: post.getContactData,
                            views: views
                        }
                    },
                    {
                        "fields": {"_id": 1}
                    }, function (err, updatedPost) {
                    });
                delete post.views;
                delete post.getContactData;
                delete post.transaction;
                Post.findOne({_id: {$lt: req.params.id}}, '_id title', function (err, pl) {
                    if (pl && pl._id && pl.title)
                        post.nextPost = {_id: pl._id, title: pl.title[req.headers.lan]};
                    res.json(post);
                    return 0;
                }).sort({_id: 1}).limit(1)


            }).lean();
    },
    viewOneF: function (req, res, next) {

        Post.findById(req.params.id, 'title _id price addToCard customer',
            function (err, post) {
                if (err || !post) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                // _.forEach(categorys, (c) => {
                post.title = post['title'][req.headers.lan];
                let addToCard = post.addToCard;
                if (!addToCard) {
                    addToCard = [];
                }

                addToCard.push({
                    userIp: requestIp.getClientIp(req),
                    createdAt: new Date()
                })
                Post.findByIdAndUpdate(req.params.id, {
                        "$set": {
                            // getContactData: post.getContactData,
                            addToCard: addToCard
                        }
                    },
                    {
                        "fields": {"_id": 1}
                    }, function (err, updatedPost) {
                    });
                delete post.addToCard;
                post.seller = post.customer;
                delete post.customer;

                // Post.findOne({_id: {$lt: req.params.id}}, '_id title', function (err, pl) {
                //   if (pl && pl._id && pl.title)
                //     post.nextPost = {_id: pl._id, title: pl.title[req.headers.lan]};
                //   return 0;
                // }).sort({_id: 1}).limit(1)

                res.json(post);

            }).lean();
    },
    viewOneS: function (req, res, next) {
        return new Promise(function (resolve, reject) {

            Post.findById(req.params._id, 'title description',
                function (err, post) {
                    if (err || !post) {
                        resolve({});
                        return 0;
                    }
                    // _.forEach(categorys, (c) => {
                    post.title = post['title'][req.headers.lan];
                    post.description = post['description'][req.headers.lan];
                    // console.log(c);
                    // });
                    delete post.data;
                    delete post.transaction;
                    resolve(post);
                    return 0;

                }).lean();
        });
    },
    getContactData: function (req, res, next) {

        Post.findById(req.params.id, "customer getContactData",
            function (err, post) {
                if (err || !post) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                if (!post.getContactData) {
                    post.getContactData = [];
                }

                post.getContactData.push({
                    userIp: requestIp.getClientIp(req),
                    createdAt: new Date()
                })
                Post.findByIdAndUpdate(req.params.id, {
                        "$set": {
                            getContactData: post.getContactData
                        }
                    },
                    {
                        "fields": {"_id": 1}
                    }, function (err, updatedPost) {
                    });
                delete post.getContactData;
                res.json(post);
                return 0;

            }).populate("customer", "email phoneNumber").lean();
    },
    viewOneMyPost: function (req, res, next) {
        console.log('web uiwgeh  efkv', req.params.id);
        Post.findById(req.params.id,
            function (err, post) {
                console.log('post', post);
                console.log('err', err);
                if (err || !post) {
                    res.json({
                        success: false,
                        message: 'error!',
                        err: err
                    });
                    return 0;
                }
                post.title = post['title'][req.headers.lan];
                post.description = post['description'][req.headers.lan];
                post.files = post['files'];
                res.json(post);
                return 0;

            });
    },
    createByCustomer: function (req, res, next) {

        req.body.customer = req.headers.customer._id;
        if (!req.headers.lan) {
            req.headers.lan = 'fa';
        }
        let {description, title} = req.body;
        delete req.body.description;
        req.body.description = {
            [req.headers.lan]: description
        }
        delete req.body.title;
        // req.body.description[req.headers.lan]=description;
        req.body.title = {
            [req.headers.lan]: title
        }
        // req.body.title[req.headers.lan]=title;
        // console.log()
        console.log('creating post...', req.body.description, "..„");
        req.body.status = 'published';
        let code = Math.floor(100000 + Math.random() * 900000);
        req.body.postNumber = code;
        Post.create(req.body, function (err, post) {
            if (err || !post) {
                res.json({
                    err: err,
                    success: false,
                    message: 'error!'
                });
                return 0;
            }
            let $text;
            // $text = "زومی روم" + "\n" + "آگهی شما با عنوان " + '"' + req.body.title[req.headers.lan] + '"' + " ایجاد شد و بزودی توسط مدیر سیستم تایید می شود." + "\n" + "نهایت زمان انتظار تایید: ۳۰ دقیقه";
            // global.sendSms(req.headers.customer.phoneNumber, $text).then(function (uid) {
            //
            // });
            $text = "نیکان" + "\n" + "آگهی با عنوان " + '"' + req.body.title[req.headers.lan] + '"' + " ایجاد شد و در انتظار بررسی شما است.";
            // global.sendSms("9120539945", $text).then(function (uid) {
            //
            // });
            // $text = "زومی روم" + "\n" + "آگهی با عنوان " + '"' + req.body.title[req.headers.lan] + '"' + " ایجاد شد و در انتظار بررسی شما است.";
            // global.sendSms("9128093545", $text).then(function (uid) {

            // });
            let objd = {};
            // $tz = req.headers.customer.phoneNumber + "\n";
            // $tz += $text;
            objd.message = $text;
            console.log('objd', objd);
            global.notifateToTelegram(objd).then(function (f) {
                console.log('f', f);
                // res.json({success: true});
                // return 0;
            });
            res.json(post);
            return 0;

        });
    },
    estekhdam: function (req, res, next) {
        console.log('req.body', req.body);

        let p_number = req.body.phoneNumber
        if (p_number) {
            // console.log('==> addCustomer() 1.11');
            p_number = persianJs(p_number).arabicNumber().toString().trim();
            p_number = persianJs(p_number).persianNumber().toString().trim();
            p_number = parseInt(p_number);
            // console.log('==> addCustomer() 1.15');
            req.body.phoneNumber = p_number;
            let NUMBER = parseInt(p_number).toString();
            req.body.phoneNumber = NUMBER;
            if (p_number.toString().length < 10) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: 'length of phoneNumber should not be less than 10 : customer!'
                });
                return;

            }
            if (isNaN(p_number)) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: 'something wrong in creating customer : customer!'
                });
                return;
            }
        } else {
            res.json({
                success: false,
                message: 'error!',
                err: 'something wrong in creating customer : phoneNumber is not entered!'
            });
            return;

        }


        let p_age = req.body.age
        if (p_age) {
            // console.log('==> addCustomer() 1.11');
            p_age = persianJs(p_age).arabicNumber().toString().trim();
            p_age = persianJs(p_age).persianNumber().toString().trim();
            p_age = parseInt(p_age);
            req.body.age = parseInt(p_age).toString();

        }
        console.log('req.body', req.body);
        let title = '', description = '';

        global.generateTitleAndDescription(req.body).then(function (obj) {
            title = obj.title;
            description = obj.description;

            let categories = [
                {
                    "_id": "5e5e6c15c87f80559141f276",
                    "name": "اداری و مدیریت",
                    "parent": "5e5b78e4596ddb1e01531471",
                    "__v": 0,
                    "back": true
                }
            ];
            let mainList = [
                [
                    {
                        "_id": "5e5e6b22c87f80559141f26d",
                        "name": "برای کسب و کار",
                        "__v": 0
                    },
                    {
                        "_id": "5e5e6a59c87f80559141f262",
                        "name": "اجتماعی",
                        "__v": 0
                    },
                    {
                        "_id": "5e5e68e6c87f80559141f24e",
                        "name": "سرگرمی و فراغت",
                        "__v": 0
                    },
                    {
                        "_id": "5e5e67a1c87f80559141f23e",
                        "name": "وسایل شخصی",
                        "__v": 0
                    },
                    {
                        "_id": "5e5e6055c87f80559141f1f9",
                        "name": "خدمات",
                        "__v": 0
                    },
                    {
                        "_id": "5e5e6043c87f80559141f1f8",
                        "name": "مربوط به خانه",
                        "__v": 0
                    },
                    {
                        "_id": "5e5e6029c87f80559141f1f7",
                        "name": "لوازم الکترونیکی",
                        "__v": 0
                    },
                    {
                        "_id": "5e5b78ea596ddb1e01531472",
                        "name": "وسایل نقلیه",
                        "slug": "estate",
                        "__v": 0
                    },
                    {
                        "_id": "5e5b78e4596ddb1e01531471",
                        "name": "استخدام و کاریابی",
                        "slug": "estate",
                        "__v": 0
                    },
                    {
                        "_id": "5e57dd1cc2a97ec9dde7f1c2",
                        "name": "املاک",
                        "slug": "estate",
                        "__v": 0
                    }
                ],
                [
                    {
                        "_id": "5e5b78e4596ddb1e01531471",
                        "name": "استخدام و کاریابی",
                        "slug": "estate",
                        "__v": 0,
                        "back": true
                    },
                    {
                        "_id": "5e5e6d57c87f80559141f282",
                        "name": "متفرقه",
                        "parent": "5e5b78e4596ddb1e01531471",
                        "__v": 0
                    },
                    {
                        "_id": "5e5e6d3dc87f80559141f281",
                        "name": "هنری و رسانه",
                        "parent": "5e5b78e4596ddb1e01531471",
                        "__v": 0
                    },
                    {
                        "_id": "5e5e6d2ec87f80559141f280",
                        "name": "درمانی و زیبایی و بهداشتی",
                        "parent": "5e5b78e4596ddb1e01531471",
                        "__v": 0
                    },
                    {
                        "_id": "5e5e6ce3c87f80559141f27f",
                        "name": "حمل و نقل",
                        "parent": "5e5b78e4596ddb1e01531471",
                        "__v": 0
                    },
                    {
                        "_id": "5e5e6ca0c87f80559141f27e",
                        "name": "آموزشی",
                        "slug": null,
                        "__v": 0,
                        "parent": "5e5b78e4596ddb1e01531471"
                    },
                    {
                        "_id": "5e5e6c8cc87f80559141f27d",
                        "name": "صنعتی و فنی و مهندسی",
                        "parent": "5e5b78e4596ddb1e01531471",
                        "__v": 0
                    },
                    {
                        "_id": "5e5e6c80c87f80559141f27c",
                        "name": "بازاریابی و فروش",
                        "parent": "5e5b78e4596ddb1e01531471",
                        "__v": 0
                    },
                    {
                        "_id": "5e5e6c70c87f80559141f27b",
                        "name": "مالی و حسابداری و حقوقی",
                        "parent": "5e5b78e4596ddb1e01531471",
                        "__v": 0
                    },
                    {
                        "_id": "5e5e6c5ec87f80559141f27a",
                        "name": "رایانه و فناوری اطلاعات",
                        "parent": "5e5b78e4596ddb1e01531471",
                        "__v": 0
                    },
                    {
                        "_id": "5e5e6c4fc87f80559141f279",
                        "name": "خدمات فروشگاه و رستوران",
                        "parent": "5e5b78e4596ddb1e01531471",
                        "__v": 0
                    },
                    {
                        "_id": "5e5e6c3ec87f80559141f278",
                        "name": "معماری ،عمران و ساختمانی",
                        "parent": "5e5b78e4596ddb1e01531471",
                        "__v": 0
                    },
                    {
                        "_id": "5e5e6c28c87f80559141f277",
                        "name": "سرایداری و نظافت",
                        "parent": "5e5b78e4596ddb1e01531471",
                        "__v": 0
                    },
                    {
                        "_id": "5e5e6c15c87f80559141f276",
                        "name": "اداری و مدیریت",
                        "parent": "5e5b78e4596ddb1e01531471",
                        "__v": 0,
                        "loading": true,
                        "disabled": "disabled"
                    }
                ],
                [
                    {
                        "_id": "5e5e6c15c87f80559141f276",
                        "name": "اداری و مدیریت",
                        "parent": "5e5b78e4596ddb1e01531471",
                        "__v": 0,
                        "back": true
                    }
                ]
            ];
            let mainCategory = {
                "_id": "5e5e6c15c87f80559141f276",
                "name": "اداری و مدیریت",
                "parent": "5e5b78e4596ddb1e01531471",
                "__v": 0,
                "loading": true,
                "disabled": "disabled"
            };
            let firstCategory = "5e5b78e4596ddb1e01531471";
            let secondCategory = "5e5e6c15c87f80559141f276";
            let catChoosed = [
                {
                    "_id": "5e5b78e4596ddb1e01531471",
                    "name": "استخدام و کاریابی",
                    "slug": "estate",
                    "__v": 0,
                    "loading": true,
                    "disabled": "disabled"
                },
                {
                    "_id": "5e5e6c15c87f80559141f276",
                    "name": "اداری و مدیریت",
                    "parent": "5e5b78e4596ddb1e01531471",
                    "__v": 0,
                    "loading": true,
                    "disabled": "disabled"
                }
            ];
            Customer.create({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    phoneNumber: req.body.phoneNumber,
                    email: req.body.email
                }, function (err, customer) {
                    if (err) {
                        if (err.code == 11000) {
                            Customer.findOneAndUpdate({
                                    phoneNumber: req.body.phoneNumber
                                },
                                {
                                    firstName: req.body.firstName,
                                    lastName: req.body.lastName,
                                    email: req.body.email
                                }, function (err, customer) {
                                    if (err || !customer) {
                                        res.json({
                                            err: err,
                                            success: false,
                                            message: 'error!'
                                        });
                                        return 0;
                                    }
                                    console.log('customer is,', customer);
                                    Post.create({
                                        customer: customer._id,
                                        title: {
                                            fa: title
                                        },
                                        description: {
                                            fa: description
                                        },
                                        data: req.body,
                                        catChoosed: catChoosed,
                                        categories: categories,
                                        mainList: mainList,
                                        mainCategory: mainCategory,
                                        firstCategory: firstCategory,
                                        secondCategory: secondCategory,
                                        status: "published"

                                    }, function (err, customer) {
                                        if (err || !customer) {
                                            res.json({
                                                err: err,
                                                success: false,
                                                message: 'error!'
                                            });
                                            return 0;
                                        }
                                        let $text;
                                        $text = "زومی روم" + "\n" + "رزومه شما با موفقیت دریافت شد،  به زودی با شما ارتباط برقرار خواهیم کرد.";
                                        global.sendSms(req.body.phoneNumber, $text).then(function (uid) {

                                        });
                                        $text = "زومی روم" + "\n" + "آگهی رزومه کار" + "\n" + req.body.phoneNumber + "\n" + req.body.firstName + "\n" + req.body.lastName;
                                        global.sendSms("9120539945", $text).then(function (uid) {

                                        });
                                        res.json({
                                            success: true,

                                        })
                                        return 0;
                                    });
                                });
                        }
                        else {
                            res.json({
                                err: err,
                                success: false,
                                message: 'error!'
                            });
                            return 0;
                        }
                        return;
                    }

                    // let array = ['جویای کار ', 'به دنبال کار '];
                    // title += = array[Math.floor(Math.random() * array.length)];
                    //
                    // if(req.body.sabegheKar){
                    //     array = ['جویای کار ', 'به دنبال کار '];
                    //     title += = array[Math.floor(Math.random() * array.length)];
                    //
                    // }
                    console.log('customer', customer, err);
                    Post.create({
                        customer: customer._id,
                        title: {
                            fa: title
                        },
                        description: {
                            fa: description
                        },
                        data: req.body,
                        catChoosed: catChoosed,
                        categories: categories,
                        mainList: mainList,
                        mainCategory: mainCategory,
                        firstCategory: firstCategory,
                        secondCategory: secondCategory,
                        status: "published"
                    }, function (err, customer) {
                        if (err || !customer) {
                            res.json({
                                err: err,
                                success: false,
                                message: 'error!'
                            });
                            return 0;
                        }
                        let $text;
                        $text = "زومی روم" + "\n" + "رزومه شما با موفقیت دریافت شد،  به زودی با شما ارتباط برقرار خواهیم کرد.";
                        global.sendSms(req.body.phoneNumber, $text).then(function (uid) {

                        });
                        $text = "زومی روم" + "\n" + "آگهی رزومه کار" + "\n" + req.body.phoneNumber + "\n" + req.body.firstName + "\n" + req.body.lastName;
                        global.sendSms("9120539945", $text).then(function (uid) {

                        });
                        res.json({
                            success: true,

                        })
                        return 0;
                    });
                }
            )
            ;

            //     return 0;
            //
            // });
        });
    },
    create: function (req, res, next) {

        // req.body.customer = req.headers.customer._id;
        req.body.type = 'story';
        console.log('creating post...', req.body);
        Post.create(req.body, function (err, post) {
            if (err || !post) {
                res.json({
                    err: err,
                    success: false,
                    message: 'error!'
                });
                return 0;
            }
            res.json(post);
            return 0;

        });
    },
    destroy: function (req, res, next) {
        Post.findByIdAndDelete(req.params.id,
            function (err, post) {
                if (err || !post) {
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
        req.body.status = 'published';
        req.body.customer = req.headers.customer._id;
        if (!req.headers.lan) {
            req.headers.lan = 'fa';
        }
        let {description, title} = req.body;
        delete req.body.description;
        req.body.description = {
            [req.headers.lan]: description
        }
        delete req.body.title;
        // req.body.description[req.headers.lan]=description;
        req.body.title = {
            [req.headers.lan]: title
        }
        // req.body.title[req.headers.lan]=title;
        // console.log()
        console.log('creating post...', req.body.description, "..„");
        Post.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
            if (err || !post) {
                res.json({
                    success: false,
                    message: 'error!'
                });
                return 0;
            }

            res.json(post);
            return 0;

        });
    },
    editAdmin: function (req, res, next) {
        if (!req.headers.lan) {
            req.headers.lan = 'fa';
        }
        Post.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
            if (err || !post) {
                res.json({
                    success: false,
                    message: 'error!'
                });
                return 0;
            }
            if (req.body.status === 'published') {
                let $text;
                $text = "زومی روم" + "\n" + "آگهی شما با عنوان " + '"' + post.title[req.headers.lan] + '"' + " با موفقیت بر روی سایت منتشر شد." + "\n" + "با تشکر";
                global.sendSms(post.customer.phoneNumber, $text).then(function (uid) {

                });
                let objd = {};
                $tz = post.title['fa'] + "\n";
                $tz += post.description['fa'];
                objd.message = $tz;
// let im='';
                if (post.files) {
                    if (post.files[0]) {
                        objd.media = post.files[0].url;
                    }
                }
                console.log('objd', objd);
                // global.publishToTelegram(objd).then(function (f) {
                //     console.log('f', f)
                // });
            }
            // if (req.body.status === 'deleted') {
            //   let $text;
            //   $text = "زومی روم" + "\n" + "آگهی شما با عنوان " + '"' + post.title[req.headers.lan] + '"' + " از روی سایت حذف شد (آگهی تکراری)." + "\n" + "با تشکر";
            //   global.sendSms(post.customer.phoneNumber, $text).then(function (uid) {
            //
            //   });
            // }

            res.json(post);
            return 0;

        }).populate('customer');
    },
    telegram: function (req, res, next) {
        if (!req.headers.lan) {
            req.headers.lan = 'fa';
        }
        Post.findById(req.params.id, function (err, post) {
            if (err || !post) {
                res.json({
                    success: false,
                    message: 'error!'
                });
                return 0;
            }

            let objd = {};
            $tz = post.title[req.headers.lan] + "\n";
            $tz += post.description[req.headers.lan];
            objd.message = $tz;
// let im='';
            if (post.files) {
                if (post.files[0]) {
                    objd.media = post.files[0].url;
                }
            }
            console.log('objd', objd);
            global.publishToTelegram(objd).then(function (f) {
                console.log('f', f)
            });


            res.json(objd);
            return 0;

        });
    },
    deleteByCustomer: function (req, res, next) {
        Post.findByIdAndUpdate(req.params.id, {
            status: 'deleted'
        }, function (err, post) {
            if (err || !post) {
                res.json({
                    success: false,
                    message: 'error!'
                });
                return 0;
            }

            res.json({
                success: true,
                message: 'deleted!'
            });
            return 0;

        });
    },
    count: function (req, res, next) {
        Post.countDocuments({}, function (err, count) {
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
    fileUpload: function (req, res, next) {
        // console.log(req.files);
        // console.log('we are here')
        //
        // req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        //     // ...
        //     console.log('on file')
        // });
        // req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
        //     // ...
        //     console.log('on filed')
        //
        // });
        // console.log('req.body',req.body);
        // console.log('req.params',req.params);
        // let fstream;
        // req.pipe(req.busboy);
        // // var busboy = new Busboy({ headers: req.headers });
        // busboy.on('file', function (fieldname, file, filename) {
        //     let name = getFormattedTime() + filename;
        //     let filePath = path.join(__dirname, '/../customer/', name);
        //     fstream = fs.createWriteStream(filePath);
        //     file.pipe(fstream);
        //     fstream.on('close', function () {
        //         console.log('Files saved');
        //         let url = 'customer/' + name;
        //         let obj = [{'name': name, 'url': url}];
        //
        //
        let photos = req.photo_all;
        console.log(photos, req.body);

        if (photos && photos[0]) {
            Media.create({
                name: photos[0].name,
                url: photos[0].url,
                type: photos[0].type

            }, function (err, media) {


                if (err) {
                    // console.log('==> pushSalonPhotos() got response err');


                    res.json({
                        err: err,
                        success: false,
                        message: 'error'
                    })

                } else {
                    res.json({
                        success: true,
                        media: media

                    })
                }
            });
        } else {
            res.json({
                success: false,
                message: 'upload faild!'
            })
        }
        //
        //     });
        // });


    },

});
export default self;