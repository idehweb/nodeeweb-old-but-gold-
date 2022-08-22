import React , {useEffect} from "react";
import {
    eid,
    slide1Img,
    slide2Img,
    slide3Img,
    slide4Img,
    slide5Img,
    slideOffer1Img,
    slideOffer2Img,
    slideOffer3Img,
    slideOffer4Img,
    slideOffer5Img,
    slideOffer6Img,
    slideOffer7Img,
    slideOffer8Img,
    valentineDays
} from "#c/assets/index";
import {
    enableAdmin,
    enableAgent,
    enableSell,
    fetchCats,
    fetchHome,
    getPosts,
    getPostsByCat,
    getThemeData,
    isClient,
    loadPosts,
    loadProducts,
    SaveData,
    setCountry
} from "#c/functions/index";
import {ProductsSliderServer} from "#c/components/components-overview/ProductsSlider";
import {PostSliderServer} from "#c/components/components-overview/PostSlider";
import {store} from '#c/functions/store';

import {withTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import PageBuilder from "#c/components/page-builder/PageBuilder";

store.dispatch(fetchHome());

const Home_new = (props) => {
    // const Recipe = React.lazy(() =>
    //     import(`../../../public_media/theme/shomeis/shomeis.json`)
    //         .catch(() => ({ default: () => <div>Not found</div> }))
    // );
    // console.log('Reci/pe',Recipe)
    // getThemeData().then(r=>{
    //     console.log('r',r)
    // })
    const themeData = useSelector((st) => st.store.themeData);
    const homeData = useSelector((st) => st.store.homeData);
    // console.log('homeDataaaaaaaaaa',homeData)
    // console.log('themeDataataaaaaaaaaa',themeData.Home.layout)
//     useEffect(() => {
// // console.clear();
// console.log('homeData',homeData)
//     }, [homeData]);
//
//     useEffect(() => {
// // console.clear();
// console.log('themeData',themeData)
//     }, [themeData]);
    if (homeData && themeData && themeData.Home && themeData.Home.layout)
        return (<PageBuilder {...props} elements={themeData.Home.layout} content={homeData}/>);
    else
        return <></>
};
export const HomeServer = [
    {
        func: loadProducts,
        params: "61d58e38d931414fd78c7fca"
    },
    {
        func: loadProducts,
        params: "61d58e37d931414fd78c7fbd"
    },
    {
        func: loadProducts,
        params: "61d58e37d931414fd78c7fb7"
    },
    {
        func: loadProducts,
        params: "61d58e37d931414fd78c7fb9"
    },
    {
        func: loadProducts,
        params: "61d58e37d931414fd78c7fbc"
    },
    {
        func: loadProducts,
        params: "61d58e37d931414fd78c7fba"
    },
    {
        func: loadPosts,
        params: null
    },
    {
        func: fetchCats,
        params: null
    }];

// export const HomeServer = loadProducts;
// export const HomeServerArgument = "61d58e37d931414fd78c7fba";
// export const HomeServer = fetchData("61d58e37d931414fd78c7fba");
export default withTranslation()(Home_new);
