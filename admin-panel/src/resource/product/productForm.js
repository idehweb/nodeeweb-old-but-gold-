import {
    ArrayInput,
    BooleanInput,
    DeleteButton,
    FormDataConsumer,
    NumberInput,
    SaveButton,
    SelectInput,
    showNotification,
    SimpleFormIterator,
    TextInput,
    Toolbar,
    useForm,
    useNotify,
    useRedirect,
    useTranslate
} from "react-admin";
import {useFormContext} from 'react-hook-form';
import API from "@/functions/API";
import {dateFormat} from "@/functions";
import {
    CatRefField,
    Combinations,
    EditOptions,
    FileChips,
    FormTabs,
    List,
    ProductType,
    ShowDescription,
    showFiles,
    ShowLink,
    ShowOptions,
    ShowPictures,
    SimpleForm,
    SimpleImageField,
    StockStatus,
    UploaderField
} from "@/components";
import {Val} from "@/Utils";
import React from "react";
import {RichTextInput} from "ra-input-rich-text";

// import { RichTextInput } from 'ra-input-rich-text';
// import {ImportButton} from "react-admin-import-csv";
let combs = [];

let valuess = {"photos": [], "files": [], thumbnail: "", combinations: []};
let _The_ID = null;
console.log("_The_ID", _The_ID)

function setPhotos(values) {

    // let {values} = useFormState();
    console.log("setPhotos", values);
    valuess["photos"] = values;
    // setV(!v);
    // this.forceUpdate();
}

function returnToHome(values) {
    console.log('returnToHome', values);
    if (values["firstCategory"])
        valuess["firstCategory"] = values["firstCategory"];
    if (values["secondCategory"])
        valuess["secondCategory"] = values["secondCategory"];
    if (values["thirdCategory"])
        valuess["thirdCategory"] = values["thirdCategory"];
}

function onCreateCombinations(options) {
    // console.log('onCreateCombinations', options);
    let combCount = 1;
    let combinationsTemp = [];
    let combinations = [];
    let counter = 0;
    options.forEach((opt, key) => {
        let optemp = {};
        let theVals = [];
        opt.values.forEach((val, key2) => {
            theVals.push({[opt.name]: val.name});

        });
        combinationsTemp.push(theVals);

    });
    // console.log('combinationsTemp', combinationsTemp);
    let ttt = cartesian(combinationsTemp);
    // console.log('ttt', ttt);

    ttt.forEach((tt, key) => {
        let obj = {};
        tt.forEach((ther, key) => {
            // obj[key]=ther;
            Object.assign(obj, ther);
        });
        combinations.push({
            id: key,
            options: obj,
            in_stock: false,
            price: null,
            salePrice: null,
            quantity: 0
        });

    });
    // (id, path, rowRecord) => form.change('combinations', combinations)
    // console.log('combinations', combinations);
    combs = combinations;
    return combinations;

}

function cartesian(args) {
    let r = [], max = args.length - 1;

    function helper(arr, i) {
        for (let j = 0, l = args[i].length; j < l; j++) {
            let a = arr.slice(0); // clone arr
            a.push(args[i][j]);
            if (i === max)
                r.push(a);
            else
                helper(a, i + 1);
        }
    }

    helper([], 0);
    return r;
}

function returnCatsValues() {
    console.log('returnCatsValues', values);
    return ({
        firstCategory: valuess["firstCategory"],
        secondCategory: valuess["secondCategory"],
        thirdCategory: valuess["thirdCategory"]
    });
}

function thel(values) {
    return new Promise(resolve => {
        console.log("change photos field", values);

        valuess["photos"] = values;
        resolve(values);
    }, reject => {
        reject(null);
    });

    // console.log(values);

}

function theP(values) {
    console.log("change thumbnail field", values);
    valuess["thumbnail"] = values;
    // console.log(values);

}

function thelF(values) {
    // console.log('change files field', values);

    valuess["files"].push({
        url: values
    });
    // console.log(values);

}


function CombUpdater(datas) {
    console.log("datas", datas);
    valuess["combinations"] = datas;
}

function OptsUpdater(datas) {
    console.log("datas", datas);
    valuess["options"] = datas;
}


