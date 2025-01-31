import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { Modal, Portal, Button, PaperProvider } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import Pdf from 'react-native-pdf';
import Share from 'react-native-share';
import { IconButton } from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import { COLORS, FONTFAMILY } from '../theme/theme';
import HeaderBarOthers from '../components/HeaderBarOthers';
import { watermarkpdf } from '../api/ApiCalls';
import Loading from '../components/Loading';
import Success from '../components/Success';
import Error from '../components/Error';
import NoInternetConnection from '../components/NoInternetConnection';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const WatermarkScreen = (props: any) => {
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
  const [watermarkText, setWatermarkText] = useState('');
  const [fontStyle, setFontStyle] = useState('Arial');
  const [fontSize, setFontSize] = useState<string>('40');
  const [fontColor, setFontColor] = useState('#ffffff');
  const [strokeColor, setStrokeColor] = useState('#271851');
  const [strokeWidth, setStrokeWidth] = useState<string>('1');
  const [opacity, setOpacity] = useState<string>('100');
  const [horizontalAlignment, setHorizontalAlignment] = useState('Center');
  const [verticalAlignment, setVerticalAlignment] = useState('Center');
  const [compressedPdfUri, setCompressedPdfUri] = useState<string | null>(null);
  const [isFontStylePickerOpen, setIsFontStylePickerOpen] = useState(false);
  const [isHorizontalPickerOpen, setIsHorizontalPickerOpen] = useState(false);
  const [isVerticalPickerOpen, setIsVerticalPickerOpen] = useState(false);
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const fontStyles = [
    { label: 'Arial', value: 'Arial' },
    { label: 'Bahnschrift', value: 'Bahnschrift' },
    { label: 'Calibri', value: 'Calibri' },
    { label: 'Cambria', value: 'Cambria' },
    { label: 'Consolas', value: 'Consolas' },
    { label: 'Constantia', value: 'Constantia' },
    { label: 'Courier New', value: 'Courier New' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Tahoma', value: 'Tahoma' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Verdana', value: 'Verdana' },
  ];

  const horizontalAlignments = [
    { label: 'Left', value: 'Left' },
    { label: 'Center', value: 'Center' },
    { label: 'Right', value: 'Right' },
  ];

  const verticalAlignments = [
    { label: 'Top', value: 'Top' },
    { label: 'Center', value: 'Center' },
    { label: 'Bottom', value: 'Bottom' },
  ];

  const validateHexColor = (color: any) => /^#[0-9A-F]{6}$/i.test(color);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });
      if (result) {
        setFileUri(result.uri);
        setFileName(result.name);
        const fileContent = await RNFS.readFile(result.uri, 'base64');
        const pageCount = await getPageCount(result.uri);
        if (pageCount > 2000) {
          Alert.alert('Error', 'PDF file should not have more than 2000 pages.');
          setFileUri('');
          setFileName('');
          return;
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.log('Unknown error: ', err);
      }
    }
  };

  const getPageCount = async (uri: any) => {
    return 1000;
  };

  const handleSave = async () => {
    if (watermarkText.trim() === '' || watermarkText.length > 100) {
      Alert.alert('Invalid Input', 'Watermark text must be filled and within 100 characters.');
      return;
    }
    if (!validateHexColor(fontColor) || !validateHexColor(strokeColor)) {
      Alert.alert('Invalid Input', 'Color codes must be valid hex codes.');
      return;
    }
    const fontSizeValue = parseInt(fontSize, 10);
    if (isNaN(fontSizeValue) || fontSizeValue < 1 || fontSizeValue > 200) {
      Alert.alert('Invalid Input', 'Font size must be a number between 1 and 200.');
      return;
    }
    const strokeWidthValue = parseInt(strokeWidth, 10);
    if (isNaN(strokeWidthValue) || strokeWidthValue < 0 || strokeWidthValue > 200) {
      Alert.alert('Invalid Input', 'Stroke width must be a number between 0 and 200.');
      return;
    }

    const opacityValue = parseInt(opacity, 10);
    if (isNaN(opacityValue) || opacityValue < 0 || opacityValue > 100) {
      Alert.alert('Invalid Input', 'Opacity must be a number between 0 and 100.');
      return;
    }
    if (!fileUri) {
      Alert.alert('No File Selected', 'Please select a PDF file first.');
      return;
    }

    try {
      setLoading(true);
      const fileContent = await RNFS.readFile(fileUri, 'base64');
      const response = await watermarkpdf(fileName, fileContent, watermarkText, fontStyle, fontSize, fontColor, strokeColor, strokeWidth, opacity, horizontalAlignment, verticalAlignment)
      console.log(response?.data);
      const pdfUrl = response?.data.Files[0].Url;
      const pdfResponse = await axios.get(pdfUrl, { responseType: 'blob' });
      const fileReaderInstance = new FileReader();
      fileReaderInstance.readAsDataURL(pdfResponse.data);
      fileReaderInstance.onload = async () => {
        const base64data = fileReaderInstance.result as string;
        const path = `/storage/emulated/0/Download/PDFgo/AddWatermark/${fileName}_watermarked.pdf`;
        await RNFS.writeFile(path, base64data.split(',')[1], 'base64');
        setCompressedPdfUri(`file://${path}`);
        triggerSuccess()
      };
    } catch (error) {
      console.error('Error watermarking file: ', error);
      triggerError()
    } finally {
      setLoading(false)
    }
  };

  const sharePdf = async () => {
    if (!compressedPdfUri) {
      Alert.alert('No PDF to Share', 'Please convert a file first.');
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
      console.log('Error sharing PDF: ', error);
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
    <PaperProvider>
      <SafeAreaView style={{ height: screenHeight, width: screenWidth, backgroundColor: COLORS.lightBackground }}>
        <StatusBar
          backgroundColor={COLORS.lightBackground}
          barStyle={'dark-content'}
        />
        {!connectionStatus && (<NoInternetConnection />)}
        {loading && (<Loading message={'Adding..'} />)}
        {success && (<Success message={'Addition Success'} />)}
        {error && (<Error message={'Addition Failed'} />)}
        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={{ height: screenHeight * 0.7, width: screenWidth * 0.9, borderRadius: 20, borderColor: COLORS.primary, borderWidth: 2, backgroundColor: COLORS.tertiary, alignSelf: 'center' }}>
            <Text style={{ fontFamily: FONTFAMILY.poppins_medium, color: COLORS.secondary, alignSelf: 'center', fontSize: 20 }}>Information</Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ height: 'auto', width: screenWidth * 0.9 }}>
              <Text style={{ textAlign: 'center', marginHorizontal: 5, color: COLORS.darkText2, fontSize: 15 }}>Watermarking a PDF adds a text or image overlay to its pages for purposes like marking it as confidential, draft, or approved, or adding branding or copyright info.</Text>
              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: COLORS.primary, fontSize: 17 }}>Watermark Text</Text>
                <Text style={{ color: COLORS.darkText2, fontSize: 15 }}>Enter your watermark text here (max 100 characters).</Text>
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: COLORS.primary, fontSize: 17 }}>Font Style</Text>
                <Text style={{ color: COLORS.darkText2, fontSize: 15 }}>
                  Options: Arial, Bahnschrift, Calibri, Cambria, Consolas, Constantia, Courier New, Georgia, Tahoma, Times New Roman, Verdana
                </Text>
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: COLORS.primary, fontSize: 17 }}>Font Size</Text>
                <Text style={{ color: COLORS.darkText2, fontSize: 15 }}>Default value: 40 (range 1-200)</Text>
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: COLORS.primary, fontSize: 17 }}>Font Color</Text>
                <Text style={{ color: COLORS.darkText2, fontSize: 15 }}>Default value: #ffffff (must be a hex code)</Text>
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: COLORS.primary, fontSize: 17 }}>Stroke Color</Text>
                <Text style={{ color: COLORS.darkText2, fontSize: 15 }}>Default value: #271851 (must be a hex code)</Text>
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: COLORS.primary, fontSize: 17 }}>Stroke Width</Text>
                <Text style={{ color: COLORS.darkText2, fontSize: 15 }}>Default value: 1 (range 0-200)</Text>
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: COLORS.primary, fontSize: 17 }}>Opacity</Text>
                <Text style={{ color: COLORS.darkText2, fontSize: 15 }}>Default value: 100 (range 0-100)</Text>
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: COLORS.primary, fontSize: 17 }}>Horizontal Alignment</Text>
                <Text style={{ color: COLORS.darkText2, fontSize: 15 }}>
                  Options: Left, Center, Right
                </Text>
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: COLORS.primary, fontSize: 17 }}>Vertical Alignment</Text>
                <Text style={{ color: COLORS.darkText2, fontSize: 15 }}>
                  Options: Top, Center, Bottom
                </Text>
              </View>
            </ScrollView>
          </Modal>
        </Portal>
        <HeaderBarOthers props={props} />
        <View style={{ flexDirection: 'row', marginVertical: 10, alignSelf: 'center' }}>
          <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 24, textAlign: 'center' }}>
            Add Watermark To PDF
          </Text>
          <IconButton
            icon="information-outline"
            style={{ alignSelf: 'center', marginTop: 0 }}
            iconColor={COLORS.primary}
            size={25}
            onPress={() => { showModal() }}
          />
        </View>

        <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 16 }}>

          {!compressedPdfUri && (<>
            <Text style={{ color: COLORS.secondary, fontFamily: FONTFAMILY.poppins_medium, fontSize: 24, textAlign: 'center', marginVertical: 10 }}>
              Watermark Settings
            </Text>
            <Text style={{
              color: `${COLORS.secondary}50`,
              fontFamily: FONTFAMILY.poppins_bold,
              fontSize: 15,
              marginTop: 10,
            }}>Watermark Text</Text>
            <TextInput
              style={{ width: screenWidth * 0.8, padding: 10, borderColor: COLORS.tertiary, borderWidth: 1, borderRadius: 5, marginVertical: 10 }}
              placeholder="Watermark Text"
              value={watermarkText}
              onChangeText={setWatermarkText}
              maxLength={100}
            />
            <Text style={{
              color: `${COLORS.secondary}50`,
              fontFamily: FONTFAMILY.poppins_bold,
              fontSize: 15,
              marginTop: 10,
            }}>Font Style</Text>
            <DropDownPicker
              items={fontStyles}
              open={isFontStylePickerOpen}
              setOpen={setIsFontStylePickerOpen}
              value={fontStyle}
              setValue={setFontStyle}
              placeholder="Font Style"
              containerStyle={{ width: screenWidth * 0.8, marginVertical: 10 }}
              style={{ backgroundColor: COLORS.tertiary }}
              textStyle={{ color: COLORS.darkText1, fontFamily: FONTFAMILY.poppins_medium, fontSize: 15 }}
            />
            <Text style={{
              color: `${COLORS.secondary}50`,
              fontFamily: FONTFAMILY.poppins_bold,
              fontSize: 15,
              marginTop: 10,
            }}>Font Size</Text>
            <TextInput
              style={{ width: screenWidth * 0.8, padding: 10, borderColor: COLORS.tertiary, borderWidth: 1, borderRadius: 5, marginVertical: 10 }}
              placeholder="Font Size"
              value={fontSize}
              onChangeText={setFontSize}
              keyboardType="numeric"
            />
            <Text style={{
              color: `${COLORS.secondary}50`,
              fontFamily: FONTFAMILY.poppins_bold,
              fontSize: 15,
              marginTop: 10,
            }}>Font Color</Text>
            <TextInput
              style={{ width: screenWidth * 0.8, padding: 10, borderColor: COLORS.tertiary, borderWidth: 1, borderRadius: 5, marginVertical: 10 }}
              placeholder="Font Color"
              value={fontColor}
              onChangeText={setFontColor}
            />
            <Text style={{
              color: `${COLORS.secondary}50`,
              fontFamily: FONTFAMILY.poppins_bold,
              fontSize: 15,
              marginTop: 10,
            }}>Stroke Color</Text>
            <TextInput
              style={{ width: screenWidth * 0.8, padding: 10, borderColor: COLORS.tertiary, borderWidth: 1, borderRadius: 5, marginVertical: 10 }}
              placeholder="Stroke Color"
              value={strokeColor}
              onChangeText={setStrokeColor}
            />
            <Text style={{
              color: `${COLORS.secondary}50`,
              fontFamily: FONTFAMILY.poppins_bold,
              fontSize: 15,
              marginTop: 10,
            }}>Stroke Width</Text>
            <TextInput
              style={{ width: screenWidth * 0.8, padding: 10, borderColor: COLORS.tertiary, borderWidth: 1, borderRadius: 5, marginVertical: 10 }}
              placeholder="Stroke Width"
              value={strokeWidth}
              onChangeText={setStrokeWidth}
              keyboardType="numeric"
            />
            <Text style={{
              color: `${COLORS.secondary}50`,
              fontFamily: FONTFAMILY.poppins_bold,
              fontSize: 15,
              marginTop: 10,
            }}>Opacity</Text>
            <TextInput
              style={{ width: screenWidth * 0.8, padding: 10, borderColor: COLORS.tertiary, borderWidth: 1, borderRadius: 5, marginVertical: 10 }}
              placeholder="Opacity"
              value={opacity}
              onChangeText={setOpacity}
              keyboardType="numeric"
            />
            <Text style={{
              color: `${COLORS.secondary}50`,
              fontFamily: FONTFAMILY.poppins_bold,
              fontSize: 15,
              marginTop: 10,
            }}>Horizontal Alignment</Text>
            <DropDownPicker
              items={horizontalAlignments}
              open={isHorizontalPickerOpen}
              setOpen={setIsHorizontalPickerOpen}
              value={horizontalAlignment}
              setValue={setHorizontalAlignment}
              placeholder="Horizontal Alignment"
              containerStyle={{ width: screenWidth * 0.8, marginVertical: 10 }}
              style={{ backgroundColor: COLORS.tertiary }}
              textStyle={{ color: COLORS.darkText1, fontFamily: FONTFAMILY.poppins_medium, fontSize: 15 }}
            />
            <Text style={{
              color: `${COLORS.secondary}50`,
              fontFamily: FONTFAMILY.poppins_bold,
              fontSize: 15,
              marginTop: 10,
            }}>Vertical Alignment</Text>
            <DropDownPicker
              items={verticalAlignments}
              open={isVerticalPickerOpen}
              setOpen={setIsVerticalPickerOpen}
              value={verticalAlignment}
              setValue={setVerticalAlignment}
              placeholder="Vertical Alignment"
              containerStyle={{ width: screenWidth * 0.8, marginVertical: 10 }}
              style={{ backgroundColor: COLORS.tertiary }}
              textStyle={{ color: COLORS.darkText1, fontFamily: FONTFAMILY.poppins_medium, fontSize: 15 }}
            />
          </>)}
          {!compressedPdfUri && (
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
          )}

          {fileUri && !compressedPdfUri && (
            <Button
              style={{ width: screenWidth * 0.4, alignSelf: 'center', margin: 5 }}
              icon="file-pdf-box"
              mode="elevated"
              onPress={handleSave}
            >
              Save Watermark
            </Button>
          )}
        </ScrollView>
        {compressedPdfUri && (
          <>
            <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 22, textAlign: 'center', marginTop: 5 }}>
              Preview Watermarked PDF
            </Text>
            <Pdf
              source={{ uri: compressedPdfUri }}
              style={{ width: screenWidth, height: screenHeight * 0.55 }}
            />
            <View style={{ width: screenWidth }}>
              <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 16, textAlign: 'center', marginTop: 20 }}>
                PDF saved at: {compressedPdfUri}
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
    </PaperProvider>
  );
};

export default WatermarkScreen;


