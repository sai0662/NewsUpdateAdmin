/* eslint-disable no-lone-blocks */
/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Image,
  TextInput,
  ImageBackground,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import toast from 'react-native-simple-toast';
import messaging from '@react-native-firebase/messaging';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  scopes: [], // what API you want to access on behalf of the user, default is email and profile
  webClientId:
    '950238380873-nmaa8ilkqkgevo7fk67g26p3358p85u9.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  hostedDomain: '', // specifies a hosted domain restriction
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  accountName: '', // [Android] specifies an account name on the device that should be used
  iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
  openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
  profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});

const Login = ({navigation, route, params}) => {
  const [user, setUser] = useState({loading: true, currentUser: null});

  const [useData, setUserData] = useState(null);
  const [current_user, set_current_user] = useState(null);

  const [state, setState] = useState({
    email: '',
    password: '',
    loader: false,
    emailTestFail: null,
    passwordTestFail: null,
    passwordHidden: false,
  });

  const onChangeEmail = text => {
    setState(prev => ({...prev, email: text}));
  };
  const onChangePassword = text => {
    setState(prev => ({...prev, password: text}));
  };

  const validEmail = () => {
    const pattern =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    setState(prev => ({...prev, emailTestFail: !pattern.test(state.email)}));
  };

  const validPassword = () => {
    var pass = String(state.password).trim();
    setState(prev => ({...prev, passwordTestFail: !(pass.length > 6)}));
  };

  const submitForm = () => {
    // email validation starts here
    const email = String(state.email).trim().toLowerCase();
    const pattern =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    var email_test = pattern.test(email);
    if (email_test === false) {
      setState(prev => ({...prev, emailTestFail: true}));
      return;
    }
    if (email_test) {
      setState(prev => ({...prev, emailTestFail: false}));
    }
    // password validation starts here
    const password = String(state.password).trim();
    if (password.length >= 6) {
      setState(prev => ({...prev, passwordTestFail: false}));
    } else {
      setState(prev => ({...prev, passwordTestFail: true}));
      return;
    }

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        var currentUser = auth().currentUser;
        if (currentUser !== null) {
          var uid = currentUser._user.uid;
          console.log('uid', uid);
        }
        toast.show('You are Logged in Successfully');
        AsyncStorage.setItem('@uid', uid);
        // setTimeout(() => {
        //   navigation.navigate('Home');
        // }, 1000);
        console.log('you logged in successfully', res.user, typeof res.user);
        // var uid = res.user.uid;
        // AsyncStorage.setItem('@uid', uid);
        // navigation.navigate('Home');
      })
      .catch(e => {
        console.log('e');
      });
  };

  useEffect(() => {
    const currentUser = auth().currentUser;
    set_current_user(currentUser);
    //isGoogleSigned();
    // if (currentUser === null) {
    //   isGoogleSigned();
    // }
  }, []);

  const isGoogleSigned = async () => {
    //await GoogleSignin.revokeAccess();
    //const isSignedIn = await GoogleSignin.isSignedIn();
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      //console.log('userInfo', userInfo);
      setUserData(userInfo);
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken,
      );
      auth()
        .signInWithCredential(googleCredential)
        .then(signedInUser => {
          //set_current_user(auth().currentUser);
          set_current_user(signedInUser.user.uid);
        });
    } catch (error) {
      console.log('error', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  //style={{flex: 1, backgroundColor: 'red'}}
  return (
    <ScrollView>
      <View style={{width: '100%', height: '100%'}}>
        <ImageBackground
          source={require('../../../Assets/Images/newsbg.jpeg')}
          style={{width: '100%', height: '62%'}}>
          <View
            style={{
              marginTop: 80,
              justifyContent: 'center',
              alignItems: 'center',
              //borderWidth: 1,
              borderColor: '#fff',
            }}>
            <Text style={{color: 'orange', fontSize: 28, fontWeight: 'bold'}}>
              N
              <Text style={{color: 'lightblue'}}>
                ews <Text style={{color: 'orange'}}>U</Text>pdate{' '}
                <Text style={{color: 'orange'}}>A</Text>
                <Text style={{color: 'lightblue'}}>pp</Text>
              </Text>
            </Text>
          </View>
          <Text
            style={{
              color: 'orange',
              fontSize: 28,
              fontWeight: 'bold',
              marginTop: 58,
              marginLeft: 10,
            }}>
            Login
          </Text>
          <View
            style={{
              width: '100%',
              backgroundColor: '#fff',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              padding: 20,
              borderWidth: 1,
              marginTop: '10%',
              borderColor: 'orange',
            }}>
            <TextInput
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderColor: 'lightgrey',
                borderWidth: 1,
                borderRadius: 16,
              }}
              onChangeText={text => onChangeEmail(text)}
              value={state.email}
              onBlur={validEmail}
              placeholder="Enter Email"
            />
            {state.emailTestFail === true && (
              <Text
                style={{
                  fontSize: 10,
                  color: 'red',
                  paddingLeft: 15,
                  paddingTop: 15,
                }}>
                invalid Email
              </Text>
            )}
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                alignItems: 'center',
                borderColor: 'lightgrey',
                borderWidth: 1,
                borderRadius: 16,
              }}>
              <View style={{flex: 8}}>
                <TextInput
                  style={{
                    color: 'grey',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                  }}
                  onChangeText={text => onChangePassword(text)}
                  value={state.password}
                  secureTextEntry={state.passwordHidden}
                  onBlur={validPassword}
                  placeholder="Enter Password"
                />
              </View>
              <TouchableOpacity
                style={{flex: 1}}
                onPress={() =>
                  setState(prev => ({
                    ...prev,
                    passwordHidden: !state.passwordHidden,
                  }))
                }>
                {/* <Feather name={state.passwordHidden ? 'eye': 'eye-off'} size={29} color="black" /> */}
                <Image
                  source={require('../../../Assets/Images/passwordeye.png')}
                  style={{width: 20, height: 15}}
                />
              </TouchableOpacity>
            </View>
            {state.passwordTestFail === true && (
              <Text
                style={{
                  fontSize: 10,
                  color: 'red',
                  paddingLeft: 15,
                  paddingTop: 15,
                }}>
                invalid Password
              </Text>
            )}
            <View style={{padding: 5, alignItems: 'flex-end'}}>
              <Text style={{padding: 8, color: 'orange'}}>
                Forgot Password?
              </Text>
            </View>
            <TouchableOpacity
              onPress={submitForm}
              style={{
                marginTop: 5,
                height: 56,
                backgroundColor: 'orange',
                borderRadius: 16,
                padding: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 18, lineHeight: 20, color: 'black'}}>
                Login
              </Text>
            </TouchableOpacity>
            <View style={{borderBottomWidth: 1, marginTop: 20}} />
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <Text>or login with</Text>
            </View>
            <View
              style={{
                //padding: 5,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30,
              }}>
              <GoogleSigninButton
                style={{width: 192, height: 48}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={isGoogleSigned}
                //disabled={this.state.isSigninInProgress}
              />
            </View>
            <View style={{alignItems: 'center', marginTop: 20}}>
              <Text style={{color: 'orange'}}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Register');
                  }}>
                  <Text style={{color: 'orange'}}>
                    <Text style={{color: '#D3D3D3'}}>
                      New to The News Updates
                    </Text>{' '}
                    Create an Account
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </ScrollView>
  );
};

