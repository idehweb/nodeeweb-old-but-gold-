import React from "react";

import {Splide, SplideSlide} from "@splidejs/react-splide";

export default (props) => {
    const {
        children,
        className,
        perPage = 4,
        type = "loop",
        pagination = false,
        arrows = false,
        autoplay = true,
        lazyLoad = true,
        interval = 2000,
        gap = "1rem",
        breakpoints = {
            1024: {
                perPage: 3
            },
            768: {

                perPage: 3
            },
            640: {

                perPage: 2
            },
            320: {

                perPage: 1
            }
        }
    } = props;
    console.log('children', children);
    if (!children) {
        return <></>
    }
    return (
        <Splide
            options={{
                gap: gap,
                perPage: perPage,
                type: type,
                perMove: 1,
                pagination: pagination,
                direction: "rtl",
                arrows: arrows,
                autoplay: autoplay,
                lazyLoad: lazyLoad,
                breakpoints: breakpoints,
                interval: interval
            }}
            className={className}
        >

            {(children && children.length > 0) && children.map((item, key) => {
                return <SplideSlide key={key}>{item}</SplideSlide>;
            })}

        </Splide>
    );
};