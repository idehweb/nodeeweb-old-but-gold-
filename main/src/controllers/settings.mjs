import Settings from "#models/settings";
import global from "#root/global";
import Media from "#models/media";

import path from "path";
import fs from "fs";

let self = ({
    all: function (req, res, next) {
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        Settings.find(function (err, settingss) {

            if (err || !settingss) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            Settings.countDocuments({}, function (err, count) {
                console.log("countDocuments", count);
                if (err || !count) {
                    res.json({
                        success: false,
                        message: "error!"
                    });
                    return 0;
                }
                res.setHeader(
                    "X-Total-Count",
                    count
                );
                res.json(settingss);
                return 0;


            });

        }).skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
    },
    last: function (req, res, next) {
        console.log("last setting ==> ");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        Settings.find(function (err, settingss) {
            // console.log('Settings find==> ');

            if (err || !settingss) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            // console.log('settingss',settingss);
            if (settingss && settingss[0] && settingss[0].data)
                res.json(settingss[0].data);
            else
                res.json([]);
            return 0;


        }).skip(offset).sort({_id: -1}).limit(1);
        // res.json([]);
    },
    configuration: function (req, res, next) {
        console.log("configuration setting ==> ");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        Settings.find(function (err, settingss) {
            // console.log('Settings find==> ');

            if (err || !settingss) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            // console.log('settingss',settingss);
            if (settingss && settingss[0])
                res.json(settingss[0]);
            else
                res.json([]);
            return 0;


        }).skip(offset).sort({_id: -1}).limit(1);
        // res.json([]);
    },
    submitDollarPrice: function (req, res, next) {
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        Settings.find(function (err, settingss) {

            if (err || !settingss) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            console.log("dollar price", req.params.price);
            if (settingss && settingss[0] && settingss[0].data) {
                Settings.findByIdAndUpdate(settingss[0]._id, {
                    dollarPrice: req.params.price
                }, function (err, settings) {
                    if (err || !settings) {
                        res.json({
                            success: false,
                            message: "error!",
                            err: err
                        });
                        return 0;
                    }

                    res.json(settings);
                    return 0;


                });
            } else
                res.json([]);
            return 0;


        }).skip(offset).sort({_id: -1}).limit(1);
    },
    submitDerhamPrice: function (req, res, next) {
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        Settings.find(function (err, settingss) {

            if (err || !settingss) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            console.log("dollar price", req.params.price);
            if (settingss && settingss[0] && settingss[0].data) {
                Settings.findByIdAndUpdate(settingss[0]._id, {
                    derhamPrice: req.params.price
                }, function (err, settings) {
                    if (err || !settings) {
                        res.json({
                            success: false,
                            message: "error!",
                            err: err
                        });
                        return 0;
                    }

                    res.json(settings);
                    return 0;


                });
            } else
                res.json([]);
            return 0;


        }).skip(offset).sort({_id: -1}).limit(1);
    },
    dollar: function (req, res, next) {
        console.log("get dollar");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        Settings.find({}, "dollarPrice derhamPrice", function (err, settingss) {

            if (err || !settingss) {
                res.json({
                    success: false,
                    message: "error!",
                    err: err
                });
                return 0;
            }
            console.log("dollar price", settingss);
            if (settingss && settingss[0] && settingss[0].dollarPrice) {
                res.json({"dollarPrice": settingss[0].dollarPrice, "derhamPrice": settingss[0].derhamPrice});

            } else
                res.json([]);
            return 0;


        }).skip(offset).sort({_id: -1}).limit(1);
    },
    viewOne: function (req, res, next) {

        Settings.findById(req.params.id,
            function (err, settings) {
                if (err || !settings) {
                    res.json({
                        success: false,
                        message: "error!"
                    });
                    return 0;
                }
                res.json(settings);
                return 0;

            });
    },
    siteStatus: function (req, res, next) {

        global.checkSiteStatus().then(function (response) {
            res.json(response);
        }).catch(function (err) {
            res.json(err);
        });
    },
    update: function (req, res, next) {


        res.json({
            success: false
        });

    },
    create: function (req, res, next) {
        // return new Promise(function (resolve, reject) {
        console.log("settings create");
        Settings.create(req.body, function (err, settings) {
            if (err || !settings) {
                if (res)
                    return res.json({
                        err: err,
                        success: false,
                        message: "error!"
                    });
                else
                    return ({
                        err: err,
                        success: false,
                        message: "error!"
                    });
            }
            if (res)
                return res.json(settings);
            else
                return settings
        });
        // });

    },
    destroy: function (req, res, next) {
        Settings.findByIdAndDelete(req.params.id,
            function (err, settings) {
                if (err || !settings) {
                    res.json({
                        success: false,
                        message: "error!"
                    });
                    return 0;
                }
                res.json({
                    success: true,
                    message: "Deleted!"
                });
                return 0;


            }
        );

    },
    edit: function (req, res, next) {
        Settings.findByIdAndUpdate(req.params.id, req.body, function (err, settings) {
            if (err || !settings) {
                res.json({
                    success: false,
                    message: "error!",
                    err: err
                });
                return 0;
            }

            res.json(settings);
            return 0;


        });
    },
    count: function (req, res, next) {
        Settings.countDocuments({}, function (err, count) {
            console.log("countDocuments", count);
            if (err) {
                res.json({
                    success: false,
                    err: err
                });

            }
            res.json({
                success: true,
                count: count
            });


        });
    },
    fileUpload: function (req, res, next) {
        if (req.busboy) {
            req.pipe(req.busboy);

            req.busboy.on("file", function (
                fieldname,
                file,
                filename,
                encoding,
                mimetype
            ) {

                let fstream;
                // console.log("on file app filePath", fieldname, file, filename, encoding, mimetype);
                if (!(filename && filename.filename)) {
                    res.json({
                        success: false
                    });
                    return 0;
                }
                let exention = filename.filename.split(".");
                // if (filename.mimetype.toString().includes('image')) {
                //   // name+=".jpg"
                // }
                // if (filename.mimetype.toString().includes('video')) {
                //   // name+="mp4";
                // }
                let name = "logo." + exention[1];

                let filePath = path.join(__dirname, "/../../public_media/site_setting/", name);

                fstream = fs.createWriteStream(filePath);
                // console.log('on file app mimetype', typeof filename.mimeType);

                file.pipe(fstream);
                fstream.on("close", function () {
                    // console.log('Files saved');
                    let url = "site_setting/" + name;
                    let obj = [{name: name, url: url, type: mimetype}];
                    req.photo_all = obj;
                    let photos = obj;
                    if (photos && photos[0]) {
                        Media.create({
                            name: photos[0].name,
                            url: photos[0].url,
                            type: photos[0].type,
                            theKey: "logo"

                        }, function (err, media) {


                            if (err && !media) {


                                res.json({
                                    err: err,
                                    success: false,
                                    message: "error"
                                });

                            }
                            Settings.findOneAndUpdate({}, {
                                logo: photos[0].url
                            }, {new: true}, function (err, setting) {


                                if (err && !setting) {


                                    res.json({
                                        err: err,
                                        success: false,
                                        message: "error"
                                    });

                                }
                                // console.log('setting',setting);
                                // console.log('media',media);
                                res.json(setting);

                            });

                        });
                    } else {
                        res.json({
                            success: false,
                            message: "upload faild!"
                        });
                    }
                });
            });
        } else {
            next();
        }
    },
    getSetting: function (req, res, next) {
        Settings.findOneAndUpdate({}, req.body, {new: true}, function (err, setting) {


            if (err && !setting) {


                res.json({
                    err: err,
                    success: false,
                    message: "error"
                });

            }
            self.updateImportantFiles(res, setting);
            self.updateCssFile(res, setting);


            // file.pipe(fstream);
            // fstream.on("close", function() {
            //
            // });
            res.json({success: true})

        });

    },
    updateConfiguration: function (req, res, next) {
        console.log("==> updateConfiguration()")
        Settings.findOneAndUpdate({}, req.body, {new: true}, function (err, setting) {


            if (err && !setting) {


                res.json({
                    err: err,
                    success: false,
                    message: "error"
                });

            }
            // self.updateImportantFiles(res,setting);
            // if (req.body.home)
            //     self.updateHomeComponent(res, setting);
            self.updateCssFile(res, setting);


            // file.pipe(fstream);
            // fstream.on("close", function() {
            //
            // });
            res.json({success: true})

        });

    },
    updatePrivateConfiguration: function (req, res, next) {
        console.log("updatePrivateConfiguration", req.body);
        Settings.findOneAndUpdate({}, req.body, {new: true}, function (err, setting) {


            if (err && !setting) {


                res.json({
                    err: err,
                    success: false,
                    message: "error"
                });

            }
            //update public/site_setting/config.js
            //update build/site_setting/config.js
            // const writedata = global.config();
            self.updateImportantFiles(res, setting);

            // file.pipe(fstream);
            // fstream.on("close", function() {
            //
            // });
            res.json({success: true})

        });

    },
    updateImportantFiles: function (res, setting) {
        self.updateFile(res, "/../../build/site_setting/", "config.js",
            "window.BASE_URL='" + setting.BASE_URL + "';\n" +
            "window.SHOP_URL='" + setting.SHOP_URL + "';")

        self.updateFile(res, "/../../public/site_setting/", "config.js",
            "window.BASE_URL='" + setting.BASE_URL + "';\n" +
            "window.SHOP_URL='" + setting.SHOP_URL + "';")

        self.updateFile(res, "/../../../main/public_media/admin/", "variables.js",
            "window.BASE_URL='" + setting.BASE_URL + "';\n" +
            "window.ADMIN_ROUTE='" + setting.ADMIN_ROUTE + "';\n" +
            "window.ADMIN_URL='" + setting.ADMIN_URL + "';\n" +
            "window.SHOP_URL='" + setting.SHOP_URL + "';")

        self.updateFile(res, "/../../../admin-panel/public/", "variables.js",
            "window.BASE_URL='" + setting.BASE_URL + "';\n" +
            "window.ADMIN_ROUTE='" + setting.ADMIN_ROUTE + "';\n" +
            "window.ADMIN_URL='" + setting.ADMIN_URL + "';\n" +
            "window.SHOP_URL='" + setting.SHOP_URL + "';")
    },
    updateCssFile: function (res, setting) {
        console.log("setting.primaryColor", setting.primaryColor);
        // return;
        var JSO =
            ":root {" +
            "--blue: #674eec;" +
            "--primary: " + setting.primaryColor + ";" +
            "--indigo: #674eec;" +
            "--purple: #8445f7;" +
            "--pink: #ff4169;" +
            "--red: #c4183c;" +
            "--orange: #fb7906;" +
            "--yellow: #ffb400;" +
            "--green: #17c671;" +
            "--teal: #1adba2;" +
            "--cyan: #00b8d8;" +
            "--white: #fff;" +
            "--gray: #868e96;" +
            "--gray-dark: #343a40;" +
            "--secondary: " + setting.secondaryColor + ";" +
            "--success: #17c671;" +
            "--info: #00b8d8;" +
            "--warning: #ffb400;" +
            "--danger: #c4183c;" +
            "--light: #FBFBFB;" +
            "--dark: #212529;" +
            "--bg-color: " + setting.bgColor + ";" +
            "--footer-bg-color: " + setting.footerBgColor + ";" +
            "--text-color: " + setting.textColor + ";" +
            "--breakpoint-xs: 0;" +
            "--breakpoint-sm: 576px;" +
            "--breakpoint-md: 768px;" +
            "--breakpoint-lg: 992px;" +
            "--breakpoint-xl: 1200px;" +
            "--font-family-sans-serif: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;" +
            "--font-family-monospace: 'Roboto Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" +
            "}";

        self.updateFile(res, "/../../build/site_setting/", "theme.css", JSO)

        self.updateFile(res, "/../../public/site_setting/", "theme.css", JSO)

    },
    updateHomeComponent: function (res, setting) {
        console.log("updateHomeComponent", setting.home);
        Settings.findOne({}, function (err, setting) {

            if (err && !setting && !setting.elements) {


                res.json({
                    err: err,
                    success: false,
                    message: "error"
                });

            }

            res.json(setting.elements)
        }).populate("home", "_id elements");

    },
    updateFile: function (res, thePath, file_name, data) {
        let filePath = path.join(__dirname, thePath, file_name);

        // let fstream = fs.createWriteStream(filePath);
        // console.log('on file app mimetype', typeof filename.mimeType);

        // writeFile(filename, writedata)
        try {
            fs.promises.writeFile(filePath, data, "utf8");
            console.log("data is written successfully in the file\n" +
                "filePath: " + filePath + " " + file_name);
            // return res.json({
            //   success: true
            // });

        }
        catch (err) {
            console.log("not able to write data in the file ", err);
            // return res.json({
            //   success: false,
            //   err: err
            // });
        }

    },
    exists: function (req, res, next) {
        return new Promise(function (resolve, reject) {
            Settings.exists({}, function (err, setting) {
                if (err || !setting) {
                    reject(err);
                } else {
                    resolve(setting);
                }
            });
        });

    },

});
export default self;