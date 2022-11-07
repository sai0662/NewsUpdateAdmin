/* eslint-disable react-hooks/exhaustive-deps */
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import _, {each} from 'lodash';
import DropDownPicker from 'react-native-dropdown-picker';
import {getallnews} from '../../../Redux/Action/newspostsactions';
import {
  resetCategories,
  getcategories,
} from '../../../Redux/Action/newscategoriesactions';
import {useSelector, useDispatch} from 'react-redux';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
function Home({navigation, route, params}) {
  //redux dispatch
  // const posts = useSelector(state => {
  //   console.log('from selector', state);
  //   return state.posts.newsposts;
  // });
  const posts = useSelector(state => state.posts.newsposts);
  const dispatch = useDispatch();
  //dispatch(getallnews);

  const [data, setData] = useState({loading: true}, []);
  const [visited, setVisited] = useState([]);
  const [filteredPosts, set_filteredPosts] = useState([]);
  const [valuePicker, set_valuePicker] = useState([]);
  useEffect(() => {
    if (posts.length > 0) {
      set_filteredPosts([...posts]);
    }
  }, [posts]);
  useEffect(() => {
    if (valuePicker.length > 0) {
      let filtered_posts = _.filter(posts, posts =>
        _.includes(valuePicker, posts.catID),
      );
      set_filteredPosts([...filtered_posts]);
    } else {
      set_filteredPosts([...posts]);
    }
  }, [valuePicker]);

  useEffect(() => {
    getVisitedData();
  }, [visited]);
  useEffect(() => {
    getVisitedData();
    getData();
    dispatch(getallnews());
    dispatch(getcategories());
  }, []);

  //getData from firestore

  const getData = () => {
    var rowData = [];
    firestore()
      .collection('newposts')
      .get()
      .then(snapShot => {
        snapShot.docs.map(eachDoc => {
          rowData.push({id: eachDoc.id, ...eachDoc.data()});
        });
        setData(rowData);
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  ///visted data get

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

  //filters
  //dropdown for categorylist

  const renderItem = ({item, index}) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            visitDetail(item.id, item.description, item.title, item.image),
              {reloadData: getData};
          }}
          key={item.id}>
          <View
            style={[
              styles.postView,
              {
                backgroundColor:
                  visited.indexOf(item.id) !== -1 ? 'lightblue' : 'white',
              },
            ]}>
            <View style={styles.titleview}>
              <Text style={styles.titleText}>{item.title}</Text>
            </View>
            <Text style={{color: 'green'}}>{item.catName}</Text>
            <View style={styles.description}>
              <View style={styles.descriptionView}>
                <Text style={styles.descriptionText}>{item.description}</Text>
              </View>
              <View style={styles.ImageView}>
                <Image source={{uri: item.image}} style={styles.ImageSize} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  //model for category creating

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  //const [items, setItems] = useState([]);
  const items = useSelector(state => state.categories.newscategories);
  // useEffect(() => {
  //   SelectCategories();
  // }, []);
  // const SelectCategories = () => {
  //   firestore()
  //     .collection('categories')
  //     .get()
  //     .then(response => {
  //       var categorylist = [];
  //       response.docs.map(each => {
  //         categorylist.push({label: each.data().name, value: each.id});
  //       });
  //       setItems([...categorylist]); //?Adding to dropdownlist
  //     })
  //     .catch(error => {
  //       console.log('error', error);
  //     });
  // };

  useEffect(() => {
    if (value.length !== 0) {
      categoryFilter();
      console.log('Value of Array:', value);
    }
  });
  const categoryFilter = () => {
    firestore()
      .collection('newposts')
      .where('catID', 'in', value)
      .get()
      .then(response => {
        var selectcategory = [];
        response.docs.map(each => {
          selectcategory.push(each.data());
        });
        setData(selectcategory);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', padding: 10}}>
        <TouchableOpacity
          // onPress={Signout}
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
          <TouchableOpacity>
            <Text style={{fontWeight: 'bold', fontSize: 20, color: 'white'}}>
              News Updates
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{padding: 12, flexDirection: 'row'}}>
        <View
          style={{
            width: '65%',
            // borderWidth: 1,
            // borderRadius: 12,
            // borderColor: 'orange',
          }}>
          <DropDownPicker
            placeholder="Select Category..."
            multiple={true}
            min={0}
            max={5}
            showBadgeDot={true}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            //setItems={setItems}
            mode="BADGE"
            badgeDotColors={[
              '#E76F51',
              '#00B4D8',
              '#E9C46A',
              '#E76F51',
              '#8AC926',
              '#00B4D8',
              '#E9C46A',
            ]}
          />
        </View>
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddCategory')}
            style={{
              marginLeft: 8,
              //marginTop: 2,
              //borderWidth: 1,
              padding: 10,
              borderRadius: 10,
              borderColor: 'orange',
              height: 50,
              backgroundColor: 'orange',
            }}>
            <Text
              style={{
                marginTop: 4,
                color: '#fff',
                fontSize: 14,
                fontWeight: '600',
              }}>
              Add
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate('categorilist')}
            style={{
              marginLeft: 2,
              //marginTop: 2,
              //borderWidth: 1,
              padding: 10,
              borderRadius: 10,
              borderColor: 'orange',
              height: 50,
              backgroundColor: 'orange',
            }}>
            <Text
              style={{
                marginTop: 4,
                color: '#fff',
                fontSize: 14,
                fontWeight: '600',
              }}>
              Category
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPost', {reloadData: getData})}>
        <Image
          style={styles.addButtonImage}
          source={require('../../../Assets/Images/add.jpeg')}
        />
      </TouchableOpacity>
      {filteredPosts.loading && <ActivityIndicator size="large" color="blue" />}
      <FlatList
        data={filteredPosts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

export default Home;
