import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Col} from 'shards-react';

import MainNavbar from '#c/components/layout/MainNavbar/MainNavbar';
import MainMobileNavbar from '#c/components/layout/MainNavbar/MainMobileNavbar';
import MainSidebar from '#c/components/layout/MainSidebar/MainSidebar';
import CardSidebar from '#c/components/layout/MainSidebar/CardSidebar';
import StickyCard from '#c/components/layout/StickyCard';
import MainFooter from '#c/components/layout/MainFooter';
import {useSelector} from "react-redux";
import grapesjs from "grapesjs";
// import useWindowSize from '#c/components/common/useWindowSize';yarn
import {GetBuilder, isClient, returnTheBuilderUrl, SaveBuilder,MainUrl} from '#c/functions/index';
import {useParams} from "react-router-dom";
import 'grapesjs/dist/css/grapes.min.css'
import 'grapesjs/dist/grapes.min.js'
import 'grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.css'
import 'grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.js'
import '../assets/scripts/grapesjs-swiper-slider.min.js'
import '../assets/styles/grape.css'

if (isClient) {


}

let editor;
const Pgbuilder = (props) => {
    // console.clear();
    console.log("isClient", isClient)
    // if (!isClient) {
    //     return
    // }
    let tok = null;
    let {_id, type} = useParams();
    console.log('==> pgbuilder');
    if (isClient) {
        console.log('true')


        let url = new URL(window.location.href);
        tok = url.searchParams.get("token") || "";
    }
    let theme = useSelector((st) => {
        // console.log("st.store", st.store.productSliderData);
        return st.store.theme || "light";
    });

    useEffect(() => {
//
//         const svgText = `<svg style="width:48px;height:48px" viewBox="0 0 24 24">
// <path fill="currentColor" d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z" />
// </svg>`;
//         const svgLink = `<svg style="width:48px;height:48px" viewBox="0 0 24 24">
// <path fill="currentColor" d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z" />
// </svg>`;
//         const svgImage = `<svg style="width:48px;height:48px" viewBox="0 0 24 24">
// <path fill="currentColor" d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
// </svg>`;
//
//         const blocks = [
//             {
//                 id: 'text',
//                 label: 'Text',
//                 category: 'Basic',
//                 media: svgText,
//                 activate: true,
//                 content: {
//                     type: 'text',
//                     content: 'Insert your text here',
//                     style: {padding: '10px'},
//                 }
//             }, {
//                 id: 'link',
//                 label: 'Link',
//                 category: 'Basic',
//                 media: svgLink,
//                 activate: true,
//                 content: {
//                     type: 'link',
//                     content: 'Insert your link here',
//                     style: {color: '#d983a6'}
//                 }
//             }, {
//                 id: 'image',
//                 label: 'Image',
//                 category: 'Basic',
//                 media: svgImage,
//                 activate: true,
//                 content: {type: 'image'}
//             }
//         ];
        // console.clear();
        console.log('returnTheBuilderUrl', returnTheBuilderUrl())
        const sessionStoragePlugin = (editor) => {
            // As sessionStorage is not an asynchronous API,
            // the `async` keyword could be skipped
            editor.Storage.add('session', {
                async load(options = {}) {
                    // const data = editor.getProjectData();
                    // console.log(data)
                    GetBuilder(_id, type, {
                        token: tok
                    }).then(r => {
                        console.log('r', r.elements);
                        sessionStorage.setItem(options.key, JSON.stringify(r.elements));

                        return (r.elements);

                    }).catch(f => {
                        console.log('f', f);
                    })
                    let str = sessionStorage.getItem(options.key);
                    console.log("xxxload ", str);
                    let obj = JSON.parse(str);
                    // delete obj.js;
                    // delete obj.html;
                    return obj;
                },

                async store(data, options = {}) {
                    console.log("store ")
                    SaveBuilder(_id, type, {...data, html: editor.getHtml(), js: editor.getJs()}, {
                        token: tok
                    }).then(r => {
                        sessionStorage.setItem(options.key, JSON.stringify(data));

                        console.log('r', r);
                    }).catch(f => {
                        console.log('f', f);
                    })
                    sessionStorage.setItem(options.key, JSON.stringify(data));

                }
            });
        };
        editor = grapesjs.init({
            container: '#gjs',
            height: '100vh',
            width: '100%',
            // plugins: ['gjs-preset-webpage', 'grapesjs-swiper-slider',],
            plugins: ['gjs-preset-webpage','grapesjs-swiper-slider', sessionStoragePlugin],
            // blocManager: {
            //     custom: true,
            //     blocks,
            // },

            storageManager: {
                // type: 'remote',
                // stepsBeforeSave: 1,
                // options: {
                //     remote: {
                //         urlLoad: returnTheBuilderUrl(_id,type),
                //         urlStore: returnTheBuilderUrl(_id,type),
                //         // The `remote` storage uses the POST method when stores data but
                //         // the json-server API requires PATCH.
                //         fetchOptions: opts => (opts.method === 'POST' ?  { method: 'PATCH' } : {}),
                //         // As the API stores projects in this format `{id: 1, data: projectData }`,
                //         // we have to properly update the body before the store and extract the
                //         // project data from the response result.
                //         onStore: data => ({ id: _id, data }),
                //         onLoad: result => result.data,
                //         headers: {
                //             'token': tok,
                //             "Origin": "http://localhost:3001",
                //             "Host": "localhost:3001",
                //             "Accept": "application/json, text/plain, */*",
                //             "Content-Type": "application/json"
                //         }
                //     }
                // },
                id: 'gjs-',
                autosave: true,
                storeComponents: true,
                storeStyles: true,
                storeHtml: true,
                storeCss: true,
                // type: 'remote',
                // autosave: true,         // Store data automatically
                // autoload: true,
                // params: { page_id: _id },
                contentTypeJson: true,
                // storeComponents: true,
                // storeStyles: true,
                // storeHtml: true,
                // storeCss: true,
                // headers: {
                //     'Content-Type': 'application/json',
                //     'token': tok,
                // }
                type: 'session',
                options: {
                    session: {key: 'myKey'}
                }
            },

            deviceManager: {
                devices:
                    [
                        {
                            id: 'desktop',
                            name: 'Desktop',
                            width: '',
                        },
                        {
                            id: 'tablet',
                            name: 'Tablet',
                            width: '768px',
                            widthMedia: '992px',
                        },
                        {
                            id: 'mobilePortrait',
                            name: 'Mobile portrait',
                            width: '320px',
                            widthMedia: '575px',
                        },
                    ]
            },
            pluginsOpts: {
                'grapesjs-preset-webpage': {
                    blocksBasicOpts: {
                        blocks: ['link'],
                        flexGrid: 1,
                    },
                    blocks: ['link-block', 'quote', 'text-basic'],
                },
            },
        })
        editor.Panels.addButton
        ('options',
            [{
                id: 'save-db',
                className: 'fa fa-floppy-o',
                command: 'save-db',
                attributes: {title: 'Save DB'}
            },{
                id: 'view-front',
                className: 'fa fa-eye',
                command: 'view-front',
                attributes: {title: 'View at front mode'}
            }]
        );
        // Add the command
        editor.Commands.add
        ('save-db', {
            run: function (editor, sender) {
                sender && sender.set('active'); // turn off the button
                editor.store(); // extract data
            }
        });
        editor.Commands.add
        ('view-front', {
            run: function (editor, sender) {
                if(isClient){
                    let anchor = document.createElement('a');
                    anchor.href = MainUrl+'/post/'+_id+'/preview';
                    anchor.target="_blank";
                    anchor.click();
                }
                // sender && sender.set('active'); // turn off the button
                // editor.store(); // extract data
            }
        });
        // to load data inital
        // editor.setComponents(JSON.parse(value.components));
        // editor.setStyle(JSON.parse(value.styles));
        editor.on('storage:load', function (e) {
            console.log('Loaded ', e);
        });
        editor.on('storage:store', function (e) {
            console.log('Stored ', e);

            // console.log(e.pages[0].frames[0].component)
            // const data = editor.getProjectData();
            // console.log(data)
            // SaveBuilder(_id,type,e,{
            //     token:tok
            // }).then(r=>{
            //     console.log('r',r);
            // }).catch(f=>{
            //     console.log('f',f);
            // })
            // storageManager.store(data);
        });
        editor.BlockManager.add('Nodeeweb', {
            label: 'Nodeeweb',
            category: 'Nodeeweb',
            // ...
        })

    }, [])

    let {children, width = 1200, noNavbar, onChange = () => null, location} = props;
    // console.log(width);
    // let [width2, setWindowSize] = useState(width);
    // useEffect(() => {
    //   console.log('DefaultLayout...', theme);
    //
    //   function handleResize() {
    //     // Set window width/height to state
    //     console.log('DefaultLayout...', window.innerWidth, width);
    //
    //     if ((width > 1200 && window.innerWidth < 1200) || (width < 1200 && window.innerWidth > 1200)) {
    //
    //       setWindowSize(window.innerWidth);
    //     }
    //
    //   }
    //
    //   // Add event listener
    //   window.addEventListener("resize", handleResize);
    //   handleResize();
    //   // Remove event listener on cleanup
    //   return () => window.removeEventListener("resize", handleResize);
    // }, [theme]);

    console.log('DefaultLayout...', theme);
    {/*<SiteStatus/>,*/
    }
    return (

        <div className={'page-builder'}>
            <main key={1} data-theme={theme}>
                {/*<div>*/}
                {width < 1200 && <MainSidebar {...children.props} />}
                {width > 1199 && <StickyCard {...children.props} />}

                <CardSidebar {...children.props} />

                <Col
                    className="main-content p-0"
                    lg={{size: 12, offset: 0}}
                    md={{size: 12, offset: 0}}
                    sm="12"
                    // tag="main"
                >

                    {(!noNavbar && width > 1199) && <MainNavbar onChange={onChange}/>}
                    {(!noNavbar && width < 1200) && <MainMobileNavbar onChange={onChange}/>}
                    {/*<div id="blocks"></div>*/}
                    <div id="gjs" key={2}>
                    </div>
                    {/*<button onClick={(e)=>{*/}
                    {/*console.log(editor.getJs())*/}
                    {/*}}>hello</button>*/}
                    {children}
                    <MainFooter/>
                </Col>
                {/*</div>*/}
            </main>

            {/*<div id="blocks"></div>*/}
        </div>
    );
};

Pgbuilder.propTypes = {
    /**
     * Whether to display the navbar, or not.
     */
    noNavbar: PropTypes.bool,
    /**
     * Whether to display the footer, or not.
     */
    noFooter: PropTypes.bool,
};

Pgbuilder.defaultProps = {
    noNavbar: false,
    noFooter: false,
};

export default Pgbuilder;
