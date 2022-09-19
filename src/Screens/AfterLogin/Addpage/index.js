/* eslint-disable no-shadow */
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
const colorScheme = Appearance.getColorScheme();

const styles = {
  //
  mytextcolor: {
    color: colorScheme === 'light' ? 'black' : 'white',
    fontSize: 15,
  },
};
function AddPost({navigation, route, navigation: {goBack}}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  //useEffect(() => {}, []);

  const openCamera = () => {
    console.log('pic');
    ImagePicker.openCamera({
      width: 250,
      height: 250,
      compressImageQuality: 0.7,
      // includeExif: true,
      // default: false,
    })
      .then(image => {
        console.log(image);
        setSelectedImage(image);
      })
      .catch(e => {
        console.log('e', e);
      });
  };

  const openGallery = () => {
    ImagePicker.openPicker({
      width: 250,
      height: 250,
      // cropping: true,
      compressImageQuality: 0.7,
    })
      .then(image => {
        console.log(image);
        setSelectedImage(image);
      })
      .catch(e => {
        console.log('e', e);
      });
  };

  const Submit = async () => {
    var titleRefined = String(title).trim();

    if (titleRefined.length < 5) {
      toast.show('Title must be 100 characters long.');
      return;
    }
    var data = {
      title: String(title).trim(),
      description: String(description).trim(),
    };

    setLoading(true);
    var imageName = '';
    try {
      var res = await firestore().collection('newposts').add({
        title: title,
        description: description,
        catName: select.name,
        catID: select.id,
      });
      if (res) {
        if (selectedImage?.path) {
          var extension = '';
          if (selectedImage.mime === 'image/jpeg') {
            extension = 'jpeg';
          } else if (selectedImage.mime === 'image/png') {
            extension = 'png';
          }
          imageName = `${res.id}.${extension}`;
          await storage().ref(imageName).putFile(selectedImage.path);
          var url = await storage().ref(imageName).getDownloadURL();
          await firestore()
            .collection('newposts')
            .doc(res.id)
            .update({image: url});
          setLoading(false);
          toast.show('Uploaded Successfully');

          //push notifications

          axios
            .post(
              'https://us-central1-newsadminapp.cloudfunctions.net/sendPushtoTopic',
              {
                topic: 'customers',
                title,
                description,
              },
            )
            .then(status => {
              console.log('status', status);
            })
            .catch(error => {
              console.log('error', error);
            });
          route.params.reloadData();
          setTimeout(() => {
            navigation.navigate('Home');
          }, 1500);
        } else {
          setLoading(false);
          toast.show('Uploaded Successfully');
          route.params.reloadData();
          navigation.navigate('Home');
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const openActionSheet = () => {
    var BUTTONSiOS = ['Camera', 'CameraRoll', 'Cancel'];

    var BUTTONSandroid = ['Camera', 'ImageGallery', 'Cancel'];

    // var DESTRUCTIVE_INDEX = 3;
    var CANCEL_INDEX = 2;

    ActionSheet.showActionSheetWithOptions(
      {
        options: Platform.OS === 'ios' ? BUTTONSiOS : BUTTONSandroid,
        cancelButtonIndex: CANCEL_INDEX,
        tintColor: 'blue',
      },
      buttonIndex => {
        console.log('button clicked :', buttonIndex);
        if (buttonIndex === 0) {
          openCamera();
        } else if (buttonIndex === 1) {
          openGallery();
        }
      },
    );
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
          categorylist.push({...each.data(), id: each.id});
        });
        setState(prev => ({...prev, data: categorylist}));
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

      <View style={{paddingHorizontal: 10}}>
        <Text style={{color: 'black', fontSize: 24, paddingVertical: 30}}>
          Create A Blog Post
        </Text>

        <Text style={styles.mytextcolor}>
          Title{' '}
          <Text style={{color: 'red', fontSize: 9}}>(min 100 characters)</Text>
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
          }}
        />

        <View style={{marginVertical: 10}}>
          <Text style={styles.mytextcolor}>Description</Text>
          <TextInput
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={text => setDescription(text)}
            style={{
              ...styles.mytextcolor,
              borderWidth: 1,
              borderColor: 'grey',
              borderRadius: 4,
              padding: 3,
            }}
          />
        </View>
        <View
          style={{
            borderWidth: 1,
            padding: 10,
            borderColor: 'grey',
            borderRadius: 4,
          }}>
          <TouchableOpacity onPress={toggleModal}>
            <Text style={{color: 'black'}}>{select.name}</Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            color: 'black',
            padding: 10,
            fontSize: 16,
            fontWeight: 'bold',
          }}>
          Upload an Image{' '}
        </Text>
        <TouchableOpacity
          onPress={openActionSheet}
          style={{
            borderRadius: 15,
            width: 252,
            height: 252,
            borderWidth: 1,
            borderColor: 'grey',
          }}>
          <Text
            style={{
              color: 'grey',
              fontSize: 18,
              fontWeight: '900',
              position: 'absolute',
              padding: 80,
              marginTop: 30,
            }}>
            Tap Here
          </Text>
          {selectedImage !== null && (
            <Image
              source={{uri: selectedImage.path}}
              style={{width: 250, height: 250, borderRadius: 15}}
            />
          )}
        </TouchableOpacity>
        <View
          style={{
            width: '80%',
            justifyContent: 'center',
            padding: 15,
            marginLeft: 30,
          }}>
          <Button onPress={Submit} title="Submit" />
        </View>
        {/* </TouchableOpacity> */}
      </View>
      <Modal isVisible={isModalVisible}>
        <View>
          {/* <View style={{flexDirection: 'row', marginBottom: '30%'}}>
                <Text style={{color: 'white'}}>Category List</Text>
                <TouchableOpacity onPress={toggleModal}>
                  <Text style={{color: 'white', marginLeft: 190}}>Close</Text>
                </TouchableOpacity>
              </View> */}
          <FlatList
            data={state.data}
            renderItem={renderItem}
            //setSelect={setSelect}
            keyExtractor={item => item.id}
          />
        </View>
      </Modal>
    </View>
  );
}

export default AddPost;
