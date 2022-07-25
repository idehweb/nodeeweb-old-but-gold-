import mongoose from "mongoose";
import dotenv from "dotenv";
import path from 'path';
dotenv.config({ silent: false ,
  path: path.join(__dirname, '../../', '.env.local'),
});
console.log(process.env.SERVER_PORT)
mongoose.Promise = global.Promise;
// console.log('process.env',process.env.mongodbConnectionUrl);
// console.log('process.env.BASE_URL',process.env.BASE_URL);
let connection = process.env.mongodbConnectionUrl;
let options = {
    useNewUrlParser: true,
    dbName: process.env.dbName
};
export default async () => await mongoose
    .connect(connection, options)
    .then(async () => await console.log("==> db connection successful to",process.env.dbName))
    .catch(err => console.error(err,"db name:",process.env.dbName));
