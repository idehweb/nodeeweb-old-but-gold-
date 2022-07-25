import React , {useState} from "react";
import { Button } from "@mui/material";
import { Draggable, Dropzone } from "react-page-maker";
import {
  Canvas,
  Palette,
  state,
  Trash,
  core,
  Preview,
  registerPaletteElements
} from 'react-page-maker';
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import DeleteIcon from '@mui/icons-material/Delete';
const DeleteElement = (props) => {
  // const [modal,setModal]=useState(false)
  const deleteElement = (e) => {
    e.preventDefault();
    console.log('box');
    console.log("EditConfigOfElement props",props);
    props.removeElement(props.id);

  };

  return (<Button onClick={(e) => deleteElement(e)}>
      <DeleteIcon/>

    </Button>
  );
};
//
// DraggableLayout.propTypes = {
//   id: PropTypes.string.isRequired,
//   showBasicContent: PropTypes.bool.isRequired
// };

export default DeleteElement;
