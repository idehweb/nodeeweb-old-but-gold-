import React from "react";

import { Draggable, Dropzone } from "react-page-maker";
import EditConfigOfElement from "./EditConfigOfElement";
import DeleteElement from "./DeleteElement";

const Toolbar = (props) => {
  // make sure you are passing `parentID` prop to dropzone
  // it help to mainatain the state to meta data
  const {
    dropzoneID,
    parentID,
    showBasicContent,
    showPreview,
    id,
    dropzoneProps,
    payload,
    initialElements,
    defaultForm,
    ...rest
  } = props;
  const { countOfCols } = payload;


  return (
    <div className={"the-toolbar"} {...props}>
      <div className={"row auto-col"}>
        <div className={"col"}>{rest.name}</div>
        <div className={"col bittons"}>
          <EditConfigOfElement {...props} defaultForm={defaultForm}/>
          <DeleteElement {...props} />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
