import React from 'react';
import Swiper from "#c/components/swiper";

export function ShowElement(p) {
    console.log("ShowElement", p);

    let {element} = p;
    let {name, type} = element;
    // console.log("name", name);

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
    let {content, classes} = element;
    // console.clear()
    console.log('element',element)

    return <div className={'p-node ' + (classes ? classes.map(ob => (ob.name ? ob.name : ob)).join(" ") : "")}> {content}</div>;
    // return <div className={'the-title'}><ShowElement element={component}/></div>;


}

export function TITLE({element}) {
    let {type, components,classes} = element;
    return components.map((com, index) => {
        console.log("TITLE", classes)
        return <div className={'p-title ' + (classes ? classes.map(ob => (ob.name ? ob.name : ob)).join(" ") : "")}><ShowElement key={index} element={com}/></div>
    })
    // return <div className={'the-title'}><ShowElement element={component}/></div>;


}

export function CAROUSEL({element}) {
    let {type, fields} = element;
    return "CAROUSEL";

}

export function SWIPER({element}) {
    let {type, components} = element;
    // console.clear()
    // console.log(components);
    if (components)
        return components.map((com, index) => {
            // console.log("TITLE", com)
            return <ShowElement key={index} element={com}/>
        })

}

export function SWIPERWrapper({element}) {
    let {type, components, classes} = element;
    // console.log("SWIPERWrapper")

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
            className={"p-0 m-0 " + (classes ? classes.map(ob => (ob.name ? ob.name : ob)).join(" ") : "")}
        >{components.map((com, index) => {
            return <ShowElement key={index} element={com}/>
        })}</Swiper>

}

export function SWIPERSlide({element}) {
    let {type, components, classes} = element;
    if (components)
        return components.map((com, index) => {
            // console.log("SWIPERSlide", com)
            return <div className={'SWIPERSlide ' + (classes ? classes.map(ob => (ob.name ? ob.name : ob)).join(" ") : "")}><ShowElement key={index} element={com}/></div>
        })

}

export function TEXTBOX(element) {
    let {type, fields} = element;

    return "TEXTBOX";

}

export function IMAGE({element}) {
    let {type, attributes, classes} = element;
    // console.clear()
    // console.log(element);
    return <img className={' ' + (classes ? classes.map(ob => (ob.name ? ob.name : ob)).join(" ") : "")} src={attributes.src}/>

}

export function SLIDER(element) {
    let {type, fields} = element;
    return "SLIDER";

}

export function GRID_LAYOUT({element}) {

    let {type, components, classes} = element;
    // console.log("GRID_LAYOUT", components);


    return <div
        className={"limited posrel row grid-layout " + (classes ? classes.map(ob => (ob.name ? ob.name : ob)).join(" ") : "")}>{components && components.map((item, k) => {
        // console.log("item.name", item.name);
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
    // console.clear();


    const {payload, type, components, classes} = element;
    console.log("GRID_COL ",classes);

    return <div className={"col " + (classes ? classes.map(ob => (ob.name ? ob.name : ob)).join(" ") : "")}>
        {components && components.map(item => {
            // console.log("item.id", item.id);
            return <ShowElement element={item}/>;
        })}
    </div>;
}


export default function PageBuilder({elements}) {
    let html = elements.html;
    if (elements && elements.pages && elements.pages[0] && elements.pages[0].frames && elements.pages[0].frames[0] && elements.pages[0].frames[0].component && elements.pages[0].frames[0].component.components)
        elements = elements.pages[0].frames[0].component.components;
    // console.log('elements', elements)
// console.clear();
    return (
        <div className={'page-builder'}>
            {/*<div*/}
            {/*dangerouslySetInnerHTML={{__html: html}}*/}
            {/*/>*/}
            {elements && elements.map((element, index) => {
                console.log('#'+index+' element',element)
                return <ShowElement key={index} element={element}/>
            })}
        </div>
    );
}
