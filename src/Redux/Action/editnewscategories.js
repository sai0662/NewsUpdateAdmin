import {EDITNEWSCATEGORIES} from '../Reducer/newscategoriesReducer';
import firestore from '@react-native-firebase/firestore';

export const editCategory = ({label, id}) => {
  return dispatch => {
    firestore()
      .collection('categories')
      .doc(id)
      .update({label})
      .then(() => {
        dispatch({type: EDITNEWSCATEGORIES, payload: 'success'});
      })
      .catch(error => {
        dispatch({type: EDITNEWSCATEGORIES, payload: 'error'});
      });
  };
};
