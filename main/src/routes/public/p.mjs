// console.log('#f main/src/seo.mjs')
console.log("#f public/p");

import path from "path";
import isbot from "isbot";
// import app from "./index";
import fs from "fs";
import "ignore-styles";
import * as ReactDOMServer from "react-dom/server";
import * as React from "react";
import { StaticRouter } from "react-router-dom/server";
import { matchPath } from "react-router-dom";
import AppSSR from "#c/AppSSR";
import routes from "#c/ssrRoutes";

import { Provider } from "react-redux";

import { persistor, store } from "#c/functions/store";
// import config from "#c/config";
// import {the_public_route} from "#routes/public/p";

import express from "express";
import seo from "#root/seo";
import productController from "#controllers/product";
import global from "#root/global";
import moment from "moment-jalaali";
// import isbot from "isbot/index";
// import * as ReactDOMServer from "react-dom/server";

const router = express.Router();
const m = moment();
m.locale("fa");

// router.get("/", (req, res, next) => {

export const the_public_route=(req, res, next)=> {

    console.log("go through home...");
    let body = res.locals.body;
    if (body) {
        body = body.replace('</head>', `<title>${'ttl'}</title></head>`);
        body = body.replace('</head>', `<meta name="description" content="${'metadescription'}" /></head>`);
        console.log(' send... ');
        return res.status(200).send(body);
    } else {
        console.log('render...');
        return res.status(200).render('index');
    }
};
export const the_product_route=(req, res, next)=> {

};
// });

router.get("/:_theCategory/:_slug",  (req, res, next) => {
    console.log("#r /:_theCategory/:_slug");
    ssrParse(req,res,next).then(e=>{

        seo.readFilePromise().then(data => {
            productController.viewOneS(req, res, next).then((d) => {
                console.log("d._id",d._id);
                let obj={
                    _id: d._id,
                    title: d.title + " " + data.setting.separator + " (" + m.format("jD jMMMM") + ") " + data.setting.siteName,
                    description: d.description || "",
                    image: global.domain + "/" + d.image || data.setting.logo,
                    product_name: d.title,
                    product_price: d.product_price,
                    product_old_price: d.product_old_price,
                    availability: d.availability,
                    url: global.domain + "/" + req.params._id + "/" + encodeURIComponent(d.title),
                    width: "512",
                    height: "512",
                    name: d.title || "",
                    metadescription: d.metadescription || "",
                    keywords: d.keywords || "",
                    lng: req.headers.lan,
                    list: [],
                    categories: [],
                    html: global.body || ""
                };
                console.log("obj._id",obj._id);

                let body=res.locals.body;
                if(body) {
                    body = body.replace('</head>', `<title>${obj.title}</title></head>`);
                    body = body.replace('</head>', `<meta name="description" content="${obj.metadescription}" /></head>`);
                    body = body.replace('</head>', `<meta name="product_id" content="${obj._id}" /></head>`);
                    body = body.replace('</head>', `<meta name="product_name" content="${obj.product_name}" /></head>`);
                    body = body.replace('</head>', `<meta name="product_price" content="${obj.product_price}" /></head>`);
                    body = body.replace('</head>', `<meta name="product_old_price" content="${obj.product_old_price}" /></head>`);
                    body = body.replace('</head>', `<meta name="product_image" content="${obj.product_image}" /></head>`);
                    body = body.replace('</head>', `<meta name="image" content="${obj.image}" /></head>`);
                    body = body.replace('</head>', `<meta name="availability" content="${obj.availability}" /></head>`);
                    body = body.replace('</head>', `<meta name="og:image" content="${obj.image}" /></head>`);
                    body = body.replace('</head>', `<meta name="og:image:secure_url" content="${obj.image}" /></head>`);
                    body = body.replace('</head>', `<meta name="og:image:width" content="1200" /></head>`);
                    body = body.replace('</head>', `<meta name="og:image:height" content="675" /></head>`);
                    body = body.replace('</head>', `<meta name="og:locale" content="fa_IR" /></head>`);
                    body = body.replace('</head>', `<meta name="og:type" content="website" /></head>`);
                    body = body.replace('</head>', `<meta name="og:title" content="${obj.title}" /></head>`);
                    body = body.replace('</head>', `<meta name="og:description" content="${obj.description}" /></head>`);
                    body = body.replace('</head>', `<meta name="og:url" content="." /></head>`);
                    body = body.replace('</head>', `<meta name="og:site_name" content="Arvandshop" /></head>`);
                    body = body.replace('</head>', `<meta name="og:site_name" content="Arvandshop" /></head>`);
                    console.log(' send... ');
                    return res.status(200).send(body);
                }else{
                    console.log('render...');
                    return res.status(200).render('product',obj);
                }
            });
        });
    });

});


