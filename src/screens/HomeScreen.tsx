import { View, Text, StatusBar, SafeAreaView, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { useStore } from '../store/store';
import HeaderBarHome from '../components/HeaderBarHome';
import { COLORS, FONTFAMILY } from '../theme/theme';
import LottieView from 'lottie-react-native';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Iconfa6 from 'react-native-vector-icons/FontAwesome6';
import Iconfa5 from 'react-native-vector-icons/FontAwesome5';
import NoInternetConnection from '../components/NoInternetConnection';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const HomeScreen = (props: any) => {

  const setActive = useStore((state: any) => state.setActive);
  useFocusEffect(
    () => {
      setActive('');
    }
  );

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.tertiary, height: screenHeight, width: screenWidth }}>
      <StatusBar
        backgroundColor={COLORS.tertiary}
        barStyle={'dark-content'}
      />
      <HeaderBarHome props={props} />
      <LottieView
        style={{ height: screenHeight * 0.35, width: screenWidth, alignSelf: 'center' }}
        source={require('../assets/lotties/home.json')}
        autoPlay
        loop
      />
      <View style={{ alignItems: 'center', height: screenHeight * 0.58, width: screenWidth * 0.9, alignSelf: 'center', backgroundColor: COLORS.lightBackground, borderRadius: 20 }}>

        <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 10, }} showsVerticalScrollIndicator={false}>

          <TouchableOpacity onPress={() => {
            setActive('wtrmrk');
            props.navigation.push('WatermarkScreen')
          }} >
            <View style={{ alignSelf: 'center', margin: 2, borderRadius: 20, borderWidth: 2, borderColor: COLORS.tertiary, width: '99%', backgroundColor: COLORS.secondary, flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }}>
              <View style={{ margin: 5, flexDirection: 'row' }}>
                <IconMaterial name="watermark" style={{ alignSelf: 'center', marginRight: 30 }} size={50} color={COLORS.tertiary} />
                <Text style={{ color: COLORS.tertiary, fontFamily: FONTFAMILY.poppins_extrabold, fontSize: 20 }}>Add Watermark</Text>
              </View>
              <View style={{ flexDirection: 'column', margin: 5 }}>
                <Text style={{ textAlign: 'justify', color: COLORS.lightText1, fontSize: 15 }}>Watermarking a PDF adds a text or image overlay to its pages for purposes like marking it as confidential, draft, or approved, or adding branding or copyright info.</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            setActive('dcrpdf');
            props.navigation.push('DecryptPdfScreen')
          }} >
            <View style={{ alignSelf: 'center', margin: 2, borderRadius: 20, borderWidth: 2, borderColor: COLORS.tertiary, width: '99%', backgroundColor: COLORS.secondary, flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }}>
              <View style={{ margin: 5, flexDirection: 'row' }}>
                <Iconfa6 name="unlock" style={{ alignSelf: 'center', marginRight: 30 }} size={50} color={COLORS.tertiary} />
                <Text style={{ color: COLORS.tertiary, fontFamily: FONTFAMILY.poppins_extrabold, fontSize: 20 }}>Decryption</Text>
              </View>
              <View style={{ flexDirection: 'column', margin: 5 }}>
                <Text style={{ textAlign: 'justify', color: COLORS.lightText1, fontSize: 15 }}>Unlocking PDF documents and removing owner or user passwords can be accomplished. Decrypt PDFs by removing restrictions and passwords.</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            setActive('encrpdf');
            props.navigation.push('EncryptScreen')
          }} >
            <View style={{ alignSelf: 'center', margin: 2, borderRadius: 20, borderWidth: 2, borderColor: COLORS.tertiary, width: '99%', backgroundColor: COLORS.secondary, flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }}>
              <View style={{ margin: 5, flexDirection: 'row' }}>
                <Iconfa6 name="lock" style={{ alignSelf: 'center', marginRight: 30 }} size={50} color={COLORS.tertiary} />
                <Text style={{ color: COLORS.tertiary, fontFamily: FONTFAMILY.poppins_extrabold, fontSize: 20 }}>Encryption</Text>
              </View>
              <View style={{ flexDirection: 'column', margin: 5 }}>
                <Text style={{ textAlign: 'justify', color: COLORS.lightText1, fontSize: 15 }}>Protecting and encrypting PDF documents with a password involves setting a user password, which restricts access to the document, and optionally an owner password, which restricts certain actions like printing or editing.</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            setActive('exltopdf');
            props.navigation.push('ExcelToPdfScreen')
          }} >
            <View style={{ alignSelf: 'center', margin: 2, borderRadius: 20, borderWidth: 2, borderColor: COLORS.tertiary, width: '99%', backgroundColor: COLORS.secondary, flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }}>
              <View style={{ margin: 5, flexDirection: 'row' }}>
                <Iconfa6 name="file-excel" style={{ alignSelf: 'center', marginRight: 30 }} size={50} color={COLORS.tertiary} />
                <Text style={{ color: COLORS.tertiary, fontFamily: FONTFAMILY.poppins_extrabold, fontSize: 20 }}>Excel To PDF</Text>
              </View>
              <View style={{ flexDirection: 'column', margin: 5 }}>
                <Text style={{ textAlign: 'justify', color: COLORS.lightText1, fontSize: 15 }}>
                  Converting Excel documents to PDF files allows for easy sharing and ensures consistent formatting across different platforms, simplifying document management and enhancing accessibility.</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            setActive('imgtopdf');
            props.navigation.push('ImageToPdfScreen')
          }} >
            <View style={{ alignSelf: 'center', margin: 2, borderRadius: 20, borderWidth: 2, borderColor: COLORS.tertiary, width: '99%', backgroundColor: COLORS.secondary, flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }}>
              <View style={{ margin: 5, flexDirection: 'row' }}>
                <Iconfa6 name="file-image" style={{ alignSelf: 'center', marginRight: 30 }} size={50} color={COLORS.tertiary} />
                <Text style={{ color: COLORS.tertiary, fontFamily: FONTFAMILY.poppins_extrabold, fontSize: 20 }}>Images To PDF</Text>
              </View>
              <View style={{ flexDirection: 'column', margin: 5 }}>
                <Text style={{ textAlign: 'justify', color: COLORS.lightText1, fontSize: 15 }}>
                  Generating PDFs from images consolidates multiple images into a single, easily shareable document, ideal for presentations, portfolios, or archiving visual content efficiently.</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            setActive('mrgpdf');
            props.navigation.push('MergePdfScreen')
          }} >
            <View style={{ alignSelf: 'center', margin: 2, borderRadius: 20, borderWidth: 2, borderColor: COLORS.tertiary, width: '99%', backgroundColor: COLORS.secondary, flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }}>
              <View style={{ margin: 5, flexDirection: 'row' }}>
                <IconMaterial name="merge" style={{ alignSelf: 'center', marginRight: 30 }} size={50} color={COLORS.tertiary} />
                <Text style={{ color: COLORS.tertiary, fontFamily: FONTFAMILY.poppins_extrabold, fontSize: 20 }}>Merge PDFs</Text>
              </View>
              <View style={{ flexDirection: 'column', margin: 5 }}>
                <Text style={{ textAlign: 'justify', color: COLORS.lightText1, fontSize: 15 }}>
                  Merging multiple PDF files into a single document streamlines document management and enhances organization, facilitating easier sharing and storage of related information.</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            setActive('pdfcomp');
            props.navigation.push('PdfCompressionScreen')
          }} >
            <View style={{ alignSelf: 'center', margin: 2, borderRadius: 20, borderWidth: 2, borderColor: COLORS.tertiary, width: '99%', backgroundColor: COLORS.secondary, flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }}>
              <View style={{ margin: 5, flexDirection: 'row' }}>
                <Iconfa5 name="compress-arrows-alt" style={{ alignSelf: 'center', marginRight: 30 }} size={50} color={COLORS.tertiary} />
                <Text style={{ color: COLORS.tertiary, fontFamily: FONTFAMILY.poppins_extrabold, fontSize: 20 }}>Compress PDF</Text>
              </View>
              <View style={{ flexDirection: 'column', margin: 5 }}>
                <Text style={{ textAlign: 'justify', color: COLORS.lightText1, fontSize: 15 }}>
                  Compressing and reducing a PDF file size by up to 90% conserves storage space and speeds up document transmission, ensuring faster uploads and downloads without sacrificing quality.</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            setActive('pdfread');
            props.navigation.push('OpenPdfScreen')
          }} >
            <View style={{ alignSelf: 'center', margin: 2, borderRadius: 20, borderWidth: 2, borderColor: COLORS.tertiary, width: '99%', backgroundColor: COLORS.secondary, flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }}>
              <View style={{ margin: 5, flexDirection: 'row' }}>
                <IconMaterial name="file-eye" style={{ alignSelf: 'center', marginRight: 30 }} size={50} color={COLORS.tertiary} />
                <Text style={{ color: COLORS.tertiary, fontFamily: FONTFAMILY.poppins_extrabold, fontSize: 20 }}>PDF Viewer</Text>
              </View>
              <View style={{ flexDirection: 'column', margin: 5 }}>
                <Text style={{ textAlign: 'justify', color: COLORS.lightText1, fontSize: 15 }}>
                  A PDF reader allows you to open, view, and read PDF documents, providing a convenient way to access and interact with digital content.</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            setActive('pdftoimg');
            props.navigation.push('PdfToImageScreen')
          }} >
            <View style={{ alignSelf: 'center', margin: 2, borderRadius: 20, borderWidth: 2, borderColor: COLORS.tertiary, width: '99%', backgroundColor: COLORS.secondary, flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }}>
              <View style={{ margin: 5, flexDirection: 'row' }}>
                <Iconfa6 name="file-pdf" style={{ alignSelf: 'center', marginRight: 30 }} size={50} color={COLORS.tertiary} />
                <Text style={{ color: COLORS.tertiary, fontFamily: FONTFAMILY.poppins_extrabold, fontSize: 20 }}>PDF To Images</Text>
              </View>
              <View style={{ flexDirection: 'column', margin: 5 }}>
                <Text style={{ textAlign: 'justify', color: COLORS.lightText1, fontSize: 15 }}>
                  Converting PDF documents to JPG images transforms each page into a separate image file, facilitating easy sharing and editing of specific content from the PDF document.</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            setActive('ppttopdf');
            props.navigation.push('PptToPdfScreen')
          }} >
            <View style={{ alignSelf: 'center', margin: 2, borderRadius: 20, borderWidth: 2, borderColor: COLORS.tertiary, width: '99%', backgroundColor: COLORS.secondary, flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }}>
              <View style={{ margin: 5, flexDirection: 'row' }}>
                <Iconfa5 name="file-powerpoint" style={{ alignSelf: 'center', marginRight: 30 }} size={50} color={COLORS.tertiary} />
                <Text style={{ color: COLORS.tertiary, fontFamily: FONTFAMILY.poppins_extrabold, fontSize: 20 }}>Powerpoint To PDF</Text>
              </View>
              <View style={{ flexDirection: 'column', margin: 5 }}>
                <Text style={{ textAlign: 'justify', color: COLORS.lightText1, fontSize: 15 }}>
                  Converting a PowerPoint presentation to a PDF file preserves the layout and formatting, ensuring compatibility across different devices and platforms while simplifying sharing and distribution.</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            setActive('pgsplit');
            props.navigation.push('SplitPdfScreen')
          }} >
            <View style={{ alignSelf: 'center', margin: 2, borderRadius: 20, borderWidth: 2, borderColor: COLORS.tertiary, width: '99%', backgroundColor: COLORS.secondary, flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }}>
              <View style={{ margin: 5, flexDirection: 'row' }}>
                <IconMaterial name="format-page-split" style={{ alignSelf: 'center', marginRight: 30 }} size={50} color={COLORS.tertiary} />
                <Text style={{ color: COLORS.tertiary, fontFamily: FONTFAMILY.poppins_extrabold, fontSize: 20 }}>Split PDF</Text>
              </View>
              <View style={{ flexDirection: 'column', margin: 5 }}>
                <Text style={{ textAlign: 'justify', color: COLORS.lightText1, fontSize: 15 }}>
                  Splitting PDF files into individual pages and saving them separately streamlines document management, allowing for easy organization and distribution of specific content. Extracting pages from a PDF to create a new document provides flexibility in compiling customized documents tailored to specific needs or preferences.</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            setActive('wrdtopdf');
            props.navigation.push('WordToPdfScreen')
          }} >
            <View style={{ alignSelf: 'center', margin: 2, borderRadius: 20, borderWidth: 2, borderColor: COLORS.tertiary, width: '99%', backgroundColor: COLORS.secondary, flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }}>
              <View style={{ margin: 5, flexDirection: 'row' }}>
                <Iconfa5 name="file-word" style={{ alignSelf: 'center', marginRight: 30 }} size={50} color={COLORS.tertiary} />
                <Text style={{ color: COLORS.tertiary, fontFamily: FONTFAMILY.poppins_extrabold, fontSize: 20 }}>Word File To PDF</Text>
              </View>
              <View style={{ flexDirection: 'column', margin: 5 }}>
                <Text style={{ textAlign: 'justify', color: COLORS.lightText1, fontSize: 15 }}>
                  Converting Word DOC/DOCX documents to PDF format quickly and accurately preserves the original layout and content, ensuring seamless compatibility and professional presentation across various platforms and devices. </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            setActive('cloud');
            props.navigation.push('DriveScreen')
          }} >
            <View style={{ alignSelf: 'center', margin: 2, borderRadius: 20, borderWidth: 2, borderColor: COLORS.tertiary, width: '99%', backgroundColor: COLORS.secondary, flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }}>
              <View style={{ margin: 5, flexDirection: 'row' }}>
                <IconMaterial name="cloud-upload" style={{ alignSelf: 'center', marginRight: 30 }} size={50} color={COLORS.tertiary} />
                <Text style={{ color: COLORS.tertiary, fontFamily: FONTFAMILY.poppins_extrabold, fontSize: 20 }}>PDF Cloud</Text>
              </View>
              <View style={{ flexDirection: 'column', margin: 5 }}>
                <Text style={{ textAlign: 'justify', color: COLORS.lightText1, fontSize: 15 }}>
                  A PDF cloud service enables users to upload PDF files to the cloud, freeing up storage space on their devices while allowing convenient access to their documents from anywhere. Users can reaad, download or delete files as needed, ensuring flexibility and control over their digital content. </Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen