/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */

import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import toast from 'react-native-simple-toast';
import auth from '@react-native-firebase/auth';
import styles from './styles';
import axios from 'axios';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
function Home({navigation, route, params}) {
  const [useData, setUserData] = useState(null);
  const [state, setState] = useState({
    loading: true,
    data: [],
    postData: [],
    commentsData: [],
  });
  const [current_user, set_current_user] = useState(null);
  const [visited, setVisited] = useState([]);

  useEffect(() => {
    getVisitedData();
    getData();
  }, []);

  //Getting Data from FireStore
  const getData = () => {
    var myData = [];
    firestore()
      .collection('newposts')
      .get()
      .then(snapShot => {
        console.log('getData', snapShot);
        snapShot.docs.map(each => {
          console.log('data', each.data(), each.id);
          myData.push({...each.data(), id: each.id});
          setState(prev => ({...prev, loading: false, data: myData}));
        });
      })
      .catch(error => {
        console.log('error', error);
        setState(prev => ({...prev, loading: false}));
        toast.show('network problem', toast.LONG);
      });
  };

  // Going to Details Page
  const visitDetail = async (id, description, title, image, getData) => {
    var tempVisited = visited;
    if (tempVisited.indexOf(id) === -1) {
      tempVisited.push(id);
    }
    setVisited([...tempVisited]);

    try {
      var converttoString = JSON.stringify(tempVisited);
      await AsyncStorage.setItem('@visitedposts', converttoString);
    } catch (e) {
      console.log('error', e);
    }

    navigation.navigate(
      'Details',
      {
        id: id,
        description: description,
        title: title,
        image: image,
      },
      {reloadData: getData},
    );
  };

  const getVisitedData = async () => {
    try {
      let jsonValue = await AsyncStorage.getItem('@visitedposts');
      if (jsonValue !== null) {
        jsonValue = JSON.parse(jsonValue);
        setVisited(jsonValue);
      }
    } catch (e) {
      console.log('error', e);
    }
  };

  useEffect(() => {
    console.log('visited', visited);
  }, [visited]);

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
  };

  const Signout = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out'));
    GoogleSignin.signOut();
    set_current_user(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', padding: 10}}>
        <TouchableOpacity
          // onPress={() => auth().signOut()}
          onPress={Signout}
          style={{
            width: 52,
            height: 50,
            marginLeft: 4,
            marginTop: 2,
            borderWidth: 1,
            borderRadius: 30,
            borderColor: 'orange',
          }}>
          <Image
            source={require('../../../Assets/Images/userpro.png')}
            style={{width: '100%', height: '100%', borderRadius: 30}}
          />
        </TouchableOpacity>

        <View
          style={{
            width: '80%',
            height: 55,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 12,
            borderRadius: 20,
            padding: 5,
            backgroundColor: 'orange',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 20, color: 'white'}}>
            News Updates
          </Text>
        </View>
      </View>
      <View style={{padding: 12}}>
        <Text style={{color: 'orange', fontWeight: 'bold', fontSize: 16}}>
          Trending News
        </Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPost', {reloadData: getData})}>
        <Image
          style={styles.addButtonImage}
          source={require('../../../Assets/Images/add.jpeg')}
        />
      </TouchableOpacity>
      {state.loading && <ActivityIndicator size="large" color="blue" />}
      <ScrollView>
        {state.data.map(data => (
          <TouchableOpacity
            onPress={() => {
              visitDetail(data.id, data.description, data.title, data.image),
                {reloadData: getData};
            }}
            key={data.id}>
            <View
              style={[
                styles.postView,
                {
                  backgroundColor:
                    visited.indexOf(data.id) !== -1 ? 'lightblue' : 'white',
                },
              ]}>
              <View style={styles.titleview}>
                <Text style={styles.titleText}>{data.title}</Text>
              </View>
              <Text style={{color: 'green'}}>{data.catName}</Text>
              {/* <View
                style={{
                  width: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                }}>
                <TouchableOpacity onPress={() => UnRead(data.id)}>
                  <Text
                    style={{
                      color: visited.indexOf(data.id) !== -1 ? 'green' : 'red',
                    }}>
                    {visited.indexOf(data.id) !== -1 ? 'read' : 'unread'}
                  </Text>
                </TouchableOpacity>
              </View> */}
              <View style={styles.description}>
                <View style={styles.descriptionView}>
                  <Text style={styles.descriptionText}>{data.description}</Text>
                </View>
                <View style={styles.ImageView}>
                  <Image source={{uri: data.image}} style={styles.ImageSize} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default Home;
