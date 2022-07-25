import React, { useState } from "react";
import { Button } from "@mui/material";
import { Draggable, Dropzone, state } from "react-page-maker";
import { SketchPicker } from "react-color";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import CustomModal from "@/components/CustomModal";

const Color = (props) => {
  const { defaultForm,id, dropzoneID, parentID,color,onChangeComplete,label } = props;

  const [thecolor, setColor] = useState(color);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  console.clear();
  console.log('props',props);


  const handleChangeComplete = (color) => {
    // er.defaultValue=color.hex;
    console.log('handleChangeComplete',color);
    // const { id, dropzoneID, parentID } = props;
    state.updateElement(id, dropzoneID, parentID, {
      payload: { background: color.hex }
    });
    setColor(color.hex);

    // props.updateElement(id, dropzoneID, parentID, {
    //   payload: { background: color.hex }
    // });

  };
  return (<div className={'color-picker-page-builder'}>
    <label className={'the-label-inline'}>{label}</label>
    <button className={'the-color-swatch'} onClick={()=>setDisplayColorPicker(true)}>
      <div style={{backgroundColor:thecolor}} className={'the-color'}/>
    </button>
    {displayColorPicker && <div className={'the-color-popover'}><div className={'the-color-cover'} onClick={()=>setDisplayColorPicker(false)}/><SketchPicker color={thecolor} onChangeComplete={(e)=>{handleChangeComplete(e);onChangeComplete(e)}}/>x</div>}
  </div>);
  // return ( (showColorPicker ? <SketchPicker
  //         color={thecolor}
  //         onChangeComplete={(e)=>{handleChangeComplete(e);onChangeComplete(e)}}
  //       /> : <Button></Button>)
  // );
};
//
// DraggableLayout.propTypes = {
//   id: PropTypes.string.isRequired,
//   showBasicContent: PropTypes.bool.isRequired
// };

export default Color;
