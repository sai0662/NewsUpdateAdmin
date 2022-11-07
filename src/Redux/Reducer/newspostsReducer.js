export const GETNEWSPOST = 'getnewspost';
export const ADDNEWSPOST = 'addnewspost';
export const EDITNEWSPOST = 'editnewspost';
export const DELETENEWSPOST = 'getnewspost';

const initValue = {
  newsposts: [],
};

const newspostsReducer = (state = initValue, action) => {
  console.log('action', action);
  if (action.type === GETNEWSPOST) {
    return {...state, newsposts: action.payload};
  }
  if (action.type === ADDNEWSPOST) {
    return {...state, newsposts: action.payload};
  }
  if (action.type === EDITNEWSPOST) {
    return {...state, editposts: action.payload};
  }
  if (action.type === DELETENEWSPOST) {
    return {...state, editposts: action.payload};
  }
  return state;
};
export default newspostsReducer;
