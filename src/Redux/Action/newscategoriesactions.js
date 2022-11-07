import {GETNEWSCATEGORIES, RESET} from '../Reducer/newscategoriesReducer';
import firestore from '@react-native-firebase/firestore';

export const getcategories = () => {
  return dispatch => {
    firestore()
      .collection('categories')
      .get()
      .then(response => {
        var categorylist = [];
        response.docs.map(each => {
          categorylist.push({label: each.data().name, value: each.id});
        });
        categorylist.push({label: 'select an item', value: null});
        dispatch({type: GETNEWSCATEGORIES, payload: categorylist});
      })
      .catch(error => {
        console.log('error', error);
        dispatch({type: GETNEWSCATEGORIES, payload: []});
      });
  };
};

export const resetCategories = () => {
  return dispatch => {
    dispatch({type: RESET, payload: []});
  };
};
