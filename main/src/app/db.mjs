import Wizard from '../../wizard.js';
import dotenv from "dotenv";

dotenv.config({
    silent: false,
    path: path.join(__dirname, '../../', '.env.local'),
});
Wizard.updateImportantFiles(process.env);

import settingsController from '#controllers/settings';
import userController from '#controllers/user';

import mongoose from "mongoose";
import path from 'path';

console.log("#db", new Date())

console.log('process.env');

mongoose.Promise = global.Promise;
console.log('process.env2');
console.log('process.env.RESET', process.env.RESET)

// console.log('process.env.BASE_URL',process.env.BASE_URL);
let connection = process.env.mongodbConnectionUrl;
let options = {
    useNewUrlParser: true,
    dbName: process.env.dbName
};
export default async () => await mongoose
    .connect(connection, options)
    .then(async () => {
        await console.log("==> db connection successful to", process.env.dbName, new Date());
        if (process.env.RESET == 'true') {
            //if database does not have any records

            userController.exists().then((e) => {
                console.log('user exist...')
            }).catch(e => {
                console.log('create user...')

                //create user
                let req = {
                    body: {
                        email: process.env.ADMIN_EMAIL,
                        username: process.env.ADMIN_USERNAME,
                        password: process.env.ADMIN_PASSWORD
                    }
                };
                userController.register(req);
            })
            settingsController.exists().then((e) => {
                console.log('setting exist...')

            }).catch(e => {
                //create setting
                console.log('create setting...')
                settingsController.create({
                    body: {
                        siteActive: true
                    }
                })
            })
        } else {
            console.log('no need to import database...')
        }
    })
    .catch(err => console.error(err, "db name:", process.env.dbName));
