import cookieParser from "cookie-parser";
import logger from "morgan";
import busboy from "connect-busboy";
import path from "path";

const __dirname = path.resolve();
// const viewsFolder = path.join(__dirname, "./src/views");
// const publicFolder = path.join(__dirname, "./public");
const buildFolder = path.join(__dirname, "./build");
const assetsFolder = path.join(__dirname, "./src/client/assets/img");
const public_mediaFolder = path.join(__dirname, "./public_media");

let configHandle = (express, app) => {
  app.disable("x-powered-by");
  app.use(logger("dev"));

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(busboy());
  app.use(express.static(public_mediaFolder, { maxage: "1y" }));
  app.use(express.static(buildFolder,{  index: false}));
  app.set("view engine", "pug");
  // app.use(express.static(assetsFolder));
  console.log("==> configHandle");
};
export default configHandle;