import React, {useState} from "react";
import {Draggable, Dropzone, state,} from "react-page-maker";
import Toolbar from "../Toolbar";
import {elements} from "../const";
import { unicID } from "@/functions/index";

const DraggableCol = (props) => {
    // const { defaultForm,id, dropzoneID, parentID,color,onChangeComplete,label } = props;
    console.log("props", props)
    // console.log('DraggableCol',props.payload.classNames)
    let defaltClassNames = 'col-md-4';
    if (props && props.payload && props.payload.classNames)
        defaltClassNames = props.payload.classNames
    const [theState, setTheState] = useState({
        showColorPicker: false,
        classNames: defaltClassNames
    });


    const handleChangeComplete = (e) => {
        console.log('handleChangeComplete', e.target.value)
        const {id, dropzoneID, parentID} = props;
        setTheState({...theState, classNames: e.target.value});
        // er.defaultValue=color.hex;
        // console.log('handleChangeComplete', color);
        // const { id, dropzoneID, parentID } = props;
        state.updateElement(id, dropzoneID, parentID, {
            payload: {classNames: e.target.value}
        });
        // setColor(color.hex);

        // props.updateElement(id, dropzoneID, parentID, {
        //   payload: { background: color.hex }
        // });

    };

    const _onDrop = (data, cb = () => {
    }) => {
        // no need to ask id and name again
        console.log("data ", data, cb)
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
            payload: {dropped: true}
        });
    };

    const {
        id, showBasicContent, showPreview,
        dropzoneID, parentID, name, payload,
        dropzoneProps,
        initialElements,
        ...rest
    } = props;


    const {
        classNames
    } = theState;
    console.log('className', classNames)
    // const background = state.background ||
    //     payload && payload.background || "#37d67a";

    if (showBasicContent) {
        return (
            <Draggable {...props} >
                {
                    <span>Draggable col</span>
                }
            </Draggable>
        );
    }

    if (showPreview) {
        return (
            <header className={classNames}>
                <h2 className="center-heading">kose nanat</h2>
            </header>
        );
    }
    console.log("dragableCol", props.payload)
    const filterInitialElements = (dID) => {
        return initialElements.filter(e => e.dropzoneID === dID) || [];
    };
    return (
        <div className={classNames}>

            <Draggable {...props} className={classNames}>
                <Toolbar  {...props} defaultForm={[
                    {
                        label: "className",
                        defaultValue: "col-md-4",
                        type: "text",
                        name: "className",
                        onChange: (e) => handleChangeComplete(e)
                    },
                ]}/>
                <Dropzone
                    {...dropzoneProps}
                    className="auto-col2"
                    initialElements={filterInitialElements("canvas-1-" + "1")}
                    id={"canvas-1-" + "1"}
                    onDrop={_onDrop}
                    placeholder="Drop Here"
                />
            </Draggable>
        </div>

    );


};
//
// DraggableCol.propTypes = {
//   id: PropTypes.string.isRequired,
//   showBasicContent: PropTypes.bool.isRequired
// };

export default DraggableCol;
