import CONFIG from "#c/config";
import {isClient} from "../functions/index"

// export const config = "../../..public_media/site_setting/"+ ("config.js");
// export const url ="/site_setting/img/";
export let url =CONFIG.SHOP_URL;
if(isClient){
  url+="site_setting/img/";
}
// if (env === 'development') {
//   url =VARIABLE.SHOP_URL;
//   console.log("VARIABLE",VARIABLE);
//
// }

console.log("VARIABLE",CONFIG);
export const defaultImg = url + ("not-found.png");

export const SnapChatIcon = url + ("snapchat.svg");
export const logoImg = CONFIG.SHOP_URL + ("site_setting/logo.png");
export const payImg = url + ("pay.png");
export const enamadImg = url + ("enamad.png");
export const etmeImg = url + ("etme.jpeg");
export const etehadImg = url + ("etehad.png");
export const blueImg = url + ("blue.png");
export const topsaleImg = url + ("topsale.png");

export const slide1Img = url + ("im/1.jpeg");
export const slide2Img = url + ("im/2.jpeg");
export const slide3Img = url + ("im/3.jpeg");
export const slide4Img = url + ("im/4.jpeg");
export const slide5Img = url + ("im/5.jpeg");
export const slide6Img = url + ("im/6.jpeg");
export const slide7Img = url + ("im/7.jpeg");
export const slide11Img = url + ("im/11.jpg");
export const slide22Img = url + ("im/22.jpg");
export const slide33Img = url + ("im/33.jpg");
export const slide44Img = url + ("im/44.jpg");
export const slide55Img = url + ("im/55.jpg");
export const slide66Img = url + ("im/66.jpg");
export const slide77Img = url + ("im/77.jpg");
export const slide88Img = url + ("im/88.jpg");
export const slideMain = url + ("im/slide-main.jpg");
export const eid = url + ("im/eid.jpg");
// export const slideOffer1Img = path.resolve(__dirname, ".", "img/im/offer-1.png");
export const slideOffer1Img = url + "im/offer-1.png";
export const slideOffer2Img = url + ("im/offer-2.png");
export const slideOffer3Img = url + ("im/offer-3.png");
export const slideOffer4Img = url + ("im/offer-4.png");
export const slideOffer5Img = url + ("im/offer-5.png");
export const slideOffer6Img = url + ("im/offer-6.jpg");
export const slideOffer7Img = url + ("im/offer-7.png");
export const slideOffer8Img = url + ("im/offer-8.png");
export const spriteImg = url + ("icons-sprite_2x.png");
// export const slideOffer5Img = url+('im/offer-5.png');
