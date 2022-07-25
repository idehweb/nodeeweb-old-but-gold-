console.log("#f main/src/seo.mjs");

import express from "express";
import global from "#root/global";
import path from "path";
import fs from "fs";
import moment from "moment-jalaali";

const router = express.Router();
const m = moment();
m.locale("fa");

router.post("/", (req, res, next) => {
  console.log("go through wizard...");
  let {
    SERVER_PORT,
    CLIENT_PORT,
    site_name,
    BASE_URL,


    SHOP_URL,
    ADMIN_URL,
    ADMIN_USERNAME,
    ADMIN_PASSWORD
  } = req.body;
  delete req.body.ADMIN_URL;
  // let fstream = fs.createWriteStream(filePath);
  // console.log('on file app mimetype', typeof filename.mimeType);
  const writedata = global.config({ ...req.body, FRONT_ROUTE: req.body.BASE_URL + "/customer" });
  // console.log("fddfdsf", writedata);
  let __dirname = path.resolve();
  // console.log("gfvcecefffff", __dirname);
  // console.log("gfvcecefffff222", path.join(__dirname, "../index.mjs"));

  let filePath = path.join(__dirname, "/public_media/site_setting/", "config.js");
  try {
    fs.promises.writeFile(filePath, "export default ()=> (" + JSON.stringify(writedata, null, 4) + ")", "utf8");
    console.log("data is written successfully in the file");
    return res.render("wizard", {
      success: true
    });

  }
  catch (err) {
    console.log("not able to write data in the file ", err);
    return res.render("wizard", {
      success: false,
      err: err
    });
  }
});


export default router;