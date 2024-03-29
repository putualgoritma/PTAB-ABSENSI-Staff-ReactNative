import {combineReducers} from 'redux';

// initialState = {
//     name : 'prawito Huduro'
// }

const User = {};
const UserReducer = (state = User, action) => {
  if (action.type === 'SET_DATA_USER') {
    state = action.value;
    // console.log('action user',action.value);
  }
  return state;
};

const Token = '';

const TokenReducer = (state = Token, action) => {
  if (action.type === 'SET_DATA_TOKEN') {
    state = action.value;
    // console.log('action token',action.value);
  }
  return state;
};

const Permission = '';

const PermissionReducer = (state = Permission, action) => {
  if (action.type === 'SET_DATA_PERMISSION') {
    state = action.value;
    // console.log('action token',action.value);
  }
  return state;
};

// untuk android
const HightAccuracy = false;
// untuk ios
// const HightAccuracy = true;

const HightAccuracyReducer = (state = HightAccuracy, action) => {
  if (action.type === 'SET_DATA_HIGHTACCURACY') {
    state = action.value;
    // console.log('action token',action.value);
  }
  return state;
};

const reducer = combineReducers({
  UserReducer,
  TokenReducer,
  PermissionReducer,
  HightAccuracyReducer,
});

export default reducer;
