import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import { Button } from 'react-native-paper';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import Pdf from 'react-native-pdf';
import NetInfo from '@react-native-community/netinfo';

import { decryption } from '../api/ApiCalls';
import { COLORS, FONTFAMILY } from '../theme/theme';

import Loading from '../components/Loading';
import Success from '../components/Success';
import Error from '../components/Error';
import HeaderBarOthers from '../components/HeaderBarOthers';
import NoInternetConnection from '../components/NoInternetConnection';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const DecryptPdfScreen = (props: any) => {
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
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [encryptedPdfUri, setEncryptedPdfUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const pickDocument = async () => {
    try {
      const result: DocumentPickerResponse = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });
      if (result) {
        setFileUri(result.uri);
        setFileName(result.name);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
      }
    }
  };

  const decryptPdf = async () => {

    if (!fileUri) {
      Alert.alert('No File Selected', 'Please select a PDF file first.');
      return;
    }

    if (!password) {
      Alert.alert('Password Required', 'Please enter a password.');
      return;
    }

    try {
      setLoading(true);
      const fileContent = await RNFS.readFile(fileUri, 'base64');
      const response = await decryption(fileName, fileContent, password)
      const pdfUrl = response?.data.Files[0].Url;
      const pdfResponse = await axios.get(pdfUrl, { responseType: 'blob' });
      const fileReaderInstance = new FileReader();
      fileReaderInstance.readAsDataURL(pdfResponse.data);
      fileReaderInstance.onload = async () => {
        const base64data = fileReaderInstance.result as string;
        const path = `/storage/emulated/0/Download/PDFgo/Decryption/${fileName}_unprotected.pdf`;
        await RNFS.writeFile(path, base64data.split(',')[1], 'base64');
        setEncryptedPdfUri(`file://${path}`);
        triggerSuccess()
      };
    } catch (error) {
      console.error('Error decrypting file: ', error);
      triggerError()
    } finally {
      setLoading(false)
    }
  };

  const sharePdf = async () => {
    if (!encryptedPdfUri) {
      Alert.alert('No PDF to Share', 'Please decrypt a file first.');
      return;
    }

    try {
      const options = {
        title: 'Share PDF',
        url: encryptedPdfUri,
        type: 'application/pdf',
      };

      await Share.open(options);
    } catch (error) {
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

  return (
    <SafeAreaView style={{ height: screenHeight, width: screenWidth, backgroundColor: COLORS.lightBackground }}>
      <StatusBar
        backgroundColor={COLORS.lightBackground}
        barStyle={'dark-content'}
      />
      {!connectionStatus && (<NoInternetConnection />)}
      {loading && (<Loading message={'Decrypting..'} />)}
      {success && (<Success message={'Decryption Success'} />)}
      {error && (<Error message={'Decryption Failed'} />)}
      <HeaderBarOthers props={props} />
      <View style={{ alignItems: 'center', padding: 16 }}>
        <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 24, textAlign: 'center', marginVertical: 10 }}>
          Decrypt PDF
        </Text>
        {!encryptedPdfUri && (
          <>
            <TextInput
              style={{ width: screenWidth * 0.8, padding: 10, borderColor: COLORS.tertiary, borderWidth: 1, borderRadius: 5, marginVertical: 10 }}
              placeholder="Your Password"
              value={password}
              onChangeText={setPassword}
              maxLength={20}
            />
            <TouchableOpacity style={{ marginVertical: 20 }} onPress={pickDocument}>
              <LottieView
                style={{ height: screenHeight * 0.3, width: screenWidth * 0.6, alignSelf: 'center' }}
                source={require('../assets/lotties/choosefile.json')}
                autoPlay
                loop
              />
              <Text style={{ color: COLORS.secondary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 24, textAlign: 'center' }}>
                Choose PDF File
              </Text>
            </TouchableOpacity>
          </>
        )}
        {fileUri && !encryptedPdfUri && (
          <Button
            style={{ width: screenWidth * 0.4, alignSelf: 'center', margin: 5 }}
            icon="lock-open"
            mode="elevated"
            onPress={decryptPdf}
          >
            Decrypt PDF
          </Button>
        )}
        {encryptedPdfUri && (
          <>
            <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 22, textAlign: 'center', marginTop: 5 }}>
              Preview Decrypted PDF
            </Text>
            <Pdf
              source={{ uri: encryptedPdfUri }}
              style={{ width: screenWidth, height: screenHeight * 0.5 }}
            />
            <View style={{ width: screenWidth }}>
              <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 16, textAlign: 'center', marginTop: 20 }}>
                PDF saved at: {encryptedPdfUri}
              </Text>
            </View>
            <Button
              style={{ width: screenWidth * 0.4, alignSelf: 'center', margin: 10 }}
              icon="share-variant"
              mode="elevated"
              onPress={sharePdf}
            >
              Share PDF
            </Button>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default DecryptPdfScreen;
