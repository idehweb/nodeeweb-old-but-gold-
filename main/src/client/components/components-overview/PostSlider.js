import React, { Suspense, useEffect, useState } from "react";
import Swiper from "#c/components/swiper";
import { isClient, loadPostItems, MainUrl } from "#c/functions/index";
import BlogCard from "#c/components/Home/BlogCard";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const PostSlider = ({ cat_id=null, delay = 2500, include, t }) => {
  // console.log("\nPostSlider==================>");
  let postSliderData = useSelector((st) => {
    // if (st.store.postSliderData)
      // console.log("st.store", st.store.postSliderData);
    return st.store.postSliderData;
  });

  const [tracks, settracks] = useState(isClient ? [] : (postSliderData[cat_id]));
  // console.log("post tracks", postSliderData[cat_id]);

  if (isClient)
    useEffect(() => {
      console.log("\nuseEffect loadPostItems==================>");
      loadPostItems().then(res => settracks(res));
    }, []);

  return (
    <Suspense fallback={<div> loading... </div>}>
      <div className={"ltr "}>
        {(tracks && tracks.length > 0) && <Swiper>
          {tracks.map((i, idx) => (
            <div className={"swiper-slide"} key={idx}><BlogCard item={i}/></div>
          ))}
        </Swiper>}

      </div>
    </Suspense>
  );

};
export const PostSliderServer = loadPostItems;

export default withTranslation()(PostSlider);