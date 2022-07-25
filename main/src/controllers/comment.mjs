import Comment from "#models/comment";

var self = ({

  all: function(req, res, next) {
    console.log("get all comments...");
    let offset = 0;
    if (req.params.offset) {
      offset = parseInt(req.params.offset);
    }

    let search = {
      'status':'published'
    };
    if(req.params.id){
      search['product']=req.params.id;
    }
    Comment.find(search, function(err, comments) {
      if (err || !comments) {
        res.json([]);
        return 0;
      }
      Comment.countDocuments(search, function(err, count) {
        // console.log('countDocuments', count);
        if (err || !count) {
          res.json([]);
          return 0;
        }
        res.setHeader(
          "X-Total-Count",
          count
        );
        res.json(comments);
        return 0;


      });

    }).skip(offset).sort({
      updatedAt: -1
    }).limit(req.params.limit).populate("customer", "_id , firstName , lastName").lean();
  },
  viewOne: function(req, res, next) {

    Comment.findById(req.params.id,
      function(err, comment) {
        if (err || !comment) {
          res.json({
            success: false,
            message: "error!"
          });
          return 0;
        }
        res.json(comment);
        return 0;

      });
  },
  create: function(req, res, next) {
    if(!req.params.id || !req.body.rate|| !req.body.text){
      res.json({
        success: false,
        message: "error!"
      });
      return 0;
    }
    req.body.product=req.params.id;
    req.body.customer=req.headers.customer._id;
    // console.log('req.body.customer',req.body.customer);
    Comment.create(req.body, function(err, comment) {
      if (err || !comment) {
        res.json({
          err: err,
          success: false,
          message: "error!"
        });
        return 0;
      }
      if (req.headers.user && req.headers.token) {
        let action = {
          customer: req.headers.customer._id,
          title: "create comment " + comment._id,
          data: comment,
          comment: comment._id
        };
        global.submitAction(action);
      }
      res.json(comment);
      return 0;

    });
  },
  destroy: function(req, res, next) {
    Comment.findByIdAndDelete(req.params.id,
      function(err, comment) {
        if (err || !comment) {
          res.json({
            success: false,
            message: "error!"
          });
          return 0;
        }
        console.log("req.headers", req.headers);
        if (req.headers.user && req.headers.token) {
          let action = {
            customer: req.headers.customer._id,
            title: "delete comment " + comment._id,
            data: comment,
            comment: comment._id
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
    Comment.findByIdAndUpdate(req.params.id, req.body, { new: true }, function(err, comment) {
      if (err || !comment) {
        res.json({
          success: false,
          message: "error!"
        });
        return 0;
      }

      res.json(comment);
      return 0;

    });
  },
  count: function(req, res, next) {
    Comment.countDocuments({}, function(err, count) {
      // console.log('countDocuments', count);
      if (err || !count) {
        res.json({
          success: false,
          message: "error!"
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

});
export default self;