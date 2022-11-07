export const GETNEWSCATEGORIES = 'getnewscategories';
// const ADDNEWSPOST = 'getnewspost';
export const EDITNEWSCATEGORIES = 'editnewscategories';
// const DELETENEWSPOST = 'getnewspost';
export const NULLMSG = 'nullmsg';
export const RESET = 'reset';
const initValue = {
  newscategories: [],
  loading: false,
  msg: null,
};

const newscategoriesReducer = (state = initValue, action) => {
  console.log('action', action);
  if (action.type === GETNEWSCATEGORIES) {
    return {...state, newscategories: action.payload};
  }
  if (action.type === EDITNEWSCATEGORIES) {
    return {...state, msg: action.payload, loading: false};
  }
  if (action.type === NULLMSG) {
    return {...state, msg: null};
  }
  if (action.type === RESET) {
    return {...state, newscategories: [], loading: false, msg: null};
  }
  return state;
};
export default newscategoriesReducer;
