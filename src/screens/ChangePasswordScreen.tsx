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
import { changeUserPassword } from '../data/firebase';
import NetInfo from '@react-native-community/netinfo';
import NoInternetConnection from '../components/NoInternetConnection';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ChangePasswordScreen = (props: any) => {
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
      const response = await changeUserPassword(email, password);
      if (response.status === 'success') {
        setSignInSuccessMessage(`${response.message} Please check Your Email Inbox`)
        triggerSuccess();
        setTimeout(() => {
          props.navigation.replace('HomeScreen');
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

  function changeLaterOn() {
    // Navigation to forgot password screen logic
    props.navigation.replace('HomeScreen')
  }


  return (
    <>
      {!connectionStatus && (<NoInternetConnection />)}
      {loading && (<Loading message={'Sending Mail..'} />)}
      {success && (<Success message={signInSuccessMessage} />)}
      {error && (<Error message={signInErrorMessage} />)}
      {!loading && !success && connectionStatus && !error && (<SafeAreaView style={{ width: screenWidth, height: screenHeight, backgroundColor: COLORS.primary, justifyContent: 'flex-end', paddingBottom: 50 }}>
        <StatusBar backgroundColor={COLORS.primary} barStyle={'light-content'} />
        <View>
          <LottieView style={{ height: screenHeight * 0.4, width: screenWidth * 0.9, alignSelf: 'center' }} source={require('../assets/lotties/changepassword.json')} autoPlay loop />
        </View>
        <View style={{ width: screenWidth * 0.9, height: screenHeight * 0.4, backgroundColor: COLORS.tertiary, alignSelf: 'center', borderRadius: 30, marginTop: 70 }}>
          <Text style={{ color: COLORS.secondary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 25, textAlign: "center" }}>Verify Your Credentials</Text>

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
            <TouchableOpacity onPress={() => changeLaterOn()}>
              <Text style={{ color: COLORS.secondary, fontFamily: FONTFAMILY.poppins_medium, fontSize: 15 }}>Back To Home</Text>
            </TouchableOpacity>
          </View>

          <Button icon="login" style={{ width: '40%', alignSelf: 'center', margin: 20 }} labelStyle={{ fontFamily: FONTFAMILY.poppins_extrabold, fontSize: 19 }} disabled={(emailError || passwordError)} mode="contained" onPress={handelEmailSignIn}>
            Submit
          </Button>

        </View>
      </SafeAreaView>)}

    </>

  );
};

export default ChangePasswordScreen;
