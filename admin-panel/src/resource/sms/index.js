import smsList from "./smsList";
import smsCreate from "./smsCreate";
import { Send,Textsms } from "@mui/icons-material";

const Sms = {
  list: smsList,
  create: smsCreate,
  icon: Textsms,
  createIcon: Send,
};
export default Sms;