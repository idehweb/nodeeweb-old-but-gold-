import React, {useState} from "react";
import {Button} from "@mui/material";
import {Draggable, Dropzone, state} from "react-page-maker";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import CustomModal from "@/components/CustomModal";
import Color from "./forms/Color";

const EditConfigOfElement = (props) => {
    const [modal, setModal] = useState(false);
    const [theState, setState] = useState([]);
    console.log('props', props);
    const {defaultForm, id, dropzoneID, parentID} = props;
    // let defaultFormArr = Object.keys(defaultForm);

    const toggleBox = (e) => {
        e.preventDefault();
        console.log("box");
        console.log("EditConfigOfElement props", props);
        // let temp=modal;
        setModal(!modal);
        // return !temp;
    };

    const handleChangeComplete = (color, er) => {
        er.defaultValue = color.hex;
        console.log('handleChangeComplete', color, er);
        // const { id, dropzoneID, parentID } = props;
        state.updateElement(id, dropzoneID, parentID, {
            payload: {background: color.hex}
        });
        // setState({ background: color.hex });

        // props.updateElement(id, dropzoneID, parentID, {
        //   payload: { background: color.hex }
        // });

    };
    const handleChangeTextComplete = (e, er) => {
        // er.defaultValue=color.hex;
        console.clear();
        console.log('handleChangeTextComplete', e.target.value, er,props,state);
        // const { id, dropzoneID, parentID } = props;
        // setState({
        //     ...setState,
        //     countOfCols: e.target.value
        // })
        state.updateElement(id, dropzoneID, parentID, {
            payload: {countOfCols: e.target.value}
        });
        // setState({ background: color.hex });

        // props.updateElement(id, dropzoneID, parentID, {
        //   payload: { background: color.hex }
        // });

    };
    const handleChangeSelectComplete = (e, er) => {
        // er.defaultValue=color.hex;
        console.clear();
        // console.log('handleChangeSelectComplete',props,er);
        console.log('handleChangeSelectComplete', e.target.value,  er);
        // const { id, dropzoneID, parentID } = props;
        //   setState({...setState,
        //       countOfCols: e.target.value
        //   })
        console.log('state',props);
        let payload=props.payload;
        if(e.target.value){
            payload[er.name]=e.target.value;
        }
        state.updateElement(id, dropzoneID, parentID, {
            payload:payload
        });
        // setState({ background: color.hex });

        // props.updateElement(id, dropzoneID, parentID, {
        //   payload: { background: color.hex }
        // });

    };
    console.log("defaultForm", defaultForm);
    if (!defaultForm) {
        return <></>;
    }
    return ([<CustomModal {...props} className={"page-editor-modal"} open={modal} onClose={e => toggleBox(e)} key={1}>{
        defaultForm.map((er, r) => {
            console.log('er', er);
            if (er.type === "color") {
                return <div className={'row'}><Color label={er.label} color={er.defaultValue || "#ccc"}
                                                     onChangeComplete={(e) => {
                                                         handleChangeComplete(e, er)
                                                     }}
                /></div>;
            } else if (er.type === "select-options") {
                return <select defaultValue={er.defaultValue || {}}
                               onChange={(e) => {
                                   handleChangeSelectComplete(e, er)
                               }}>
                    {er.children && er.children.map(ch => <option value={ch.value}>{ch.name}</option>)}
                </select>;
            } else if (er.type === "text") {
                return <input defaultValue={er.defaultValue} name={er.name} placeholder={er.label} onChange={(e) => {
                    er.onChange(e);
                    // handleChangeTextComplete(e, er)
                }}/>;
            } else if (er.type === "number") {
                return <input defaultValue={er.defaultValue} name={er.name} type={'number'} placeholder={er.label}
                              onChange={(e) => {
                                  handleChangeTextComplete(e, er)
                              }}/>;
            } else
                return <input defaultValue={er.defaultValue}/>;
        })

    }</CustomModal>,
        <Button onClick={(e) => toggleBox(e)} key={2}>
            <SettingsApplicationsIcon/>

        </Button>
    ]);
};
//
// DraggableLayout.propTypes = {
//   id: PropTypes.string.isRequired,
//   showBasicContent: PropTypes.bool.isRequired
// };

export default EditConfigOfElement;
