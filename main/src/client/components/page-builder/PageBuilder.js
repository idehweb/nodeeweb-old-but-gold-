import React from 'react';
import Swiper from "#c/components/swiper";

export function ShowElement(p) {
    console.log("ShowElement", p);

    let {element} = p;
    let {name, type} = element;
    console.log("name", name);

    switch (type) {
        case "text":
            return <TITLE element={element}/>;
        case "image":
            return <IMAGE element={element}/>;
        case "textnode":
            return <TEXTNODE element={element}/>;
        case "swiper-wrapper":
            return <SWIPERWrapper element={element}/>;
        case "swiper-slide":
            return <SWIPERSlide element={element}/>;
        case "swiper-container":
            return <SWIPER element={element}/>;
    }

    switch (name) {
        case "text":
            return <TITLE element={element}/>;
        case "TEXTBOX":
            return <TEXTBOX element={element}/>;
        case "swiper-container":
            return <SLIDER element={element}/>;
        case "Row":
            return <GRID_LAYOUT element={element}/>;
        case "Cell":
            return <GRID_COL element={element}/>;
        case "CAROUSEL":
            return <CAROUSEL element={element}/>;
        default :
            return <></>
    }
}


export function TEXTNODE({element}) {
    let {content} = element;

    return <div className={'p-node'}> {content}</div>;
    // return <div className={'the-title'}><ShowElement element={component}/></div>;


}

export function TITLE({element}) {
    let {type, components} = element;
    return components.map((com, index) => {
        console.log("TITLE", com)
        return <ShowElement key={index} element={com}/>
    })
    // return <div className={'the-title'}><ShowElement element={component}/></div>;


}

export function CAROUSEL({element}) {
    let {type, fields} = element;
    return "CAROUSEL";

}

export function SWIPER({element}) {
    let {type, components} = element;
    console.clear()
    console.log(components);
    if (components)
        return components.map((com, index) => {
            console.log("TITLE", com)
            return <ShowElement key={index} element={com}/>
        })

}

export function SWIPERWrapper({element}) {
    let {type, components} = element;
    console.log("SWIPERWrapper")

    if (components)
        return <Swiper
            perPage={1}
            arrows={true}
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
        >{components.map((com, index) => {
            return <ShowElement key={index} element={com}/>
        })}</Swiper>

}

export function SWIPERSlide({element}) {
    let {type, components} = element;
    if (components)
        return components.map((com, index) => {
            console.log("SWIPERSlide", com)
            return <div className={'SWIPERSlide'}><ShowElement key={index} element={com}/></div>
        })

}

export function TEXTBOX(element) {
    let {type, fields} = element;

    return "TEXTBOX";

}

export function IMAGE({element}) {
    let {type, attributes} = element;
    // console.clear()
    // console.log(element);
    return <img src={attributes.src}/>

}

export function SLIDER(element) {
    let {type, fields} = element;
    return "SLIDER";
    // fields.map(item => {
    //     console.log("item")
    //
    // })
    // switch (type) {
    //     case 'SLIDER':
    //         return "slider";
    //     case "GRID_LAYOUT":
    //         return "GRID_LAYOUT";
    //     case "GRID_COL":
    //         return "GRID_COL";
    //     default :
    //         return <></>
    // }
}

export function GRID_LAYOUT({element}) {

    let {type, components} = element;
    console.log("GRID_LAYOUT", components);


    return <div className={"limited posrel row grid-layout"}>{components && components.map((item, k) => {
        console.log("item.name", item.name);
        return <ShowElement key={k} element={item}/>;
    })}</div>;
    // switc¬h (type) {
    //     case 'SLIDER':
    //         return "slider";
    //     case "GRID_LAYOUT":
    //         return "GRID_LAYOUT";
    //     case "GRID_COL":
    //         return "GRID_COL";
    //     default :
    //         return <></>
    // }
}

export function GRID_COL({element}) {
    const {payload, type, components} = element;
    console.log("GRID_COL");
    return <div className={"col "}>
        {components && components.map(item => {
            console.log("item.id", item.id);
            return <ShowElement element={item}/>;
        })}
    </div>;
    // let {type} = element;
    //
    // switch (type) {
    //     case 'SLIDER':
    //         return "slider";
    //     case "GRID_LAYOUT":
    //         return "GRID_LAYOUT";
    //     case "GRID_COL":
    //         return "GRID_COL";
    //     default :
    //         return <></>
    // }
}


export default function PageBuilder({elements}) {
    let html = elements.html;
    if (elements && elements.pages && elements.pages[0] && elements.pages[0].frames && elements.pages[0].frames[0] && elements.pages[0].frames[0].component && elements.pages[0].frames[0].component.components)
        elements = elements.pages[0].frames[0].component.components;
    console.log('elements', elements)

    return (
        <div className={'page-builder'}>
            {/*<div*/}
            {/*dangerouslySetInnerHTML={{__html: html}}*/}
            {/*/>*/}
            {elements && elements.map((element, index) => {
                return <ShowElement key={index} element={element}/>
            })}
        </div>
    );
}
