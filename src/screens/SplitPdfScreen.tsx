import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Dimensions, SafeAreaView, ScrollView, FlatList, StatusBar } from 'react-native';
import { Button } from 'react-native-paper';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import LottieView from 'lottie-react-native';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import Pdf from 'react-native-pdf';
import HeaderBarOthers from '../components/HeaderBarOthers';
import { COLORS, FONTFAMILY } from '../theme/theme';
import Loading from '../components/Loading';
import Success from '../components/Success';
import Error from '../components/Error';
import { splitpdf } from '../api/ApiCalls';
import NoInternetConnection from '../components/NoInternetConnection';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const SplitPdfScreen = (props: any) => {
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
    const [name, setName] = useState<string | null>(null);
    const [splitPdfFiles, setSplitPdfFiles] = useState<Array<any>>([]);
    const [pageRange, setPageRange] = useState<string>('');
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
                setName(result.name);
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
            }
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

    const splitPdf = async () => {
        if (!fileUri) {
            Alert.alert('No File Selected', 'Please select a PDF file first.');
            return;
        }

        if (!pageRange) {
            Alert.alert('Page Range Required', 'Please enter a page range.');
            return;
        }

        const validPageRangeRegex = /^(\d+|\d+-\d+)(,\s*\d+|\s*,\s*\d+|\s*,\s*\d+-\d+)*$/;
        if (!validPageRangeRegex.test(pageRange)) {
            Alert.alert('Invalid Page Range', 'Please enter a valid page range format.');
            return;
        }

        try {
            setLoading(true)
            const fileContent = await RNFS.readFile(fileUri, 'base64');
            const response = await splitpdf(fileContent, pageRange)
            setSplitPdfFiles(response?.data.Files);
            triggerSuccess()
        } catch (error) {
            console.error('Error splitting PDF: ', error);
            triggerError()
        } finally {
            setLoading(false)
        }
    };

    const downloadFile = async (file: any) => {
        try {
            const pdfResponse = await axios.get(file.Url, { responseType: 'blob' });
            const fileReaderInstance = new FileReader();
            fileReaderInstance.readAsDataURL(pdfResponse.data);
            fileReaderInstance.onload = async () => {
                const base64data = fileReaderInstance.result as string;
                const path = `/storage/emulated/0/Download/PDFgo/SplitToPdf/${name}_${file.FileName}.pdf`;
                await RNFS.writeFile(path, base64data.split(',')[1], 'base64');
            };
        } catch (error) {
            console.error('Error downloading file: ', error);
        }
    };

    const sharePdf = async (fileUri: string) => {
        try {
            const options = {
                title: 'Share PDF',
                url: fileUri,
                type: 'application/pdf',
            };
            await Share.open(options);
        } catch (error) {
        }
    };

    useEffect(() => {
        if (splitPdfFiles.length > 0) {
            splitPdfFiles.forEach((file) => {
                downloadFile(file);
            });
        }
    }, [splitPdfFiles]);

    return (
        <SafeAreaView style={{ height: screenHeight, width: screenWidth, backgroundColor: COLORS.lightBackground }}>
            <StatusBar
                backgroundColor={COLORS.lightBackground}
                barStyle={'dark-content'}
            />
            {!connectionStatus && (<NoInternetConnection />)}
            {loading && (<Loading message={'Splitting..'} />)}
            {success && (<Success message={'Split Success'} />)}
            {error && (<Error message={'Split Failed'} />)}
            <HeaderBarOthers />
            <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 16 }}>
                <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 24, textAlign: 'center', marginVertical: 10 }}>
                    Split PDF
                </Text>

                {!splitPdfFiles.length && (
                    <>
                        <TextInput
                            style={{ width: screenWidth * 0.8, padding: 10, borderColor: COLORS.tertiary, borderWidth: 1, borderRadius: 5, marginVertical: 10 }}
                            placeholder="Page/Range"
                            value={pageRange}
                            onChangeText={setPageRange}
                            maxLength={100}
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
                {fileUri && !splitPdfFiles.length && (
                    <Button
                        style={{ width: screenWidth * 0.4, alignSelf: 'center', margin: 5 }}
                        icon="format-page-split"
                        mode="elevated"
                        onPress={splitPdf}
                    >
                        Split PDF
                    </Button>
                )}
                {splitPdfFiles.length > 0 && (
                    <>
                        <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 24, textAlign: 'center', marginTop: 5 }}>
                            Preview Split PDF
                        </Text>
                        <FlatList
                            horizontal
                            data={splitPdfFiles}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={{ marginRight: 10 }}>
                                    <Pdf
                                        source={{ uri: `file:///storage/emulated/0/Download/PDFgo/SplitToPdf/${name}_${item.FileName}.pdf` }}
                                        style={{ width: screenWidth * 0.8, height: screenHeight * 0.6 }}
                                    />
                                    <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_regular, fontSize: 10, textAlign: 'center', marginTop: 10 }}>
                                        {`${name}_${item.FileName}.pdf`}
                                    </Text>
                                    <Button
                                        style={{ width: screenWidth * 0.3, alignSelf: 'center', marginVertical: 5 }}
                                        icon="share-variant"
                                        mode="elevated"
                                        onPress={() => sharePdf(`file:///storage/emulated/0/Download/PDFgo/SplitToPdf/${name}_${item.FileName}.pdf`)}
                                    >
                                        Share PDF
                                    </Button>
                                </View>
                            )}
                        />
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default SplitPdfScreen;
