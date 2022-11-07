import {GETNEWSPOST} from '../Reducer/newspostsReducer';
import firestore from '@react-native-firebase/firestore';

export const getallnews = () => {
  return dispatch => {
    firestore()
      .collection('newposts')
      .get()
      .then(snapShot => {
        var rowData = [];
        snapShot.docs.map(eachDoc => {
          rowData.push({id: eachDoc.id, ...eachDoc.data()});
        });
        dispatch({type: GETNEWSPOST, payload: rowData});
      })
      .catch(error => {
        console.log('error', error);
        dispatch({type: GETNEWSPOST, payload: []});
      });
  };
};
