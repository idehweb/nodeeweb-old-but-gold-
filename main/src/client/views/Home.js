import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";

import {Col, Row} from "shards-react";
import InfiniteScroll from "react-infinite-scroller";
import {
    eid,
    slide1Img,
    slide2Img,
    slide3Img,
    slide4Img,
    slide5Img,
    slideMain,
    slideOffer1Img,
    slideOffer2Img,
    slideOffer3Img,
    slideOffer4Img,
    slideOffer5Img,
    slideOffer6Img,
    slideOffer8Img
} from "#c/assets/index";
import BallotIcon from "@mui/icons-material/Ballot";
import LoadingComponent from "#c/components/components-overview/LoadingComponent";
import Product from "#c/views/Product";
import Swiper from "#c/components/swiper";
import Sort from "#c/components/archive/Sort";
import Story from "#c/components/Home/Story";
import {
    enableAdmin,
    enableAgent,
    enableSell,
    fetchCats,
    getPosts,
    getPostsByCat,
    isClient,
    loadPosts,
    loadProducts,
    SaveData,
    setCountry
} from "#c/functions/index";
import ProductsSlider, {ProductsSliderServer} from "#c/components/components-overview/ProductsSlider";
import PostSlider, {PostSliderServer} from "#c/components/components-overview/PostSlider";

import {withTranslation} from "react-i18next";
import PostCard from "#c/components/Home/PostCard";
import {useSelector} from "react-redux";

