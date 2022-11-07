import {DELETENEWSPOST} from '../Reducer/newspostsReducer';
import firestore from '@react-native-firebase/firestore';

export const deletepost = id => {
  //console.log('add news data come here', id);
  return dispatch => {
    firestore()
      .collection('newposts')
      .doc(id)
      .delete()
      .then(() => {
        dispatch({type: DELETENEWSPOST, payload: 'deleted successfully'});
      })
      .catch(error => {
        dispatch({type: DELETENEWSPOST, payload: 'error'});
      });
  };
};