const CustomToolbar = props => {
    const notify = useNotify();
    const {reset} = useFormContext();
    const redirect = useRedirect();

    const transform = (data, {previousData}) => {

        console.log('transformProduct()...');

        if (valuess.firstCategory) {
            // console.log('let us set firstCategory');
            values.firstCategory = valuess.firstCategory;

        }
        if (valuess.secondCategory) {
            // console.log('let us set secondCategory');

            values.secondCategory = valuess.secondCategory;

        }
        if (valuess.thirdCategory) {
            // console.log('let us set thirdCategory');

            values.thirdCategory = valuess.thirdCategory;

        }
        if (valuess.thumbnail) {
            values.thumbnail = valuess.thumbnail;

        }
        console.log('values', values);
        return values;
    }
    let {record} = props;

//     function save(e) {
//         // console.clear();
//         let values = record;
//         console.log('save function ()...');
//         // const translate = useTranslate();
// // console.clear();
// // console.log('save');
//         // let {values} = useFormState();
// // console.clear();
// //     console.log('product values', values);
// //     console.log('product valuess', valuess);
//         // dataProvider.createOne(values).then(()=>{
//         //     console.log('hell yeah');
//         // })
//         // return;
//         // values={...valuess};
//         if (valuess.firstCategory) {
//             // console.log('let us set firstCategory');
//             values.firstCategory = valuess.firstCategory;
//
//         }
//         if (valuess.secondCategory) {
//             // console.log('let us set secondCategory');
//
//             values.secondCategory = valuess.secondCategory;
//
//         }
//         if (valuess.thirdCategory) {
//             // console.log('let us set thirdCategory');
//
//             values.thirdCategory = valuess.thirdCategory;
//
//         }
//         if (valuess.thumbnail) {
//             values.thumbnail = valuess.thumbnail;
//
//         }
//         // if (valuess.photos) {
//         //   values.photos = valuess.photos;
//         //   // valuess['photos']
//         // }
//         // if (valuess.combinations) {
//         //   values.combinations = valuess.combinations;
//         //   // valuess['photos']
//         // }
//
//         console.log("values after edit: ", values);
//         return;
//         if (values._id) {
//             // delete values.photos;
//             delete values.questions;
//             delete values.nextproduct;
//             delete values.category;
//             delete values.catChoosed;
//             delete values.files;
//             console.log("last values (edit): ", values);
//
//             API.put("/product/" + values._id, JSON.stringify({...values}))
//                 .then(({data = {}}) => {
//                     // const refresh = useRefresh();
//                     // refresh();
//                     // alert('it is ok');
//                     redirect(false);
//                     // showNotification(translate('product.updated'));
//                     // window.location.reload();
//                     if (data.success) {
//                         values = [];
//                         valuess = [];
//                     }
//                 })
//                 .catch((err) => {
//                     console.log("error", err);
//                 });
//         }
//         else {
//             if (valuess.photos) {
//                 values.photos = valuess.photos;
//             }
//             if (valuess.files) {
//                 values.files = valuess.files;
//             }
//             API.post("/product/", JSON.stringify({...values}))
//                 .then(({data = {}}) => {
//                     // showNotification(translate('product.created'));
//                     // console.clear()
//                     console.log("data", data);
//                     if (data._id) {
//                         // window.location.reload()
//                         window.location.href = "/#/product/" + data._id;
//                         // values = [];
//                         // valuess = [];
//                     }
//                 })
//                 .catch((err) => {
//                     console.log("error", err);
//                 });
//         }
//     }

    return (
        <Toolbar {...props} className={"dfghjk"}>
            <SaveButton alwaysEnable
                        redirect={false}
                // onClick={(e) => save(e)}
                        edit={"edit"}
                        mutationMode={'pessimistic'}
                        transform={transform}
            />
            <DeleteButton mutationMode="pessimistic"/>
        </Toolbar>
    );
}