const Home = (props) => {
    let {match, location, history, t, url} = props;
    let params = useParams();
    history = useNavigate();
    url = isClient ? new URL(window.location.href) : "";

    let search = isClient ? (url.searchParams.get("search") || "") : "";
    const [tracks, settracks] = useState([]);
    // let showSlide = true;

    let [showSlide, setShowSlide] = useState(true);

    const [hasMoreItems, sethasMoreItems] = useState(true);
    const [single, set_single] = useState(false);
    const [single_id, set_single_id] = useState("");
    const [attrP, setAttr] = useState("");
    const [valueP, setValue] = useState("");
    let [offset, setoffset] = useState(-24);
    const [loadingMoreItems, setLoadingMoreItems] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [catid, setcatid] = useState(params._id);
    const [load, setLoad] = useState(null);
    //
    const postCardMode = useSelector((st) => st.store.postCardMode);
    const sortBy = useSelector((st) => st.store.sortBy);
    const defaultSort = useSelector((st) => st.store.defaultSort);


    console.log('sortBy', sortBy);
    // const theAttr = useSelector((st) => st.store.attr);
    // const theValue = useSelector((st) => st.store.value);
    // console.log("theAttr", theAttr, "theValue", theValue);
    if (isClient) {
        useEffect(() => {

            let url = new URL(window.location.href);
            let eAd = url.searchParams.get("enableAdmin") || "";
            if (eAd) {
                console.log('enableAdmin');
                enableAdmin(true);
            }


        }, []);

    }
    useEffect(() => {
        console.log('defaultSort changed to: ', defaultSort);
        SaveData({
            defaultSort: defaultSort
        });
        setoffset(-24);
        offset = -24;
        sethasMoreItems(true);
        settracks([]);
        loadProductItems(0);

    }, [defaultSort]);
    useEffect(() => {

        console.log('sortBy', sortBy);

    }, [sortBy]);
    const loadProductItems = async (page, catId = catid, filter = {}) => {

        // console.log("==> loadProductItems():", offset, search, catId,filter);

        // if(!loadingMoreItems){
        let newOffset = (await offset) + 24;
        if (!catId && !showSlide) {
            let trackss = [...tracks];

            await setoffset(newOffset);
            await setInitialLoad(false);
            await setLoadingMoreItems(true);
            getPosts(newOffset, 48, search || "", filter).then((resp) => {
                setLoadingMoreItems(false);
                afterGetData(resp);
            });
            return;
        } else {
            await setoffset(newOffset);
            await setInitialLoad(false);
            await setLoadingMoreItems(true);
            getPostsByCat(newOffset, 24, catId, search || "", filter).then((resp) => {
                setLoadingMoreItems(false);
                afterGetData(resp);
            });


        }
        // }
    };
    if (isClient) {

        let attr = url.searchParams.get("attr") || "";
        let value = url.searchParams.get("value") || "";
        if (attr !== attrP)
            setAttr(attr);
        if (value !== valueP)
            setValue(value);

    }
    useEffect(() => {
        loadProductItems(0, catid);
    }, [catid]);


    useEffect(() => {
        console.log("match.params._id", match, "and:", catid);
        if (params._id !== catid) {
            setcatid(params._id);
            sethasMoreItems(true);
            settracks([]);
            setoffset(-24);
        }
    }, [params._id, catid]);
    useEffect(() => {
        console.log("we changed value...");
        setoffset(-24);

        // settracks([]);
        sethasMoreItems(true);
        settracks([]);

        loadProductItems(0, catid, {
            attr: attrP,
            value: valueP
        });
    }, [attrP, valueP]);

    const afterGetData = (resp) => {
        let trackss = [...tracks];
        if (resp.length < 24) sethasMoreItems(false);
        // console.log("resp", resp);
        if (resp && resp.length) {
            resp.forEach((item) => {
                trackss.push(item);
            });
            settracks(trackss);
            if (resp && resp.length < 1) sethasMoreItems(false);
        } else {
            sethasMoreItems(false);
            setLoad(false);
        }
    };

    const loader = (
        <div className="loadNotFound loader " key={23}>
            {t("loading...")}
            <LoadingComponent height={30} width={30} type="spin" color="#3d5070"/>
        </div>
    );
    // console.log("Home", catid, search);
    if (catid || search)
        showSlide = false;


    return (<div className="main-content-container fghjkjhgf ">

            {(showSlide) && <div className="page-header relative ">
                <Swiper
                    perPage={1}
                    arrows={true}
                    type={"fade"}
                    breakpoints={{
                        1024: {
                            perPage: 1
                        },
                        768: {

                            perPage: 1
                        },
                        640: {

                            perPage: 1
                        },
                        320: {

                            perPage: 1
                        }
                    }}
                    className={"p-0 m-0"}
                >

                    <div className={''}>
                        <div className={'relative w-full h-screen'}>
                            <div className={'jhgfdfgtyhu'} style={{
                                backgroundImage: `url('${slideMain}')`,
                            }}>
                                <div className={'gfdsasdf'}>
                                    <div
                                        className="text-2xl lg:text-4xl xl:text-5xl tracking-tight text-heading font-bold color-white">
                                        Use it in both CSR or SSR Mode
                                        <br/>
                                        It's multi language
                                    </div>
                                    <a href={"#"}><h1
                                        className="text-2xl lg:text-4xl xl:text-5xl tracking-tight text-heading font-bold juygtfgh">
                                        Welcome to NodeeWeb
                                    </h1></a>
                                    <p className="text-2xl lg:text-4xl xl:text-5xl tracking-tight font-bold max-width-slide color-white">
<span>
       <div className={'hr'}/>

    start editing client/views/Home.js
    <div className={'hr'}/>

</span>

                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={''}>
                        <div className={'relative w-full h-screen'}>
                            <div className={'jhgfdfgtyhu'} style={{
                                backgroundImage: `url('${slideMain}')`,
                            }}>
                                <div className={'gfdsasdf'}>
                                    <div
                                        className="text-2xl lg:text-4xl xl:text-5xl tracking-tight text-heading font-bold color-white">
                                        Based on NodeJs
                                    </div>
                                    <a href={"#"}><h1
                                        className="text-2xl lg:text-4xl xl:text-5xl tracking-tight text-heading font-bold juygtfgh">
                                        NodeeWeb is fast
                                    </h1></a>
                                    <p className="text-2xl lg:text-4xl xl:text-5xl tracking-tight font-bold max-width-slide color-white">
<span>
    <div className={'hr'}/>
    For docs, please check <a
    href={"https://idehweb.com/product/how-to-create-advanced-shop-website-and-application-with-node-js-react-express/"}
    target={"_blank"}>here</a>
    <div className={'hr'}/>


</span>

                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </Swiper>


            </div>}

            {(showSlide) && <div className="relative mt-3 p-3">
                <Story/>
            </div>}
            <Row className={"m-0"}>

                {(showSlide) && <Col
                    className="main-content iuytfghj"
                    lg={{size: 12}}
                    md={{size: 12}}
                    sm="12"
                    tag="main">


                    <Row className={'mt-3 juytrfvbh pl-15'}>

                        <Col
                            className="ghjhtgfrdsfg"
                            lg={{size: 9}}
                            md={{size: 9}}
                            sm="12">
                            <ProductsSlider cat_id={'62c0a82f7b8cc28ff7571041'} delay={3000}
                            />
                        </Col>
                        <Col
                            className="ghjhtgfrdsfg bg-color-full bg-left bg-color-custom"
                            lg={{size: 3}}
                            md={{size: 3}}
                            sm="12">
                            <Link to={'category/62c0a82f7b8cc28ff7571041/courses'}>
                                <h2 className={' fgfdfv title mb-3'}>
                                    {'دوره ها (حضوری و غیر حضوری)'}
                                </h2>
                                {/*<div className={'the-circle-inside'}></div>*/}
                                {/*<div className={'the-circle-inside second'}></div>*/}
                                <img src={slideOffer6Img}/>
                            </Link>
                        </Col>
                    </Row>
                    <Row className={"mt-3 juytrfvbh pl-15"}>

                        <Col
                            className="ghjhtgfrdsfg"
                            lg={{size: 12}}
                            md={{size: 12}}
                            sm="12">
                            <div className={"title mb-3 p-2"}>
                                <BallotIcon className={"mr-2"}/> {t("Latest from blog")}
                            </div>
                            <PostSlider delay={2000}/>
                        </Col>
                    </Row>


                </Col>}


                {(!showSlide) && <Col
                    className="main-content iuytfghj pb-5 "
                    lg={{size: 12}}
                    md={{size: 12}}
                    sm="12"
                    tag="main">
                    <Sort/>
                    <InfiniteScroll
                        pageStart={0}
                        initialLoad={initialLoad}
                        loadMore={() =>
                            !initialLoad && !loadingMoreItems ? loadProductItems() : null
                        }
                        hasMore={hasMoreItems}
                        catid={catid}
                        loader={loader}
                        offset={offset}
                        className={"row p-3 productsmobile "}
                        element="div">
                        {tracks && tracks.map((i, idxx) => (
                            <Col key={idxx} lg="2"
                                 md="3"
                                 sm="4"
                                 xs="6" className={"nbghjk post-style-" + postCardMode}>

                                <PostCard item={i} method={postCardMode}/>

                            </Col>
                        ))}
                    </InfiniteScroll>

                    {single && (
                        <div className={"kjuyhgfdfgh modallllll " + single}>
                            <div className="col-sm-12 col-md-9 offset-md-3 col-lg-10 offset-lg-2">
                                <Product match={{params: {_id: single_id}}}></Product>
                            </div>
                        </div>
                    )}
                </Col>}
            </Row>
        </div>
    );
};
export const HomeServer = [
    {
        func: loadProducts,
        params: "61d58e38d931414fd78c7fca"
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
export default withTranslation()(Home);
