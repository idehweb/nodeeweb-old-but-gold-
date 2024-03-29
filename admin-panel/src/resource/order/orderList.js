import {
  Datagrid,
  EditButton,
  Filter,
  FunctionField,
  ListContextProvider,
  NumberField,
  Pagination,
  SearchInput,
  SelectField,
  SelectInput,
  TextField,
  TextInput,
  useListContext,
  useTranslate
} from "react-admin";
import { Divider, Tab, Tabs } from "@mui/material";
import { Chip } from "@mui/material";


import {
  List,
  OrderPaymentStatus,
  OrderStatus,
  OrderTabs,
  PrintOrder,
  PrintPack,
  SimpleForm,
  StatusField,
  PaymentStatusField
} from "@/components";
import { dateFormat } from "@/functions";
import { BASE_URL } from "@/functions/API";
import React, { Fragment, useCallback, useEffect, useState } from "react";

const PostPagination = props => <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />;

export const orderList = (props) => {
  const translate = useTranslate();

  return (
    <List {...props} filters={
      <Filter {...props}>
        <SearchInput source="search" placeholder={translate("resources.order.orderNumberOrMobileNumber")} alwaysOn/>
        <TextInput source="firstName" label={translate("resources.order.customerFirstName")}
                   placeholder={translate("resources.order.customerFirstName")}/>
        <TextInput source="lastName" label={translate("resources.order.customerLastName")}
                   placeholder={translate("resources.order.customerLastName")}/>
        <SelectInput source="paymentStatus" label={translate("resources.order.paymentStatus")}
                     emptyValue={null}
                     choices={OrderPaymentStatus()} alwaysOn/>
      </Filter>
    } pagination={<PostPagination/>}>
      <TabbedDatagrid/>

    </List>
  );
};

const TabbedDatagrid = (props) => {
  const listContext = useListContext();
  const { ids, filterValues, setFilters, displayedFilters } = listContext;
  const translate = useTranslate();

  const [cart, setCart] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [indoing, setIndoing] = useState([]);
  const [makingready, setMakingready] = useState([]);
  const [inpeyk, setInpeyk] = useState([]);
  const [cancel, setCancel] = useState([]);
  const [complete, setComplete] = useState([]);
  const [checkout, setCheckout] = useState([]
  );

  const totals = 0;

  useEffect(() => {
    if (ids && ids !== filterValues.status) {
      switch (filterValues.status) {
        case "processing":
          setProcessing(ids);
          break;
        case "indoing":
          setIndoing(ids);
          break;
        case "makingready":
          setMakingready(ids);
          break;
        case "inpeyk":
          setInpeyk(ids);
          break;
        case "cancel":
          setCancel(ids);
          break;
        case "complete":
          setComplete(ids);
          break;
      }
    }
  }, [ids, filterValues.status]);

  const handleChange = useCallback(
    (event, value) => {
      setFilters &&
      setFilters(
        { ...filterValues, status: value },
        displayedFilters
      );
    },
    [displayedFilters, filterValues, setFilters]
  );
  console.clear();
// console.log('filterValues.status',filterValues.status);
console.log('props',props);
  return (
    <Fragment>
      <Tabs
        variant="fullWidth"
        centered
        value={filterValues.status}
        indicatorColor="primary"
        onChange={handleChange}
      >
        {OrderTabs().map(choice => (
          <Tab
            key={choice.id}
            label={
              totals[choice.name]
                ? `${choice.name} (${totals[choice.name]})`
                : choice.name
            }
            value={choice.id}
          />
        ))}
      </Tabs>
      <Divider/>

      <div>
        <ListContextProvider
          value={{ ...listContext, ids: cart }}
        >
          <Datagrid {...props} optimized rowClick="edit">
            <TextField source="orderNumber" label={translate("resources.order.orderNumber")}/>
            <FunctionField label={translate("resources.order.customerData")}
                           render={record => (
                             <div className='theDate'>
                               {record.customer && <div>{record.customer.firstName && <div>
                                 {record.customer.firstName}
                               </div>}


                                 {record.customer.lastName && <div>
                                   {record.customer.lastName}
                                 </div>}
                                 {record.customer.phoneNumber &&
                                 <a href={"/#/customer/" + record.customer._id}>{record.customer.phoneNumber}</a>}

                               </div>}

                               {(!record.customer && record.customer_data) && <div>
                                 {(record.customer_data.firstName) &&
                                 <div>
                                   {record.customer_data.firstName}
                                 </div>}
                                 {(record.customer_data.lastName) &&
                                 <div>
                                   {record.customer_data.lastName}
                                 </div>}
                               </div>}


                             </div>
                           )}/>
            <NumberField source="sum" label={translate("resources.order.total")}/>
            <NumberField source="amount" label={translate("resources.order.paid")}/>

              <FunctionField label={translate("resources.order.status")}
                             render={record => {
                               console.log("record",record);
                               return(<Chip source="status" className={record.status} label={translate("pos.OrderStatus."+record.status)}/>)
                             }}/>
              <FunctionField label={translate("resources.order.paymentStatus")}
                             render={record => {
                               console.log("record",record);
                               return(<Chip source="paymentStatus" className={record.paymentStatus} label={translate("pos.OrderPaymentStatus."+record.paymentStatus)}/>)
                             }}/>
            {/*<SelectField source="status" choices={OrderStatus()}*/}
                         {/*label={translate("resources.order.status")} optionText={<StatusField/>}*/}
            {/*/>*/}
            {/*<SelectField source="paymentStatus" choices={OrderPaymentStatus()}*/}
                         {/*label={translate("resources.order.paymentStatus")} optionText={<PaymentStatusField/>}*/}
            {/*/>*/}

            <FunctionField label={translate("resources.order.date")}
                           render={record => (
                             <div className='theDate'>
                               <div>
                                 {translate("resources.order.createdAt") + ": " + `${dateFormat(record.createdAt)}`}
                               </div>
                               <div>
                                 {translate("resources.order.updatedAt") + ": " + `${dateFormat(record.updatedAt)}`}
                               </div>

                             </div>
                           )}/>

            <EditButton/>
          </Datagrid>
        </ListContextProvider>

      </div>

    </Fragment>
  );
};


export default orderList;
