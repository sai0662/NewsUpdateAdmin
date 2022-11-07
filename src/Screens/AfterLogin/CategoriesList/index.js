/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import {getcategories} from '../../../Redux/Action/newscategoriesactions';
import {useSelector, useDispatch} from 'react-redux';
//import {GETNEWSCATEGORIES} from '../../../Redux/Reducer/newscategoriesReducer';
function CategoriesList({navigation, route, params}) {
  const categories = useSelector(state => {
    console.log('from selector', state);
    return state.categories.newscategories;
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getcategories());
  }, []);

  const renderItem = ({item}) => {
    return (
      <View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: 'red', padding: 20}}>{item.label}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditCategory', {item})}>
            <Image
              style={{
                width: 10,
                height: 10,
                marginLeft: 10,
                padding: 10,
                marginTop: 10,
              }}
              source={require('../../../Assets/Images/update.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View>
      <View>
        <Text style={{color: 'black', fontSize: 20}}>Categories List</Text>
      </View>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.value}
      />
    </View>
  );
}

export default CategoriesList;
