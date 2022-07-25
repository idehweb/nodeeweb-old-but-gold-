import React from "react";
import PropTypes from "prop-types";
import {Col, Container, Row} from "shards-react";
import {withTranslation} from "react-i18next";
import {enamadImg, etehadImg, etmeImg, payImg, spriteImg} from "#c/assets/index";
import InfoIcon from '@mui/icons-material/Info';
import CopyrightIcon from '@mui/icons-material/Copyright';
import HelpIcon from '@mui/icons-material/Help';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import MapIcon from '@mui/icons-material/Map';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import RoomIcon from '@mui/icons-material/Room';
import LinkIcon from '@mui/icons-material/Link';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';

const MainFooter = ({contained, menuItems, menuItems2, menuItems3, copyright, t}) => (
    <footer className="main-footer p-2 px-3 border-top">
        <Container fluid={contained}>
            <Row>
                <hr/>
            </Row>
            <Row>
                <Col lg={8} md={8} sm={12} xs={12}>
                    <CopyrightIcon/>
                    Copy write text editable from client/components/layout/MainFooter.js
                </Col>
                <Col lg={4} md={4} sm={12} xs={12} style={{textAlign: "right"}}>
          <span>
            <span style={{fontSize: "17px",marginRight:"3px"}}>Support by</span>
            <a rel={"nofollow"} href={"https://idehweb.com/"} target={"_blank"} style={{marginRight: "10px"}}><img
                style={{width: "20px"}}
                src={spriteImg}/></a></span>
                </Col>
            </Row>
        </Container>
    </footer>
);

MainFooter.propTypes = {
    /**
     * Whether the content is contained, or not.
     */
    contained: PropTypes.bool,
    /**
     * The menu items araray.
     */
    menuItems: PropTypes.array,
    /**
     * The copyright info.
     */
    copyright: PropTypes.string
};

MainFooter.defaultProps = {
    contained: false,
    copyright: "",
    menuItems: [


        {
            title: "درباره ما",
            link: 'https://www.arvandguarantee.com/about-us/',

            icon: <InfoIcon/>
        },
        {
            title: "سوالات متداول",
            link: 'https://www.arvandguarantee.com/%d8%b3%d9%88%d8%a7%d9%84%d8%a7%d8%aa-%d9%85%d8%aa%d8%af%d8%a7%d9%88%d9%84/',

            icon: <HelpIcon/>

        },
        {
            title: "حفظ حریم شخصی",
            link: 'https://www.arvandguarantee.com/privacy-policy/',

            icon: <PrivacyTipIcon/>

        },
        {
            title: "آدرس، ارتباط با ما",
            link: 'https://www.arvandguarantee.com/contact-us-2/',

            icon: <MapIcon/>

        },
        {
            title: "تعمیرات در آروند",
            link: "https://www.arvandguarantee.com/repair-request",
            icon: <PrecisionManufacturingIcon/>

        },

        {
            title: 'سایت آروند گارانتی',
            link: 'https://www.arvandguarantee.com',
            icon: <LinkIcon/>

        }
    ],
    menuItems2: [


        {
            title: '+98(902)42 528 02',
            link: 'tel:+989024252802',
            icon: <PhoneIphoneIcon/>,
            style: {direction: "ltr", display: "inline-block"}

        },
        {
            title: '+98(21)42 528 000',
            link: 'tel:+982142528000',
            icon: <PhoneEnabledIcon/>,
            style: {direction: "ltr", display: "inline-block"}


        }

    ],
    menuItems3: [
        {
            title: 'support@arvandguarantee.shop',
            link: 'mailto:support@arvandguarantee.shop',
            icon: <AlternateEmailIcon/>

        },
        {
            title: 'تهران،خیابان میرداماد،مجتمع کامپیوتر پایتخت،برج A،طبقه۹،واحد ۹۰۱',

            link: "#",
            icon: <RoomIcon/>,
            style: {lineHieght: "20px"}


        }
        //
        // {
        //            title: 'ضمانت نامه سبز آروند',
        //            link: 'https://www.arvandguarantee.com/green-guarantee/',
        //            icon: <LinkIcon/>
        //
        //        }, {
        //            title: 'ضمانت تکمیلی طلایی آروند',
        //            link: 'https://www.arvandguarantee.com/extendedwarranty-terms/',
        //            icon: <LinkIcon/>
        //
        //        }
    ]

};

export default withTranslation()(MainFooter);