router.get("/:slug/:slug2/:slug3/", (req, res, next) => {
    console.log('#r /:slug/:slug2/:slug3/')

    the_public_route(req, res, next);
});
// router.get("/:slug/:slug2/", (req, res, next) => {
//   console.log('#r /:slug/:slug2/')
//
//   the_public_route(req, res, next);
// });
router.get("/transaction/", (req, res, next) => {
    console.log('#transaction /transaction/',req.params)
    // the_public_route(req, res, next);
    // ssrParse(req,reژژs,next).then(e=>{
    // if(req.next)
    //   next();
// console.log('here');
    return res.render("index");

    // });
});
router.get("/checkout/", (req, res, next) => {
    console.log('#transaction /transaction/',req.params)
    // the_public_route(req, res, next);
    // ssrParse(req,reژژs,next).then(e=>{
    // if(req.next)
    //   next();
// console.log('here');
    return res.render("index");

    // });
});
router.get("/", (req, res, next) => {
    console.log('#r /')
    ssrParse(req,res,next).then(e=>{
        the_public_route(req,res,next);
    });

});
router.get("/:slug/", (req, res, next) => {
    console.log('#r /:slug/',req.params)
    // the_public_route(req, res, next);
    ssrParse(req,res,next).then(e=>{
        // if(req.next)
        //   next();
// console.log('here');
//     res.render("index");

    });
});




const ssrParse = (req, res, next) => {
    return new Promise(function(resolve, reject) {

        let ua = req.get("user-agent");
        if (!req.headers.lan)
            req.headers.lan = "fa";
        console.log("==> () ssrParse");

        if (isbot(ua)) {
            console.log("it is bot, we need SSR...");

            console.log("BOT => ", ua);
            fs.readFile(path.resolve("./build/index.html"), "utf8", (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("An error occurred");
                }
                const context = {};
                let cccc = [];
                const dataRequirements =
                    routes
                        .filter(route => {
                            return (matchPath(route, req.url));
                        })
                        .map(route => {
                            if (req.params._firstCategory && req.params._id) {
                                route.server[0].params = req.params._id;
                            }
                            return route;
                        })
                        .filter(comp => {
                            return comp.server;
                        })
                        .map(comp => {
                            console.log("typeof comp.server", typeof comp.server);
                            if (typeof comp.server === "object") {
                                comp.server.forEach(s => {
                                    console.log("s.params", s.params);
                                    cccc.push(store.dispatch(s.func(s.params)));
                                });
                                return cccc;
                            } else {
                                cccc.push(store.dispatch(comp.server(comp.params)));
                                return store.dispatch(comp.server(comp.params));

                            }
                            // return store.dispatch(comp.server(comp.parameter))
                        }); // dispatch data requirement
                console.log("dataRequirements", cccc);
                Promise.all(cccc).then(() => {
                    const renderedData = ReactDOMServer.renderToString(<Provider store={store}>
                        <StaticRouter context={context} location={req.url}>
                            <AppSSR url={req.url}/></StaticRouter></Provider>);
                    console.log("res.send ==============>");
                    res.locals.renderedData = renderedData;
                    res.locals.body = data.replace(
                        "<div id=\"root\"></div>",
                        `<div id="root">${renderedData}</div>`
                    );
                    // return the_public_route(req,res,next);
                    // res.locals.body=data;
                    // console.log("res.locals.body",res.locals.body);
                    // req.headers.htmlSend='xxxs';
                    // console.log('req',req);
                    // return res.json(req);
                    resolve();
                    // return res.send(
                    //   res.locals.body
                    // );
                });
            });
        }
        else {
            console.log("no need to ssr...");
            resolve();
        }
    });
};
export default router;