import React, { useEffect, useState } from "react";
import { Badge, Button, ButtonGroup, Col, Container, Row } from "shards-react";
import { useParams } from "react-router-dom";
import Gallery from "#c/components/single-post/Gallery";
import { withTranslation } from "react-i18next";
import { dFormat, PriceFormat } from "#c/functions/utils";

import {
    addBookmark,
    clearPost,
    getBlogPost,
    isClient,
    loadPost,
    loveIt,
    MainUrl,
    savePost
} from "#c/functions/index";
import { SnapChatIcon } from "#c/assets/index";
import Loading from "#c/components/Loading";
import PageBuilder from "#c/components/page-builder/PageBuilder";
import store from "../functions/store";
import { useSelector } from "react-redux";
import CONFIG from "#c/config";
import ShareIcon from "@mui/icons-material/Share";
// import { Link, useNavigate, useParams } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
// let obj = ;
// let the_id='';
import { RWebShare } from "react-web-share";

const Page = (props) => {
    // console.log("props", props);
    let { match, location, history, t, url } = props;

    let page = useSelector((st) => {
        // console.log("st.store", st.store.productSliderData);
        return st.store.page || [];
    });
    // window.scrollTo(0, 0);
    let params = useParams();
    let the_id = params._id;
    // let search = false;
    // let history = useNavigate();


    const [mainId, setMainId] = useState(the_id);
    const [tab, setTab] = useState("description");
    const [state, setState] = useState(isClient ? [] : (page || []));
    const [lan, setLan] = useState(store.getState().store.lan || "fa");


    const getThePost = (_id) => {
        return new Promise(function(resolve, reject) {

            getBlogPost(_id).then((d = {}) => {
                console.log("set _id to show:", d);
                if(d._id) {
                    savePost({
                        mainList: d.mainList,
                        catChoosed: d.catChoosed,
                        countryChoosed: d.countryChoosed,
                        categories: d.categories,
                        elements: d.elements,
                        mainCategory: d.mainCategory
                    });
                    resolve({
                        load: true,
                        title: d.title,
                        description: d.description,
                        photos: d.photos,
                        _id: d._id,
                        updatedAt: d.updatedAt,
                        kind: d.kind,
                        elements: d.elements,
                        thumbnail: d.thumbnail,
                        excerpt: d.excerpt,
                        views: d.views
                    });
                }else{
                    reject({
                        load: true,
                        notfound:true
                    });
                }
            });
        });
    };
    if (isClient)
        useEffect(() => {
            // let mounted = true;
            let { _id, title } = params;

            console.log("useEffect", _id, the_id, mainId);

            getThePost(the_id)
                .then(items => {
                    // console.log('items',items,the_id);
                    // if (mounted) {
                    setState(items);
                    if (isClient)
                        window.scrollTo(0, 0);
                    // }
                }).catch(e=>{
                setState(e);


            });
            // return () => mounted = false;
        }, [the_id]);

    // useEffect(() => {
    //   let { _id, title } = params;
    //   console.log("useEffect", _id, the_id, mainId);
    //   // if (mainId != _id) {
    //   getThePost(_id).then(res=>setState(state => ({ ...state, ...res })));
    //   window.scrollTo(0, 0);
    //   // }
    //
    // }, [the_id]);


    let {
        load,
        title,
        description,
        photos,
        redirect,
        _id,
        thumbnail,
        excerpt,
        notfound,
        enableAdmin = false,
        views = null,elements=null
    } = state;
    if (redirect && isClient) return <Navigate to={redirect}/>;
    if (!load && isClient) return <Loading/>;
    if (load && notfound && isClient) return <div>not found</div>;
    // console.log("product", title, lan, encodeURIComponent(title[lan]));
    console.log('isClient',isClient);
    return (

        <Container className="main-content-container p-0 pb-4 kiuytyuioiu bg-white" key={0}>

            <Row className={"limited posrel"}>
                <div className={"floating-tools"}>
                    {isClient && <ButtonGroup vertical>

                        {title && <RWebShare
                            data={{
                                text: excerpt,
                                url: CONFIG.SHOP_URL + "p/" + _id + "/" + encodeURIComponent(title[lan]),
                                title: title[lan]
                            }}
                            sites={["whatsapp", "telegram", "linkedin", "copy"]}
                            closeText={t("close")}
                            onClick={() => console.log("shared successfully!")}
                        >
                            <Button>
                                <ShareIcon/>
                            </Button>
                        </RWebShare>}
                        {views && <Button><RemoveRedEyeIcon/><Badge theme="info">{views}</Badge></Button>}

                        {enableAdmin && <a href={VARIABLE.ADMIN_URL + "/#/product/" + _id} target={"_blank"}><i
                            className="material-icons">edit</i></a>}
                    </ButtonGroup>}
                </div>
                <Col lg="3" md="4" xs="12">

                    <Gallery photos={photos} thumbnail={thumbnail}/>

                </Col>
                <Col lg="9" md="8" xs="12">


                    <Row>
                        <Col lg="12" md="12" className={"single-product"}>

                            <h1 className="kjhghjk hgfd ">
                                {title && title.fa}
                            </h1>


                            {excerpt && <div
                                className="d-inline-block item-icon-wrapper mt-3 ki765rfg hgfd"
                                dangerouslySetInnerHTML={{ __html: excerpt }}
                            />}


                        </Col>
                    </Row>


                </Col>

                <Col lg={12} md={12} sm={12} xs={12}>

                    {tab === "description" && <div className={"pt-5"} id={"description"}>
                        {description && <div
                            className="d-inline-block item-icon-wrapper ki765rfg  hgfd mb-5"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />}

                    </div>}

                </Col>


            </Row>

            <PageBuilder elements={elements}/>
        </Container>
    );
};
export const PageServer = [
    {
        func: loadPost,
        params: "6217502008d0e437d6b4ad97"
    }
];
export default withTranslation()(Page);
