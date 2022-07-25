import Customer from "#models/customer";
import Product from "#models/product";
import persianJs from "persianjs";
import _ from "lodash";
import gf from "#root/google-util";
import bcrypt from "bcrypt";
import requestIp from "request-ip";
import global from '#root/global';
var self = {
  getNumber: function(req, res, next) {

    let search = { whatsapp: true };

    Customer.findOne(search, "phoneNumber , _id , activationCode", function(err, customer) {
      if (err || !customer) {
        res.json({
          success: false
        });
        return 0;
      }
      Customer.findByIdAndUpdate(customer._id, { $set: { whatsapp: false } }, function(err, cus) {
        res.json({
          success: true,
          message: "\n خوش آمدید\n کد تایید شما:\n" + customer.activationCode,
          phoneNumber: customer.phoneNumber,
          method: "whatsapp"
        });
        return 0;
      });


    });

  },
  all: function(req, res, next) {
    console.log("get all customers...", req.params.q, req.params.search);
    let offset = 0;
    if (req.params.offset) {
      offset = parseInt(req.params.offset);
    }

    let search = {};
    if (req.params.search || req.query.q) {
      if (req.query.q)
        req.params.search = req.query.q;
      if (parseInt(req.params.search)) {
        search = { "$where": "function() { return this.phoneNumber.toString().match(/" + req.params.search + "/) != null; }" };
      } else {
        search = {
          "$or": [
            { "firstName": { "$regex": req.params.search, "$options": "i" } },
            { "lastName": { "$regex": req.params.search, "$options": "i" } },
            { "phoneNumber": { "$regex": req.params.search, "$options": "i" } },
            { "internationalCode": { "$regex": req.params.search, "$options": "i" } }
          ]
        };
      }
    }
    console.log(search);
    Customer.find(search, function(err, customers) {
      if (err || !customers) {
        res.json({
          success: false,
          message: "error!"
        });
        return 0;
      }

      Customer.countDocuments({}, function(err, count) {
        // console.log('countDocuments', count);
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
        res.json(customers);
        return 0;


      });

    }).skip(offset).sort({ createdAt: -1 }).limit(parseInt(req.params.limit));

  },
  viewOne: function(req, res, next) {
    if (req.headers.customer && req.headers.token) {
      if (req.headers.customer._id != req.params.id) {
        res.json({
          success: false,
          message: "error!"
        });
        return 0;
      }
    }
    Customer.findById(req.params.id,
      function(err, response) {
        if (err || !response) {
          res.json({
            success: false,
            message: "error!"
          });
          return 0;
        }
        // console.log('req.headers',req.headers);
        // if(req.headers.user && req.headers.token) {
        //     let action = {
        //         user:req.headers.user._id,
        //         title:'view customer '+response._id,
        //         data:response,
        //         customer:response._id
        //     };
        //     global.submitAction(action);
        // }

        res.json(response);
        return 0;
      });

    // console.log('Viewing ' + req.params.id);
  },
  getContactData: function(req, res, next) {

    Customer.findById(req.params.id,
      function(err, response) {
        if (err || !response) {
          res.json({
            success: false,
            message: "error!"
          });
          return 0;
        }
        res.json({
          success: true,
          phoneNumber: response.phoneNumber,
          email: response.email

        });
        return 0;
      });

    // console.log('Viewing ' + req.params.id);
  },
  loginWithGoogle: function(req, res, next) {
    gf.authenticate().then(function(response) {
      res.json(response);
    });

  },
  validateWithGoogle: async function(req, res, next) {
    let s = await
      gf.getGoogleAccountFromCode(req.query.code);
    // console.log(s);
    let obj = {
      emailAddresses: s.emailAddresses[0].value,
      photos: s.photos[0].url,
      displayName: s.names[0].displayName,
      familyName: s.names[0].familyName,
      givenName: s.names[0].givenName
    };
    if (obj.emailAddresses) {
      Customer.findOne({ email: obj.emailAddresses }, await

        function(err, response) {
          // console.log(err, response);
          if (err) {
            res.json({
              success: false,
              message: "error!"
            });
            return 0;
          }
          if (response) {
            let obj = {
              success: response.success,
              _id: response._id
            };
            // console.log('user was in db before...');
            self.getToken(response, res);
          } else {
            //we should create customer
            let cxdcf = {
              "email": obj.emailAddresses
            };
            if (obj.displayName) {
              cxdcf.nickname = obj.displayName;
            }
            if (obj.familyName) {
              cxdcf.lname = obj.familyName;
            }
            if (obj.givenName) {
              cxdcf.name = obj.givenName;
            }
            if (obj.photos) {
              cxdcf.photos = [{
                name: "fromGoogle",
                url: obj.photos
              }];
            }

            Customer.create(cxdcf, function(err, response) {
              if (err || !response) {

                res.json({
                  success: false,
                  message: "error!",
                  err: err
                });
                return 0;

              }
              let $text;
              $text = "Arvand" + "\n" + "customer registered!" + "\n" + obj.emailAddresses;
              // global.sendSms('9120539945', $text).then(function (uid) {
              //
              // });
              let objd = {};
              objd.message = $text;
              global.notifateToTelegram(objd).then(function(f) {
                // console.log('f', f);
              });
              // global.sendSms('9128093545', $text).then(function (uid) {
              //
              // });
              self.getToken(response, res);

            });
          }
        }
      )
      ;

    } else {
      await
        res.json({
          success: false,
          message: "You can not Login/Register with Google! Please try another way!"
        });
    }

  },
  validateTokenWithGoogle: async function(req, res, next) {
    // console.log('resdfg',req.body);
    // res.json(req.body);
    // return;
    let s = await
      gf.validateTokenWithGoogle(req.body);
    // console.log(s);
    let obj = {
      emailAddresses: s.emailAddresses[0].value,
      photos: s.photos[0].url,
      displayName: s.names[0].displayName,
      familyName: s.names[0].familyName,
      givenName: s.names[0].givenName
    };
    // console.log(obj);
    if (obj.emailAddresses) {
      Customer.findOne({ email: obj.emailAddresses }, await

        function(err, response) {
          // console.log(err, response);
          if (err) {
            res.json({
              success: false,
              message: "error!"
            });
            return 0;
          }
          if (response) {
            let obj = {
              success: response.success,
              _id: response._id
            };
            // console.log('user was in db before...');
            self.getToken(response, res);
          } else {
            //we should create customer
            let cxdcf = {
              "email": obj.emailAddresses
            };
            if (obj.displayName) {
              cxdcf.nickname = obj.displayName;
            }
            if (obj.familyName) {
              cxdcf.lname = obj.familyName;
            }
            if (obj.givenName) {
              cxdcf.name = obj.givenName;
            }
            if (obj.photos) {
              cxdcf.photos = [{
                name: "fromGoogle",
                url: obj.photos
              }];
            }
            Customer.create(cxdcf, function(err, response) {
              if (err) {
                // console.log(err);
                res.json({
                  success: false,
                  message: "error!",
                  err: err
                });
                return 0;

              }
              let $text;
              $text = "Arvand" + "\n" + "customer registered!" + "\n" + obj.emailAddresses;
              // global.sendSms('9120539945', $text).then(function (uid) {
              //
              // });
              let objd = {};
              objd.message = $text;
              global.notifateToTelegram(objd).then(function(f) {
                // console.log('f', f);
              });

              // global.sendSms('9128093545', $text).then(function (uid) {
              //
              // });
              self.getToken(response, res);

            });
          }
        }
      )
      ;

    } else {
      await
        res.json({
          success: false,
          message: "You can not Login/Register with Google! Please try another way!"
        });
    }

  },
  viewOneCustomer: function(req, res, next) {
    // console.log('\ngetting customer...');
    Customer.findById(req.params.id, {
        activationCode: 0,
        history: 0,
        tokens: 0
      },
      function(err, response) {
        if (err || !response) {
          res.json({
            success: false,
            message: "error!"
          });
          return 0;
        }

        // console.log('customer name(name) is:', response.name);
        // console.log('customer family(lname) is:', response.lname);
        // console.log('customer phoneNumber is:', response.phoneNumber);
        // console.log('customer _id is:', response._id);
        // console.log('customer username(nickname) is:', response.nickname);
        // console.log('customer photos length:', response.photos.length);
        // console.log('customer credit:', response.credit);
        // console.log('customer question_credit:', response.question_credit);
        // console.log('customer invitation_list length:', response.invitation_list.length);
        let pocket = [];
        _.forEach(response.pocket, function(item, i) {
          if (item._id || item.silverScore || item.goldScore) {
            pocket.push(item);
          }
        });
        response.pocket = pocket;
        res.json(response);

      });

    // console.log('Viewing ' + req.params.id);
  },
  viewOneCustomerByCus: function(req, res, next) {
    // console/('\ngetting customer...');
    Customer.findById(req.headers.customer_id, {
        activationCode: 0,
        history: 0,
        tokens: 0
      },
      function(err, response) {
        if (err || !response) {
          res.json({
            success: false,
            message: "error!"
          });
          return 0;
        }
        if (req.headers.customer && req.headers.token) {
          let action = {
            customer: req.headers.customer._id,
            title: "view profile " + response._id,
            data: response
            // customer:response._id
          };
          global.submitAction(action);
        }
        // console.log('customer name(name) is:', response.firstName);
        // console.log('customer family(lname) is:', response.lastName);
        // console.log('customer phoneNumber is:', response.phoneNumber);
        // console/('customer _id is:', response._id);
        // console.log('customer username(nickname) is:', response.nickname);
        // console.log('customer photos length:', response.photos.length);
        // console.log('customer credit:', response.credit);
        // console.log('customer question_credit:', response.question_credit);
        // console.log('customer invitation_list length:', response.invitation_list.length);
        // let pocket = [];
        // _.forEach(response.pocket, function (item, i) {
        //     if (item._id || item.silverScore || item.goldScore) {
        //         pocket.push(item);
        //     }
        // });
        // response.pocket = pocket;
        res.json({
          success: true,
          customer: response
        });
        return 0;

      });

    // console.log('Viewing ' + req.params.id);
  },
  viewHistory: function(req, res, next) {
    // console.log('\ngetting customer...');
    let offset = 0;
    if (req.params.offset) {
      offset = parseInt(req.params.offset);
    }
    if (!req.headers.customer_id) {
      // console.log(req.headers.customer_id)
      res.json({
        success: false,
        message: "req.headers.customer_id not defined!"
      });
      return 0;
    }
    Customer.findById(req.headers.customer_id, {
        activationCode: 0,
        tokens: 0
      },
      function(err, response) {
        if (err || !response) {
          res.json({
            success: false,
            message: "error!",
            err: err
          });
          return 0;
        }

        let history = [];
        // console.log('response.history',response.history.length);
        if (response.history)
          response.history.reverse();
        _.forEach(response.history, function(item, i) {
          // console.log('offset:', offset, 'i:', i, 'limit:', req.params.limit);
          if (i >= offset && i <= req.params.limit) {
            // if (item._id) {
            history.push(item);
            // }
          }

        });

        res.json(history);

      });

  },
  chancesCode: function(req, res, next) {
    // console.log('\ngetting customer...');
    let offset = 0;
    if (req.params.offset) {
      offset = parseInt(req.params.offset);
    }
    if (!req.headers.customer_id) {
      // console.log(req.headers.customer_id)
      res.json({
        success: false,
        message: "req.headers.customer_id not defined!"
      });
      return 0;
    }
    Customer.findById(req.headers.customer_id, {
        activationCode: 0,
        tokens: 0
      },
      function(err, response) {
        if (err || !response) {
          res.json({
            success: false,
            message: "error!",
            err: err
          });
          return 0;
        }

        let chancesCode = [];
        _.forEach(response.chancesCode, function(item, i) {

          // if (item._id) {
          chancesCode.push(item);
          // }


        });

        res.json(chancesCode);

      });

  },
  create: function(req, res, next) {
    Customer.create(req.body, function(err, customer) {
      if (err || !customer) {
        res.json({
          success: false,
          message: "error!",
          err: err
        });
      } else {
        if (req.headers.user && req.headers.token) {
          let action = {
            user: req.headers.user._id,
            title: "create customer " + customer._id,
            data: req.body,
            customer: customer._id
          };
          global.submitAction(action);
        }
        res.json(customer);
      }
    });
  },
  destroy: function(req, res, next) {
    Customer.findByIdAndDelete(req.params.id,
      function(err, customer) {
        if (err || !customer) {
          res.json({
            success: false,
            message: "error!"
          });
          return 0;

        }
        if (req.headers.user && req.headers.token) {
          let action = {
            user: req.headers.user._id,
            title: "delete customer " + customer._id,
            history: customer,
            customer: customer._id
          };
          global.submitAction(action);
        }
        res.json({
          success: true,
          message: "Deleted!"
        });
        return 0;

      }
    );
  },
  edit: function(req, res, next) {


    Customer.findOneAndUpdate(
      {
        _id: req.params.id
        // "tokens.token": req.headers.token
      },
      req.body, { new: true }, function(err, customer) {
        if (err || !customer) {
          res.json({
            success: false,
            message: "error!"
          });
          return 0;
        }
        if (req.headers.user && req.headers.token) {
          let action = {
            user: req.headers.user._id,
            title: "edit customer " + customer._id,
            data: customer,
            history: req.body,
            customer: customer._id
          };
          global.submitAction(action);
        }
        // console.log(post);
        res.json(customer);
        return 0;
      });
  },
  editWL: function(req, res, next) {
    // console.log('\n\n\n\n\n =====> editing customer:');
    // console.log('body: ', req.body);
    // console.log('id: ', req.headers.customer_id);
    // console.log("token: ", req.headers.token);
    let search = {
      "$or": [
        { "email": { "$regex": req.body.email, "$options": "i" } },
        { "phoneNumber": { "$regex": req.body.phoneNumber, "$options": "i" } }
      ]
    };
    Customer.findOne({ _id: req.headers.customer_id }, "_id , phoneNumber , email", function(err, respo) {
      if (err) {
        res.json({
          success: false,
          err: err,
          message: "خطا در ثبت اطلاعات!"
        });
        return;
      }
      // console.log('respo:', respo);
      let c = false;
      if (!respo) {
        c = true;

      } else {
        if (respo._id.toString() === req.headers.customer_id.toString()) {
          c = true;
        } else {
          res.json({
            success: false,
            message: "ایمیل یا نام کاربری از قبل وجود دارد!"
          });
          return;
        }
      }
      if (c) {
        Customer.findByIdAndUpdate(
          req.headers.customer_id,
          {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "email": req.body.email,
            "nickname": req.body.nickname,
            "internationalCode": req.body.internationalCode,
            updatedAt: new Date()

          }, {
            new: true,
            projection: {
              "_id": 1,
              "email": 1,
              "firstName": 1,
              "nickname": 1,
              "lastName": 1,
              "internationalCode": 1,
              "photos": 1,
              "phoneNumber": 1
            }
          }, function(err, post) {
            if (err || !post) {
              res.json({
                err: err,
                success: false,
                message: "error!"
              });
              return;
            }
            // console.log('customer updated successfully!');
            if (req.headers.user && req.headers.token) {
              let action = {
                customer: req.headers.customer._id,
                title: "edit customer " + customer._id,
                data: customer,
                history: req.body
                // customer:post._id
              };
              global.submitAction(action);
            }
            res.json({
              success: true,
              post: post
            });
            return;

          });
      }

    });

  },
  updateAddress: function(req, res, next) {
    console.log('\n\n\n\n\n =====> editing updateAddress:');
    // console.log('body: ', req.body);
    // console.log('id: ', req.headers.customer_id);
    // console.log("token: ", req.headers.token);
    let search = {
      "$or": [
        { "email": { "$regex": req.body.email, "$options": "i" } },
        { "phoneNumber": { "$regex": req.body.phoneNumber, "$options": "i" } }
      ]
    };
    Customer.findOne({ _id: req.headers.customer_id }, "_id , phoneNumber , email , address", function(err, respo) {
      if (err) {
        res.json({
          success: false,
          err: err,
          message: "خطا در ثبت اطلاعات!"
        });
        return;
      }
      // console.log('respo:', respo);
      let c = false;
      if (!respo) {
        c = true;

      } else {
        if (respo._id.toString() === req.headers.customer_id.toString()) {
          c = true;
        } else {
          res.json({
            success: false,
            message: "ایمیل یا نام کاربری از قبل وجود دارد!"
          });
          return;
        }
      }
      if (c) {
        Customer.findByIdAndUpdate(
          req.headers.customer_id,
          {
            "address": req.body.address,
            updatedAt: new Date()

          }, {
            new: true,
            projection: {
              "_id": 1,
              "address": 1
            }
          }, function(err, post) {
            if (err || !post) {
              res.json({
                err: err,
                success: false,
                message: "error!"
              });
              return;
            }
            // console.log('customer updated successfully!');
            res.json({
              success: true,
              customer: post
            });
            return;

          });
      }

    });

  },
  updateNotifToken: function(req, res, next) {

    console.log("updateNotifToken");
    Customer.findOneAndUpdate(
      {
        // _id: req.params.id,
        "tokens.token": req.headers.token
      },
      {
        $push: {
          notificationTokens: {
            token: req.params.notification_token
          }
        }
      }, { new: true }, function(err, post) {
        if (err || !post) {
          res.json({
            success: false,
            message: "error!"
          });
          return;
        }
        // console.log(post);
        res.json({
          success: true

        });

      });
  },
  count: function(req, res, next) {
    Customer.countDocuments({}, function(err, count) {
      // console.log('countDocuments', count);
      if (err || !count) {
        res.json({
          success: false,
          err: err
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
  authCustomer: function(req, res, next) {
    console.log("\n\n\n\n\n =====> try login/register user:");
    // let self=this;
    let p_number = req.body.phoneNumber.toString();
    let fd = req.body.countryCode.toString();
    if (p_number) {
      p_number = p_number.replace(/\s/g, "");
      // console.log('==> addCustomer() 1.11');
      p_number = persianJs(p_number).arabicNumber().toString().trim();
      p_number = persianJs(p_number).persianNumber().toString().trim();
      p_number = parseInt(p_number);
      // console.log('==> addCustomer() 1.15');
      req.body.phoneNumber = p_number;
      if (p_number.toString().length < 12) {
        // console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
        if (p_number.toString().length === 10) {
          p_number = "98" + p_number.toString();
        }
      }
      console.log(p_number);

      if (isNaN(p_number)) {
        res.json({
          success: false,
          message: "error!",
          err: "something wrong in creating customer : customer!"
        });
        return;
      }
    } else {
      res.json({
        success: false,
        message: "error!",
        err: "something wrong in creating customer : phoneNumber is not entered!"
      });
      return;

    }
    let NUMBER = parseInt(p_number).toString();


    console.log("phone number:", NUMBER);
    Customer.findOne({ phoneNumber: NUMBER }, function(err, response) {
      if (err) {
        res.json({
          success: false,
          message: "error!",
          err: err
        });
        return 0;
        // reject(err);
      }
      if (response) {
        let obj = {
          success: response.success,
          _id: response._id
        };
        console.log("user was in db before...");
        self.updateActivationCode(obj, res, req, true);
      } else {
        console.log("user was not in db before...");

        //we should create customer
        let objs = req.body;
        objs.phoneNumber = NUMBER;
        Customer.create({
          "phoneNumber": NUMBER,
          "invitation_code": req.body.invitation_code
        }, function(err, response) {
          if (err) {
            if (parseInt(err.code) == 11000) {
              Customer.findOne({ phoneNumber: NUMBER }, function(err3, response) {
                if (err3) {
                  res.json({
                    success: false,
                    message: "error!",
                    err: err
                  });
                }
                // console.log('registering user...')
                self.updateActivationCode(response, res, req);
              });
            } else {
              res.json({
                success: false,
                message: "error!",
                err: err
              });
            }
          } else {

            // console.log('==> sending sms');
            let $text;
            $text = "Arvand" + "\n" + "customer registered!" + "\n" + NUMBER;
            // console.log($text);
            // if (req.body.invitation_code) {
            //     self.addToInvitaitionList(response._id, req.body.invitation_code);
            // }

            // global.sendSms('9120539945', $text, '300088103373', null, '98').then(function (uid) {
            //     // console.log('==> sending sms to admin ...');
            //     let objd = {};
            //     objd.message = $text;
            //     global.notifateToTelegram(objd).then(function (f) {
            //         // console.log('f', f);
            //     });
            // }).catch(function () {
            //     return res.json({
            //         success: true,
            //         message: 'Sth wrong happened!'
            //     });
            // });
            self.updateActivationCode(response, res, req);
          }
        });
      }
    });


  },
  authCustomerForgotPass: function(req, res, next) {
    console.log("\n\n\n\n\n =====> Customer Forgot Password:");
    // let self=this;
    let p_number = req.body.phoneNumber.toString();
    if (p_number) {
      p_number = p_number.replace(/\s/g, "");
      // console.log('==> addCustomer() 1.11');
      p_number = persianJs(p_number).arabicNumber().toString().trim();
      p_number = persianJs(p_number).persianNumber().toString().trim();
      p_number = parseInt(p_number);
      // console.log('==> addCustomer() 1.15');
      req.body.phoneNumber = p_number;
      // if (p_number.toString().length < 12) {
      //     console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
      //     if (p_number.toString().length === 10) {
      //         p_number = "98" + p_number.toString();
      //     }
      // }
      // console.log(p_number);

      if (isNaN(p_number)) {
        res.json({
          success: false,
          message: "error!",
          err: "something wrong in creating customer : customer!"
        });
        return;
      }
    } else {
      res.json({
        success: false,
        message: "error!",
        err: "something wrong in creating customer : phoneNumber is not entered!"
      });
      return;

    }
    let NUMBER = parseInt(p_number).toString();


    console.log("this phone number:", NUMBER);
    Customer.findOne({ phoneNumber: NUMBER }, function(err, response) {
      if (err) {
        res.json({
          success: false,
          message: "error!",
          err: err
        });
        return 0;
        // reject(err);
      }
      if (response) {
        let obj = {
          success: response.success,
          _id: response._id
        };
        // console.log('user was in db before...');
        Customer.findOneAndUpdate({ phoneNumber: NUMBER }, { password: "" }, function(err, response) {
          self.updateActivationCode(obj, res, req, true);

        });
      } else {
        //we should create customer
        let objs = req.body;
        objs.phoneNumber = NUMBER;
        Customer.create({
          "phoneNumber": NUMBER,
          "invitation_code": req.body.invitation_code
        }, function(err, response) {
          if (err) {
            if (parseInt(err.code) == 11000) {
              Customer.findOne({ phoneNumber: NUMBER }, function(err3, response) {
                if (err3) {
                  res.json({
                    success: false,
                    message: "error!",
                    err: err
                  });
                }
                // console.log('registering user...')
                self.updateActivationCode(response, res, req);
              });
            } else {
              res.json({
                success: false,
                message: "error!",
                err: err
              });
            }
          } else {

            // console.log('==> sending sms');
            let $text;
            $text = "Arvand" + "\n" + "customer registered!" + "\n" + NUMBER;
            // console.log($text);
            if (req.body.invitation_code) {
              self.addToInvitaitionList(response._id, req.body.invitation_code);
            }

            // global.sendSms('9120539945', $text).then(function (uid) {
            //     // console.log('==> sending sms to admin ...');
            //     let objd = {};
            //     objd.message = $text;
            //     global.notifateToTelegram(objd).then(function (f) {
            //         console.log('f', f);
            //     });
            // }).catch(function () {
            //     return res.json({
            //         success: true,
            //         message: 'Sth wrong happened!'
            //     });
            // });
            self.updateActivationCode(response, res, req);
          }
        });
      }
    });


  },
  authCustomerWithPassword: function(req, res, next) {
    // console.log('\n\n\n\n\n =====> try login/register user:');
    // let self=this;
    let p_number = req.body.phoneNumber.toString();
    if (p_number) {
      p_number = p_number.replace(/\s/g, "");
      // console.log('==> addCustomer() 1.11');
      p_number = persianJs(p_number).arabicNumber().toString().trim();
      p_number = persianJs(p_number).persianNumber().toString().trim();
      p_number = parseInt(p_number);
      // console.log('==> addCustomer() 1.15');
      req.body.phoneNumber = p_number;
      if (p_number.toString().length < 12) {
        // console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
        if (p_number.toString().length === 10) {
          p_number = "98" + p_number.toString();
        }
      }
      // console.log(p_number);

      if (isNaN(p_number)) {
        res.json({
          success: false,
          message: "error!",
          err: "something wrong in creating customer : customer!"
        });
        return;
      }
    } else {
      res.json({
        success: false,
        message: "error!",
        err: "something wrong in creating customer : phoneNumber is not entered!"
      });
      return;

    }
    let NUMBER = parseInt(p_number).toString();

    // console.log('this is phone number:', NUMBER);
    Customer.authenticate(NUMBER, req.body.password, function(error, cus) {
      if (error || !cus) {
        let err = new Error("Wrong phoneNumber or password.");
        err.status = 401;
        res.status(401);
        return res.json({ "success": false, "message": "شماره موبایل یا رمز عبور اشتباه!" });
      } else {
        // req.session.userId = user._id;

        return res.json({ "success": true, "message": "در حال ریدایرکت...", "customer": cus });
      }
    });


  },
  setPassword: function(req, res, next) {
    // console.log('\n\n\n\n\n =====> try to set password:');
    // console.log('before hash');
    bcrypt.hash(req.body.password, 10, function(err, hash) {
      if (err) {
        return next(err);
      }
      // console.log('after hash');
      req.body.password = hash;
      let obj = {
        password: req.body.password
      };
      if (req.body.email) {
        obj["email"] = req.body.email;
      }
      if (req.body.nickname) {
        obj["nickname"] = req.body.nickname;
      }
      if (req.body.firstName) {
        obj["firstName"] = req.body.firstName;
      }
      if (req.body.lastName) {
        obj["lastName"] = req.body.lastName;
      }
      if (req.body.internationalCode) {
        obj["internationalCode"] = req.body.internationalCode;
      }
      Customer.findOneAndUpdate(
        {
          _id: req.headers.customer_id
        },
        obj,

        {
          new: true,
          projection: {
            "_id": 1,
            "email": 1,
            "nickname": 1,
            "firstName": 1,
            "lastName": 1,
            "internationalCode": 1,
            "address": 1

          }
        },
        function(err, customer) {
          // console.log('==> pushSalonPhotos() got response');

          if (err || !customer) {
            // console.log('==> pushSalonPhotos() got response err');


            res.json({
              err: err,
              success: false,
              message: "error"
            });

          } else {
            if (req.headers.customer && req.headers.token) {
              let action = {
                customer: req.headers.customer._id,
                title: "customer set password customer " + customer._id,
                data: obj,
                history: customer
                // customer:customer._id
              };
              global.submitAction(action);
            }
            res.json({
              success: true,
              customer: customer

            });
          }
        });

    });


  },
  setPasswordWithPhoneNumber: function(req, res, next) {
    // console.log('\n\n\n\n\n =====> try to set password with phone number:');
    // console.log('before hash');
    bcrypt.hash(req.body.password, 10, function(err, hash) {
      if (err) {
        return next(err);
      }
      // console.log('after hash');
      req.body.password = hash;
      let obj = {
        password: req.body.password
      };
      if (req.body.email) {
        obj["email"] = req.body.email;
      }
      if (req.body.nickname) {
        obj["nickname"] = req.body.nickname;
      } else {
        if (req.body.firstName && req.body.lastName) {
          obj["nickname"] = req.body.firstName + " " + req.body.lastName;
        }
      }
      if (req.body.firstName) {
        obj["firstName"] = req.body.firstName;
      }
      if (req.body.lastname) {
        obj["lastName"] = req.body.lastName;
      }
      let p_number = req.body.phoneNumber.toString();
      if (p_number) {
        p_number = p_number.replace(/\s/g, "");
        // console.log('==> addCustomer() 1.11');
        p_number = persianJs(p_number).arabicNumber().toString().trim();
        p_number = persianJs(p_number).persianNumber().toString().trim();
        p_number = parseInt(p_number);
        // console.log('==> addCustomer() 1.15');
        req.body.phoneNumber = p_number;
        if (p_number.toString().length < 12) {
          // console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
          if (p_number.toString().length === 10) {
            p_number = "98" + p_number.toString();
          }
        }
        // console.log(p_number);

        if (isNaN(p_number)) {
          res.json({
            success: false,
            message: "error!",
            err: "something wrong in creating customer : customer!"
          });
          return;
        }
      } else {
        res.json({
          success: false,
          message: "error!",
          err: "something wrong in creating customer : phoneNumber is not entered!"
        });
        return;

      }
      let NUMBER = parseInt(p_number).toString();

      // console.log('this is phone number:', NUMBER);
      Customer.findOneAndUpdate(
        {
          phoneNumber: NUMBER
        },
        obj,
        {
          new: true,
          projection: {
            "_id": 1,
            "email": 1,
            "nickname": 1,
            "firstName": 1,
            "lastName": 1,
            "tokens": 1,
            "address": 1,
            "internationalCode": 1

          }
        },
        function(err, customer) {
          // console.log('==> pushSalonPhotos() got response');

          if (err || !customer) {
            // console.log('==> pushSalonPhotos() got response err');


            res.json({
              err: err,
              success: false,
              message: "error"
            });

          } else {
            self.getToken(customer, res);

            // res.json({
            //     success: true,
            //     customer: customer
            //
            // })
          }
        });

    });


  },
  activateCustomer: function(req, res, next) {
    console.log("activateCustomer...");
    let p_number = req.body.phoneNumber;
    if (p_number) {
      // console.log('==> addCustomer() 1.11');
      p_number = persianJs(p_number).arabicNumber().toString().trim();
      p_number = persianJs(p_number).persianNumber().toString().trim();
      p_number = parseInt(p_number);
      if (p_number.toString().length < 12) {
        // console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
        if (p_number.toString().length === 10) {
          p_number = "98" + p_number.toString();
        }
      }
      // console.log('==> addCustomer() 1.15');
      if (isNaN(p_number)) {
        res.json({ success: false, message: "something wrong in creating customer : customer!" });
        return;
      }
    } else {
      res.json({ success: false, message: "something wrong in creating customer : phoneNumber is not entered!" });
      return;

    }
    req.body.phoneNumber = p_number.toString();
    // console.log('customer phone number is:', p_number.toString());

    p_number = req.body.activationCode;
    if (p_number) {
      // console.log('==> addCustomer() 1.11');
      p_number = persianJs(p_number).arabicNumber().toString().trim();
      p_number = persianJs(p_number).persianNumber().toString().trim();
      p_number = parseInt(p_number);
      // console.log('==> addCustomer() 1.15');
      if (isNaN(p_number)) {
        res.json({ success: false, message: "something wrong in creating customer : customer!" });
        return;
      }
    } else {
      res.json({
        success: false,
        message: "something wrong in creating customer : activationCode is not entered!"
      });
      return;
    }
    req.body.activationCode = p_number.toString();
    // console.log('activationCode is:', p_number.toString());
    // parseInt(p_number).toString()

    Customer.findOne({ phoneNumber: req.body.phoneNumber }, "_id activationCode internationalCode address firstName lastName invitation_code", function(err, user) {
      if (err) return next(err);
      // console.log('user is:', user);
      if (user) {
        // console.log('==> check db.activationCode with req.body.activationCode');
        // console.log(user.activationCode, req.body.activationCode);
        if (user.activationCode == req.body.activationCode) {
          let Token = global.generateUnid();
          let invitation_code;
          if (!user.invitation_code) {
            invitation_code = Math.floor(100000 + Math.random() * 900000);

          } else {
            invitation_code = user.invitation_code;
          }
          console.log('Token generated:',Token)
          Customer.findByIdAndUpdate(user._id, {
            activationCode: null,
            invitation_code: invitation_code,
            $push: { tokens: { token: Token, os: req.body.os } }
          }, {
            returnNewDocument: true,
            projection: {
              password: true
              // internationalCode:true,
              // address:true,
              // firstName:true,
              // lastName:true
            }
          }, function(err, post) {
            if (err) return next(err);
            // console.log('user activated successfully...');
            // if (post.tokens)
            // console.log('user tokens count is:', post.tokens.length);
            let shallWeSetPass = true;
            if (post.password) {
              shallWeSetPass = false;
            }
            return res.json({
              success: true,
              token: Token,
              address: user.address,
              firstName: user.firstName,
              lastName: user.lastName,
              internationalCode: user.internationalCode,
              shallWeSetPass: shallWeSetPass,
              invitation_code: invitation_code,
              _id: user._id,
              message: "Your user account activated successfully!"
            });
          });

        } else {
          return res.json({
            success: false,
            message: "The code is wrong!"
          });
        }
      } else {
        return res.json({
          success: false,
          message: "This user was not found!"
        });
      }
    });
  },
  login: function(req, res, next) {
    if (req.body.identifier && req.body.password) {
      Customer.authenticate(req.body.identifier, req.body.password, function(error, user) {
        if (error || !user) {
          let err = new Error("Wrong email or password.");
          err.status = 401;
          return res.json({ "success": false, "message": "نام کاربری یا رمز عبور اشتباه!" });
        } else {
          // req.sessi
          // on.userId = user._id;
          return res.json({ "success": true, "message": "در حال ریدایرکت...", "user": user });
        }
      });
    } else {
      let err = new Error("All fields required.");
      err.status = 400;
      return res.json({ "success": false, "message": "لطفا تمامی فیلد ها را تکمیل کنید!" });
    }
  },
  register: function(req, res, next) {
    if (req.body.email &&
      req.body.username &&
      req.body.password) {

      let userData = req.body;
      userData.type = "user";
      userData.token = global.generateUnid();


      Customer.create(userData, function(error, user) {
        if (error) {
          return res.json({ err: error });
        } else {
          return res.json({ "success": true, "message": "ساخته شد" });

        }
      });

    }
  },
  wishlist: function(req, res, next) {

    let _id = req.params._id,
    customer=req.headers.customer;
    if (!_id) {
      res.json({
        success: false,
        message: "error!"
      });
      return 0;
    }
      if (!customer.wishlist) {
        customer.wishlist = [];
      }
    let doWeNeedPush = true;

    _.forEach(customer.wishlist, function(wish) {
          if (wish._id.toString() === _id.toString()) {
            doWeNeedPush=false;

          }
        }
      );
    if (doWeNeedPush) {
      // console.log('doWeNeedPush');
      customer.wishlist.push({
        _id: _id
      });
    }else{
      res.json({
        success: false,
        message: "You have done this before!"
      });
      return 0;
    }
      Customer.findOneAndUpdate({ _id: customer._id },
        {
          $set: {
            wishlist: customer.wishlist
          }

        },
        { new: true }, function(err, cus) {

          if (err || !cus) {
            // console.log(err);
            res.json({
              success: false,
              message: "false"
            });
            return 0;
          } else {
            // console.log(post);
            res.json({
              success: true,
              message: "done!"
            });
            return 0;

          }
        });





  },
  getWishlist: function(req, res, next) {
    let _ids = [];
    if (req.headers.customer.wishlist)
    _.forEach(req.headers.customer.wishlist, (resp) => {
      if (resp._id)
        _ids.push(resp._id);
    });
    else
    {
      res.json([]);
      return 0;
    }
    console.log("getWishlist", _ids);

    Product.find({ _id: { $in: _ids } },"_id , combinations , options , price , salePrice , createdAt , updatedAt , firstCategory , title , thumbnail , type , thirdCategory , secondCategory , in_stock , quantity , status", function(err, product) {
      if (err || !product) {
        res.json({
          product,
          success: false,
          message: "error!",
          err: err
        });
        return 0;
      }

      res.json(product);
      return 0;

    }).populate("firstCategory", "_id name").populate("secondCategory", "_id name").populate("thirdCategory", "_id name").lean();


  },
  updateActivationCode: function(response, res, req, userWasInDbBefore = false) {
    console.log("\n\n\n\n\n =====> updateActivationCode");

    // console.log('==> updateActivationCode');
    // console.log(response);

    let code = Math.floor(100000 + Math.random() * 900000);
    let date = new Date();
    Customer.findByIdAndUpdate(response._id, {
      activationCode: code,
      updatedAt: date
    }, { new: true }, function(err, post) {
      if (err) {
        res.json({
          success: false,
          message: "error!"
        });
      } else {
        let shallWeSetPass = true;
        if (post.password) {
          shallWeSetPass = false;
        }
        res.json({
          success: true,
          message: "Code has been set!",
          userWasInDbBefore: userWasInDbBefore,
          shallWeSetPass: shallWeSetPass
        });
        console.log("==> sending sms");
        let $text;
        $text = "فروشگاه آنلاین آروند" + " : " + post.activationCode;
        console.log("req.body.method", req.body.method);
        console.log("activation code is:", post.activationCode);

        if (!shallWeSetPass && userWasInDbBefore) {
          console.log("shallWeSetPass && userWasInDbBefore:", shallWeSetPass, userWasInDbBefore);

          return;
        }
        if (req.body.method == "whatsapp") {
          Customer.findByIdAndUpdate(response._id, {
            whatsapp: true
          }, { new: true }, function(err, cus) {
            return;
          });
        } else {
          let key = "sms_welcome";
          if (userWasInDbBefore) {
            key = "sms_register";

          }
          global.sendSms(req.body.phoneNumber, [{
            key: "activationCode",
            value: post.activationCode
          }], "300088103373", response._id, req.body.countryCode, key).then(function(uid) {
            console.log("activation code sent via sms to customer:", req.body.phoneNumber);
            return;

          }).catch(function(e) {
            console.log("sth is wrong", e);
            return;
          });
        }
      }
    });

  },
  getToken: function(response, res) {

    let Token = global.generateUnid();
    Customer.findByIdAndUpdate(response._id, {
        activationCode: null,
        $push: { tokens: { token: Token } }
      }, { new: true },
      function(err, post) {
        if (err) return next(err);
        // console.log('user activated successfully...');
        // if (post.tokens)
        //     console.log('user tokens count is:', post.tokens.length);
        return res.json({
          success: true,
          token: Token,
          firstName: post.firstName,
          lastName: post.lastName,
          phoneNumber: post.phoneNumber,
          email: post.email,
          nickname: post.nickname,
          _id: post._id,
          message: "حساب کاربری شما فعال شد!"
        });
      });


  },
  photo: function(req, res, next) {

    let photos = req.photo_all;
    // console.log(photos, req.headers.customer_id);

    if (photos) {
      Customer.findOneAndUpdate(
        {
          _id: req.headers.customer_id
        },
        {
          $push: {
            photos: photos
          }
        },

        {
          new: true,
          projection: {
            "photos": 1

          }
        },
        function(err, customer) {
          // console.log('==> pushSalonPhotos() got response');

          if (err) {
            // console.log('==> pushSalonPhotos() got response err');


            res.json({
              err: err,
              success: false,
              message: "error"
            });

          } else {
            // console.log('==> pushSalonPhotos() got response success');
            // let photos_array=[];
            // if(customer)
            //     if(customer.photos)
            //         if(customer.photos.length)
            //             pho
            res.json({
              success: true,
              customer: customer

            });
          }
        });
    } else {
      res.json({
        success: false,
        message: "upload faild!"
      });
    }
    //
    //     });
    // });


  }
};
export default self;