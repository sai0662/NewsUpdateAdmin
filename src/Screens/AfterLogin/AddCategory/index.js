/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */

import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Appearance,
  Platform,
  Button,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import toast from 'react-native-simple-toast';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-action-sheet';
import storage from '@react-native-firebase/storage';
import Modal from 'react-native-modal';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import _ from 'lodash';
import Moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
const colorScheme = Appearance.getColorScheme();

const styles = {
  //
  mytextcolor: {
    color: colorScheme === 'light' ? 'black' : 'white',
    fontSize: 15,
  },
};
function AddCategory({navigation, route, navigation: {goBack}}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  //dropdown for categorylist
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  //useEffect(() => {}, []);

  const Submit = async () => {
    var titleRefined = String(title).trim();

    if (titleRefined.length < 5) {
      toast.show('Title must be 100 characters long.');
      return;
    }
    var data = {
      name: String(title).trim(),
      //   description: String(description).trim(),
      ParentID: value,
    };

    setLoading(true);
    try {
      var res = await firestore().collection('categories').add(data);
      if (res) {
        toast.show('Category added Successfully');
        setLoading(false);
        route.params.reloadData();
        navigation.navigate('Home');
      }
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  };

  //model for category creating
  const [state, setState] = useState({data: []});
  const [isModalVisible, setModalVisible] = useState(false);
  const [select, setSelect] = useState({name: 'Select Category...', id: null});

  const onSelectItem = item => {
    setSelect(item);
    toggleModal();
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    SelectCategories();
    firestore()
      .collection('categories')
      .get()
      .then(res => {
        res.docs.map(each => {
          firestore()
            .collection('categories')
            .doc(each.id)
            .set({ParentID: null}, {merge: true});
        });
      });
  }, []);

  const renderItem = ({item}) => {
    return (
      <View style={{backgroundColor: 'white'}}>
        <TouchableOpacity
          onPress={() => onSelectItem(item)}
          style={{height: 60}}>
          <Text
            style={{
              color: 'black',
              padding: 10,
              fontSize: 16,
              marginLeft: 30,
            }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const SelectCategories = () => {
    firestore()
      .collection('categories')
      .get()
      .then(response => {
        var categorylist = [];
        console.log('response', response.docs);
        response.docs.map(each => {
          //categorylist.push({...each.data(), id: each.id});
          categorylist.push({label: each.data().name, value: each.id});
        });
        categorylist.push({label: 'Select category', value: null});
        // setState(prev => ({...prev, data: categorylist}));
        setItems([...categorylist]);
      })
      .catch(error => {
        console.log('error', error);
      });
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {loading && (
        <ActivityIndicator size="large" color="blue" animating={true} />
      )}
      <KeyboardAwareScrollView>
        <View style={{paddingHorizontal: 10}}>
          <Text style={{color: 'black', fontSize: 24, paddingVertical: 30}}>
            Add A Category
          </Text>
          <View style={{height: 400}}>
            <Text style={styles.mytextcolor}>
              Title{' '}
              <Text style={{color: 'red', fontSize: 9}}>
                (min 100 characters)
              </Text>
            </Text>
            <TextInput
              value={title}
              onChangeText={text => setTitle(text)}
              style={{
                ...styles.mytextcolor,
                borderWidth: 1,
                borderColor: 'grey',
                borderRadius: 4,
                padding: 3,
                marginBottom: 10,
              }}
            />

            <View>
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
              />
            </View>
            <View
              style={{
                width: '80%',
                justifyContent: 'center',
                padding: 15,
                marginLeft: 30,
              }}>
              <Button onPress={Submit} title="Submit" />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <Modal isVisible={isModalVisible}>
        <View>
          <FlatList
            data={state.data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      </Modal>
    </View>
  );
}

export default AddCategory;
