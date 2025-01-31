import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Dimensions, SafeAreaView, ScrollView, Image, StatusBar } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import LottieView from 'lottie-react-native';
import HeaderBarOthers from '../components/HeaderBarOthers';
import { COLORS, FONTFAMILY } from '../theme/theme';
import axios from 'axios';
import { pdftoimage } from '../api/ApiCalls';
import Loading from '../components/Loading';
import Success from '../components/Success';
import Error from '../components/Error';
import NetInfo from '@react-native-community/netinfo';
import NoInternetConnection from '../components/NoInternetConnection';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const PdfToImageScreen = (props: any) => {
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
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [imageUris, setImageUris] = useState<string[]>([]);
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
        console.log('User cancelled the picker');
      } else {
        console.log('Unknown error: ', err);
      }
    }
  };

  const convertToPdf = async () => {
    if (!fileUri) {
      Alert.alert('No File Selected', 'Please select a PDF file first.');
      return;
    }

    try {
      setLoading(true)
      const fileContent = await RNFS.readFile(fileUri, 'base64');
      const response = await pdftoimage(fileName, fileContent)

      const files = response?.data.Files;
      const uris: any = [];
      for (let i = 0; i < files.length; i++) {
        const fileUrl = files[i].Url;
        const fileResponse = await axios.get(fileUrl, { responseType: 'blob' });
        const fileReaderInstance = new FileReader();
        fileReaderInstance.readAsDataURL(fileResponse.data);
        fileReaderInstance.onload = async () => {
          const base64data = fileReaderInstance.result as string;
          const path = `/storage/emulated/0/Download/PDFgo/PdfToImage/${files[i].FileName}`;
          await RNFS.writeFile(path, base64data.split(',')[1], 'base64');
          uris.push(`file://${path}`);
          if (uris.length === files.length) {
            setImageUris(uris);
            setPdfUri(`file://${path}`);
            triggerSuccess()
          }
        };
      }
    } catch (error) {
      console.error('Error converting file: ', error);
      triggerError()
    } finally {
      setLoading(false)
    }
  };

  const shareImage = async (uri: string) => {
    try {
      const options = {
        title: 'Share Image',
        url: uri,
        type: 'image/jpeg',
      };
      await Share.open(options);
    } catch (error) {
      console.log('Error sharing image: ', error);
    }
  };

  const sharePdf = async () => {
    if (!pdfUri) {
      Alert.alert('No PDF to Share', 'Please convert a file first.');
      return;
    }

    try {
      const options = {
        title: 'Share PDF',
        url: pdfUri,
        type: 'application/pdf',
      };

      await Share.open(options);
    } catch (error) {
      console.log('Error sharing PDF: ', error);
    }
  };

  const shareAllImages = async () => {
    if (imageUris.length === 0) {
      Alert.alert('No Images to Share', 'Please convert a PDF file first.');
      return;
    }

    try {
      const options = {
        title: 'Share Images',
        urls: imageUris,
        type: 'image/jpeg',
      };
      await Share.open(options);
    } catch (error) {
      console.log('Error sharing images: ', error);
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
      {loading && (<Loading message={'Converting..'} />)}
      {success && (<Success message={'Convertion Success'} />)}
      {error && (<Error message={'Convertion Failed'} />)}
      <HeaderBarOthers props={props} />
      <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 24, textAlign: 'center', marginVertical: 10 }}>
        PDF To Images
      </Text>
      <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 16 }}>
        {!pdfUri && (
          <TouchableOpacity style={{ marginVertical: 20 }} onPress={pickDocument}>
            <LottieView
              style={{ height: screenHeight * 0.3, width: screenWidth * 0.6, alignSelf: 'center' }}
              source={require('../assets/lotties/choosefile.json')}
              autoPlay
              loop
            />
            <Text style={{ color: COLORS.secondary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 24, textAlign: 'center' }}>
              Choose a PDF File
            </Text>
          </TouchableOpacity>
        )}
        {fileUri && !pdfUri && (
          <Button
            style={{ width: screenWidth * 0.6, alignSelf: 'center', margin: 5 }}
            icon="file-pdf-box"
            mode="elevated"
            onPress={convertToPdf}
          >
            Convert to Images
          </Button>
        )}
        {pdfUri && (
          <>
            <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 22, textAlign: 'center', marginTop: 5 }}>
              Preview Images
            </Text>
            <ScrollView horizontal>
              {imageUris.map((uri, index) => (
                <View key={index} style={{ alignItems: 'center', marginHorizontal: 10 }}>
                  <Image source={{ uri }} style={{ width: screenWidth * 0.8, height: screenHeight * 0.55, resizeMode: 'contain' }} />
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                    <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 16, textAlign: 'center', marginRight: 10 }}>
                      Page {index + 1}
                    </Text>
                    <IconButton
                      icon="share"
                      iconColor={COLORS.secondary}
                      mode="contained"
                      size={20}
                      onPress={() => shareImage(uri)}
                    />
                  </View>
                </View>
              ))}
            </ScrollView>
            <View style={{ width: screenWidth, alignItems: 'center', marginTop: 20 }}>
              <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
                Images saved at: file://storage/emulated/0/Download/PDFgo/PdfToImage/
              </Text>
              <Button
                style={{ width: screenWidth * 0.4 }}
                icon="share-all"
                mode="elevated"
                onPress={shareAllImages}
              >
                Share All Images
              </Button>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PdfToImageScreen;
