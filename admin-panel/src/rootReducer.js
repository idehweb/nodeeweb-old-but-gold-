import { combineReducers } from 'redux';
import  FriendListReducer  from './FriendListReducer';

export default combineReducers({
  friends: FriendListReducer
});
