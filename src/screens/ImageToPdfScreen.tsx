import React, {  useState } from 'react';
import { Text, TextInput, TouchableOpacity, Alert, Dimensions, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Button } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import Share from 'react-native-share';
import { createPdf } from 'react-native-images-to-pdf';
import HeaderBarOthers from '../components/HeaderBarOthers';
import LottieView from 'lottie-react-native';
import { COLORS, FONTFAMILY } from '../theme/theme';
import Loading from '../components/Loading';
import Success from '../components/Success';
import Error from '../components/Error';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ImageToPdfScreen = (props: any) => {

  const [images, setImages] = useState<any[]>([]);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [newPdfName, setNewPdfName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
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
  const pickImages = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        allowMultiSelection: true,
      });
      if (result) {
        setImages(result);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
      }
    }
  };

  const createPdfFromImages = async () => {
    if (images.length === 0) {
      Alert.alert('No Images Selected', 'Please select images to create a PDF.');
      return;
    }

    if (newPdfName.trim() === '') {
      Alert.alert('Invalid PDF Name', 'Please enter a valid name for the PDF.');
      return;
    }

    try {
      setLoading(true)
      const outputPath = `/storage/emulated/0/Download/PDFgo/ImageToPdf/${newPdfName}.pdf`;

      const options = {
        pages: images.map(image => ({ imagePath: image.uri })),
        outputPath: `file://${outputPath}`,
      };
      const path = await createPdf(options);
      setPdfUri(path);
      triggerSuccess()
      setNewPdfName('');
      setImages([]);
    } catch (err) {
      triggerError()
    } finally {
      setLoading(false)
    }
  };

  const sharePdf = async () => {
    if (!pdfUri) {
      Alert.alert('No PDF to Share', 'Please create a PDF first.');
      return;
    }

    try {
      const pdfPath = pdfUri.replace('file://', '');

      const options = {
        title: 'Share PDF',
        url: `file://${pdfPath}`,
        type: 'application/pdf',
      };

      await Share.open(options);
    } catch (error) {
    }
  };

  return (
    <SafeAreaView style={{ height: screenHeight, width: screenWidth, backgroundColor: COLORS.lightBackground }}>
      <StatusBar
        backgroundColor={COLORS.lightBackground}
        barStyle={'dark-content'}
      />
      {loading && (<Loading message={'Converting..'} />)}
      {success && (<Success message={'Convertion Success'} />)}
      {error && (<Error message={'Convertion Failed'} />)}
      <HeaderBarOthers props={props} />
      <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 24, textAlign: 'center', marginVertical: 5 }}>
        Image To PDF
      </Text>
      <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 16 }}>
        {!pdfUri && (
          <TouchableOpacity style={{ marginVertical: 20 }} onPress={pickImages}>
            <LottieView style={{ height: screenHeight * 0.3, width: screenWidth * 0.6, alignSelf: 'center' }} source={require('../assets/lotties/image.json')} autoPlay loop />
            <Text style={{ color: COLORS.secondary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 24, textAlign: 'center' }}>Choose Images</Text>
          </TouchableOpacity>
        )}
        {images.length > 0 && !pdfUri && (
          <>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: screenWidth * 0.8, marginVertical: 10, paddingHorizontal: 10 }}
              placeholder="Enter PDF name"
              value={newPdfName}
              onChangeText={setNewPdfName}
            />
            <Button style={{ width: screenWidth * 0.4, alignSelf: 'center', margin: 5 }} icon="file-pdf-box" mode="elevated" onPress={createPdfFromImages}>
              Create PDF
            </Button>
          </>
        )}
        {pdfUri && (
          <>
            <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 22, textAlign: 'center', marginTop: 20 }}>
              Preview PDF
            </Text>
            <Pdf
              source={{ uri: pdfUri }}
              style={{ flex: 1, width: screenWidth, height: screenHeight * 0.5 }}
            />
            <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 16, textAlign: 'center', marginTop: 20 }}>
              PDF saved at: {pdfUri}
            </Text>
            <Button style={{ width: screenWidth * 0.4, alignSelf: 'center', margin: 5 }} icon="share-variant" mode="elevated" onPress={sharePdf}>
              Share PDF
            </Button>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ImageToPdfScreen;
