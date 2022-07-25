import React from "react";
import { withTranslation } from "react-i18next";
import _truncate from "lodash/truncate";
import { Link } from "react-router-dom";

import { dFormat,dateFormat, PriceFormat } from "#c/functions/utils";
import { addItem, MainUrl, removeItem } from "#c/functions/index";
import { defaultImg } from "#c/assets/index";

// import store from "#c/functions/store";

function BlogCard({ onClick, item, method, t }) {
  // let card = store.getState().store.card || [];
    const [lan, setLan] = useState(store.getState().store.lan || "en");

    let date = dateFormat(item.updatedAt, t);
  let price = null;
  let salePrice = null;
  if (item.price) price = PriceFormat(item.price);
  if (item.salePrice) salePrice = PriceFormat(item.salePrice);
  let backgroundImage = defaultImg;
  if (item.photos && item.photos[0])
    backgroundImage = MainUrl + "/" + item.photos[0];
  if (item.thumbnail)
    backgroundImage = MainUrl + "/" + item.thumbnail;
  let title = encodeURIComponent(item.title[lan].replace(/\\|\//g, ""));
  // console.log('item.labels', item.labels);
  return (
    <div
      className="mb-4 ad-card-col nbghjk"
    >
      <div
        className="ad-card-main-div"
      >
        <div
          className="card-post__image"
          onClick={onClick}
        ><Link to={"/post/" + item._id + "/" + title}>
          <img alt={item.title["fa"]} loading={"lazy"} src={backgroundImage || defaultImg}/></Link></div>
        <div className={"post-content-style"}>
          <div className="ad-card-content">
            <span className="a-card-title">
              <Link to={"/post/" + item._id + "/" + title}>{_truncate(item.title["fa"], { length: 120 })}</Link>
            </span>
            <div className={"wer textAlignLeft dateFormat"}>
              {date}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withTranslation()(BlogCard);
