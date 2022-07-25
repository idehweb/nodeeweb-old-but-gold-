import Link from '#models/link';
import _ from 'lodash';
import requestIp from 'request-ip';

var self = ( {
    viewOne: function (req, res, next) {
        console.log('hgfgh');
        Link.findById(req.params.id,
            function (err, link) {
                if (err || !link) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                let IP = requestIp.getClientIp(req);
                let views = link.views;
                let unicViews = link.unicViews;
                let income = 0;
                // if(link.income){
                //   income=link.income;
                // }
                if (!views) {
                    views = [];
                }
                // console.log('unicViews', unicViews);
                let unicTest = [];
                if (!unicViews || (unicViews && unicViews.length === 0)) {
                    unicViews = [];
                    unicViews.push({
                        userIp: IP,
                        createdAt: new Date()
                    });
                    unicTest = unicViews;
                } else {
                    const found = _.some(unicViews, el => el.userIp === IP);
                    // const found = unicViews.some(el => el.userIp === userIp);
                    console.log('found', found);
                    if (!found) {
                        unicViews.push({userIp: IP, createdAt: new Date()})
                    }
                    ;
                    unicTest = unicViews;

                    // global.addUnic(unicViews, IP).then(async function (arr) {
                    //   console.log('arr.length', arr.length);
                    //   unicTest = await arr;
                    // });
                }

                views.push({
                    userIp: requestIp.getClientIp(req),
                    createdAt: new Date()
                })
                // console.log('vviews', views);
                // console.log('uunicViews', unicViews);
                // income = unicTest.length * 20;
                let a = 0;
                if (link.sales)
                    _.forEach(link.sales, (c) => {
                        if (c && c.income) {
                            a += c.income;
                        }
                    });
                income = (unicTest.length * 50) + a;

                console.log('unicTest', unicTest);
                Link.findByIdAndUpdate(req.params.id, {
                        "$set": {
                            views: views,
                            unicViews: unicTest,
                            income: income
                        }
                    },
                    {
                        "fields": {"_id": 1}
                    }, function (err, updatedLink) {
                    });
                let url = '';
                if (link.redirectTo) {
                    url = link.redirectTo;
                }
                if (!url) {
                    url = 'https://zoomiroom.com/products';
                }
                // link.redirect='https://zoomiroom.com/p/5e8e13a546341b5d60fe01b8/%D8%A7%DB%8C%D8%B1%D9%BE%D8%A7%D8%AF_-_airpod_-_%D9%87%D9%86%D8%AF%D8%B2%D9%81%D8%B1%DB%8C_%D8%A8%D9%84%D9%88%D8%AA%D9%88%D8%AB%DB%8C';
                res.json({
                    success: true,
                    agent: link.customer,
                    // url: 'https://zoomiroom.com/p/5e8e13a546341b5d60fe01b8/%D8%A7%DB%8C%D8%B1%D9%BE%D8%A7%D8%AF_-_airpod_-_%D9%87%D9%86%D8%AF%D8%B2%D9%81%D8%B1%DB%8C_%D8%A8%D9%84%D9%88%D8%AA%D9%88%D8%AB%DB%8C'
                    url: url
                });
                // console.log('hg')
                // res.redirect('https://zoomiroom.com/p/5e8e13a546341b5d60fe01b8/%D8%A7%DB%8C%D8%B1%D9%BE%D8%A7%D8%AF_-_airpod_-_%D9%87%D9%86%D8%AF%D8%B2%D9%81%D8%B1%DB%8C_%D8%A8%D9%84%D9%88%D8%AA%D9%88%D8%AB%DB%8C');
                return 0;

            });
    },
    allWLinks: function (req, res, next) {
        console.log('allWLinks');
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        search["customer"] = req.headers.customer_id;
        // search['status']='published';
        Link.find(search, '_id updatedAt createdAt kind views unicViews income', function (err, links) {
            if (err || !links) {
                res.json([]);
                return 0;
            }

            Link.countDocuments(search, function (err, count) {
                console.log('countDocuments', count);
                if (err || !count) {
                    res.json([]);
                    return 0;
                }
                res.setHeader(
                    "X-Total-Count",
                    count
                );

                _.forEach(links, (c) => {
                    // c.views = 0;
                    // c.title = c['title'][req.headers.lan];
                    // console.log('views', c.views);
                    // if (!c.unicViews)
                    //   c.unicViews = 0;
                    // if (!c.income)
                    //   c.income = 0;
                    if (c.views) {

                        c.views = c.views.length;
                    } else {
                        c.views = 0;
                    }

                    if (c.unicViews) {

                        c.unicViews = c.unicViews.length;
                    } else {
                        c.unicViews = 0;
                    }
                    // c.income = c.unicViews * 50;

                    // c.description =c['description'][req.headers.lan];
                });
                // links.map(resource => ({ ...resource, id: resource._id }))
                res.json(links);
                return 0;


            });

        }).populate('customer', 'nickname photos').skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit)).lean();
    },

    create: function (req, res, next) {
        // console.log('creating link...', req.body);
        // res.json(req.body.data);
        // return 0;
        req.body.customer = req.headers.customer_id;
        if (req.body.customer)
            Link.create(req.body, function (err, link) {
                if (err || !link) {
                    res.json({
                        err: err,
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                res.json({success: true});
                return 0;

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
    createAll: function (req, res, next) {
        _.forEach(req.body.data, function (d, i) {

            Link.create({
                name: {
                    fa: d.name
                },
                parent: "5e7882a5bd7e3c643f1fff20"
            }, function (err, link) {
                console.log(link)
                // if (d.cities) {
                //     _.forEach(d.cities, function (city, c) {
                //         Link.create({
                //             name: {
                //                 fa: city.name
                //             },
                //             parent: link._id
                //         }, function (err, cit) {
                //             console.log(cit);
                //             if (city.districts) {
                //                 _.forEach(city.districts, function (dis, idx) {
                //                     Link.create({
                //                         name: {
                //                             fa: dis.name
                //                         },
                //                         parent: cit._id
                //                     }, function (err, cit2) {
                //                         console.log(cit2);
                //                     });
                //                 })
                //             }
                //         });
                //     })
                // }
                // res.json(req.body.data);
                //     // return 0;
            });
        })
        // Link.create(req.body, function (err, link) {
        //     if (err || !link) {
        //         res.json({
        //             err: err,
        //             success: false,
        //             message: 'error!'
        //         });
        //         return 0;
        //     }
        //     res.json(link);
        //     return 0;
        //
        // });
    },
    destroy: function (req, res, next) {
        Link.findByIdAndDelete(req.params.id,
            function (err, link) {
                if (err || !link) {
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
        Link.findByIdAndUpdate(req.params.id, req.body, function (err, link) {
            if (err || !link) {
                res.json({
                    success: false,
                    message: 'error!'
                });
                return 0;
            }

            res.json(link);
            return 0;

        });
    },
    count: function (req, res, next) {
        Link.countDocuments({}, function (err, count) {
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