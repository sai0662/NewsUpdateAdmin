import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {borderWidth: 1, flex: 1},
  options: {flexDirection: 'row', padding: 15},
  updateButton: {
    width: 20,
    height: 20,
  },
  deleteButton: {
    width: 20,
    height: 20,
  },
  backButton: {marginLeft: '65%'},
  backButtonImage: {
    width: 30,
    height: 20,
  },
  detailsImageView: {
    height: '55%',
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'red',
    //borderWidth: 1,
  },
  detailsImage: {
    width: '90%',
    height: '80%',
    borderRadius: 15,
  },
  Description: {
    color: 'black',
    fontSize: 24,
    margin: 20,
    //borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
