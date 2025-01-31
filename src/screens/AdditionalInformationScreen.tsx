import { View, Text, SafeAreaView, Dimensions, StatusBar, TextInput, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useStore } from '../store/store';
import Loading from '../components/Loading';
import Success from '../components/Success';
import Error from '../components/Error';
import { COLORS, FONTFAMILY } from '../theme/theme';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { Button } from 'react-native-paper';
import { getUser, setAddInfoTrue, uploadImageAndAddProfilePic } from '../data/firebase';
import DocumentPicker from 'react-native-document-picker';
import NetInfo from '@react-native-community/netinfo';
import NoInternetConnection from '../components/NoInternetConnection';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const AdditionalInformationScreen = (props: any) => {
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
  const user = useStore((state: any) => state.user);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const setUser = useStore((state: any) => state.setUser);
  const [name, setName] = useState('');
  const [nameVerify, setNameVerify] = useState(false);
  const [nameError, setNameError] = useState(false);

  const [imageData, setImageData] = useState<any>();
  const [profilePicLink, setProfilePicLink] = useState('');

  const [signInSuccessMessage, setSignInSuccessMessage] = useState('');
  const [signInErrorMessage, setSignInErrorMessage] = useState('');

  function handleName(e: any) {
    const nameVar = e.nativeEvent.text;
    setName(nameVar);
    setNameVerify(false);
    if (nameVar.length >= 3 || nameVar.length == 0) {
      setName(nameVar);
      setNameVerify(true);
      setNameError(false);
    } else {
      setNameError(true);
    }
  }

  const pickImage = async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
        copyTo: 'cachesDirectory'
      });
      setImageData(response);
    } catch (err) {
      console.log(err);
    }
  };

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


  async function handleSubmit() {
    try {
      setLoading(true)
      const response = await uploadImageAndAddProfilePic(user.uid, imageData, name)
      if (response.status === 'success') {
        const res=await getUser(user.uid);
        setUser(res)
        setSignInSuccessMessage(response.message)
        triggerSuccess()
        await setAddInfoTrue(user.uid)
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


  return (
    <>
      {!connectionStatus && (<NoInternetConnection />)}
      {loading && (<Loading message={'Saving..'} />)}
      {success && (<Success message={signInSuccessMessage} />)}
      {error && (<Error message={signInErrorMessage} />)}
      {!loading && !success && connectionStatus && !error && (<SafeAreaView style={{ width: screenWidth, height: screenHeight, backgroundColor: COLORS.primary, justifyContent: 'flex-end', paddingBottom: 20 }}>
        <StatusBar backgroundColor={COLORS.primary} barStyle={'light-content'} />
        <View>
          <LottieView style={{ height: screenHeight * 0.4, width: screenWidth * 0.9, alignSelf: 'center' }} source={require('../assets/lotties/signin.json')} autoPlay loop />
        </View>
        <View style={{ width: screenWidth * 0.9, height: screenHeight * 0.55, backgroundColor: COLORS.tertiary, alignSelf: 'center', borderRadius: 30 }}>
          <Text style={{ color: COLORS.secondary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 25, textAlign: "center" }}>Additional Information</Text>

          <View style={{ flexDirection: 'row', paddingTop: 14, paddingBottom: 3, marginTop: 25, marginLeft: 5, marginRight: 5, paddingHorizontal: 15, borderWidth: 1, borderColor: COLORS.secondary, backgroundColor: COLORS.lightBackground, borderRadius: 50 }}>
            <Icon name='pen' size={24} color={COLORS.secondary} style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Name"
              style={{ flex: 1, marginTop: -9, fontFamily: FONTFAMILY.poppins_medium, fontSize: 18, color: COLORS.darkText1 }}
              onChange={e => handleName(e)}
            />
            {name.length >= 3 ? null : nameVerify ? (
              <Icon name='circle-check' size={20} color={COLORS.successText} />
            ) : (
              <Icon name='circle-exclamation' size={20} color={COLORS.errorText} />

            )}
          </View>
          {name.length >= 3 || name.length == 0 ? null : nameVerify ? null : (
            <Text
              style={{
                color: COLORS.errorText,
              }}>
              <Icon name='circle-exclamation' size={20} color={COLORS.errorText} />

              Name sholud not be less then 3 characters.
            </Text>
          )}

          <View style={{ flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
            {imageData ? (
              <Image
                source={{ uri: imageData.uri }}
                style={{ height: 150, width: 150, borderRadius: 75, margin: 10, marginRight: 30, resizeMode: 'cover' }}
              />
            ) : (
              <Image
                source={require('../assets/images/default-user-pic-adr-info.png')}
                style={{ height: 150, width: 150, borderRadius: 60, margin: 10, marginRight: 30, resizeMode: 'cover' }}
              />
            )}

            <Button icon="login" style={{ width: '70%', alignSelf: 'center', margin: 15 }} labelStyle={{ fontFamily: FONTFAMILY.poppins_extrabold, fontSize: 18 }} mode='outlined' onPress={pickImage}>
              Choose Image
            </Button>

          </View>

          <Button icon="login" style={{ width: '40%', alignSelf: 'center', margin: 20 }} labelStyle={{ fontFamily: FONTFAMILY.poppins_extrabold, fontSize: 19 }} disabled={(nameError || !imageData)} mode="contained" onPress={handleSubmit}>
            Submit
          </Button>

        </View>
      </SafeAreaView>)}
    </>
  );
};

export default AdditionalInformationScreen;
