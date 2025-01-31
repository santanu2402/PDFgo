import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, Dimensions, StatusBar } from 'react-native';
import { Button, Provider } from 'react-native-paper';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import Pdf from 'react-native-pdf';
import DropDownPicker from 'react-native-dropdown-picker';
import NetInfo from '@react-native-community/netinfo';

import HeaderBarOthers from '../components/HeaderBarOthers';
import { COLORS, FONTFAMILY } from '../theme/theme';
import { compresspdf } from '../api/ApiCalls';
import Loading from '../components/Loading';
import Success from '../components/Success';
import Error from '../components/Error';
import NoInternetConnection from '../components/NoInternetConnection';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
let orgsize: any;
const PdfCompressionScreen = (props: any) => {
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
  const [compressedPdfUri, setCompressedPdfUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [compressedFileSize, setCompressedFileSize] = useState<number | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [currentPickerValue, setCurrentPickerValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const itemsPick = [
    { label: 'Highest Compression', value: 'text' },
    { label: 'High Compression', value: 'archive' },
    { label: 'Medium Compression', value: 'web' },
    { label: 'Less Compression', value: 'ebook' },
    { label: 'Very Less Compression', value: 'printer' },
  ];

  const pickDocument = async () => {
    try {
      const result: DocumentPickerResponse = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });
      if (result) {
        setFileUri(result.uri);
        setFileName(result.name);
        orgsize = result.size;
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
      }
    }
  };

  const compressPdf = async () => {
    if (!fileUri) {
      Alert.alert('No File Selected', 'Please select a PDF file first.');
      return;
    }
    if (!currentPickerValue) {
      Alert.alert('No Compression Level Selected', 'Please select a compression level.');
      return;
    }

    try {
      setLoading(true)
      const fileContent = await RNFS.readFile(fileUri, 'base64');
      const response = await compresspdf(fileName, fileContent, currentPickerValue)
      const pdfUrl = response?.data.Files[0].Url;
      const pdfResponse = await axios.get(pdfUrl, { responseType: 'blob' });
      const fileReaderInstance = new FileReader();
      fileReaderInstance.readAsDataURL(pdfResponse.data);
      fileReaderInstance.onload = async () => {
        const base64data = fileReaderInstance.result as string;
        const path = `/storage/emulated/0/Download/PDFgo/PdfCompressor/${fileName}_compressed.pdf`;
        await RNFS.writeFile(path, base64data.split(',')[1], 'base64');

        const fileStat = await RNFS.stat(path);
        setCompressedFileSize(fileStat.size / (1024 * 1024)); // size in MB

        setCompressedPdfUri(`file://${path}`);
        triggerSuccess()
      };
    } catch (error) {
      console.error('Error compressing file: ', error);
      triggerError()
    } finally {
      setLoading(false)
    }
  };

  const sharePdf = async () => {
    if (!compressedPdfUri) {
      Alert.alert('No PDF to Share', 'Please compress a file first.');
      return;
    }

    try {
      const options = {
        title: 'Share PDF',
        url: compressedPdfUri,
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
    <Provider>
      <SafeAreaView style={{ height: screenHeight, width: screenWidth, backgroundColor: COLORS.lightBackground }}>
        <StatusBar
          backgroundColor={COLORS.lightBackground}
          barStyle={'dark-content'}
        />
        {!connectionStatus && (<NoInternetConnection />)}
        {loading && (<Loading message={'Compressing..'} />)}
        {success && (<Success message={'Compression Success'} />)}
        {error && (<Error message={'Compression Failed'} />)}
        <HeaderBarOthers props={props} />
        <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 24, textAlign: 'center', marginVertical: 10 }}>
          PDF Compression
        </Text>
        {!compressedPdfUri && (
          <>
            <View style={{ width: screenWidth * 0.8, alignSelf: 'center', zIndex: 11 }}>
              <DropDownPicker
                items={itemsPick}
                open={isPickerOpen}
                setOpen={setIsPickerOpen}
                value={currentPickerValue}
                setValue={setCurrentPickerValue}
                autoScroll={true}
                dropDownDirection='BOTTOM'
                placeholder='Choose level of Compression'
                style={{
                  backgroundColor: COLORS.tertiary,
                  width: screenWidth * 0.8,
                  alignSelf: 'center',
                }}
                textStyle={{
                  color: COLORS.darkText1,
                  fontFamily: FONTFAMILY.poppins_medium,
                  fontSize: 15,
                }}
                labelStyle={{
                  color: COLORS.darkText1,
                  fontFamily: FONTFAMILY.poppins_medium,
                }}
              />
            </View>

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
            <Button
              style={{ width: screenWidth * 0.4, alignSelf: 'center', margin: 5 }}
              icon="file-pdf-box"
              mode="elevated"
              onPress={compressPdf}
            >
              Compress PDF
            </Button>
          </>
        )}
        {compressedPdfUri && (
          <>
            <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 22, textAlign: 'center', marginTop: 5 }}>
              Preview Compressed PDF
            </Text>
            <Pdf
              source={{ uri: compressedPdfUri }}
              style={{ width: screenWidth, height: screenHeight * 0.55 }}
            />
            <View style={{ width: screenWidth }}>
              <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 16, textAlign: 'center', marginTop: 20 }}>
                PDF saved at: {compressedPdfUri}
              </Text>

              <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 16, textAlign: 'center', marginTop: 5 }}>
                Compressed File Size: {compressedFileSize?.toFixed(2)} MB
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
      </SafeAreaView>
    </Provider>
  );
};

export default PdfCompressionScreen;
