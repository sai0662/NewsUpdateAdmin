/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import {editCategory} from '../../../Redux/Action/editnewscategories';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-simple-toast';
import {getcategories} from '../../../Redux/Action/newscategoriesactions';
import {NULLMSG} from '../../../Redux/Reducer/newscategoriesReducer';
function EditCategory({navigation, route, params}) {
  const [label, setLabel] = useState(route.params.item.label);
  const updateMsg = useSelector(state => state.categories.msg);
  const dispatch = useDispatch();
  const submitForm = () => {
    var test_label = String(label).length > 4;
    if (!test_label) {
      Toast.show('atleast 4 characters long');
      return;
    }
    dispatch(editCategory({label, id: route.params.item.id}));
  };

  useEffect(() => {
    if (updateMsg !== null) {
      Toast.show(updateMsg);
      dispatch({type: NULLMSG});
      if (updateMsg === 'success') {
        dispatch(getcategories());
      }
    }
  }, [updateMsg]);
  return (
    <View>
      <TextInput
        value={label}
        onChangeText={text => setLabel(text)}
        style={{padding: 3, borderWidth: 1, borderRadius: 5}}
      />
      <Button onPress={submitForm} title="update" />
    </View>
  );
}

export default EditCategory;
