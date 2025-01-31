import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Dimensions, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Button } from 'react-native-paper';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import Pdf from 'react-native-pdf';
import NetInfo from '@react-native-community/netinfo';

import { exceltopdf } from '../api/ApiCalls';
import { COLORS, FONTFAMILY } from '../theme/theme';
import HeaderBarOthers from '../components/HeaderBarOthers';
import Loading from '../components/Loading';
import Success from '../components/Success';
import Error from '../components/Error';
import NoInternetConnection from '../components/NoInternetConnection';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ExcelToPdfScreen = (props: any) => {
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
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const pickDocument = async () => {
        try {
            const result: DocumentPickerResponse = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.xls, DocumentPicker.types.xlsx],
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

    const convertToPdf = async () => {
        if (!fileUri) {
            Alert.alert('No File Selected', 'Please select a Excel(xls/xlsx) file first.');
            return;
        }

        try {
            setLoading(true)
            const fileContent = await RNFS.readFile(fileUri, 'base64');
            const response = await exceltopdf(fileName, fileContent);
            const pdfUrl = response?.data.Files[0].Url;
            const pdfResponse = await axios.get(pdfUrl, { responseType: 'blob' });
            const fileReaderInstance = new FileReader();
            fileReaderInstance.readAsDataURL(pdfResponse.data);
            fileReaderInstance.onload = async () => {
                const base64data = fileReaderInstance.result as string;
                const path = `/storage/emulated/0/Download/PDFgo/ExcelToPdf/${fileName}_converted.pdf`;
                await RNFS.writeFile(path, base64data.split(',')[1], 'base64');
                setPdfUri(`file://${path}`);
                triggerSuccess()
            };
        } catch (error) {
            console.error('Error converting file: ', error);
            triggerError()
        } finally {
            setLoading(false)
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
            <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 24, textAlign: 'center', marginVertical: 5 }}>
                Excel To PDF
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
                            Choose Excel(xls/xlsx) File
                        </Text>
                    </TouchableOpacity>
                )}
                {fileUri && !pdfUri && (
                    <Button
                        style={{ width: screenWidth * 0.4, alignSelf: 'center', margin: 5 }}
                        icon="file-pdf-box"
                        mode="elevated"
                        onPress={convertToPdf}
                    >
                        Convert to PDF
                    </Button>
                )}
                {pdfUri && (
                    <>
                        <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 22, textAlign: 'center', marginTop: 5 }}>
                            Preview PDF
                        </Text>
                        <Pdf
                            source={{ uri: pdfUri }}
                            style={{ width: screenWidth, height: screenHeight * 0.65 }}
                        />
                        <View style={{ width: screenWidth }}>
                            <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 16, textAlign: 'center', marginTop: 20 }}>
                                PDF saved at: {pdfUri}
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
            </ScrollView>
        </SafeAreaView>
    );
};

export default ExcelToPdfScreen;
