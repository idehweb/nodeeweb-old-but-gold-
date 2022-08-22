// console.log('#f main/src/seo.mjs')
console.log("#f public/db");

import "ignore-styles";
import * as React from "react";


import mongoose from "mongoose";

import express from "express";
import _ from "lodash";

const router = express.Router();


router.get("/", (req, res, next) => {
    // console.log('action',mongoose.models);
    // let models=['Action','Attributes',
    // 'Category','Comment','Customer','Link','Media','Menu',
    // 'Notification','Order','Post','Product','Settings','Sms','Transaction'
    //
    // ]
    let arr=[];
    _.forEach(Object.keys(mongoose.models), (model, is) => {

        let schema = mongoose.model(model).schema.paths;
        let obj = {}
        _.forEach(Object.keys(schema), (col, i) => {
            // let t={
            //     name:'action',
            // }
            console.log('col', col);
            obj[col] = {
                instance: schema[col].instance,

            };
            if (schema[col].options && schema[col].options.ref) {
                obj[col]['ref'] = schema[col].options.ref
            }
            // obj.push()
        })
        arr.push({
            name:model,
            schema:obj
        })
    })
    return res.json({
        success: true,
        tables: arr
    })

});

export default router;