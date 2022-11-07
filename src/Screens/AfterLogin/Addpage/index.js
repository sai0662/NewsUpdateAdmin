/* eslint-disable react-hooks/exhaustive-deps */
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
import {getcategories} from '../../../Redux/Action/newscategoriesactions';
import {addnewposts} from '../../../Redux/Action/addnewspostsactions';
import {useSelector, useDispatch} from 'react-redux';
import {getallnews} from '../../../Redux/Action/newspostsactions';

const colorScheme = Appearance.getColorScheme();

const styles = {
  //
  mytextcolor: {
    color: colorScheme === 'light' ? 'black' : 'white',
    fontSize: 15,
  },
};
function AddPost({navigation, route, navigation: {goBack}}) {
  // const [title, setTitle] = useState('');
  // const [description, setDescription] = useState('');
  // const [name, setName] = useState('');
  // const [image, setImage] = useState('');
  // const [selectedImage, setSelectedImage] = useState(null);
  // const [loading, setLoading] = useState(false);

  // //dropdown for categorylist
  // const [open, setOpen] = useState(false);
  // const [value, setValue] = useState(null);
  // //const [items, setItems] = useState([]);
  // const items = useSelector(state => state.categories.newscategories);

  // //dispatch redux

  // const dispatch = useDispatch();
  //useEffect(() => {}, []);

  //Redux for add page
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [postData, setPostData] = useState({title: '', description: ''});
  const [openPicker, set_openPicker] = useState(false); // status of dropdownload status = false, status = true
  const [valuePicker, set_valuePicker] = useState(null); //to store select option of dropdown
  const [itemsPicker, set_itemsPicker] = useState([]);
  const category = useSelector(state => state.categories.newscategories);
  useEffect(() => {
    console.log('valuePicker', valuePicker);
    console.log('ItemPicker::::', itemsPicker);
  }, [valuePicker]);

  useEffect(() => {
    if (category.length > 0) {
      console.log('categories', category);
      set_itemsPicker([{label: 'Select Category', value: null}, ...category]);
    }
  }, [category]);
  const Submit = async () => {
    setLoading(true);
    let res = firestore().collection('newposts').doc(); //blank unique ID

    console.log('res', res.id);

    ImageAddition(res.id);

    dispatch(
      addnewposts({
        ...postData,
        catName: catName[0].label,
        catID: valuePicker,
        timeCreated: Moment().unix(),
        time: Moment().format('h:mm:ss a'),
        timeinHuman: Moment().format('DD-MM-YYYY'),
        id: res.id,
      }),
    );

    dispatch(getallnews());
  };

  const ImageAddition = async documentID => {
    console.log('Yes selected image has path');
    var extension = '';
    //const res = dispatch(addpost);
    //console.log('RESPONSE IN IMAGE ADDITION', res);
    if (selectedImage.mime === 'image/jpeg') {
      extension = 'jpg';
    } else if (selectedImage.mime === 'image/png') {
      extension = 'png';
    }
    let imagename = `${documentID}.${extension}`; //97Df0E8yksbRJhpWhlwd.jpg
    await storage().ref(imagename).putFile(selectedImage.path);
    var url = await storage().ref(imagename).getDownloadURL();
    await firestore()
      .collection('newposts')
      .doc(documentID)
      .set({image: url}, {merge: true});
    setLoading(false);
    toast.show('Image updated successfully!!!');
    //dispatch(getallnews());
    //pushNotification();
  };

  // const pushNotification = () => {
  //   axios
  //     .post(`${API_URL}/sendPushToTopic`, {
  //       topic: 'customers',
  //       Title: postData.Title,
  //       Name: postData.Name,
  //     })

  //     .then(status => {
  //       console.log('status::', status);
  //     })
  //     .catch(e => {
  //       console.log('error::', e);
  //     }),
  //     setTimeout(() => {
  //       navigation.navigate('Home');
  //     }, 1500);
  // };

  var catName = _.filter(itemsPicker, each => {
    return each.value === valuePicker;
  });

  //const categories = useSelector(state => state.category.newscategories);
  // useEffect(() => {
  //   if (categories.length > 0) {
  //     console.log('categories', categories);
  //     set_itemsPicker([{label: 'Select Category', value: null}, ...categories]);
  //   }
  // }, [categories]);
  // useEffect(() => {
  //   dispatch(getcategories());
  // }, []);

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

  // submit fuction
  // const Submit = async () => {
  //   setLoading(true);
  //   let res = firestore().collection('newposts').doc();
  //   // console.log(‘res’, res.id);
  //   if (selectedImage?.path) {
  //     ImageAddition(res.id);
  //   }
  //   let data = {
  //     title: title,
  //     description: description,
  //     //catName: catName[0].label,
  //     catID: value,
  //     //image: url,
  //     timeCreated: Moment().unix(),
  //     timeinHuman: Moment().format('DD-MM-YYYY'),
  //   };
  //   //console.log(‘data’, data);
  //   //dispatch(editpost(data));
  //   if (selectedImage == null) {
  //     dispatch(addnewposts(data));
  //     //pushNotification();
  //   }
  // };
  //Image adding
  // const ImageAddition = async documentID => {
  //   console.log('Yes selected image has path');
  //   var extension = '';
  //   const res = dispatch(addnewposts);
  //   console.log('RESPONSE IN IMAGE ADDITION', res);
  //   if (selectedImage.mime === 'image/jpeg') {
  //     extension = 'jpg';
  //   } else if (selectedImage.mime === 'image/png') {
  //     extension = 'png';
  //   }
  //   let imagename = '${documentID}.${extension}';
  //   await storage().ref(imagename).putFile(selectedImage.path);
  //   var url = await storage().ref(imagename).getDownloadURL();
  //   await firestore()
  //     .collection('newposts')
  //     .doc(documentID)
  //     .set({image: url}, {merge: true});
  //   setLoading(false);
  //   toast.show('Image updated successfully!!!');
  //   dispatch(addnewposts());
  //   //pushNotification();
  // };

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

  // useEffect(() => {
  //   SelectCategories();
  // }, []);

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

  // const SelectCategories = async () => {
  //   dispatch(getcategories());
  // };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {loading && (
        <ActivityIndicator size="large" color="blue" animating={true} />
      )}
      <KeyboardAwareScrollView>
        <View style={{paddingHorizontal: 10}}>
          <Text style={{color: 'black', fontSize: 24, paddingVertical: 30}}>
            Create A Blog Post
          </Text>

          <Text style={styles.mytextcolor}>
            Title{' '}
            <Text style={{color: 'red', fontSize: 9}}>
              (min 100 characters)
            </Text>
          </Text>
          <TextInput
            value={postData.title}
            onChangeText={text => setPostData(prev => ({...prev, title: text}))}
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
              numberOfLines={5}
              value={postData.description}
              onChangeText={text =>
                setPostData(prev => ({...prev, description: text}))
              }
              style={{
                ...styles.mytextcolor,
                borderWidth: 1,
                borderColor: 'grey',
                borderRadius: 4,
                padding: 3,
              }}
            />
          </View>
          <DropDownPicker
            open={openPicker}
            value={valuePicker}
            items={itemsPicker}
            setOpen={set_openPicker}
            setValue={set_valuePicker}
            //setItems={setItems}
          />
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
        </View>
      </KeyboardAwareScrollView>
      <Modal isVisible={isModalVisible}>
        <View>
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

