/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Alert,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../Screens/AfterLogin/Homepage';
import Details from '../Screens/AfterLogin/Details';
import AddPost from '../Screens/AfterLogin/Addpage';
import Login from '../Screens/BeforeLogin/Login';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import Register from '../Screens/BeforeLogin/Register';
import Editpage from '../Screens/AfterLogin/Editpage';

const Stack = createNativeStackNavigator();
const Navigator = ({navigation, route, params}) => {
  const [user, setUser] = useState({loading: true, currentUser: null});
  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        var uid = user.uid;
        setUser(prev => ({...prev, currentUser: uid, loading: false}));
      } else {
        console.log('user is singed out');
        setUser(prev => ({...prev, currentUser: null, loading: false}));
      }
    });

    getRequest();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  }, []);

  const getRequest = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      getToken();
    }
  };
  const getToken = () => {
    messaging()
      .getToken()
      .then(token => {
        console.log('token for notification', token);
      })
      .catch(error => {
        console.log('error to get a token', error);
      });

    messaging()
      .subscribeToTopic('customers')
      .then(() => {
        console.log('subscribed to topic customers');
      });
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Login'}
        screenOptions={{
          headerShown: false,
        }}>
        {user.currentUser === null ? (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Details" component={Details} />
            <Stack.Screen name="AddPost" component={AddPost} />
            <Stack.Screen name="EditPage" component={Editpage} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
