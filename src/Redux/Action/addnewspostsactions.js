import {ADDNEWSPOST} from '../Reducer/newspostsReducer';
import firestore from '@react-native-firebase/firestore';
import Moment from 'moment';
export const addnewposts = state => {
  console.log('add news data come here', state);
  return dispatch => {
    firestore()
      .collection('newposts')
      .doc(state.id)
      .set(
        {
          title: state.title || 'test',
          description: state.description || 'test',
          catName: state.catName || 'test',
          catID: state.catID || 'test',
          timeCreated: Moment().unix(),
          timeinHuman: Moment().format('DD-MM-YYYY'),
        },
        {merge: true},
      )
      .then(res => {
        dispatch({type: ADDNEWSPOST, payload: {}});
      })
      .catch(error => {
        dispatch({type: ADDNEWSPOST, payload: 'network_error'});
      });
  };
};
