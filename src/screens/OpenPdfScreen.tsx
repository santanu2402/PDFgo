import React, { useState } from 'react';
import { View, PermissionsAndroid, Platform, SafeAreaView, Dimensions, StatusBar, Text, TouchableOpacity } from 'react-native';
import DocumentPicker, { types, DocumentPickerResponse } from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import { Button } from 'react-native-paper';
import LottieView from 'lottie-react-native';

import HeaderBarOthers from '../components/HeaderBarOthers';
import { COLORS, FONTFAMILY } from '../theme/theme';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const OpenPdfScreen = (props: any) => {
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [curPages, setCurPages] = useState<number | null>(null);
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'This app needs access to your storage to view PDF files.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const pickDocument = async () => {
    const permissionGranted = await requestStoragePermission();
    if (!permissionGranted) {
      return;
    }
    try {
      const result: DocumentPickerResponse = await DocumentPicker.pickSingle({
        type: [types.pdf],
      });
      const resolvedUri = await resolveContentUri(result.uri);
      setPdfUri(resolvedUri);
      setPdfName(result.name);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
      }
    }
  };

  const resolveContentUri = async (contentUri: string) => {
    if (Platform.OS === 'android' && contentUri.startsWith('content://')) {
      try {
        const destPath = `${RNFS.TemporaryDirectoryPath}/${new Date().getTime()}.pdf`;
        await RNFS.copyFile(contentUri, destPath);
        return `file://${destPath}`;
      } catch (err) {
        console.error('Failed to resolve content URI:', err);
        return null;
      }
    }
    return contentUri;
  };

  return (
    <SafeAreaView style={{ height: screenHeight, width: screenWidth, backgroundColor: COLORS.lightBackground }}>
      <StatusBar
        backgroundColor={COLORS.lightBackground}
        barStyle={'dark-content'}
      />

      <HeaderBarOthers props={props} />
      <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 24, textAlign: 'center', marginVertical: 10 }}>
        PDF Viewer
      </Text>
      {pdfUri ? (
        <SafeAreaView style={{ backgroundColor: COLORS.lightBackground }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 10, marginRight: 10 }}>
            <Text style={{ backgroundColor: `${COLORS.secondary}20`, borderRadius: 10, padding: 5, fontFamily: FONTFAMILY.poppins_medium }}>
              {pdfName}
            </Text>
            <Text style={{ backgroundColor: `${COLORS.secondary}20`, borderRadius: 10, padding: 5, fontFamily: FONTFAMILY.poppins_medium }}>
              {`${curPages}/${totalPages}`}
            </Text>
          </View>
          <Pdf
            source={{ uri: pdfUri }}
            style={{ height: screenHeight * 0.8, width: screenWidth * 0.95, alignSelf: 'center', margin: 5, backgroundColor: COLORS.lightBackground }}
            onLoadComplete={(numberOfPages, filePath) => {
              setTotalPages(numberOfPages);
            }}
            onPageChanged={(page, numberOfPages) => {
              setCurPages(page);
            }}
            onError={(error) => {
            }}
          />
          <Button style={{ width: screenWidth * 0.4, alignSelf: 'center', margin: 5 }} icon="file-document" mode="elevated" onPress={pickDocument}>
            Choose Pdf
          </Button>
        </SafeAreaView>
      ) : (<SafeAreaView style={{ height: screenHeight * 0.9, width: screenWidth * 0.95, alignSelf: 'center', margin: 5, backgroundColor: COLORS.lightBackground }}>
        <TouchableOpacity style={{ height: screenHeight * 0.9, width: screenWidth * 0.95, alignItems: 'center' }} onPress={pickDocument}>
          <LottieView style={{ height: screenHeight * 0.5, width: screenWidth * 0.7, alignSelf: 'center', marginTop: 130 }} source={require('../assets/lotties/choosefile.json')} autoPlay loop />
          <Text style={{ color: COLORS.secondary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 30 }}>Choose PDF</Text>
        </TouchableOpacity>
      </SafeAreaView>)}
    </SafeAreaView>
  );
};

export default OpenPdfScreen;