// const SelectCategories = () => {
//   firestore()
//     .collection('categories')
//     .get()
//     .then(response => {
//       var categorylist = [];
//       console.log('response', response.docs);
//       response.docs.map(each => {
//         //categorylist.push({...each.data(), id: each.id});
//         categorylist.push({label: each.data().name, value: each.id});
//       });
//       categorylist.push({label: 'Select category', value: null});
//       // setState(prev => ({...prev, data: categorylist}));
//       setItems([...categorylist]);
//     })
//     .catch(error => {
//       console.log('error', error);
//     });
// };

// const Submit = async () => {
//   try {
//     const catName = _.filter(items, item => {
//       return item.value === value;
//     });
//     console.log('catName: ', catName[0].label);
//     var data = {
//       title: title,
//       description: description,
//       catName: catName[0].label,
//       catID: value,
//       //image: url,
//       timeCreated: Moment().unix(),
//       timeinHuman: Moment().format('DD-MM-YYYY'),
//     };
//     dispatch(addnewposts(data));
//   } catch (e) {
//     console.log('error', e);
//   }
// };
//const Submit = async () => {
// var titleRefined = String(title).trim();

// if (titleRefined.length < 5) {
//   toast.show('Title must be 100 characters long.');
//   return;
// }
// var data = {
//   title: String(title).trim(),
//   description: String(description).trim(),
//   //ParentID = value,
// };

// setLoading(true);
// var catName = _.filter(items, item => {
//   return item.value === value;
// });
// var imageName = '';
// try {
//   var res = await firestore()
//     .collection('newposts')
//     .add({
//       title: title,
//       description: description,
//       catName: catName[0].label,
//       catID: value,
//       timeCreated: Moment().unix(),
//       timeinHuman: Moment().format('DD-MM-YYYY'),
//     });
//   if (res) {
//     if (selectedImage?.path) {
//       var extension = '';
//       if (selectedImage.mime === 'image/jpeg') {
//         extension = 'jpeg';
//       } else if (selectedImage.mime === 'image/png') {
//         extension = 'png';
//       }
//       imageName = `${res.id}.${extension}`;
//       await storage().ref(imageName).putFile(selectedImage.path);
//       var url = await storage().ref(imageName).getDownloadURL();
//       await firestore()
//         .collection('newposts')
//         .doc(res.id)
//         .update({image: url});
//       setLoading(false);
//       toast.show('Uploaded Successfully');

//push notifications

//         axios
//           .post(
//             'https://us-central1-newsadminapp.cloudfunctions.net/sendPushtoTopic',
//             {
//               topic: 'customers',
//               title,
//               description,
//             },
//           )
//           .then(status => {
//             console.log('status', status);
//           })
//           .catch(error => {
//             console.log('error', error);
//           });
//         route.params.reloadData();
//         setTimeout(() => {
//           navigation.navigate('Home');
//         }, 1500);
//       }
//     }
//   }
//   .catch (error) {
//     console.log('error', error);
//   }
// };
