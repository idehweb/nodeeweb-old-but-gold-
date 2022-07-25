import {

    Datagrid,
    DateField,
    DeleteButton,
    TextField,
  useTranslate
} from 'react-admin';

import {List, SimpleForm} from '@/components';

export const smsList = (props) => {
  const translate = useTranslate();
  return(

    <List {...props}>
      <Datagrid>
        <TextField source="phoneNumber" label={translate('resources.sms.receiver')}/>
        <TextField source="message" label={translate('resources.sms.message')}/>
        <TextField source="status" label={translate('resources.sms.status')}/>
        <TextField source="from" label={translate('resources.sms.sender')}/>
        <DateField source="createdAt" showTime label={translate('resources.sms.createdAt')}/>
        <DateField source="updatedAt" showTime label={translate('resources.sms.updatedAt')}/>
        <DeleteButton />
      </Datagrid>
    </List>
  );
}

export default smsList;
