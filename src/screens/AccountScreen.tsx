import { View, Text, SafeAreaView, Dimensions, StatusBar, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useStore } from '../store/store';
import Loading from '../components/Loading';
import Success from '../components/Success';
import Error from '../components/Error';
import { COLORS, FONTFAMILY } from '../theme/theme';
import { getUserStats, signOutUser } from '../data/firebase';
import { Button } from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import NoInternetConnection from '../components/NoInternetConnection';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const AccountScreen = (props: any) => {
  const signInDone = useStore((state: any) => state.signInDone);
  const toggleSignIn = useStore((state: any) => state.toggleSignIn);
  const user = useStore((state: any) => state.user);
  const [size, setSize] = useState(0);
  const [number, setNumber] = useState(0);
  const setActive = useStore((state: any) => state.setActive);
  const setAuthType = useStore((state: any) => state.setAuthType);
  const setUser = useStore((state: any) => state.setUser);
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
  const handleSignOut = async () => {
    try {
      setLoading(true)
      const res = await signOutUser(user.uid)
      if (res.status === 'success') {
        setSignInSuccessMessage(res.message)
        toggleSignIn(false)
        triggerSuccess()
        setAuthType('')
        setUser({})
        setTimeout(() => {
          props.navigation.push('HomeScreen');
        }, 3000);
      } else {
        setSignInErrorMessage(res.message)
        triggerError()
      }
    } catch (error: any) {
      setSignInErrorMessage(error.toString())
      triggerError()
    } finally {
      setLoading(false)
    }
  };

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
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

  useEffect(() => {
    if (!user.uid) {
      props.navigation.replace('SignInScreen', { from: 'Account' });
    }
    const fetchData = async () => {
      try {
        console.log('user',user.uid)
        const res = await getUserStats(user.uid);
        setSize(res.data?.size);
        setNumber(res.data?.number);
        setActive('account');
      } catch (error) {
        console.error('Error fetching user stats:', error);
        // Handle error state or log appropriately
      }
    };

    fetchData();
    console.log('user',user)
    if (!signInDone) {
      props.navigation.replace('SignUpScreen', { from: 'Account' });
    }
  }, []);
  useEffect(() => {
    if (!user.uid) {
      props.navigation.replace('SignInScreen', { from: 'Account' });
    }
    const fetchData = async () => {
      try {
        console.log('user',user.uid)
        const res = await getUserStats(user.uid);
        setSize(res.data?.size);
        setNumber(res.data?.number);
        setActive('account');
      } catch (error) {
        console.error('Error fetching user stats:', error);
        // Handle error state or log appropriately
      }
    };

    fetchData();
    console.log('user',user)
    if (!signInDone) {
      props.navigation.replace('SignUpScreen', { from: 'Account' });
    }
  }, [signInDone,user]);
  return (
    <>
      {!connectionStatus && (<NoInternetConnection />)}
      {loading && (<Loading message={'Signing out..'} />)}
      {success && (<Success message={signInSuccessMessage} />)}
      {error && (<Error message={signInErrorMessage} />)}
      {!loading && !success && !error && connectionStatus && (<SafeAreaView style={{ width: screenWidth, height: screenHeight, backgroundColor: COLORS.tertiary, alignContent: 'center' }}>
        <StatusBar backgroundColor={COLORS.tertiary} barStyle={'dark-content'} />
        <Text style={{ fontFamily: FONTFAMILY.poppins_extrabold, color: COLORS.primary, fontSize: 30, textAlign: 'center', marginTop: 20, marginBottom: -200 }}>Account</Text>
        {
          user.uid && (
            <View style={{ marginVertical: 'auto' }}>
              <Image
                style={{ width: 200, height: 200, resizeMode: 'contain', borderRadius: 100, borderWidth: 2, borderColor: COLORS.primary, alignSelf: 'center', marginBottom: 50 }}
                source={{ uri: user.profilepic }}
              />
              <Text style={{ fontFamily: FONTFAMILY.poppins_medium, color: COLORS.secondary, fontSize: 25, textAlign: 'center' }}>{user.name}</Text>
              <Text style={{ fontFamily: FONTFAMILY.poppins_regular, color: COLORS.secondary, fontSize: 20, textAlign: 'center' }}>{user.email}</Text>
              <View style={{ width: screenWidth * 0.6, height: screenHeight * 0.1, alignSelf: 'center' }}>
                <Text style={{ fontFamily: FONTFAMILY.poppins_medium, color: COLORS.secondary, fontSize: 17, textAlign: 'left' }}>{`Size Used : ${(size / (1024 * 1024)).toFixed(2)}`}MB</Text>
                <Text style={{ fontFamily: FONTFAMILY.poppins_medium, color: COLORS.secondary, fontSize: 17, textAlign: 'left' }}>{`Number of PDF Uploaded : ${number}`}</Text>
              </View>
              <Button icon="logout" style={{ width: '40%', alignSelf: 'center' }} labelStyle={{ fontFamily: FONTFAMILY.poppins_extrabold, fontSize: 19 }} mode="contained" onPress={handleSignOut}>
                Sign Out
              </Button>
            </View>
          )
        }




      </SafeAreaView>)}

    </>

  )
}

export default AccountScreen