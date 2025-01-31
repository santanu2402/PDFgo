import { View, Text, SafeAreaView, Dimensions, StatusBar, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useStore } from '../store/store';
import Loading from '../components/Loading';
import Success from '../components/Success';
import Error from '../components/Error';
import { COLORS, FONTFAMILY } from '../theme/theme';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { Button, IconButton } from 'react-native-paper';
import { getAddInfoValue, getUser, signInWithEmailAndPassword, signInWithGoogle } from '../data/firebase';
import NetInfo from '@react-native-community/netinfo';
import NoInternetConnection from '../components/NoInternetConnection';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const SignInScreen = (props: any) => {
  const [connectionStatus, setConnectionStatus] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
    NetInfo.fetch().then((state) => {
      setConnectionStatus(state.isInternetReachable ?? false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleConnectivityChange = (state: any) => {
    setConnectionStatus(state.isConnected);
  };
  const from = props.route.params.from;
  const setAuthType = useStore((state: any) => state.setAuthType);
  const setUser = useStore((state: any) => state.setUser);
  const toggleSignIn = useStore((state: any) => state.toggleSignIn);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const [email, setEmail] = useState('');
  const [emailVerify, setEmailVerify] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [signInSuccessMessage, setSignInSuccessMessage] = useState('');
  const [signInErrorMessage, setSignInErrorMessage] = useState('');

  const triggerSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 2000);
  };

  const triggerError = () => {
    setError(true);
    setTimeout(() => {
      setError(false);
    }, 2000);
  };

  function handleEmail(e: any) {
    const emailVar = e.nativeEvent.text;
    setEmail(emailVar);
    setEmailVerify(false);
    if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar)) {
      setEmail(emailVar);
      setEmailVerify(true);
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  }

  function handlePassword(e: any) {
    const passwordVar = e.nativeEvent.text;
    setPassword(passwordVar);
    setPasswordVerify(false);
    if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}/.test(passwordVar)) {
      setPassword(passwordVar);
      setPasswordVerify(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  }

  async function handelEmailSignIn() {
    try {
      setLoading(true)
      const response = await signInWithEmailAndPassword(email, password)
      if (response.status === 'success') {
        setSignInSuccessMessage(response.message)
        triggerSuccess()
        toggleSignIn(true)
        setAuthType(response.authType)
        setUser(await getUser(response.userCredential.user.uid))
        if (!await getAddInfoValue(response.userCredential.user.uid)) {
          props.navigation.replace('AdditionalInformationScreen', { from: from })
        }
        else {
          if (from === 'Account')
            props.navigation.replace('AccountScreen')
          else if (from === 'Drive')
            props.navigation.replace('DriveScreen')
          else
            props.navigation.replace('HomeScreen')
        }
      }
      else if (response.status === 'failed') {
        setSignInErrorMessage(response.message)
        triggerError()
      }
    } catch (error: any) {
      setSignInErrorMessage(error.toString())
      triggerError()
    } finally {
      setLoading(false)
    }
  }
  async function handelgmailSignIn() {
    try {
      setLoading(true)
      const response = await signInWithGoogle();
      if (response.status === 'success') {
        setSignInSuccessMessage(response.message)
        triggerSuccess()
        toggleSignIn(true)
        setAuthType(response.authType)
        setUser(await getUser(response.userCredential.user.uid))
        setTimeout(() => {
          if (from === 'Account')
            props.navigation.replace('AccountScreen')
          else if (from === 'Drive')
            props.navigation.replace('DriveScreen')
          else
            props.navigation.replace('HomeScreen')
        }, 3000);
      }
      else if (response.status === 'failed') {
        setSignInErrorMessage(response.message)
        triggerError()
      }
    } catch (error: any) {
      setSignInErrorMessage(error.toString())
      triggerError()
    } finally {
      setLoading(false)
    }
  }

  function navTofrgtPswrd() {
    props.navigation.replace('ForgotPasswordScreen')
  }

  function navToSignUp() {
    props.navigation.replace('SignUpScreen', { from: from })
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        const keyboardHeight = event.endCoordinates.height;
        setKeyboardHeight(keyboardHeight);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  return (
    <>
      {!connectionStatus && (<NoInternetConnection />)}
      {loading && (<Loading message={'Signing In..'} />)}
      {success && (<Success message={signInSuccessMessage} />)}
      {error && (<Error message={signInErrorMessage} />)}
      {!loading && !success && !error && (<SafeAreaView style={{ width: screenWidth, height: screenHeight, backgroundColor: COLORS.primary, justifyContent: 'flex-end', paddingBottom: 20 }}>
        <StatusBar backgroundColor={COLORS.primary} barStyle={'light-content'} />
        <View>
          <LottieView style={{ height: screenHeight * 0.4, width: screenWidth * 0.9, alignSelf: 'center' }} source={require('../assets/lotties/signin.json')} autoPlay loop />
        </View>
        <View style={{ width: screenWidth * 0.9, height: screenHeight * 0.55, backgroundColor: COLORS.tertiary, alignSelf: 'center', borderRadius: 30 ,marginBottom:keyboardHeight*.62}}>
          <Text style={{ color: COLORS.secondary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 30, textAlign: "center" }}>Sign In</Text>

          <View style={{ flexDirection: 'row', paddingTop: 14, paddingBottom: 3, marginTop: 25, marginLeft: 5, marginRight: 5, paddingHorizontal: 15, borderWidth: 1, borderColor: COLORS.secondary, backgroundColor: COLORS.lightBackground, borderRadius: 50 }}>

            <Icon name='envelope' size={24} color={COLORS.secondary} style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Email"
              style={{ flex: 1, marginTop: -9, fontFamily: FONTFAMILY.poppins_medium, fontSize: 18, color: COLORS.darkText1 }}
              onChange={e => handleEmail(e)}
            />
            {email.length < 1 ? null : emailVerify ? (
              <Icon name='circle-check' size={20} color={COLORS.successText} />
            ) : (
              <Icon name='circle-exclamation' size={20} color={COLORS.errorText} />
            )}
          </View>
          {email.length < 1 ? null : emailVerify ? null : (
            <Text style={{ color: COLORS.errorText, textAlign: 'center' }}>
              <Icon name='circle-exclamation' size={20} color={COLORS.errorText} />
              Enter Proper Email Address
            </Text>
          )}

          <View style={{ flexDirection: 'row', paddingTop: 14, paddingBottom: 3, marginTop: 25, marginLeft: 5, marginRight: 5, paddingHorizontal: 15, borderWidth: 1, borderColor: COLORS.secondary, backgroundColor: COLORS.lightBackground, borderRadius: 50 }}>
            <Icon name='lock' size={24} color={COLORS.secondary} style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Password"
              style={{ flex: 1, marginTop: -9, fontFamily: FONTFAMILY.poppins_medium, fontSize: 18, color: COLORS.darkText1 }}
              onChange={e => handlePassword(e)}
              secureTextEntry={showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {password.length < 1 ? null : !showPassword ? (
                <Icon name='eye-slash' size={18} style={{ marginRight: -10 }} color={passwordVerify ? COLORS.successText : COLORS.errorText} />
              ) : (
                <Icon name='eye' size={18} style={{ marginRight: -10 }} color={passwordVerify ? COLORS.successText : COLORS.errorText} />
              )}
            </TouchableOpacity>
          </View>
          {password.length < 1 ? null : passwordVerify ? null : (
            <Text style={{ color: COLORS.errorText, textAlign: 'center' }}>
              <Icon name='circle-exclamation' size={20} color={COLORS.errorText} style={{ marginLeft: 5 }} />
              Password should Contain
              Uppercase, Lowercase, Number, Symbol and 8 or more characters.
            </Text>
          )}

          <View style={{ width: '98%', alignItems: 'flex-end', marginTop: 15, marginRight: 15 }}>
            <TouchableOpacity onPress={() => navToSignUp()}>
              <Text style={{ color: COLORS.secondary, fontFamily: FONTFAMILY.poppins_medium, fontSize: 15 }}>Create New Account</Text>
            </TouchableOpacity>
          </View>

          <View style={{ width: '98%', alignItems: 'flex-end', marginRight: 15 }}>
            <TouchableOpacity onPress={() => navTofrgtPswrd()}>
              <Text style={{ color: COLORS.secondary, fontFamily: FONTFAMILY.poppins_medium, fontSize: 15 }}> Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <Button icon="login" style={{ width: '40%', alignSelf: 'center', margin: 20 }} labelStyle={{ fontFamily: FONTFAMILY.poppins_extrabold, fontSize: 19 }} disabled={(emailError || passwordError)} mode="contained" onPress={handelEmailSignIn}>
            Submit
          </Button>
          <Text style={{ textAlign: 'center', color: COLORS.secondary, fontFamily: FONTFAMILY.poppins_medium, fontSize: 15 }}>Or</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: COLORS.secondary, fontFamily: FONTFAMILY.poppins_medium, fontSize: 17 }}>Continue with</Text>
            <TouchableOpacity style={{ width: 35, height: 35, borderRadius: 20, borderWidth: 1, borderColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center', marginLeft: 10 }} onPress={handelgmailSignIn}>
              <LottieView
                style={{ width: 35, height: 35 }}
                source={require('../assets/lotties/googlesignin.json')}
                autoPlay
                loop
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>)}

    </>

  );
};

export default SignInScreen;

