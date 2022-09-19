/* eslint-disable no-dupe-keys */
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  headerView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'lightblue',
    borderRadius: 20,
    width: '74%',
    marginLeft: 4,
    //marginTop: 10,
    marginBottom: 10,
  },
  headerText: {fontWeight: 'bold', fontSize: 20, color: 'white'},
  addButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 10,
    right: 10,
    zIndex: 999,
  },
  addButtonImage: {
    width: 20,
    height: 20,
  },
  postView: {
    //borderWidth: 0.5,
    borderColor: 'grey',
    padding: 10,
    width: '95%',
    height: 140,
    margin: 10,
    borderRadius: 10,
    //backgroundColor: 'green',
    borderColor: 'orange',
  },
  titleview: {
    width: '55%',
  },
  titleText: {
    color: 'orange',
    fontSize: 17,
    fontWeight: 'bold',
    //borderWidth: 1,
  },
  description: {
    width: '100%',
    height: '80%',
    //borderWidth: 1,
    flexDirection: 'row',
    borderRadius: 10,
  },
  descriptionView: {width: '60%', height: '100%', borderRadius: 10},
  descriptionText: {color: 'grey', fontSize: 14, marginTop: 10},
  ImageView: {
    width: '43%',
    height: '110%',
    borderRadius: 10,
    marginTop: -52,
  },
  ImageSize: {width: '100%', height: '132%', borderRadius: 10},
});
