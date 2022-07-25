import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "reactstrap";

import { Draggable, Dropzone } from "react-page-maker";
import { elements } from "../const";
import Toolbar from "../Toolbar";
import { unicID } from "@/functions/index";

const DraggableLayout = (props) => {
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
    ...rest
  } = props;
  const { countOfCols } = payload;
  // console.clear();
  console.log("dropzoneProps", dropzoneProps);
  // var whatever = ['','',''];
  // for(var i=0;i<countOfCols;i++){
  //   // whatever.push();
  // }
// console.log('whatever',whatever);
  if (showBasicContent) {
      console.log('showBasicContent',showBasicContent)

      return (
      <Draggable {...props} >
        <span>{rest.name}</span>
      </Draggable>
    );
  }

  const _onDrop = (data, cb = () => {
  }) => {
    // no need to ask id and name again
      console.log("data ",data,cb)
    if (data.payload && data.payload.dropped) {
      return cb(data);
    }

    // This can be an async call or some modal to fetch data
    let name = data.name;
    if (data.type === elements.TEXTBOX || data.type === elements.DROPDOWN) {
      name = "name";
    }
    const id = unicID();

    const result = cb({
      ...data,
      name,
      id,
      payload: { dropped: true }
    });
  };

  if (showPreview) {
    console.log('showPreview',showPreview)
    return (

      <Row className="auto-col">
        {/*{[...Array(countOfCols)].map((wh, h) => {*/}

          {/*return <Col key={h} className={"col-the-" + h}>*/}
            {/*{rest.childNode["canvas-1-" + h]}*/}
          {/*</Col>;*/}

        {/*})}*/}
      </Row>
    );
  }

  const filterInitialElements = (dID) => {
    return initialElements.filter(e => e.dropzoneID === dID) || [];
  };
  // console.clear();
  // if(!countOfCols){
  //   return <></>
  // }
  let countOfColsArray = [];
  for (var i = 0; i < countOfCols; i++) {
    countOfColsArray[i] = { "": "" };
  }
  // countOfColsArray.push();
  console.log("countOfColsArray", countOfCols, countOfColsArray, payload,props);
  //

  return (
    <Draggable {...props} className={"draggable-layout-zzzz"}>
      <Toolbar  {...props} defaultForm={[
        { label: "countOfCols", defaultValue: countOfCols, type: "number", name: "countOfCols" }
      ]}/>
      <div className="mt-3">
      </div>
        <div className="auto-col draggable-layout">
            <Dropzone
                {...dropzoneProps}
                className="auto-col2"
                initialElements={filterInitialElements("canvas-1-" + "1")}
                id={"canvas-1-" + "1"}
                onDrop={_onDrop}
                placeholder="Drop Here"
            />
          {/*{countOfColsArray.map((wh, h) => {*/}
            {/*return <Col key={h} className={"the-col dropzone the-co" + h}>*/}
              {/*<Toolbar  {...props} defaultForm={[*/}
                {/*{*/}
                  {/*label: "size", defaultValue: "col-md-6", type: "select-options", name: "sizeOfCol", children: [{*/}
                    {/*name: "1/12", value: "col-md-1"*/}
                  {/*}, {*/}
                    {/*name: "1/6", value: "col-md-2"*/}
                  {/*}, {*/}
                    {/*name: "1/4", value: "col-md-3"*/}
                  {/*}, {*/}
                    {/*name: "1/3", value: "col-md-4"*/}
                  {/*}, {*/}
                    {/*name: "1/2", value: "col-md-6"*/}
                  {/*}, {*/}
                    {/*name: "2/3", value: "col-md-8"*/}
                  {/*}, {*/}
                    {/*name: "3/4", value: "col-md-9"*/}
                  {/*}, {*/}
                    {/*name: "5/6", value: "col-md-10"*/}
                  {/*}, {*/}
                    {/*name: "1/1", value: "col-md-12"*/}
                  {/*}]*/}
                {/*}*/}
              {/*]}/>*/}
              {/*<Dropzone*/}
                {/*{...dropzoneProps}*/}
                {/*initialElements={filterInitialElements("canvas-1-" + h)}*/}
                {/*id={"canvas-1-" + h}*/}
                {/*onDrop={_onDrop}*/}
                {/*placeholder="Drop Here"*/}
              {/*/>*/}
            {/*</Col>;*/}
          {/*})}*/}

        </div>
    </Draggable>
  );
};

DraggableLayout.propTypes = {
  id: PropTypes.string.isRequired,
  showBasicContent: PropTypes.bool.isRequired
};

export default DraggableLayout;
