console.log("#f headerHandle");

import path from "path";
// import isbot from "isbot";
// import ERV from "express-react-views";
// import app from "./index";

const __dirname = path.resolve();
const viewsFolder = path.join(__dirname, "./views");



const headerHandle = (app) => {


  app.use(function(req, res, next) {
    // let ua = req.get("user-agent");
    // app.set('views', viewsFolder);
    // app.set('view engine', 'jsx');
    // app.engine('jsx', ERV.createEngine());
    // if (isbot(ua)) {
    //   console.log("BOT => ", ua);
      // app.set("views", viewsFolder + "/bot");
    // } else {
      // app.set("views", viewsFolder);
      // app.set("views", viewsFolder);

    // }
    app.set("views", viewsFolder);

    // next();
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Content-Length, X-Requested-With, shared_key, token , _id , lan"
    );

    res.setHeader(
      "Access-Control-Expose-Headers",
      "X-Total-Count"
    );
    // res.setHeader(
    //   "Content-Type",
    //   "application/javascript"
    // );

    if (!req.headers.lan) {
      // let lngs = req.acceptsLanguages();
      // if (lngs.includes('ar')) {
      //   req.headers.lan = 'ar';
      // } else if (lngs.includes('tu')) {
      //   req.headers.lan = 'tu';
      // } else if (lngs.includes('fa')) {
      //   req.headers.lan = 'fa';
      // } else if (lngs.includes('en')) {
      //   req.headers.lan = 'en';
      // } else {
      req.headers.lan = "fa";
      // }
    }
    res.setHeader(
      "Content-Language",
      // 'en , fa , ar , tr'
      "fa"
    );

    //intercepts OPTIONS method
    if ("OPTIONS" === req.method) {
      //respond with 200
      return res.sendStatus(200);
    } else {
      //move on
      next();
    }

    // Pass to next layer of middleware
    //  next();
  });
};
export default headerHandle;