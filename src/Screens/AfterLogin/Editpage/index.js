/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-action-sheet';
import DropDownPicker from 'react-native-dropdown-picker';
import _ from 'lodash';
import Moment from 'moment';
import {editnewsposts} from '../../../Redux/Action/editnewspostsactions';
import {useSelector, useDispatch} from 'react-redux';
function Editpage({navigation, route, navigation: {goBack}}) {
  //console
  const [state, setState] = useState({
    title: route.params.title,
    description: route.params.description,
    image: route.params.image,
  });
  console.log('route testing', route.params);

  const [open, setOpen] = useState(false); // status of dropdownload status = false, status = true
  const [value, setValue] = useState(route.params.catID); //to store select option of dropdown
  const [items, setItems] = useState([]);

  useEffect(() => {
    SelectCategories();
  }, []);

  const SelectCategories = () => {
    firestore()
      .collection('categories')
      .get()
      .then(response => {
        var categorylist = [];
        console.log('cats', response.size);
        response.docs.map(each => {
          //categorylist.push({...each.data(), id: each.id});
          categorylist.push({label: each.data().name, value: each.id});
        });
        console.log('categorylist', categorylist);
        categorylist.push({label: 'Select an item', value: null});
        //setState(prev => ({...prev, data: categorylist}));
        setItems([...categorylist]);
      })
      .catch(error => {
        console.log('error', error);
      });
  };
  // useEffect(() => {}, []);
  const [selectedImage, setSelectedImage] = useState(Image);

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
  // const submit = () => {
  //   console.log('triggered');

  //   var catName = _.filter(items, item => {
  //     return item.value === value;
  //   });
  //   var imageName = '';
  //   firestore()
  //     .collection('newposts')
  //     .doc(route.params.id)
  //     .update({
  //       title: state.title,
  //       description: state.description,
  //       catName: catName[0].label,
  //       catID: value,
  //       timeUpdated: Moment().unix(),
  //       timeupdatedinHuman: Moment().format('DD-MM-YYYY'),
  //       status: true,
  //     })
  //     .then(res => {
  //       console.log('res', res);
  //       toast.show('post updated successfully');
  //       navigation.goBack();
  //       route.params.reloadData();
  //       //navigation.navigate('Home');
  //       //navigation.navigate('Details');
  //     })
  //     .catch(error => {
  //       console.log('error', error);
  //     });
  // };
  const data = useSelector(state => {
    console.log('from selector', state);
    return state.posts.editposts;
  });
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(editnewsposts());
  // }, []);
  const submit = (title, description, catName) => {
    dispatch(
      editnewsposts({title, description, catName, id: route.params.item.id}),
    );
  };
  return (
    <ScrollView>
      <View style={{flex: 1, backgroundColor: 'white', padding: 20}}>
        <Text style={{color: 'black', fontSize: 24}}>Edit post</Text>
        <TouchableOpacity onPress={() => goBack()}>
          <Text
            style={{
              // marginLeft: 120,
              fontWeight: '900',
              fontSize: 16,
              color: 'black',
              marginLeft: 280,
              padding: 10,
            }}>
            Back
          </Text>
        </TouchableOpacity>
        <View style={{marginVertical: 10}}>
          <Text style={{color: 'black', fontSize: 15, paddingBottom: 5}}>
            Edit Title
          </Text>
          <TextInput
            value={state.title}
            onChangeText={title => setState(prev => ({...prev, title}))}
            style={{
              borderColor: 'grey',
              borderWidth: 1,
              borderRadius: 5,
              padding: 5,
            }}
          />
        </View>
        <View>
          <Text style={{color: 'black', fontSize: 15}}>Edit Description</Text>
          <TextInput
            multiline
            numberOfLines={6}
            value={state.description}
            onChangeText={description =>
              setState(prev => ({...prev, description}))
            }
            style={{
              //marginTop: 20,
              borderColor: 'grey',
              borderWidth: 1,
              borderRadius: 5,
              padding: 5,
              marginBottom: 10,
            }}
          />
        </View>
        <View style={{marginBottom: 10}}>
          <DropDownPicker
            open={open}
            setOpen={setOpen}
            value={value}
            items={items}
            setValue={setValue}
          />
        </View>

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

          <Image
            source={{uri: selectedImage.path}}
            style={{width: 250, height: 250, borderRadius: 15}}
          />
        </TouchableOpacity>
        {/* <Button onPress={submit} title="submit" /> */}
        <TouchableOpacity
          style={{
            backgroundColor: 'lightblue',
            borderRadius: 5,
            width: 320,
            height: 36,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 20,
            marginTop: 20,
          }}
          onPress={() => submit()}>
          <Text style={{color: 'black', fontSize: 16, fontWeight: '900'}}>
            Edit Post
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default Editpage;
