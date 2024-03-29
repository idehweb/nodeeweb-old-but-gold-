import Order from '#models/order';
import Product from '#models/product';
import _ from 'lodash';
import Transaction from '#models/transaction';
import global from '#root/global';

import requestIp from 'request-ip';

var self = ( {
  chapar: function(req, res, next) {
    res.json({});
  },
  all: function(req, res, next) {
    console.log('all of orders in cart...');
    let offset = 0;
    if (req.params.offset) {
      offset = parseInt(req.params.offset);
    }

    let search = {};
    // search['$or'] = [{
    //     firstCategory: req.params._id
    // }, {
    //     secondCategory: req.params._id
    // }, {
    //     thirdCategory: req.params._id
    // }];

    if (req.query['search']) {
      // if (!Array.isArray(search['$or'])) {
      //     search['$or'] = [];
      //
      // }
      search['$or'] = [];
      search['$or'].push({
        'customer_data.phoneNumber': {
          $exists: true,
          '$regex': req.query['search'],
          '$options': 'i',
        },
      });
      search['$or'].push({
        '$where': 'function() { return this.orderNumber.toString().match(/' + req.query['search'] + '/) != null; }',

      });
      // search['orderNumber'] = {
      //         $exists: true,
      //         "$regex": req.query['search'],
      //         "$options": "i"
      // };
      // search["$where"]=
      //     "function() { return this.orderNumber.toString().match(/" + req.params.search + "/) != null; }"};

      // search['orderNumber'] = { "$where": "function() { return this.number.toString().match(/"+req.query['search']+"/) != null; }" };


    }
    if (req.query['firstName']) {
      // if (!Array.isArray(search['$or'])) {
      //     search['$or'] = [];
      //
      // }
      // search['$or'].push({
      //     "customer_data.firstName": {
      //         $exists: true,
      //         "$regex": req.query['firstName'],
      //         "$options": "i"
      //     }
      // });

      search['customer_data.firstName'] = {
        $exists: true,
        '$regex': req.query['firstName'],
        '$options': 'i',

      };

    }
    if (req.query['lastName']) {
      // if (!Array.isArray(search['$or'])) {
      //     search['$or'] = [];
      //
      // }
      // search['$or'].push({
      //     "customer_data.lastName": {
      //         $exists: true,
      //         "$regex": req.query['lastName'],
      //         "$options": "i"
      //     }
      // });
      search['customer_data.lastName'] = {
        $exists: true,
        '$regex': req.query['lastName'],
        '$options': 'i',

      };


    }
    if (req.query['paymentStatus']) {
      // if (!Array.isArray(search['$or'])) {
      //     search['$or'] = [];
      //
      // }
      // search['$or'].push({
      //     paymentStatus: req.query['paymentStatus']
      // });

      search['paymentStatus'] = req.query['paymentStatus'];
    }
    if (req.query['date_gte']) {

      search['createdAt'] = { $gt: new Date(req.query['date_gte']) };
    }

    search['status'] = {
      $nin: ['processing', 'indoing', 'makingready', 'inpeyk', 'complete', 'cancel'],
    };
    if (req.query['status']) {
      if (!search['status']) {

        search['status'] = {};
      }

      search['status']['$in'] = (req.query['status']);
    }
    console.log('search', search);
    Order.find(search, '_id , orderNumber , customer_data , customer , sum , amount , paymentStatus , status , createdAt , updatedAt', function(err, orders) {
      if (err || !orders) {
        console.log('err', err);
        res.json([]);
        return 0;
      }
      // console.log('orders', orders);
      delete search['$or'];
      Order.countDocuments(search, function(err, count) {
        console.log('countDocuments', count, err);
        if (err || !count) {
          res.json([]);
          return 0;
        }
        res.setHeader(
          'X-Total-Count',
          count,
        );
        res.json(orders);
        return 0;


      });

    }).populate('customer', '_id phoneNumber firstName lastName').skip(offset).sort({
      updatedAt: -1,
      _id: -1,
    }).limit(parseInt(req.params.limit));
  },

  viewOne: function(req, res, next) {
    // console.log('hgfgh');
    Order.findById(req.params.id,
      function(err, order) {
        if (err || !order) {
          res.json({
            success: false,
            message: 'error!',
          });
          return 0;
        }
        let IP = requestIp.getClientIp(req);
        let views = order.views;
        let unicViews = order.unicViews;
        if (!views) {
          views = [];
        }
        // console.log('unicViews', unicViews);
        let unicTest = [];
        if (!unicViews || (unicViews && unicViews.length === 0)) {
          unicViews = [];
          unicViews.push({
            userIp: IP,
            createdAt: new Date(),
          });
          unicTest = unicViews;
        } else {
          const found = _.some(unicViews, el => el.userIp === IP);
          // const found = unicViews.some(el => el.userIp === userIp);
          // console.log('found', found);
          if (!found) {
            unicViews.push({ userIp: IP, createdAt: new Date() });
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
          createdAt: new Date(),
        });
        // console.log('vviews', views);
        // console.log('uunicViews', unicViews);
        // console.log('unicTest', unicTest);
        Order.findByIdAndUpdate(req.params.id, {
            '$set': {
              views: views,
              unicViews: unicTest,
            },
          },
          {
            'fields': { '_id': 1 },
          }, function(err, updatedOrder) {
          });

        // console.log('req.headers', req.headers);
        // if (req.headers.user && req.headers.token) {
        //     let action = {
        //         user: req.headers.user._id,
        //         title: 'view order ' + order._id,
        //         data: order,
        //         // history:req.body,
        //         order: order._id
        //     };
        //     global.submitAction(action);
        // }
        // order.redirect='https://zoomiroom.com/p/5e8e13a546341b5d60fe01b8/%D8%A7%DB%8C%D8%B1%D9%BE%D8%A7%D8%AF_-_airpod_-_%D9%87%D9%86%D8%AF%D8%B2%D9%81%D8%B1%DB%8C_%D8%A8%D9%84%D9%88%D8%AA%D9%88%D8%AB%DB%8C';
        res.json(order);
        // console.log('hg')
        // res.redirect('https://zoomiroom.com/p/5e8e13a546341b5d60fe01b8/%D8%A7%DB%8C%D8%B1%D9%BE%D8%A7%D8%AF_-_airpod_-_%D9%87%D9%86%D8%AF%D8%B2%D9%81%D8%B1%DB%8C_%D8%A8%D9%84%D9%88%D8%AA%D9%88%D8%AB%DB%8C');
        return 0;

      }).populate('customer', 'nickname phoneNumber firstName lastName');
  },
  viewOneF: function(req, res, next) {
    console.log('viewOneF', req.headers.customer_id.toString());
    Order.findOne({
        _id: req.params.id,
        customer: req.headers.customer_id.toString(),
      },
      function(err, order) {
        if (err || !order) {
          res.json({
            success: false,
            message: 'error!',
          });
          return 0;
        }
        // console.log('customer_id', req.headers.customer_id);
        // console.log('customer_id_order', order.customer);
        // if (order.customer.toString() != req.headers.customer_id.toString()) {
        //     res.json({
        //         success: false,
        //         message: 'order is not yours!'
        //     });
        //     return 0;
        // }
        res.json({
          success: true,
          order: order,
        });
        return 0;

      }).populate('customer', 'nickname photos address firstName phoneNumber');
  },
  allWOrders: function(req, res, next) {
    // console.log('allWOrders');
    let offset = 0;
    if (req.params.offset) {
      offset = parseInt(req.params.offset);
    }

    let search = {};
    search['customer'] = req.headers.customer_id;
    // search['status']='published';
    Order.find(search, '_id updatedAt createdAt card sum amount deliveryPrice orderNumber status paymentStatus deliveryDay customer_data billingAddress', function(err, orders) {
      if (err || !orders) {
        res.json([]);
        return 0;
      }

      Order.countDocuments(search, function(err, count) {
        // console.log('countDocuments', count);
        if (err || !count) {
          res.json([]);
          return 0;
        }
        res.setHeader(
          'X-Total-Count',
          count,
        );


        // orders.map(resource => ({ ...resource, id: resource._id }))
        res.json(orders);
        return 0;


      });

    }).populate('customer', 'nickname photos address').skip(offset).sort({ _id: -1 }).limit(parseInt(req.params.limit)).lean();
  },
  allWSells: function(req, res, next) {
    // console.log('allWSells');
    let offset = 0;
    if (req.params.offset) {
      offset = parseInt(req.params.offset);
    }

    let search = {
      'card.seller': req.headers.customer_id.toString(),
      'paymentStatus': 'paid',

    };
// search["card"]["seller"] = ;
// search['status']='published';
//             console.log(search)
    Order.find(search, '_id updatedAt createdAt card sum orderNumber status paymentStatus sellerIncome', function(err, orders) {
      if (err || !orders) {
        res.json([]);
        return 0;
      }

      Order.countDocuments(search, function(err, count) {
        // console.log('countDocuments', count);
        if (err || !count) {
          res.json([]);
          return 0;
        }
        res.setHeader(
          'X-Total-Count',
          count,
        );


        // orders.map(resource => ({ ...resource, id: resource._id }))
        res.json(orders);
        return 0;


      });

    }).populate('customer', 'nickname photos').skip(offset).sort({ _id: -1 }).limit(parseInt(req.params.limit)).lean();
  },

  create: function(req, res, next) {
    console.log('creating order...');

    // if (req.headers.user && req.headers.token) {
    //     let action = {
    //         user: req.headers.user._id,
    //         title: 'create order ' + order._id,
    //         data: order,
    //         // history:req.body,
    //         order: order._id
    //     };
    //     global.submitAction(action);
    // }
    if (req.headers.customer && req.headers.token) {
      let action = {
        customer: req.headers.customer._id,
        title: 'create order ' + req.body.amount,
        data: req.body,
        // history:req.body,
        // order: order._id
      };
      global.submitAction(action);
    }
    var _ids = [], len = 0, ii = 0;
    if (req.body.card && req.body.card.length)
      len = req.body.card.length;
    _.forEach(req.body.card, function(pack) {
      var main_id = pack._id.split('DDD');
      var id = main_id[0];
      if (!id) {
        id = pack._id;
      }

      console.log('_id', id, pack.price, pack.salePrice);
      // _ids.push(id);
      // console.log('find _id:', id);
      Product.findOne({ _id: id }, '_id combinations type price salePrice title', function(err, ps) {
        console.log('found ', id, main_id[1], ps);
        ii++;
        if (ps.combinations)
          _.forEach(ps.combinations, function(comb) {
            if (comb.id == main_id[1]) {
              console.log('find comb', comb);
              if (pack.salePrice) {
                if (pack.salePrice != comb.salePrice) {
                  res.json({
                    success: false,
                    message: 'مغایرت در قیمت ها!',
                    'pack.salePrice': pack.salePrice,
                    'comb.salePrice': comb.salePrice,
                    'ps.type': ps.type,
                    'ps.title': ps.title,
                    'err': 1,
                  });
                  return 0;

                }
              } else if (pack.price) {
                if (pack.price != comb.price) {
                  res.json({
                    success: false,
                    message: 'مغایرت در قیمت ها!',
                    'pack.price': pack.price,
                    'comb.price': comb.price,
                    'ps.type': ps.type,
                    'ps.title': ps.title,
                    'err': 2,

                  });
                  return 0;

                }
              }

              if (comb.in_stock == false) {
                res.json({
                  success: false,
                  message: 'مغایرت در موجودی!',
                  'comb.in_stock': comb.in_stock,
                  'ps.type': ps.type,
                  'ps.title': ps.title,

                });
                return 0;
              }
            }
          });
        if (ps.type == 'normal') {
          if (pack.salePrice) {
            if (pack.salePrice != ps.salePrice) {
              res.json({
                success: false,
                message: 'مغایرت در قیمت ها!',
                'pack.salePrice': pack.salePrice,
                'ps.salePrice': ps.salePrice,
                'ps.type': ps.type,
                'ps.title': ps.title,


              });
              return 0;

            }
          }
          else if (pack.price)
            if (pack.price != ps.price) {
              res.json({
                success: false,
                message: 'مغایرت در قیمت ها!',
                'pack.price': pack.price,
                'ps.price': ps.price,
                'ps.type': ps.type,
                'ps.title': ps.title,

              });
              return 0;

            }
        }
        if (ps.in_stock == false) {
          res.json({
            success: false,
            message: 'مغایرت در موجودی!',
            'ps.in_stock': ps.in_stock,
            'ps.type': ps.type,
            'ps.title': ps.title,

          });
          return 0;
        }
        // }


        console.log('ii', ii);
        console.log('len', len);
        req.body.orderNumber = Math.floor(10000 + Math.random() * 90000);
        // return;
        if (ii == len)
          global.checkSiteStatus().then(function(resp) {
            console.log('resp', resp);

            req.body.customer = req.headers.customer_id;
            if (req.body.order_id) {
              console.log('create order 1...', req.body.order_id);

              Order.findOneAndUpdate({ _id: req.body.order_id }, {
                $set: {
                  billingAddress: req.body.billingAddress,
                  amount: req.body.amount,
                  card: req.body.card,
                  customer: req.body.customer,
                  customer_data: req.body.customer_data,
                  deliveryDay: req.body.deliveryDay,
                  deliveryPrice: req.body.deliveryPrice,
                  order_id: req.body.order_id,
                  status: 'processing',
                  package: req.body.package,
                  total: req.body.total,
                  sum: req.body.sum,
                },
                $push: {
                  statusArray: { status: 'processing' },
                },
              }, function(err, order) {
                if (err || !order) {
                  Order.create({
                    billingAddress: req.body.billingAddress,
                    amount: req.body.amount,
                    card: req.body.card,
                    customer: req.body.customer,
                    customer_data: req.body.customer_data,
                    deliveryDay: req.body.deliveryDay,
                    deliveryPrice: req.body.deliveryPrice,
                    order_id: req.body.order_id,
                    package: req.body.package,
                    total: req.body.total,
                    orderNumber: req.body.orderNumber,
                    sum: req.body.sum,
                  }, function(err, order) {
                    if (err || !order) {
                      res.json({
                        err: err,
                        success: false,
                        message: 'error!',
                      });
                      return 0;
                    }
                    if (req.headers.customer && req.headers.token) {
                      let action = {
                        customer: req.headers.customer._id,
                        title: 'create order successfully ' + order._id,
                        data: req.body,
                        history: req.body,
                        order: order._id,
                      };
                      global.submitAction(action);
                    }
                    console.log('creating order successfully:', order);
                    res.json({ success: true, order: order });
                    return 0;

                  });
                  // res.json({
                  //     // obj: {
                  //     //     amount: req.body.amount,
                  //     //     // card: req.body.card
                  //     // },
                  //     hrer:'jhjk',
                  //     err: err,
                  //     order: order,
                  //     success: false,
                  //     message: 'error!'
                  // });
                  // return 0;
                } else {
                  // if (req.headers.customer && req.headers.token) {
                  //     let action = {
                  //         customer: req.headers.customer._id,
                  //         title: 'create order successfully ' + order._id,
                  //         data: req.body,
                  //         history: req.body,
                  //         order: order._id
                  //     };
                  //     global.submitAction(action);
                  // }
                  console.log('creating order successfully:', order);
                  res.json({ success: true, order: order });
                  return 0;
                }

              });
            } else {
              console.log('create order 2...');
              Order.create({
                billingAddress: req.body.billingAddress,
                amount: req.body.amount,
                card: req.body.card,
                customer: req.body.customer,
                customer_data: req.body.customer_data,
                deliveryDay: req.body.deliveryDay,
                deliveryPrice: req.body.deliveryPrice,
                order_id: req.body.order_id,
                package: req.body.package,
                total: req.body.total,
                orderNumber: req.body.orderNumber,
                sum: req.body.sum,
              }, function(err, order) {
                if (err || !order) {
                  res.json({
                    err: err,
                    success: false,
                    message: 'error!',
                  });
                  return 0;
                }
                if (req.headers.customer && req.headers.token) {
                  let action = {
                    customer: req.headers.customer._id,
                    title: 'create order successfully ' + order._id,
                    data: req.body,
                    history: req.body,
                    order: order._id,
                  };
                  global.submitAction(action);
                }
                console.log('creating order successfully:', order);
                res.json({ success: true, order: order });
                return 0;

              });
            }


          }).catch(function(err2) {
            res.json({
              success: false,
              message: 'site is deactive!',
            });
            return 0;
          });
      });
    });
  }
  ,
  createAdmin: function(req, res, next) {
    console.log('creating order by admin...');
    req.body.orderNumber = Math.floor(10000 + Math.random() * 90000);
    Order.create({
      amount: req.body.amount,
      total: req.body.amount,
      orderNumber: req.body.orderNumber,
      sum: req.body.amount,
      status: 'checkout',
    }, function(err, order) {
      if (err || !order) {
        res.json({
          err: err,
          success: false,
          message: 'error!',
        });
        return 0;
      }
      if (req.headers.user && req.headers.token) {
        let action = {
          customer: req.headers.user._id,
          title: 'create order by user successfully ' + order._id,
          data: req.body,
          order: order._id,
        };
        global.submitAction(action);
      }
      console.log('creating order successfully:', order);

      let options = {
        method: 'POST',
        url: 'https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json',
        body: {
          MerchantID: '186704d8-c6c7-49c4-a404-baf16abcb85d',
          Amount: parseInt(order.amount),
          CallbackURL: global.domain + '/' + 'transaction',
          Description: 'سفارش #' + order.orderNumber,
        },
        json: true, // Automatically stringifies the body to JSON
      };
      console.log(options);
      // rp(options)
      //     .then(function (parsedBody) {
      request(options, function(error, response, parsedBody) {

        // console.log('parsedBody', parsedBody);

        let obj = {
          // 'customer': req.headers.customer._id,
          'amount': order.amount,
          'order': req.params._id,
          Authority: parsedBody['Authority'],
        };
        Transaction.create(obj, function(err, transaction) {
          if (parsedBody['Status'] == 100) {
            res.json({
              success: true,
              order: order,
              url: 'https://www.zarinpal.com/pg/StartPay/' + parsedBody['Authority'],
            });
            return 0;

          } else {
            res.json({
              success: false,
            });
            return 0;
          }
        });
      });

      // res.json({success: true, order: order});
      // return 0;

    });

  }
  ,
  createAll: function(req, res, next) {
    _.forEach(req.body.data, function(d, i) {

      Order.create({
        name: {
          fa: d.name,
        },
        parent: '5e7882a5bd7e3c643f1fff20',
      }, function(err, order) {
        // console.log(order)
        // if (d.cities) {
        //     _.forEach(d.cities, function (city, c) {
        //         Order.create({
        //             name: {
        //                 fa: city.name
        //             },
        //             parent: order._id
        //         }, function (err, cit) {
        //             console.log(cit);
        //             if (city.districts) {
        //                 _.forEach(city.districts, function (dis, idx) {
        //                     Order.create({
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
    });
    // Order.create(req.body, function (err, order) {
    //     if (err || !order) {
    //         res.json({
    //             err: err,
    //             success: false,
    //             message: 'error!'
    //         });
    //         return 0;
    //     }
    //     res.json(order);
    //     return 0;
    //
    // });
  }
  ,
  destroy: function(req, res, next) {

    Order.findByIdAndDelete(req.params.id,
      function(err, order) {
        if (err || !order) {
          res.json({
            success: false,
            message: 'error!',
          });
          return 0;
        }
        // console.log('req.headers', req.headers);
        if (req.headers.user && req.headers.token) {
          let action = {
            user: req.headers.user._id,
            title: 'delete order ' + order._id,
            // data:order,
            history: order,
            order: order._id,
          };
          global.submitAction(action);
        }
        res.json({
          success: true,
          message: 'Deleted!',
        });
        return 0;


      },
    );
  },
  edit: function(req, res, next) {
    Order.findByIdAndUpdate(req.params.id, req.body, function(err, order) {
      if (err || !order) {
        res.json({
          success: false,
          message: 'error!',
        });
        return 0;
      }
      // console.log('req.headers', req.headers);
      if (req.headers.user && req.headers.token) {
        let action = {
          user: req.headers.user._id,
          title: 'edit order ' + order._id,
          data: order,
          history: req.body,
          order: order._id,
        };
        global.submitAction(action);
      }
      res.json(order);
      return 0;

    });
  }
  ,
  createCart: function(req, res, next) {

    let obj = {};
    if (req.body.billingAddress) {
      obj['billingAddress'] = req.body.billingAddress;
    }
    if (req.body.amount) {
      obj['amount'] = req.body.amount;
    }
    if (req.body.card) {
      obj['card'] = req.body.card;
    }
    if (req.body.customer) {
      obj['customer'] = req.body.customer;
    }
    if (req.body.customer_data) {
      obj['customer_data'] = req.body.customer_data;
    }
    if (req.body.deliveryDay) {
      obj['deliveryDay'] = req.body.deliveryDay;
    }
    if (req.body.deliveryPrice) {
      obj['deliveryPrice'] = req.body.deliveryPrice;
    }
    if (req.body.package) {
      obj['package'] = req.body.package;
    }
    if (req.body.total) {
      obj['total'] = req.body.total;
    }
    if (req.body.sum) {
      obj['sum'] = req.body.sum;
    }


    let status = 'cart';

    if (req.body.status == 'checkout')
      status = 'checkout';
    obj['status'] = status;
    if (req.params.id) {
      Order.findByIdAndUpdate(req.params.id, {
        $set: obj,
        $push: { statusArray: { status: status } },
      }, { new: true }, function(err, order) {
        if (err || !order) {
          res.json({
            success: false,
            message: 'error!',
            err: err,
          });
          return 0;
        }
        // console.log('req.headers', req.headers);
        if (req.headers.customer && req.headers.token) {
          let action = {
            customer: req.headers.customer._id,
            title: 'customer edit cart ' + order._id,
            data: order,
            history: req.body,
            order: order._id,
          };
          global.submitAction(action);
        }
        if (!req.headers.customer && !req.headers.token) {
          let action = {
            title: 'guest edit cart ' + order._id,
            data: order,
            history: req.body,
            // order: order._id
          };
          global.submitAction(action);
        }
        res.json(order);
        return 0;

      });
    } else {
      req.body.orderNumber = Math.floor(10000 + Math.random() * 90000);
      if (req.body.orderNumber) {
        obj['orderNumber'] = req.body.orderNumber;
      }
      Order.create(obj, function(err, order) {
        if (err || !order) {
          res.json({
            success: false,
            message: 'error!',
            err: err,
          });
          return 0;
        }
        // console.log('req.headers', req.headers);
        if (req.headers.customer && req.headers.token) {
          let action = {
            customer: req.headers.customer._id,
            title: 'create cart ' + order._id,
            data: order,
            history: req.body,
            order: order._id,
          };
          global.submitAction(action);
        }
        if (!req.headers.customer && !req.headers.token) {
          let action = {
            // customer: req.headers.customer._id,
            title: 'guest created cart ' + order._id,
            data: order,
            history: req.body,
            // order: order._id
          };
          global.submitAction(action);
        }
        res.json(order);
        return 0;

      });
    }
  }
  ,
  count: function(req, res, next) {
    Order.countDocuments({}, function(err, count) {
      // console.log('countDocuments', count);
      if (err || !count) {
        res.json({
          success: false,
          message: 'error!',
        });
        return 0;
      }

      res.json({
        success: true,
        count: count,
      });
      return 0;


    });
  }
  ,


});
export default self;