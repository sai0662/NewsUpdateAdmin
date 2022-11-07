/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  ActivityIndicator,
  ImageBackground,
  Alert,
} from 'react-native';
const Width = Dimensions.get('window').width;
import firestore from '@react-native-firebase/firestore';
import toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import {deletepost} from '../../../Redux/Action/deletenewspostsactios';
import {useSelector, useDispatch} from 'react-redux';
function Details({navigation, route, navigation: {goBack}}) {
  var id = route.params.id ? route.params.id : '';
  var title = route.params.title ? route.params.title : '';
  var description = route.params.description ? route.params.description : '';
  var image = route.params.image ? route.params.image : '';

  const [state, setState] = useState({
    loading: true,
    data: [],
    postData: [],
    commentsData: [],
    title: route.params.title,
    description: route.params.description,
    image: route.params.image,
  });
  const [visited, setVisited] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    if (route.params.id) {
      var myData = [];
      firestore()
        .collection('newposts')
        .get()
        .then(snapShot => {
          console.log('getData', getData);
          snapShot.docs.map(each => {
            console.log('data', each.data(), each.id);
            myData.push({...each.data(), id: each.id});
            setState(prev => ({...prev, loading: false, data: myData}));
          });
        })
        .catch(error => {
          console.log('error', error);
          toast.show('network problem', toast.LONG);
        });
    }
  };

  // const deleteDocument = id => {
  //   firestore()
  //     .collection('newposts')
  //     .doc(id)
  //     .delete()
  //     .then(() => {
  //       toast.show('post deleted successfully');
  //       getData();
  //     })
  //     .catch(error => {
  //       toast.show('Error to Delete');
  //     });
  // };

  //delete post
  const dispatch = useDispatch();
  const deleteDocument = id => {
    dispatch(deletepost(id));
    // firestore()
    //   .collection('ghosts')
    //   .doc(id)
    //   .delete()
    //   .then(() => {
    //     toast.show('post deleted successfully');
    //     getData();
    //   })
    //   .catch(error => {
    //     toast.show('Error to Delete');
    //   });
  };
  const preDelete = id => {
    Alert.alert('Alert', 'Are you sure, want to delete?', [
      {
        text: 'Cancel',
        onPress: () => {
          console.log('cancel pressed');
        },
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          deleteDocument(id);
        },
      },
    ]);
  };

  const UnRead = async id => {
    var tempVisited = visited;
    if (tempVisited.indexOf(id) !== tempVisited) {
      tempVisited.pop(id);
    }
    setVisited([...tempVisited]);

    try {
      var converttoString = JSON.stringify(tempVisited);
      await AsyncStorage.setItem('@visitedposts', converttoString);
    } catch (e) {
      console.log('error', e);
    }
    route.params.reloadData();
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.options}>
        <View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('EditPage', {
                id: id,
                title: title,
                description: description,
                image: image,
                reloadData: state.getData,
              })
            }>
            <Image
              style={styles.updateButton}
              source={require('../../../Assets/Images/update.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={{marginLeft: 20}}>
          <TouchableOpacity
            onPress={() => {
              preDelete(id);
            }}>
            <Image
              style={styles.deleteButton}
              source={require('../../../Assets/Images/delete.png')}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              UnRead(id);
            }}>
            <Text>unread</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.backButton}>
          <TouchableOpacity onPress={() => goBack()}>
            <Image
              style={styles.backButtonImage}
              source={require('../../../Assets/Images/back.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <View style={styles.detailsImageView}>
          {image !== '' && (
            <Image source={{uri: image}} style={styles.detailsImage} />
          )}
        </View>
        <ScrollView>
          <Text style={styles.Description}>{description}</Text>
        </ScrollView>
      </View>
    </View>
  );
}

export default Details;
