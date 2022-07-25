export const isSSR = typeof window === "undefined";
// if (isSSR) var window = {};
// console.log('window.SHOP_URL',window.SHOP_URL);

export default isSSR
    ? {
        BASE_URL: process.env.BASE_URL,
        ADMIN_URL: process.env.ADMIN_URL,
        SHOP_URL: process.env.SHOP_URL,
        FRONT_ROUTE: process.env.BASE_URL + "/customer",
        setting: {
            separator: "|",
            siteName: process.env.SITE_NAME

        }
    }
    : {
        SHOP_URL: window.SHOP_URL,
        ADMIN_URL: window.ADMIN_URL,
        defaultImg: window.BASE_URL + "/site_setting/img/not-found.png",
        BASE_URL: window.BASE_URL,
        FRONT_ROUTE: window.FRONT_ROUTE,
        setting: {
            separator: "|",
            siteName: process.env.SITE_NAME
        }
    };
