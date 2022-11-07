import {EDITNEWSPOST} from '../Reducer/newspostsReducer';
import firestore from '@react-native-firebase/firestore';

export const editnewsposts = (title, description, catName) => {
  return dispatch => {
    firestore()
      .collection('newposts')
      .update({
        title,
        description,
        catName,
      })
      .then(() => {
        dispatch({type: EDITNEWSPOST, payload: 'sucess_updated'});
      })
      .catch(error => {
        dispatch({type: EDITNEWSPOST, payload: 'error_update'});
      });
  };
};
