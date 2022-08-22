import authProvider from './authProvider';
import theme from './theme';
import moment from 'jalali-moment';
import data from './dataProvider';
import {useTranslate} from 'react-admin';
// import {MainUrl, savePost} from "../../../main/src/client/functions";
import API from "./API";

const ADMIN_ROUTE = window.ADMIN_ROUTE;
const dataProvider = data(ADMIN_ROUTE);

export {dataProvider, authProvider, theme};

export const dateFormat = (d, f = 'YYYY/MM/DD HH:mm') => {
    // console.log('d', d);
    if (d)
        var t = moment(d, 'YYYY-MM-DDTHH:mm:ss.SSSZ').locale('fa').format(f);
    if (t)
        return t;
    else return false;
}

export const numberWithCommas = (x) => {
    if (x)
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const CHANGE_THEME = 'CHANGE_THEME';
export const CHANGE_LOCALE = 'CHANGE_LOCALE';

export const changeTheme = (theme) => ({
    type: CHANGE_THEME,
    payload: theme,
});
export const unicID = () => {
  let abc = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
  var token = "";
  for (let i = 0; i < 32; i++) {
    token += abc[Math.floor(Math.random() * abc.length)];
  }
  return token;
};
export const changeLocale = (locale) => {
    console.log('changeLocale',locale);
    return({
    type: CHANGE_LOCALE,
    payload: locale,
})};
export const SaveBuilder = (_id,type,data,headers) => {
    return new Promise(function (resolve, reject) {
        let c = [];
        API.put("/post/" + _id, JSON.stringify({elements: data}))
            .then(({data = {}}) => {
                let mainD = data["data"];

                resolve(mainD);
            })
            .catch(err => {
                reject(err);
            });
    });
};
export const GetBuilder = (_id) => {
    // console.log('GetBuilder()==>')

    return new Promise(function (resolve, reject) {
        let c = [];
        API.get("/post/" + _id).then(({data = {}}) => {
            // console.log('resolve GetBuilder')

            //     let mainD = data["data"];
            // console.log('mainD',data)

            // if (mainD.success) {
                //     // savePost({order_id: null, card: []});
                // }
                resolve(data);
            })
            .catch(err => {
                // console.log('reject GetBuilder')

                reject(err);
            });
    });
};

const old = Number.prototype.toLocaleString;
Number.prototype.toLocaleString = function (locale) {
    const translate=useTranslate();
  let result = old.call(this, locale);
  if (locale === 'fa-IR') {
    result = result.replace(/\٬/g, ",‬");
  }
  return result + ' '+translate('pos.currency.toman');
};