export default Login;

{
  /* <View style={{height: '100%'}}>
<ImageBackground
  source={require('../../../Assets/Images/newsbg.webp')}
  resizeMode="cover"
  style={{height: '60%'}}>
  <View
    style={{
      flex: 1,
      padding: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
      //borderWidth: 1,
      //backgroundColor: 'red',
    }}>
    <Text style={{color: 'red'}}>Header</Text>
  </View>
  <View
    style={{
      paddingHorizontal: 16,
      paddingTop: 40,
      height: '68%',
      width: '100%',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderWidth: 1,
    }}>
    <TextInput
      style={{
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderColor: 'lightgrey',
        borderWidth: 1,
        borderRadius: 16,
      }}
      onChangeText={text => onChangeEmail(text)}
      value={state.email}
      onBlur={validEmail}
      placeholder="Enter Email"
    />
    {state.emailTestFail === true && (
      <Text
        style={{
          fontSize: 10,
          color: 'red',
          paddingLeft: 15,
          paddingTop: 15,
        }}>
        invalid Email
      </Text>
    )}
    <View
      style={{
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
        borderColor: 'lightgrey',
        borderWidth: 1,
        borderRadius: 16,
      }}>
      <View style={{flex: 8}}>
        <TextInput
          style={{
            color: 'grey',
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}
          onChangeText={text => onChangePassword(text)}
          value={state.password}
          secureTextEntry={state.passwordHidden}
          onBlur={validPassword}
          placeholder="Enter Password"
        />
      </View>
      <TouchableOpacity
        style={{flex: 1}}
        onPress={() =>
          setState(prev => ({
            ...prev,
            passwordHidden: !state.passwordHidden,
          }))
        }>
        {/* <Feather name={state.passwordHidden ? 'eye': 'eye-off'} size={29} color="black" /> */
}
//         <Image
//           source={require('../../../Assets/Images/passwordeye.png')}
//           style={{width: 20, height: 15}}
//         />
//       </TouchableOpacity>
//     </View>
//     {state.passwordTestFail === true && (
//       <Text
//         style={{
//           fontSize: 10,
//           color: 'red',
//           paddingLeft: 15,
//           paddingTop: 15,
//         }}>
//         invalid Password
//       </Text>
//     )}
//     <View style={{padding: 5, alignItems: 'flex-end'}}>
//       <Text style={{padding: 8, color: 'blue'}}>Forgot Password?</Text>
//     </View>
//     <TouchableOpacity
//       onPress={submitForm}
//       style={{
//         marginTop: 20,
//         height: 56,
//         backgroundColor: '#333333',
//         borderRadius: 16,
//         padding: 8,
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}>
//       <Text style={{fontSize: 18, lineHeight: 20, color: '#FCFCFC'}}>
//         Login
//       </Text>
//     </TouchableOpacity>
//     <View>
//       <GoogleSigninButton
//         style={{width: 192, height: 48}}
//         size={GoogleSigninButton.Size.Wide}
//         color={GoogleSigninButton.Color.Dark}
//         onPress={isGoogleSigned}
//         //disabled={this.state.isSigninInProgress}
//       />
//     </View>
//   </View>
// </ImageBackground>
// </View> */}
