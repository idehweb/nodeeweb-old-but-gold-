import Category from '#models/category';
import Post from '#models/post';
import _ from 'lodash';
import request from '#root/request';
import Mongoose from 'mongoose';
var self = ( {
    importcats: async function (req, res, next) {
        return;
        // console.log('importcats');
        await request({
            method: 'GET',
                url: "",
                body: {},
            json: true
        }, function async (error, response, parsedBody) {
            console.log('parsedBody');
            if (parsedBody)
                _.forEach(parsedBody, async function (value, key) {


                    await Category.create({
                        name: {
                            fa: value.name
                        },
                        slug: value.slug
                    }, async function (err, category) {
                        if (err || !category) {
                            await console.log('err', err);
                        }
                        // await console.log('key:', key);
                        // await console.log('value:', value.name);
                        if (value.children) {
                            await _.forEach(value.children, async function (child, key2) {


                                await Category.create({
                                    name: {
                                        fa: child.name
                                    },
                                    slug: child.slug,
                                    parent: category._id
                                }, async function (err, category2) {
                                    if (err || !category2) {
                                        await console.log('err', err);
                                    }
                                    // await console.log('    key2:', key2);
                                    // await console.log('    child2:', child.name);
                                    if (child.children) {
                                        await _.forEach(child.children, async function (ch, key3) {


                                            await Category.create({
                                                name: {
                                                    fa: ch.name
                                                },
                                                slug: ch.slug,
                                                parent: category2._id
                                            }, async function (err, category3) {
                                                if (err || !category3) {
                                                    await console.log('err', err);
                                                }
                                                // await console.log('    key2:', key3);
                                                // await console.log('    child2:', ch.name);

                                            });
                                        });
                                    }
                                });
                            });
                        }

                    });


                });
        }).catch(async function (err) {
            console.log('err:', err);
            await res.json({
                success: false,
                err: err
            });
        });

    },
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
            Category.find(search, function (err, categorys) {
                // console.log('err', err);
                // console.log('categorys', categorys);
                if (err || !categorys) {
                    res.json({
                        success: false,
                        message: 'error!',
                        categorys: categorys
                    });
                    return 0;
                }
                Category.countDocuments({}, function (err, count) {
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
                    res.json(categorys);
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
        Category.find(search, function (err, categorys) {
            // console.log('err', err);
            // console.log('categorys', categorys);
            if (err || !categorys) {
                res.json({
                    success: false,
                    message: 'error!',
                    categorys: categorys
                });
                return 0;
            }
            Category.countDocuments({}, function (err, count) {
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
                res.json(categorys);
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
            Category.find(search, function (err, categorys) {
                if (err || !categorys) {
                    resolve([]);

                }
                Category.countDocuments({}, function (err, count) {
                    // console.log('countDocuments', count);
                    if (err || !count) {
                        resolve([]);

                    }
                    res.setHeader(
                        "X-Total-Count",
                        count
                    );
                    _.forEach(categorys, (c) => {
                        c.name = c['name'][req.headers.lan];
                        // console.log(c);
                    });
                    resolve(categorys);


                });

            }).skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
        });
    },
    allSXml: async function () {
        let XTL = [{
            url: '/',
            lastMod: new Date(),
            changeFreq: 'hourly'
        },
            {
                url: '/add-new-post',
                lastMod: new Date(),
                changeFreq: 'monthly'
            }], offset = 0, search = {};
        return new Promise(async function (resolve, reject) {

            await Category.find(search, async function (err, categorys) {
                if (err || !categorys) {
                    return await ([]);
                }
                // await console.log("allSXml1", "allSXml1")
                let cd = new Date();
                await _.forEach(categorys, async (c) => {
                    await XTL.push({
                        url: '/category/' + c._id + '/' + c.name['fa'],
                        lastMod: cd,
                        changeFreq: 'daily'
                    });
                });
                search['active'] = true;
                await Post.find(search, async function (err, posts) {
                    await _.forEach(posts, async (p) => {
                        await XTL.push({
                            url: '/p/' + p._id + '/' + p.title['fa'],
                            lastMod: p.updatedAt,
                            changeFreq: 'weekly'
                        });
                    });
                    resolve(XTL);
                }).skip(offset).sort({_id: -1});


            }).skip(offset).sort({_id: -1});
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
            Category.find(search, function (err, categorys) {
                if (err || !categorys) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                Category.countDocuments({}, function (err, count) {
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
                    _.forEach(categorys, (c) => {
                        c.name = c['name'][req.headers.lan];
                        // console.log(c);
                    });
                    res.json(categorys);
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
        Category.find(search, function (err, categorys) {
            if (err) {
                res.json({
                  err:err,
                    success: false,
                    message: 'error!',
                  categorys
                });
                // res.json([]);
                return 0;
            }
            if (!categorys) {
                categorys = [];
                // res.json({
                //     success: true,
                //     message: 'error!'
                // });
                // return 0;
            }
            // console.log(categorys);
            _.forEach(categorys, (c) => {
                c.name = c['name'][req.headers.lan];
                // console.log(c);
            });
            // categorys.push({});
            Category.countDocuments({}, function (err, count) {
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
                    Category.findById(req.params._id, function (err, mainCat) {
                        // console.log('here');
                        // if (categorys && categorys.length >= 0) {
                        //   if (mainCat) {
                        //     mainCat.back = true;
                        //     mainCat.name = mainCat['name'][req.headers.lan];
                        //     categorys[categorys.length] = mainCat;
                        //   }
                        // }
                        res.json(categorys.reverse());
                        return 0;
                    }).lean();
                else {
                    res.json(categorys.reverse());
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
        Category.find(search, function (err, categorys) {
            if (err) {
                res.json({
                    success: false,
                    message: 'error!'
                });
                return 0;
            }
            if (!categorys) {
                categorys = [];
                // res.json({
                //     success: true,
                //     message: 'error!'
                // });
                // return 0;
            }
            // console.log(categorys);
            _.forEach(categorys, (c) => {
                c.name = c['name'][req.headers.lan];
                // console.log(c);
            });
            Category.countDocuments({}, function (err, count) {
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
                    Category.findById(req.params.catId, function (err, mainCat) {
                        // console.log('here');
                        if (categorys && categorys.length >= 0) {
                            if (mainCat) {
                                mainCat.back = true;
                                mainCat.name = mainCat['name'][req.headers.lan];
                                categorys[categorys.length] = mainCat;
                            }
                        }
                        res.json(categorys.reverse());
                        return 0;
                    }).lean();
                else {
                    res.json(categorys.reverse());
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
            Category.find(search, function (err, categorys) {
                if (err) {
                    resolve([]);
                    return 0;
                }
                if (!categorys) {
                    categorys = [];

                }
                _.forEach(categorys, (c) => {
                    c.name = c['name'][req.headers.lan];
                });
                Category.countDocuments({}, function (err, count) {
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
                        Category.findById(req.params.catId, function (err, mainCat) {
                            // console.log('here');
                            if (categorys && categorys.length >= 0) {
                                if (mainCat) {
                                    mainCat.back = true;
                                    mainCat.name = mainCat['name'][req.headers.lan];
                                    categorys[categorys.length] = mainCat;
                                }
                            }
                            resolve(categorys.reverse());
                            return 0;
                        }).lean();
                    else {
                        resolve(categorys.reverse());
                        return 0;
                    }


                });

            }).skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
        });
    }
    ,
    viewOne: function (req, res, next) {

        Category.findById(req.params.id,
            function (err, category) {
                if (err || !category) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                res.json(category);
                return 0;

            });
    }
    ,
    exparty: function (req, res, next) {

        // Category.findById(req.params.id,
        //     function (err, category) {
        //         if (err || !category) {
        //             res.json({
        //                 success: false,
        //                 message: 'error!'
        //             });
        //             return 0;
        //         }
        // req.body.map((obj,i)=>{
        //
        // })
        // let s =[
        //     {
        //         "_id": "5e5e6d57c87f80559141f282",
        //         "name": {
        //             "fa": "متفرقه",
        //             "tu": "çeşitli",
        //             "ar": "متنوع",
        //             "en": "miscellaneous"
        //         },
        //         "parent": "5e5b78e4596ddb1e01531471",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6d3dc87f80559141f281",
        //         "name": {
        //             "fa": "هنری و رسانه",
        //             "tu": "Sanat ve Medya",
        //             "ar": "الفن والإعلام",
        //             "en": "Art and Media"
        //         },
        //         "parent": "5e5b78e4596ddb1e01531471",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6d2ec87f80559141f280",
        //         "name": {
        //             "fa": "درمانی و زیبایی و بهداشتی",
        //             "tu": "Sağlık ve Güzellik",
        //             "ar": "الصحة والجمال",
        //             "en": "Health & Beauty"
        //         },
        //         "parent": "5e5b78e4596ddb1e01531471",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6ce3c87f80559141f27f",
        //         "name": {
        //             "fa": "حمل و نقل",
        //             "tu": "taşıma",
        //             "ar": "transport",
        //             "en": "transport"
        //         },
        //         "parent": "5e5b78e4596ddb1e01531471",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6ca0c87f80559141f27e",
        //         "name": {
        //             "fa": "آموزشی",
        //             "tu": "eğitici",
        //             "ar": "تربية",
        //             "en": "educational"
        //         },
        //         "slug": null,
        //         "__v": 0,
        //         "parent": "5e5b78e4596ddb1e01531471"
        //     },
        //     {
        //         "_id": "5e5e6c8cc87f80559141f27d",
        //         "name": {
        //             "fa": "صنعتی و فنی و مهندسی",
        //             "tu": "Endüstri, Teknik ve Mühendislik",
        //             "ar": "صناعية وفنية وهندسية",
        //             "en": "Industrial, Technical and Engineering"
        //         },
        //         "parent": "5e5b78e4596ddb1e01531471",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6c80c87f80559141f27c",
        //         "name": {
        //             "fa": "بازاریابی و فروش",
        //             "tu": "Pazarlama ve Satış",
        //             "ar": "التسويق والمبيعات",
        //             "en": "Marketing and Sales"
        //         },
        //         "parent": "5e5b78e4596ddb1e01531471",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6c70c87f80559141f27b",
        //         "name": {
        //             "fa": "مالی و حسابداری و حقوقی",
        //             "tu": "Finans, Muhasebe ve Hukuk",
        //             "ar": "المالية والمحاسبة والقانونية",
        //             "en": "Finance, Accounting and Legal"
        //         },
        //         "parent": "5e5b78e4596ddb1e01531471",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6c5ec87f80559141f27a",
        //         "name": {
        //             "fa": "رایانه و فناوری اطلاعات",
        //             "tu": "Bilgisayar ve Bilgi Teknolojisi",
        //             "ar": "الكمبيوتر وتكنولوجيا المعلومات",
        //             "en": "Computer and Information Technology"
        //         },
        //         "parent": "5e5b78e4596ddb1e01531471",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6c4fc87f80559141f279",
        //         "name": {
        //             "fa": "خدمات فروشگاه و رستوران",
        //             "tu": "Mağaza & Restoran Hizmetleri",
        //             "ar": "خدمات المطاعم والمطاعم",
        //             "en": "Shop & Restaurant Services"
        //         },
        //         "parent": "5e5b78e4596ddb1e01531471",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6c3ec87f80559141f278",
        //         "name": {
        //             "fa": "معماری ،عمران و ساختمانی",
        //             "tu": "Mimarlık, İnşaat ve İnşaat",
        //             "ar": "الهندسة المعمارية والمدنية والإنشائية",
        //             "en": "Architecture, Civil and Construction"
        //         },
        //         "parent": "5e5b78e4596ddb1e01531471",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6c28c87f80559141f277",
        //         "name": {
        //             "fa": "سرایداری و نظافت",
        //             "tu": "Bekçi ve Temizlik",
        //             "ar": "تصريف الأعمال والتنظيف",
        //             "en": "Caretaker and Cleaning"
        //         },
        //         "parent": "5e5b78e4596ddb1e01531471",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6c15c87f80559141f276",
        //         "name": {
        //             "fa": "اداری و مدیریت",
        //             "tu": "Yönetim ve Yönetim",
        //             "ar": "الإدارة والتنظيم",
        //             "en": "Administration and Management"
        //         },
        //         "parent": "5e5b78e4596ddb1e01531471",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6b9dc87f80559141f275",
        //         "name": {
        //             "fa": "پزشکی",
        //             "tu": "ilaç",
        //             "ar": "الطب",
        //             "en": "medicine"
        //         },
        //         "parent": "5e5e6b2ec87f80559141f26e",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6b7fc87f80559141f274",
        //         "name": {
        //             "fa": "کافی‌شاپ و رستوران",
        //             "tu": "Kahve Dükkanı ve Restoran",
        //             "ar": "كوفي شوب ومطعم",
        //             "en": "Coffee Shop & Restaurant"
        //         },
        //         "parent": "5e5e6b2ec87f80559141f26e",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6b73c87f80559141f273",
        //         "name": {
        //             "fa": "صنعتی",
        //             "tu": "endüstriyel",
        //             "ar": "Industrial",
        //             "en": "industrial"
        //         },
        //         "parent": "5e5e6b2ec87f80559141f26e",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6b65c87f80559141f272",
        //         "name": {
        //             "fa": "دفتر کار",
        //             "tu": "ofis",
        //             "ar": "office",
        //             "en": "office"
        //         },
        //         "parent": "5e5e6b2ec87f80559141f26e",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6b56c87f80559141f271",
        //         "parent": "5e5e6b2ec87f80559141f26e",
        //         "name": {
        //             "fa": "آرایشگاه و سالن‌های زیبایی",
        //             "tu": "Kuaförler ve Güzellik Salonları",
        //             "ar": "كوافير وصالونات تجميل",
        //             "en": "Hairdressers and Beauty Salons"
        //         },
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6b4ac87f80559141f270",
        //         "name": {
        //             "fa": "فروشگاه و مغازه",
        //             "tu": "Dükkan ve Dükkan",
        //             "ar": "تسوق وتسوق",
        //             "en": "Shop and Shop"
        //         },
        //         "parent": "5e5e6b2ec87f80559141f26e",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6b3ac87f80559141f26f",
        //         "name": {
        //             "fa": "عمده فروشی",
        //             "tu": "toptan satış",
        //             "ar": "wholesale",
        //             "en": "wholesale"
        //         },
        //         "parent": "5e5e6b22c87f80559141f26d",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6b2ec87f80559141f26e",
        //         "name": {
        //             "fa": "تجهیزات و ماشین‌آلات",
        //             "tu": "Ekipman ve Makineler",
        //             "ar": "المعدات والآلات",
        //             "en": "Equipment and Machinery"
        //         },
        //         "parent": "5e5e6b22c87f80559141f26d",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6b22c87f80559141f26d",
        //         "name": {
        //             "fa": "برای کسب و کار",
        //             "tu": "İş İçin",
        //             "ar": "للأعمال",
        //             "en": "For Business"
        //         },
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6b0cc87f80559141f26c",
        //         "name": {
        //             "fa": "اشیا",
        //             "tu": "nesneler",
        //             "ar": "كائنات",
        //             "en": "objects"
        //         },
        //         "parent": "5e5e6af4c87f80559141f26a",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6b01c87f80559141f26b",
        //         "name": {
        //             "fa": "حیوانات",
        //             "tu": "hayvanlar",
        //             "ar": "Animals",
        //             "en": "animals"
        //         },
        //         "parent": "5e5e6af4c87f80559141f26a",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6af4c87f80559141f26a",
        //         "name": {
        //             "fa": "گم‌شده‌ها",
        //             "tu": "Eksik",
        //             "ar": "مفقود",
        //             "en": "Missing"
        //         },
        //         "parent": "5e5e6a59c87f80559141f262",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6adec87f80559141f269",
        //         "name": {
        //             "fa": "تحقیقاتی",
        //             "tu": "araştırma",
        //             "ar": "البحث",
        //             "en": "research"
        //         },
        //         "parent": "5e5e6acec87f80559141f268",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6acec87f80559141f268",
        //         "name": {
        //             "fa": "داوطلبانه",
        //             "tu": "gönüllü",
        //             "ar": "طوعي",
        //             "en": "voluntary"
        //         },
        //         "parent": "5e5e6a59c87f80559141f262",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6aaac87f80559141f267",
        //         "name": {
        //             "fa": "ورزشی",
        //             "tu": "spor",
        //             "ar": "تمرن",
        //             "en": "sports"
        //         },
        //         "parent": "5e5e6a66c87f80559141f263",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6a93c87f80559141f266",
        //         "name": {
        //             "fa": "موسیقی و تئاتر",
        //             "tu": "Müzik ve Tiyatro",
        //             "ar": "الموسيقى والمسرح",
        //             "en": "Music and Theater"
        //         },
        //         "parent": "5e5e6a66c87f80559141f263",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6a85c87f80559141f265",
        //         "name": {
        //             "fa": "گردهمایی و همایش",
        //             "tu": "Toplantı ve Konferans",
        //             "ar": "الاجتماع والمؤتمر",
        //             "en": "Meeting and Conference"
        //         },
        //         "parent": "5e5e6a66c87f80559141f263",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6a76c87f80559141f264",
        //         "name": {
        //             "fa": "حراج",
        //             "tu": "açık artırma",
        //             "ar": "المزاد",
        //             "en": "auction"
        //         },
        //         "parent": "5e5e6a66c87f80559141f263",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6a66c87f80559141f263",
        //         "name": {
        //             "fa": "رویداد",
        //             "tu": "etkinlik",
        //             "ar": "event",
        //             "en": "event"
        //         },
        //         "parent": "5e5e6a59c87f80559141f262",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6a59c87f80559141f262",
        //         "name": {
        //             "fa": "اجتماعی",
        //             "tu": "sosyal",
        //             "ar": "social",
        //             "en": "social"
        //         },
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6a39c87f80559141f261",
        //         "name": {
        //             "fa": "اسباب‌ بازی",
        //             "tu": "oyuncaklar",
        //             "ar": "toys",
        //             "en": "toys"
        //         },
        //         "parent": "5e5e68e6c87f80559141f24e",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6a1bc87f80559141f260",
        //         "name": {
        //             "fa": "ورزش و تناسب اندام",
        //             "tu": "Spor ve Fitness",
        //             "ar": "الرياضة واللياقة البدنية",
        //             "en": "Sport and Fitness"
        //         },
        //         "parent": "5e5e68e6c87f80559141f24e",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6a0dc87f80559141f25f",
        //         "name": {
        //             "fa": "آلات موسیقی",
        //             "tu": "Müzik Aletleri",
        //             "ar": "الآلات الموسيقية",
        //             "en": "Musical Instruments"
        //         },
        //         "parent": "5e5e68e6c87f80559141f24e",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e69fac87f80559141f25e",
        //         "name": {
        //             "fa": "کلکسیون و سرگرمی",
        //             "tu": "Koleksiyonluk ve Eğlence",
        //             "ar": "مقتنيات وترفيه",
        //             "en": "Collectibles and Entertainment"
        //         },
        //         "parent": "5e5e68e6c87f80559141f24e",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e69e9c87f80559141f25d",
        //         "name": {
        //             "fa": "حیوانات",
        //             "tu": "hayvanlar",
        //             "ar": "Animals",
        //             "en": "animals"
        //         },
        //         "parent": "5e5e68e6c87f80559141f24e",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e69bdc87f80559141f25c",
        //         "name": {
        //             "fa": "مجلات",
        //             "tu": "Dergiler",
        //             "ar": "Magazines",
        //             "en": "Magazines"
        //         },
        //         "parent": "5e5e697fc87f80559141f257",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e69b2c87f80559141f25b",
        //         "name": {
        //             "fa": "مذهبی",
        //             "tu": "dini",
        //             "ar": "الدينية",
        //             "en": "religious"
        //         },
        //         "parent": "5e5e697fc87f80559141f257",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e69a4c87f80559141f25a",
        //         "name": {
        //             "fa": "تاریخی",
        //             "tu": "tarihsel",
        //             "ar": "تاريخي",
        //             "en": "historical"
        //         },
        //         "parent": "5e5e697fc87f80559141f257",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6997c87f80559141f259",
        //         "name": {
        //             "fa": "ادبی",
        //             "tu": "edebi",
        //             "ar": "أدبي",
        //             "en": "literary"
        //         },
        //         "parent": "5e5e697fc87f80559141f257",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e698dc87f80559141f258",
        //         "name": {
        //             "fa": "آموزشی",
        //             "tu": "eğitici",
        //             "ar": "تربية",
        //             "en": "educational"
        //         },
        //         "parent": "5e5e697fc87f80559141f257",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e697fc87f80559141f257",
        //         "name": {
        //             "fa": "کتاب و مجله",
        //             "tu": "Kitap ve Dergi",
        //             "ar": "مجلة",
        //             "en": "Book and Magazine"
        //         },
        //         "parent": "5e5e68e6c87f80559141f24e",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e696bc87f80559141f256",
        //         "name": {
        //             "fa": "تور و چارتر",
        //             "tu": "Tur ve Kiralama",
        //             "ar": "جولة وميثاق",
        //             "en": "Tour and Charter"
        //         },
        //         "parent": "5e5e68e6c87f80559141f24e",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e694ac87f80559141f255",
        //         "name": {
        //             "fa": "اتوبوس، مترو و قطار",
        //             "tu": "Otobüs, Metro ve Tren",
        //             "ar": "حافلة ومترو أنفاق وقطار",
        //             "en": "Bus, Subway and Train"
        //         },
        //         "parent": "5e5e68f2c87f80559141f24f",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e693ec87f80559141f254",
        //         "name": {
        //             "fa": "ورزشی",
        //             "tu": "spor",
        //             "ar": "sports",
        //             "en": "sports"
        //         },
        //         "parent": "5e5e68f2c87f80559141f24f",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6925c87f80559141f253",
        //         "name": {
        //             "fa": "اماکن و مسابقات ورزشی",
        //             "tu": "Spor alanları ve yarışmalar",
        //             "ar": "الملاعب والمسابقات الرياضية",
        //             "en": "Sports venues and competitions"
        //         },
        //         "parent": "5e5e68f2c87f80559141f24f",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6918c87f80559141f252",
        //         "name": {
        //             "fa": "کارت هدیه و تخفیف",
        //             "tu": "Hediye Kartı ve İndirim",
        //             "ar": "بطاقة الهدايا والخصم",
        //             "en": "Gift Card and Discount"
        //         },
        //         "parent": "5e5e68f2c87f80559141f24f",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e690cc87f80559141f251",
        //         "name": {
        //             "fa": "تئاتر و سینما",
        //             "tu": "Tiyatro ve Sinema",
        //             "ar": "المسرح والسينما",
        //             "en": "Theater and Cinema"
        //         },
        //         "parent": "5e5e68f2c87f80559141f24f",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e68fdc87f80559141f250",
        //         "name": {
        //             "fa": "کنسرت",
        //             "tu": "Konser",
        //             "ar": "حفلة موسيقية",
        //             "en": "Concert"
        //         },
        //         "parent": "5e5e68f2c87f80559141f24f",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e68f2c87f80559141f24f",
        //         "name": {
        //             "fa": "بلیط",
        //             "tu": "bilet",
        //             "ar": "تذكرة",
        //             "en": "ticket"
        //         },
        //         "parent": "5e5e68e6c87f80559141f24e",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e68e6c87f80559141f24e",
        //         "name": {
        //             "fa": "سرگرمی و فراغت",
        //             "tu": "Boş Zaman ve Eğlence",
        //             "ar": "التسلية والترفيه",
        //             "en": "Leisure and Entertainment"
        //         },
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e68d2c87f80559141f24d",
        //         "name": {
        //             "fa": "لوازم التحریر",
        //             "tu": "kırtasiye",
        //             "ar": "القرطاسية",
        //             "en": "stationery"
        //         },
        //         "parent": "5e5e67a1c87f80559141f23e",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e68bbc87f80559141f24c",
        //         "name": {
        //             "fa": "اسباب و اثاث بچه",
        //             "tu": "bebek mobilyaları",
        //             "ar": "أثاث أطفال",
        //             "en": "baby furniture"
        //         },
        //         "parent": "5e5e6872c87f80559141f248",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e68b0c87f80559141f24b",
        //         "name": {
        //             "fa": "صندلی بچه",
        //             "tu": "bebek sandalyesi",
        //             "ar": "كرسي أطفال",
        //             "en": "baby chair"
        //         },
        //         "parent": "5e5e6872c87f80559141f248",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e68a0c87f80559141f24a",
        //         "name": {
        //             "fa": "کالسکه و لوازم جانبی",
        //             "tu": "Çocuk Arabaları ve Aksesuarları",
        //             "ar": "عربات واكسسوارات",
        //             "en": "Prams and Accessories"
        //         },
        //         "parent": "5e5e6872c87f80559141f248",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6886c87f80559141f249",
        //         "name": {
        //             "fa": "اسباب بازی",
        //             "tu": "oyuncaklar",
        //             "ar": "toys",
        //             "en": "toys"
        //         },
        //         "parent": "5e5e6872c87f80559141f248",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6872c87f80559141f248",
        //         "name": {
        //             "fa": "وسایل بچه و اسباب بازی",
        //             "tu": "Çocuk Oyuncakları",
        //             "ar": "ألعاب الأطفال",
        //             "en": "Kids' Toys"
        //         },
        //         "parent": "5e5e67a1c87f80559141f23e",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e684ec87f80559141f247",
        //         "name": {
        //             "fa": "کفش و لباس بچه",
        //             "tu": "bebek ayakkabıları ve giysileri",
        //             "ar": "أحذية وملابس أطفال",
        //             "en": "baby shoes and clothes"
        //         },
        //         "parent": "5e5e67a1c87f80559141f23e",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6834c87f80559141f246",
        //         "name": {
        //             "fa": "آرایشی، بهداشتی و درمانی",
        //             "tu": "Kozmetik, Sağlık",
        //             "ar": "مستحضرات التجميل والصحة",
        //             "en": "Cosmetics, Health"
        //         },
        //         "parent": "5e5e67a1c87f80559141f23e",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e681bc87f80559141f245",
        //         "name": {
        //             "fa": "بدلیجات",
        //             "tu": "yapay elmas",
        //             "ar": "أحجار الراين",
        //             "en": "rhinestones"
        //         },
        //         "parent": "5e5e67f3c87f80559141f242",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e680fc87f80559141f244",
        //         "name": {
        //             "fa": "جواهرات",
        //             "tu": "mücevher",
        //             "ar": "مجوهرات",
        //             "en": "jewelry"
        //         },
        //         "parent": "5e5e67f3c87f80559141f242",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6804c87f80559141f243",
        //         "name": {
        //             "fa": "ساعت",
        //             "tu": "saat",
        //             "ar": "ساعة",
        //             "en": "clock"
        //         },
        //         "parent": "5e5e67f3c87f80559141f242",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e67f3c87f80559141f242",
        //         "name": {
        //             "fa": "تزیینی",
        //             "tu": "dekoratif",
        //             "ar": "الزخرفية",
        //             "en": "decorative"
        //         },
        //         "parent": "5e5e67a1c87f80559141f23e",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e67e2c87f80559141f241",
        //         "name": {
        //             "fa": "لباس",
        //             "tu": "elbise",
        //             "ar": "فستان",
        //             "en": "dress"
        //         },
        //         "parent": "5e5e67b9c87f80559141f23f",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e67cbc87f80559141f240",
        //         "name": {
        //             "fa": "کیف/کفش/کمربند",
        //             "tu": "çanta / ayakkabı / kemer",
        //             "ar": "حقيبة / أحذية / حزام",
        //             "en": "bag / shoes / belt"
        //         },
        //         "parent": "5e5e67b9c87f80559141f23f",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e67b9c87f80559141f23f",
        //         "name": {
        //             "fa": "کیف، کفش و لباس",
        //             "tu": "çanta, ayakkabı ve kıyafet",
        //             "ar": "حقائب وأحذية وملابس",
        //             "en": "bags, shoes and clothes"
        //         },
        //         "parent": "5e5e67a1c87f80559141f23e",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e67a1c87f80559141f23e",
        //         "name": {
        //             "fa": "وسایل شخصی",
        //             "tu": "Kişisel eşyalar",
        //             "ar": "متعلقات شخصية",
        //             "en": "Personal belongings"
        //         },
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e675dc87f80559141f23d",
        //         "name": {
        //             "fa": "مشاوره تحصیلی",
        //             "tu": "Çalışma Danışmanlığı",
        //             "ar": "إرشاد الدراسة",
        //             "en": "Study Counseling"
        //         },
        //         "parent": "5e5e66dec87f80559141f237",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e674bc87f80559141f23c",
        //         "name": {
        //             "fa": "ورزشی",
        //             "tu": "spor",
        //             "ar": "الرياضة",
        //             "en": "sports"
        //         },
        //         "parent": "5e5e66dec87f80559141f237",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e673cc87f80559141f23b",
        //         "name": {
        //             "fa": "هنری",
        //             "tu": "sanat",
        //             "ar": "art",
        //             "en": "art"
        //         },
        //         "parent": "5e5e66dec87f80559141f237",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6726c87f80559141f23a",
        //         "name": {
        //             "fa": "نرم‌افزار",
        //             "tu": "Yazılım",
        //             "ar": "Software",
        //             "en": "Software"
        //         },
        //         "parent": "5e5e66dec87f80559141f237",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6710c87f80559141f239",
        //         "name": {
        //             "fa": "دروس مدرسه و دانشگاه",
        //             "tu": "Okul ve Üniversite Dersleri",
        //             "ar": "مقررات المدارس والجامعات",
        //             "en": "School and University Courses"
        //         },
        //         "parent": "5e5e66dec87f80559141f237",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6701c87f80559141f238",
        //         "name": {
        //             "fa": "زبان خارجی",
        //             "tu": "yabancı dil",
        //             "ar": "لغة أجنبية",
        //             "en": "foreign language"
        //         },
        //         "parent": "5e5e66dec87f80559141f237",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e66dec87f80559141f237",
        //         "name": {
        //             "fa": "آموزشی",
        //             "tu": "eğitici",
        //             "ar": "تربية",
        //             "en": "educational"
        //         },
        //         "parent": "5e5e6055c87f80559141f1f9",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e66ccc87f80559141f236",
        //         "name": {
        //             "fa": "باغبانی و درختکاری",
        //             "tu": "bahçecilik ve ağaç dikimi",
        //             "ar": "البستنة وزراعة الأشجار",
        //             "en": "horticulture and tree planting"
        //         },
        //         "parent": "5e5e6055c87f80559141f1f9",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e66b7c87f80559141f235",
        //         "name": {
        //             "fa": "نظافت",
        //             "tu": "tımar",
        //             "ar": "grooming",
        //             "en": "grooming"
        //         },
        //         "parent": "5e5e6055c87f80559141f1f9",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e66a1c87f80559141f234",
        //         "name": {
        //             "fa": "سرگرمی",
        //             "tu": "Eğlence",
        //             "ar": "Entertainment",
        //             "en": "Entertainment"
        //         },
        //         "parent": "5e5e6055c87f80559141f1f9",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e668bc87f80559141f233",
        //         "name": {
        //             "fa": "آرایشگری و زیبایی",
        //             "tu": "Kuaför ve Güzellik",
        //             "ar": "تصفيف الشعر والجمال",
        //             "en": "Hairdresser and Beauty"
        //         },
        //         "parent": "5e5e6055c87f80559141f1f9",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e666bc87f80559141f232",
        //         "name": {
        //             "fa": "پیشه و مهارت",
        //             "tu": "El Sanatları ve Beceriler",
        //             "ar": "الحرف والمهارات",
        //             "en": "Crafts and Skills"
        //         },
        //         "parent": "5e5e6055c87f80559141f1f9",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6657c87f80559141f231",
        //         "name": {
        //             "fa": "حمل و نقل",
        //             "tu": "taşıma",
        //             "ar": "transport",
        //             "en": "transport"
        //         },
        //         "parent": "5e5e6055c87f80559141f1f9",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e662bc87f80559141f230",
        //         "name": {
        //             "fa": "تعمیرات نرم‌افزار و سخت‌افزار گوشی موبایل",
        //             "tu": "Cep Telefonu Yazılım ve Donanım Onarımı",
        //             "ar": "إصلاح برامج الهاتف المحمول والأجهزة",
        //             "en": "Mobile Phone Software and Hardware Repair"
        //         },
        //         "parent": "5e5e65c8c87f80559141f22a",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e661ec87f80559141f22f",
        //         "name": {
        //             "fa": "خدمات نرم‌افزار و سخت‌افزار کامپیوتر",
        //             "tu": "Bilgisayar Yazılım ve Donanım Hizmetleri",
        //             "ar": "برامج الكمبيوتر والأجهزة",
        //             "en": "Computer Software and Hardware Services"
        //         },
        //         "parent": "5e5e65c8c87f80559141f22a",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6611c87f80559141f22e",
        //         "name": {
        //             "fa": "خدمات پهنای باند اینترنت",
        //             "tu": "İnternet Geniş Bant Hizmetleri",
        //             "ar": "خدمات الإنترنت ذات النطاق العريض",
        //             "en": "Internet Broadband Services"
        //         },
        //         "parent": "5e5e65c8c87f80559141f22a",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6603c87f80559141f22d",
        //         "name": {
        //             "fa": "میزبانی و طراحی سایت",
        //             "tu": "Web Hosting ve Tasarım",
        //             "ar": "استضافة وتصميم المواقع",
        //             "en": "Web Hosting and Design"
        //         },
        //         "parent": "5e5e65c8c87f80559141f22a",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e65f2c87f80559141f22c",
        //         "name": {
        //             "fa": "فروش دامنه و سایت",
        //             "tu": "Site ve Site Satışları",
        //             "ar": "مبيعات الموقع والموقع",
        //             "en": "Site and Site Sales"
        //         },
        //         "parent": "5e5e65c8c87f80559141f22a",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e65ddc87f80559141f22b",
        //         "name": {
        //             "fa": "مالی/حسابداری/بیمه",
        //             "tu": "Finans / Muhasebe / Sigorta",
        //             "ar": "مالية / محاسبة / تأمين",
        //             "en": "Finance / Accounting / Insurance"
        //         },
        //         "parent": "5e5e6055c87f80559141f1f9",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e65c8c87f80559141f22a",
        //         "name": {
        //             "fa": "خدمات رایانه‌ای و موبایل",
        //             "tu": "Bilgisayar ve Mobil Hizmetler",
        //             "ar": "خدمات الكمبيوتر والهواتف المحمولة",
        //             "en": "Computer & Mobile Services"
        //         },
        //         "parent": "5e5e6055c87f80559141f1f9",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e65bec87f80559141f229",
        //         "name": {
        //             "fa": "پذیرایی/مراسم",
        //             "tu": "Kabul / Tören",
        //             "ar": "استقبال / احتفال",
        //             "en": "Reception / Ceremony"
        //         },
        //         "parent": "5e5e6055c87f80559141f1f9",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e65aec87f80559141f228",
        //         "parent": "5e5e6055c87f80559141f1f9",
        //         "name": {
        //             "fa": "موتور و ماشین",
        //             "tu": "motor ve makine",
        //             "ar": "المحرك والآلة",
        //             "en": "engine and machine"
        //         },
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6598c87f80559141f227",
        //         "name": {
        //             "fa": "ابزار باغبانی",
        //             "tu": "Bahçe Aletleri",
        //             "ar": "أدوات البستنة",
        //             "en": "Gardening Tools"
        //         },
        //         "parent": "5e5e654fc87f80559141f222",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6589c87f80559141f226",
        //         "name": {
        //             "fa": "حیاط و ایوان",
        //             "tu": "Bahçe ve sundurma",
        //             "ar": "الفناء والشرفة",
        //             "en": "Yard and porch"
        //         },
        //         "parent": "5e5e654fc87f80559141f222",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e657ec87f80559141f225",
        //         "name": {
        //             "fa": "آشپزخانه",
        //             "tu": "mutfak",
        //             "ar": "kitchen",
        //             "en": "kitchen"
        //         },
        //         "parent": "5e5e654fc87f80559141f222",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e656ec87f80559141f224",
        //         "name": {
        //             "fa": "سیستم گرمایشی سرمایشی و گاز",
        //             "tu": "Soğutma ve gazlı ısıtma sistemi",
        //             "ar": "نظام تبريد وتسخين للغاز",
        //             "en": "Cooling and gas heating system"
        //         },
        //         "parent": "5e5e654fc87f80559141f222",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6563c87f80559141f223",
        //         "name": {
        //             "fa": "سرویس بهداشتی و سونا",
        //             "tu": "Sauna ve Banyo",
        //             "ar": "ساونا وحمام",
        //             "en": "Sauna & Bathroom"
        //         },
        //         "parent": "5e5e654fc87f80559141f222",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e654fc87f80559141f222",
        //         "name": {
        //             "fa": "ساختمان و حیاط",
        //             "tu": "Bina ve avlu",
        //             "ar": "مبنى وساحة",
        //             "en": "Building and yard"
        //         },
        //         "parent": "5e5e6043c87f80559141f1f8",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e653cc87f80559141f221",
        //         "name": {
        //             "fa": "تعمیرات",
        //             "tu": "onarımlar",
        //             "ar": "repairs",
        //             "en": "repairs"
        //         },
        //         "parent": "5e5e6526c87f80559141f21f",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6531c87f80559141f220",
        //         "name": {
        //             "fa": "نظافت و خیاطی و اتو",
        //             "tu": "temizlik ve dikiş ve ütü",
        //             "ar": "التنظيف والخياطة والكي",
        //             "en": "cleaning and sewing and ironing"
        //         },
        //         "parent": "5e5e6526c87f80559141f21f",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6526c87f80559141f21f",
        //         "name": {
        //             "fa": "ابزار",
        //             "tu": "araç",
        //             "ar": "tool",
        //             "en": "tool"
        //         },
        //         "parent": "5e5e6043c87f80559141f1f8",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e64fcc87f80559141f21e",
        //         "name": {
        //             "fa": "ماشین لباسشویی و خشک کننده",
        //             "tu": "çamaşır makinesi ve kurutucu",
        //             "ar": "غسالة ومجفف",
        //             "en": "washing machine and dryer"
        //         },
        //         "parent": "5e5e63f8c87f80559141f219",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6437c87f80559141f21d",
        //         "name": {
        //             "fa": "مایکروویو و گاز",
        //             "tu": "Mikrodalga ve Gaz",
        //             "ar": "ميكروويف وغاز",
        //             "en": "Microwave & Gas"
        //         },
        //         "parent": "5e5e63f8c87f80559141f219",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e642bc87f80559141f21c",
        //         "name": {
        //             "fa": "وسایل آشپزی و غذاخوری",
        //             "tu": "Yemekler",
        //             "ar": "أطباق",
        //             "en": "Dishes"
        //         },
        //         "parent": "5e5e63f8c87f80559141f219",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e641ac87f80559141f21b",
        //         "name": {
        //             "fa": "یخچال و فریزر",
        //             "tu": "Buzdolabı",
        //             "ar": "ثلاجة",
        //             "en": "Refrigerator"
        //         },
        //         "parent": "5e5e63f8c87f80559141f219",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e640bc87f80559141f21a",
        //         "name": {
        //             "fa": "ماشین ظرفشویی",
        //             "tu": "Bulaşık makinesi",
        //             "ar": "غسالة أطباق",
        //             "en": "Dishwasher"
        //         },
        //         "parent": "5e5e63f8c87f80559141f219",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e63f8c87f80559141f219",
        //         "parent": "5e5e6043c87f80559141f1f8",
        //         "name": {
        //             "fa": "وسایل آشپزخانه",
        //             "tu": "Mutfak Gereçleri",
        //             "ar": "أدوات المطبخ",
        //             "en": "Kitchen Appliances"
        //         },
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e624ac87f80559141f218",
        //         "name": {
        //             "fa": "میز تلویزیون و وسایل سیستم پخش",
        //             "tu": "Televizyon Masaları ve Aksesuarları",
        //             "ar": "مكاتب التلفزيون وملحقاتها",
        //             "en": "Television Desks and Accessories"
        //         },
        //         "parent": "5e5e61d3c87f80559141f20f",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e623cc87f80559141f217",
        //         "name": {
        //             "fa": "مبلمان و صندلی راحتی",
        //             "tu": "Mobilya ve Sandalyeler",
        //             "ar": "أثاث وكراسي",
        //             "en": "Furniture and Chairs"
        //         },
        //         "parent": "5e5e61d3c87f80559141f20f",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6223c87f80559141f216",
        //         "name": {
        //             "fa": "تخت و اتاق خواب",
        //             "tu": "Yatak ve Yatak",
        //             "ar": "سرير وسرير",
        //             "en": "Bed and Bed"
        //         },
        //         "parent": "5e5e61d3c87f80559141f20f",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6215c87f80559141f215",
        //         "name": {
        //             "fa": "پرده و رومیزی",
        //             "tu": "perdeler ve masaüstü bilgisayarlar",
        //             "ar": "ستائر ومكتبي",
        //             "en": "curtains and desktops"
        //         },
        //         "parent": "5e5e61d3c87f80559141f20f",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e620ac87f80559141f214",
        //         "name": {
        //             "fa": "کمد و بوفه",
        //             "tu": "Gardırop ve Büfe",
        //             "ar": "خزانة ملابس وبوفيه",
        //             "en": "Wardrobe and Buffet"
        //         },
        //         "parent": "5e5e61d3c87f80559141f20f",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6200c87f80559141f213",
        //         "name": {
        //             "fa": "فرش و گلیم",
        //             "tu": "kilim ve halı",
        //             "ar": "سجاد وسجاد",
        //             "en": "rugs and carpet"
        //         },
        //         "parent": "5e5e61d3c87f80559141f20f",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e61f6c87f80559141f212",
        //         "name": {
        //             "fa": "میز و صندلی",
        //             "tu": "masa ve sandalye",
        //             "ar": "طاولة وكرسي",
        //             "en": "table and chair"
        //         },
        //         "parent": "5e5e61d3c87f80559141f20f",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e61e9c87f80559141f211",
        //         "name": {
        //             "fa": "لوازم روشنایی",
        //             "tu": "Aydınlatma Aksesuarları",
        //             "ar": "مستلزمات الإضاءة",
        //             "en": "Lighting Accessories"
        //         },
        //         "parent": "5e5e61d3c87f80559141f20f",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e61dfc87f80559141f210",
        //         "name": {
        //             "fa": "تزئینی و آثار هنری",
        //             "tu": "Dekoratif ve Sanat Eserleri",
        //             "ar": "أعمال فنية وزخرفية",
        //             "en": "Decorative and Artwork"
        //         },
        //         "parent": "5e5e61d3c87f80559141f20f",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e61d3c87f80559141f20f",
        //         "name": {
        //             "fa": "وسایل و تزئینات خانه",
        //             "tu": "Ev Dekorasyonu",
        //             "ar": "الديكور المنزلي",
        //             "en": "Home Decoration"
        //         },
        //         "parent": "5e5e6043c87f80559141f1f8",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e61b4c87f80559141f20e",
        //         "name": {
        //             "fa": "تلفن رومیزی",
        //             "tu": "masaüstü telefonu",
        //             "ar": "هاتف مكتبي",
        //             "en": "desktop phone"
        //         },
        //         "parent": "5e5e6029c87f80559141f1f7",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6191c87f80559141f20d",
        //         "name": {
        //             "fa": "دوربین مداربسته",
        //             "tu": "CCTV",
        //             "ar": "CCTV",
        //             "en": "CCTV"
        //         },
        //         "parent": "5e5e6137c87f80559141f206",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6182c87f80559141f20c",
        //         "name": {
        //             "fa": "تلویزیون و پروژکتور",
        //             "tu": "TV ve Projektör",
        //             "ar": "TV & Projector",
        //             "en": "TV & Projector"
        //         },
        //         "parent": "5e5e6137c87f80559141f206",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6177c87f80559141f20b",
        //         "name": {
        //             "fa": "ویدئو و پخش کننده DVD",
        //             "tu": "Video ve DVD Oynatıcı",
        //             "ar": "مشغل فيديو DVD",
        //             "en": "Video and DVD Player"
        //         },
        //         "parent": "5e5e6137c87f80559141f206",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e616bc87f80559141f20a",
        //         "name": {
        //             "fa": "سیستم صوتی خانگی",
        //             "tu": "ev ses sistemi",
        //             "ar": "نظام صوتي منزلي",
        //             "en": "home audio system"
        //         },
        //         "parent": "5e5e6137c87f80559141f206",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e615cc87f80559141f209",
        //         "name": {
        //             "fa": "پخش‌کننده همراه",
        //             "tu": "Mobil Oynatıcı",
        //             "ar": "Mobile Player",
        //             "en": "Mobile Player"
        //         },
        //         "parent": "5e5e6137c87f80559141f206",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6152c87f80559141f208",
        //         "name": {
        //             "fa": "دوربین عکاسی و فیلم‌برداری",
        //             "tu": "Video Kamera",
        //             "ar": "كاميرا الفيديو",
        //             "en": "Camcorder"
        //         },
        //         "parent": "5e5e6137c87f80559141f206",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6146c87f80559141f207",
        //         "parent": "5e5e6137c87f80559141f206",
        //         "name": {
        //             "fa": "فیلم و موسیقی",
        //             "tu": "Filmler ve Müzik",
        //             "ar": "أفلام وموسيقى",
        //             "en": "Movies and Music"
        //         },
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6137c87f80559141f206",
        //         "name": {
        //             "fa": "صوتی و تصویری",
        //             "tu": "Ses ve Video",
        //             "ar": "الصوت والفيديو",
        //             "en": "Audio and Video"
        //         },
        //         "parent": "5e5e6029c87f80559141f1f7",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e611ac87f80559141f205",
        //         "name": {
        //             "fa": "کنسول، بازی‌ ویدئویی و آنلاین",
        //             "tu": "Konsol, Video ve Çevrimiçi Oyun",
        //             "ar": "وحدة التحكم والفيديو والألعاب عبر الإنترنت",
        //             "en": "Console, Video and Online Game"
        //         },
        //         "parent": "5e5e6029c87f80559141f1f7",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e60fec87f80559141f204",
        //         "parent": "5e5e60b9c87f80559141f1ff",
        //         "name": {
        //             "fa": "پرینتر/اسکنر/کپی/فکس",
        //             "tu": "Yazıcı / Tarayıcı / Kopyalama / Faks",
        //             "ar": "طابعة / ماسح ضوئي / نسخ / فاكس",
        //             "en": "Printer / Scanner / Copy / Fax"
        //         },
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e60f3c87f80559141f203",
        //         "name": {
        //             "fa": "مودم و تجهیزات شبکه",
        //             "tu": "Modem ve Ağ Donanımı",
        //             "ar": "المودم ومعدات الشبكة",
        //             "en": "Modem and Network Equipment"
        //         },
        //         "parent": "5e5e60b9c87f80559141f1ff",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e60e3c87f80559141f202",
        //         "name": {
        //             "fa": "قطعات و لوازم جانبی",
        //             "tu": "Parçalar ve Aksesuarlar",
        //             "ar": "قطع غيار واكسسوارات",
        //             "en": "Parts and Accessories"
        //         },
        //         "parent": "5e5e60b9c87f80559141f1ff",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e60d8c87f80559141f201",
        //         "name": {
        //             "fa": "رایانه رومیزی",
        //             "tu": "Masaüstü Bilgisayar",
        //             "ar": "كمبيوتر سطح المكتب",
        //             "en": "Desktop Computer"
        //         },
        //         "parent": "5e5e60b9c87f80559141f1ff",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e60cac87f80559141f200",
        //         "name": {
        //             "fa": "رایانه همراه",
        //             "tu": "mobil",
        //             "ar": "mobile",
        //             "en": "mobile"
        //         },
        //         "parent": "5e5e60b9c87f80559141f1ff",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e60b9c87f80559141f1ff",
        //         "name": {
        //             "fa": "رایانه",
        //             "tu": "bilgisayar",
        //             "ar": "كمبيوتر",
        //             "en": "computer"
        //         },
        //         "parent": "5e5e6029c87f80559141f1f7",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e60a2c87f80559141f1fe",
        //         "name": {
        //             "fa": "سیم کارت",
        //             "tu": "SIM",
        //             "ar": "SIM",
        //             "en": "SIM"
        //         },
        //         "parent": "5e5e6076c87f80559141f1fa",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6096c87f80559141f1fd",
        //         "name": {
        //             "fa": "لوازم جانبی موبایل و تبلت",
        //             "tu": "Mobil ve Tablet Aksesuarları",
        //             "ar": "ملحقات الهاتف المحمول والكمبيوتر اللوحي",
        //             "en": "Mobile & Tablet Accessories"
        //         },
        //         "parent": "5e5e6076c87f80559141f1fa",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e608bc87f80559141f1fc",
        //         "parent": "5e5e6076c87f80559141f1fa",
        //         "name": {
        //             "fa": "تبلت",
        //             "tu": "tablet",
        //             "ar": "tablet",
        //             "en": "tablet"
        //         },
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6082c87f80559141f1fb",
        //         "name": {
        //             "fa": "گوشی موبایل",
        //             "tu": "cep telefonu",
        //             "ar": "هاتف محمول",
        //             "en": "mobile phone"
        //         },
        //         "parent": "5e5e6076c87f80559141f1fa",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6076c87f80559141f1fa",
        //         "name": {
        //             "fa": "موبایل و تبلت",
        //             "tu": "Mobil ve Tablet",
        //             "ar": "الجوّال والأجهزة اللوحية",
        //             "en": "Mobile & Tablet"
        //         },
        //         "parent": "5e5e6029c87f80559141f1f7",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6055c87f80559141f1f9",
        //         "name": {
        //             "fa": "خدمات",
        //             "tu": "Hizmetler",
        //             "ar": "الخدمات",
        //             "en": "Services"
        //         },
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6043c87f80559141f1f8",
        //         "name": {
        //             "fa": "مربوط به خانه",
        //             "tu": "ev ile ilgili",
        //             "ar": "ذات صلة بالمنزل",
        //             "en": "home related"
        //         },
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e6029c87f80559141f1f7",
        //         "name": {
        //             "fa": "لوازم الکترونیکی",
        //             "tu": "elektronik",
        //             "ar": "إلكترونيات",
        //             "en": "electronics"
        //         },
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5fa6c87f80559141f1f6",
        //         "name": {
        //             "fa": "سنگین",
        //             "tu": "ağır",
        //             "ar": "ثقيل",
        //             "en": "heavy"
        //         },
        //         "parent": "5e5e5c84c87f80559141f1ef",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5f68c87f80559141f1f5",
        //         "name": {
        //             "fa": "اجاره‌ای",
        //             "tu": "Kiralama",
        //             "ar": "تأجير",
        //             "en": "Rental"
        //         },
        //         "parent": "5e5e5c84c87f80559141f1ef",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5f4dc87f80559141f1f4",
        //         "name": {
        //             "fa": "کلاسیک",
        //             "tu": "klasik",
        //             "ar": "كلاسيكي",
        //             "en": "classic"
        //         },
        //         "parent": "5e5e5c84c87f80559141f1ef",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5f2fc87f80559141f1f3",
        //         "name": {
        //             "fa": "سواری",
        //             "tu": "binicilik",
        //             "ar": "ركوب",
        //             "en": "riding"
        //         },
        //         "parent": "5e5e5c84c87f80559141f1ef",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5effc87f80559141f1f2",
        //         "name": {
        //             "fa": "قایق و لوازم جانبی",
        //             "tu": "Tekneler ve Aksesuarlar",
        //             "ar": "قوارب وإكسسوارات",
        //             "en": "Boats and Accessories"
        //         },
        //         "parent": "5e5b78ea596ddb1e01531472",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5ef0c87f80559141f1f1",
        //         "name": {
        //             "fa": "موتورسیکلت و لوازم جانبی",
        //             "tu": "Motosiklet ve Aksesuarları",
        //             "ar": "دراجات نارية واكسسواراتها",
        //             "en": "Motorcycle & Accessories"
        //         },
        //         "parent": "5e5b78ea596ddb1e01531472",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5ee2c87f80559141f1f0",
        //         "name": {
        //             "fa": "قطعات یدکی و لوازم جانبی خودرو",
        //             "tu": "Otomobil Parçaları ve Aksesuarları",
        //             "ar": "قطع غيار السيارات والاكسسوارات",
        //             "en": "Auto Parts and Accessories"
        //         },
        //         "parent": "5e5b78ea596ddb1e01531472",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5c84c87f80559141f1ef",
        //         "name": {
        //             "fa": "خودرو",
        //             "tu": "araba",
        //             "ar": "car",
        //             "en": "car"
        //         },
        //         "parent": "5e5b78ea596ddb1e01531472",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5af2c87f80559141f1ee",
        //         "name": {
        //             "fa": "پیش‌فروش",
        //             "tu": "satıcı",
        //             "ar": "موزع",
        //             "en": "reseller"
        //         },
        //         "parent": "5e5e599cc87f80559141f1dc",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5ae4c87f80559141f1ed",
        //         "name": {
        //             "fa": "امور مالی و حقوقی",
        //             "tu": "Finans ve Hukuk",
        //             "ar": "Finance and Legal",
        //             "en": "Finance and Legal"
        //         },
        //         "parent": "5e5e599cc87f80559141f1dc",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5ad3c87f80559141f1ec",
        //         "name": {
        //             "fa": "مشارکت در ساخت",
        //             "tu": "Oluşturmaya Katkıda Bulunun",
        //             "ar": "ساهم في البناء",
        //             "en": "Contribute to Build"
        //         },
        //         "parent": "5e5e599cc87f80559141f1dc",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5ac5c87f80559141f1eb",
        //         "name": {
        //             "fa": "آژانس املاک",
        //             "tu": "Emlak Ofisi",
        //             "ar": "الوكالة العقارية",
        //             "en": "Real Estate Agency"
        //         },
        //         "parent": "5e5e599cc87f80559141f1dc",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5aa7c87f80559141f1ea",
        //         "name": {
        //             "fa": "دفتر کار و فضای آموزشی",
        //             "tu": "Ofis ve Eğitim Alanı",
        //             "ar": "مساحة المكتب والتدريب",
        //             "en": "Office and Training Space"
        //         },
        //         "parent": "5e5e5982c87f80559141f1db",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5a7ec87f80559141f1e9",
        //         "name": {
        //             "fa": "ویلا و باغ",
        //             "tu": "villa ve bahçe",
        //             "ar": "فيلا وحديقة",
        //             "en": "villa and garden"
        //         },
        //         "parent": "5e5e5982c87f80559141f1db",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5a72c87f80559141f1e8",
        //         "name": {
        //             "fa": "آپارتمان و سوئیت",
        //             "tu": "Daire ve Süit",
        //             "ar": "Apartment & Suite",
        //             "en": "Apartment & Suite"
        //         },
        //         "parent": "5e5e5982c87f80559141f1db",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5a61c87f80559141f1e7",
        //         "name": {
        //             "fa": "صنعتی،‌ کشاورزی و تجاری",
        //             "tu": "Endüstriyel, Tarımsal ve Ticari",
        //             "ar": "صناعية وزراعية وتجارية",
        //             "en": "Industrial, Agricultural and Commercial"
        //         },
        //         "parent": "5e5e5972c87f80559141f1da",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5a52c87f80559141f1e6",
        //         "name": {
        //             "fa": "مغازه و غرفه",
        //             "tu": "mağaza ve kabin",
        //             "ar": "متجر وكشك",
        //             "en": "shop and booth"
        //         },
        //         "parent": "5e5e5972c87f80559141f1da",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5a3ec87f80559141f1e5",
        //         "name": {
        //             "fa": "دفتر کار، اتاق اداری و مطب",
        //             "tu": "ofis, ofis ve ofis",
        //             "ar": "المكتب والمكتب والمكتب",
        //             "en": "office, office and office"
        //         },
        //         "parent": "5e5e5972c87f80559141f1da",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5a27c87f80559141f1e4",
        //         "name": {
        //             "fa": "صنعتی،‌ کشاورزی و تجاری",
        //             "tu": "Endüstriyel, Tarımsal ve Ticari",
        //             "ar": "صناعية وزراعية وتجارية",
        //             "en": "Industrial, Agricultural and Commercial"
        //         },
        //         "parent": "5e57e3dcc2a97ec9dde7f1c5",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5a1cc87f80559141f1e3",
        //         "name": {
        //             "fa": "مغازه و غرفه",
        //             "tu": "mağaza ve kabin",
        //             "ar": "متجر وكشك",
        //             "en": "shop and booth"
        //         },
        //         "parent": "5e57e3dcc2a97ec9dde7f1c5",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5a0dc87f80559141f1e2",
        //         "name": {
        //             "fa": "دفتر کار، اتاق اداری و مطب",
        //             "tu": "ofis, ofis ve ofis",
        //             "ar": "المكتب والمكتب والمكتب",
        //             "en": "office, office and office"
        //         },
        //         "parent": "5e57e3dcc2a97ec9dde7f1c5",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e59f7c87f80559141f1e1",
        //         "name": {
        //             "fa": "خانه و ویلا",
        //             "tu": "Ev ve Villa",
        //             "ar": "المنزل والفيلا",
        //             "en": "Home and Villa"
        //         },
        //         "parent": "5e57e20ac2a97ec9dde7f1c4",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e59ebc87f80559141f1e0",
        //         "name": {
        //             "fa": "آپارتمان",
        //             "tu": "daire",
        //             "ar": "apartment",
        //             "en": "apartment"
        //         },
        //         "parent": "5e57e20ac2a97ec9dde7f1c4",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e59cdc87f80559141f1df",
        //         "name": {
        //             "fa": "زمین و کلنگی",
        //             "tu": "Dünya ve Koloni",
        //             "ar": "الأرض والمستعمرة",
        //             "en": "Earth and Colony"
        //         },
        //         "parent": "5e57deb3c2a97ec9dde7f1c3",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e59bec87f80559141f1de",
        //         "name": {
        //             "fa": "خانه و ویلا",
        //             "tu": "Ev ve Villa",
        //             "ar": "المنزل والفيلا",
        //             "en": "Home and Villa"
        //         },
        //         "parent": "5e57deb3c2a97ec9dde7f1c3",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e59b3c87f80559141f1dd",
        //         "name": {
        //             "fa": "آپارتمان",
        //             "tu": "daire",
        //             "ar": "apartment",
        //             "en": "apartment"
        //         },
        //         "parent": "5e57deb3c2a97ec9dde7f1c3",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e599cc87f80559141f1dc",
        //         "name": {
        //             "fa": "خدمات املاک",
        //             "tu": "Gayrimenkul Hizmetleri",
        //             "ar": "الخدمات العقارية",
        //             "en": "Real Estate Services"
        //         },
        //         "parent": "5e57dd1cc2a97ec9dde7f1c2",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5982c87f80559141f1db",
        //         "name": {
        //             "fa": "اجاره کوتاه مدت",
        //             "tu": "kısa süreli kiralama",
        //             "ar": "تأجير قصير الأمد",
        //             "en": "short term rental"
        //         },
        //         "parent": "5e57dd1cc2a97ec9dde7f1c2",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5e5972c87f80559141f1da",
        //         "name": {
        //             "fa": "اجاره اداری و تجاری",
        //             "tu": "Ticari ve Ticari Kiralama",
        //             "ar": "تأجير تجاري وتجاري",
        //             "en": "Commercial & Commercial Rental"
        //         },
        //         "parent": "5e57dd1cc2a97ec9dde7f1c2",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5b78ea596ddb1e01531472",
        //         "name": {
        //             "fa": "وسایل نقلیه",
        //             "tu": "Araçlar",
        //             "ar": "المركبات",
        //             "en": "Vehicles"
        //         },
        //         "slug": "estate",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e5b78e4596ddb1e01531471",
        //         "name": {
        //             "fa": "استخدام و کاریابی",
        //             "tu": "istihdam ve istihdam",
        //             "ar": "العمالة والتوظيف",
        //             "en": "employment and employment"
        //         },
        //         "slug": "estate",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e57e3dcc2a97ec9dde7f1c5",
        //         "name": {
        //             "fa": "فروش اداری تجاری",
        //             "tu": "ticari ofis satışı",
        //             "ar": "بيع مكاتب تجارية",
        //             "en": "commercial office sale"
        //         },
        //         "slug": "commercial-office-sale",
        //         "parent": "5e57dd1cc2a97ec9dde7f1c2",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "5e57e20ac2a97ec9dde7f1c4",
        //         "name": {
        //             "fa": "اجاره مسکونی",
        //             "tu": "Konut Kiralama",
        //             "ar": "تأجير سكني",
        //             "en": "Residential Rental"
        //         },
        //         "slug": "residential-rental-property",
        //         "__v": 0,
        //         "parent": "5e57dd1cc2a97ec9dde7f1c2"
        //     },
        //     {
        //         "_id": "5e57deb3c2a97ec9dde7f1c3",
        //         "name": {
        //             "fa": "فروش مسکونی",
        //             "tu": "Konut Satışları",
        //             "ar": "مبيعات سكنية",
        //             "en": "Residential Sales"
        //         },
        //         "slug": "residential-property-sale",
        //         "__v": 0,
        //         "parent": "5e57dd1cc2a97ec9dde7f1c2"
        //     },
        //     {
        //         "_id": "5e57dd1cc2a97ec9dde7f1c2",
        //         "name": {
        //             "fa": "املاک",
        //             "tu": "emlak",
        //             "ar": "عقارات",
        //             "en": "real estate"
        //         },
        //         "slug": "estate",
        //         "__v": 0
        //     }
        // ];
        // Category.create(s, function (err, category) {
        //     if (err || !category) {
        //         res.json({
        //             err: err,
        //             success: false,
        //             message: 'error!'
        //         });
        //         return 0;
        //     }
        //     res.json(category);
        //     return 0;
        //
        // });
        // let count = 0;
        // let j = [];
        // _.forEach(s, (obj, i) => {
        //     // if(i>=150&&i<200) {
        //     //     j.push({
        //     //         // fa:obj.name.fa,
        //     //         _id:obj._id,
        //     //         ar: obj.name.fa
        //     //     })
        //     // }
        //     if (req.body[i]._id == s[i]._id)
        //         s[i].name = {
        //             "fa": obj.name.fa,
        //             // "en":obj.name.fa,
        //             // "ar":obj.name.fa,
        //             "tu": obj.name.tu,
        //             "ar": req.body[i].ar,
        //             "en": obj.name.en
        //         }
        //
        //
        // })
        // res.json({
        //     res:req.body,
        //     count:count
        // });
        res.json(s);
        return 0;


        // });
    }
    ,
    create: function (req, res, next) {
        // console.log('creating category...', req.body);
      if(req.body.parent=="")
        delete req.body.parent
        Category.create(req.body, function (err, category) {
            if (err || !category) {
                res.json({
                    err: err,
                    success: false,
                    message: 'error!'
                });
                return 0;
            }
            res.json(category);
            return 0;

        });
    }
    ,
    destroy: function (req, res, next) {
        Category.findByIdAndDelete(req.params.id,
            function (err, category) {
                if (err || !category) {
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
        Category.findByIdAndUpdate(req.params.id, req.body, function (err, category) {
            if (err || !category) {
                res.json({
                    success: false,
                    message: 'error!',
                  err:err
                });
                return 0;
            }

            res.json(category);
            return 0;

        });
    }
    ,
    count: function (req, res, next) {
        Category.countDocuments({}, function (err, count) {
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
