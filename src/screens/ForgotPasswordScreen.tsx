import { View, Text, SafeAreaView, Dimensions, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useStore } from '../store/store';
import Loading from '../components/Loading';
import Success from '../components/Success';
import Error from '../components/Error';
import { COLORS, FONTFAMILY } from '../theme/theme';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { Button } from 'react-native-paper';
import { forgotPassword } from '../data/firebase';
import NetInfo from '@react-native-community/netinfo';
import NoInternetConnection from '../components/NoInternetConnection';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ForgotPasswordScreen = (props: any) => {
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
  const setAuthType = useStore((state: any) => state.setAuthType);
  const setUser = useStore((state: any) => state.setUser);
  const toggleSignIn = useStore((state: any) => state.toggleSignIn);
  const addInfoDone = useStore((state: any) => state.addInfoDone);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const [email, setEmail] = useState('');
  const [emailVerify, setEmailVerify] = useState(false);
  const [emailError, setEmailError] = useState(false);

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


  async function handleForgotPassword() {
    try {
      setLoading(true);
      const response = await forgotPassword(email);
      if (response.status === 'success') {
        setSignInSuccessMessage(`${response.message} Please check Your Email Inbox`)
        triggerSuccess();
        setTimeout(() => {
          props.navigation.replace('SignInScreen', { from: 'Home' });
        }, 3000);
      }
      else {
        setSignInErrorMessage(response.message)
        triggerError();
      }
    } catch (error: any) {
      setSignInErrorMessage(error.toString())
      triggerError();
    } finally {
      setLoading(false)
    }
  }

  function navToSignIn() {
    props.navigation.replace('SignInScreen', { from: 'Home' })
  }

  return (
    <>
      {!connectionStatus && (<NoInternetConnection />)}
      {loading && (<Loading message={'Sending Mail..'} />)}
      {success && (<Success message={signInSuccessMessage} />)}
      {error && (<Error message={signInErrorMessage} />)}
      {!loading && !success && !error && (<SafeAreaView style={{ width: screenWidth, height: screenHeight, backgroundColor: COLORS.primary, justifyContent: 'flex-end', paddingBottom: 60 }}>
        <StatusBar backgroundColor={COLORS.primary} barStyle={'light-content'} />
        <View>
          <LottieView style={{ height: screenHeight * 0.4, width: screenWidth * 0.9, alignSelf: 'center' }} source={require('../assets/lotties/forgotpassword.json')} autoPlay loop />
        </View>
        <View style={{ width: screenWidth * 0.9, height: screenHeight * 0.3, backgroundColor: COLORS.tertiary, alignSelf: 'center', borderRadius: 30, marginTop: 100 }}>
          <Text style={{ color: COLORS.secondary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 30, textAlign: "center" }}>Forgot Password</Text>

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

          <View style={{ width: '98%', alignItems: 'flex-end', marginTop: 15, marginRight: 15 }}>
            <TouchableOpacity onPress={() => navToSignIn()}>
              <Text style={{ color: COLORS.secondary, fontFamily: FONTFAMILY.poppins_medium, fontSize: 15 }}>Continue With Original Password</Text>
            </TouchableOpacity>
          </View>

          <Button icon="login" style={{ width: '40%', alignSelf: 'center', margin: 15 }} labelStyle={{ fontFamily: FONTFAMILY.poppins_extrabold, fontSize: 19 }} disabled={(emailError)} mode="contained" onPress={handleForgotPassword}>
            Submit
          </Button>
        </View>
      </SafeAreaView>)}
    </>

  );
};

export default ForgotPasswordScreen;