const Form = ({children, ...props}) => {
    console.clear()
    // console.log("vprops", props);
    const {record} = props;
    // if (!record) return null;
    const translate = useTranslate();
    const notify = useNotify();
    if (record && record._id) {
        console.log("_id set")
        _The_ID = record._id;
    }
    if (record && record.photos) {
        valuess['photos'] = record.photos;
    }
    if (record && record.thumbnail) {
        valuess['thumbnail'] = record.thumbnail;
    }
    // const {reset} = useFormContext();
    const redirect = useRedirect();
    const transform = (data, {previousData}) => {
        console.log("transform={transform}", data, {previousData})

        return ({
            ...data,
            // firstCategory: "61d58e37d931414fd78c7fb7"
        });
    }
    // const notify = useNotify();
    // const {reset} = useFormContext();
    //
    console.log("_The_ID", _The_ID)

    function save(values) {
        // console.clear();
        // let values = record;
        console.log('save function ()...');

        if (valuess.firstCategory) {
            // console.log('let us set firstCategory');
            values.firstCategory = valuess.firstCategory;

        }
        if (valuess.secondCategory) {
            // console.log('let us set secondCategory');

            values.secondCategory = valuess.secondCategory;

        }
        if (valuess.thirdCategory) {
            // console.log('let us set thirdCategory');

            values.thirdCategory = valuess.thirdCategory;

        }
        if (valuess.thumbnail) {
            values.thumbnail = valuess.thumbnail;

        }
        if (valuess.photos) {
            values.photos = valuess.photos;
            // valuess['photos']
        }
        // if (valuess.combinations) {
        //   values.combinations = valuess.combinations;
        //   // valuess['photos']
        // }

        console.log("values after edit: ", values);
        // return;
        if (_The_ID) {
            // delete values.photos;
            delete values.questions;
            delete values.nextproduct;
            delete values.category;
            delete values.catChoosed;
            delete values.files;
            console.log("last values (edit): ", values);

            API.put("/product/" + _The_ID, JSON.stringify({...values}))
                .then(({data = {}}) => {
                    // const refresh = useRefresh();
                    // refresh();
                    // alert('it is ok');
                    notify("saved");
                    redirect(false);
                    // showNotification(translate('product.updated'));
                    // window.location.reload();
                    if (data.success) {
                        values = [];
                        valuess = [];
                    }
                })
                .catch((err) => {
                    console.log("error", err);
                });
        }
        else {
            if (valuess.photos) {
                values.photos = valuess.photos;
            }
            if (valuess.files) {
                values.files = valuess.files;
            }
            API.post("/product/", JSON.stringify({...values}))
                .then(({data = {}}) => {
                    // showNotification(translate('product.created'));
                    // console.clear()
                    console.log("data", data);
                    if (data._id) {
                        _The_ID = data._id;
                        window.location.href = "/#/product/" + _The_ID;
                        window.location.reload()

                        // values = [];
                        // valuess = [];
                    }
                })
                .catch((err) => {
                    console.log("error", err);
                });
        }
    }

    let ST = StockStatus() || [];
    ST.map(item => {
        item.id = item.value;
        item.name = item.label;
        // delete item.value;
        // delete item.label;
        return item;
    });
    console.log(ST)
    const totals = 0;
    // toolbar={<CustomToolbar/>}
    console.log('Form props', props);
    console.log("_The_ID", _The_ID)

    return (

        <SimpleForm
            {...props}
            transform={transform}
            onSubmit={v => save(v)}
            toolbar={<CustomToolbar record={props.record}/>}
            className={"d-flex"}>
            {children}

            <TextInput source={"title." + translate("lan")} label={translate("resources.product.title")}
                       className={"width100 mb-20"} validate={Val.req} fullWidth/>

            <TextInput

                source="slug" label={translate("resources.product.slug")} className={"width100 mb-20 ltr"}
                fullWidth/>
            <TextInput fullWidth source={"keywords." + translate("lan")}
                       label={translate("resources.product.keywords")}/>
            <TextInput multiline fullWidth source={"metadescription." + translate("lan")}
                       label={translate("resources.product.metadescription")}/>

            <TextInput multiline fullWidth source={"excerpt." + translate("lan")}
                       label={translate("resources.product.excerpt")}/>
            <RichTextInput multiline fullWidth source={"description." + translate("lan")}
                           label={translate("resources.product.description")}/>

            <div className={"mb-20"}/>
            <BooleanInput source="story" label={translate("resources.product.story")}/>
            <TextInput source={"miniTitle." + translate("lan")} label={translate("resources.product.miniTitle")}/>

            <CatRefField label={translate("resources.product.firstCategory")} returnToHome={returnToHome}
                         returnCatsValues={returnCatsValues}
                // record={record}
                         source="firstCategory"
                         reference="category"
                         url={"/category/f/0/1000"} surl={"/category/s"}/>


            <div className={"mb-20"}/>

            <SelectInput
                label={translate("resources.product.type")}
                fullWidth
                className={"mb-20"}
                source="type"
                choices={ProductType()}

            />


            <div className={"mb-20"}/>

            <FormDataConsumer>
                {({formData = {}, ...rest}) => {
                    console.log("formData.type", formData.type);
                    // {/*// console.log('rendering???',formData);*/}
                    if (formData.type == "variable")
                        return [<EditOptions key={0} record={formData} onCreateCombinations={onCreateCombinations}
                                             formData={formData}
                                             type={formData.type} updater={OptsUpdater}/>,
                            <Combinations
                                key={1}
                                record={formData}
                                theST={ST}
                                source="combinations" updater={() => {
                            }}/>]
                    if (formData.type == "normal")
                        return [<div className={"row mb-20"} key={0}>
                            <div className={"col-md-6"}>
                                <SelectInput
                                    fullWidth

                                    label={translate("resources.product.stock")}
                                    // record={scopedFormData}
                                    source={"in_stock"}

                                    choices={ST}
                                    // formClassName={cls.f2}
                                    {...rest}
                                />
                            </div>
                            <div className={"col-md-6"}>
                                <NumberInput
                                    fullWidth

                                    source={"quantity"}

                                    label={translate("resources.product.quantity")}
                                    // record={scopedFormData}
                                    {...rest}
                                />
                            </div>
                        </div>,
                            <div className={"row mb-20"} key={1}>
                                <div className={"col-md-6"}>
                                    <TextInput
                                        fullWidth
                                        // record={scopedFormData}

                                        source={"price"}
                                        className={"ltr"}

                                        label={translate("resources.product.price")}
                                        format={v => {
                                            if (!v) return;

                                            return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        }}
                                        parse={v => {
                                            if (!v) return;

                                            return v.toString().replace(/,/g, "");

                                        }}
                                        {...rest}
                                    />
                                </div>
                                <div className={"col-md-6"}>
                                    <TextInput
                                        fullWidth
                                        // record={scopedFormData}

                                        source={"salePrice"}
                                        className={"ltr"}

                                        label={translate("resources.product.salePrice")}
                                        format={v => {
                                            if (!v) return;

                                            return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        }}
                                        parse={v => {
                                            if (!v) return;

                                            return v.toString().replace(/,/g, "");

                                        }}
                                        {...rest}
                                    />
                                </div>
                            </div>,
                            <div className={"row mb-20"} key={2}>
                                <div className={"col-md-3"}>
                                    <TextInput
                                        fullWidth
                                        // record={scopedFormData}

                                        source={"source"}
                                        className={"ltr"}

                                        label={translate("resources.product.source")}

                                        {...rest}
                                    />
                                </div>
                                <div className={"col-md-3"}>
                                    <TextInput
                                        fullWidth
                                        // record={scopedFormData}

                                        source={"minPrice"}
                                        className={"ltr"}

                                        label={translate("resources.product.minPrice")}
                                        format={v => {
                                            if (!v) return;

                                            return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        }}
                                        parse={v => {
                                            if (!v) return;

                                            return v.toString().replace(/,/g, "");

                                        }}
                                        {...rest}
                                    />
                                </div>
                                <div className={"col-md-3"}>
                                    <TextInput
                                        fullWidth
                                        // record={scopedFormData}

                                        source={"maxPrice"}
                                        className={"ltr"}

                                        label={translate("resources.product.maxPrice")}
                                        format={v => {
                                            if (!v) return;

                                            return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        }}
                                        parse={v => {
                                            if (!v) return;

                                            return v.toString().replace(/,/g, "");

                                        }}
                                        {...rest}
                                    />
                                </div>
                                <div className={"col-md-3"}>
                                    <TextInput
                                        fullWidth
                                        // record={scopedFormData}

                                        source={"formula"}
                                        className={"ltr"}

                                        label={translate("resources.product.formula")}

                                        {...rest}
                                    />
                                </div>

                            </div>];

                }}
            </FormDataConsumer>

            {/*<EditOptions*/}
            {/*// record={record}*/}
            {/*onCreateCombinations={onCreateCombinations} updater={OptsUpdater}/>*/}


            {/*<ShowPictu  <EditOptions ros" thep={theP} setPhotos={setPhotos}/>*/}


            <UploaderField
                label={translate("resources.product.photo")}
                accept="image/*"
                source="photos"
                multiple={true}
                thep={theP}
                setPhotos={setPhotos}
                inReturn={thel}
            />

            <div className={"mb-20"}/>

            <ArrayInput source="extra_attr"
                        label={translate("resources.product.extra_attr")}
            >
                <SimpleFormIterator {...props}>

                    <FormDataConsumer>
                        {({getSource, scopedFormData}) =>
                            ([
                                    <div className={"mb-20"}/>,

                                    <TextInput
                                        fullWidth
                                        source={getSource("title")}
                                        label={translate("resources.product.title")}

                                        record={scopedFormData}
                                    />,
                                    <TextInput
                                        fullWidth
                                        source={getSource("des")}
                                        label={translate("resources.product.description")}


                                        record={scopedFormData}
                                    />]
                            )
                        }
                    </FormDataConsumer>
                </SimpleFormIterator>
            </ArrayInput>
            <ArrayInput source="labels" label={translate("resources.product.labels")}>
                <SimpleFormIterator {...props}>

                    <FormDataConsumer>
                        {({getSource, scopedFormData}) =>
                            (
                                <TextInput
                                    fullWidth
                                    source={getSource("title")}

                                    label={translate("resources.product.title")}

                                    record={scopedFormData}
                                />
                            )
                        }
                    </FormDataConsumer>
                </SimpleFormIterator>
            </ArrayInput>


            <SelectInput
                label={translate("resources.product.status")}

                source="status"
                choices={[
                    {id: "published", name: translate("resources.product.published")},
                    {id: "processing", name: translate("resources.product.processing")},
                    {id: "deleted", name: translate("resources.product.deleted")}
                ]}
            />

        </SimpleForm>
    );
};


export default Form;
