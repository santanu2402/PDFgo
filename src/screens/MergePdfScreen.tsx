import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Dimensions, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Button } from 'react-native-paper';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import LottieView from 'lottie-react-native';
import NetInfo from '@react-native-community/netinfo';

import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import Pdf from 'react-native-pdf';

import HeaderBarOthers from '../components/HeaderBarOthers';
import { COLORS, FONTFAMILY } from '../theme/theme';
import { mergepdf } from '../api/ApiCalls';
import Loading from '../components/Loading';
import Success from '../components/Success';
import Error from '../components/Error';
import NoInternetConnection from '../components/NoInternetConnection';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const MergePdfScreen = (props: any) => {
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
    const itemsPick = [
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
    ];

    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [currentPickerValue, setCurrentPickerValue] = useState<number | null>(null);
    const [pdfUris, setPdfUris] = useState<(string | null)[]>([]);
    const [mergedPdfUri, setMergedPdfUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [name, setName] = useState<string | null>(null);
    const pickDocuments = async (index: number) => {
        try {
            const result: DocumentPickerResponse = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.pdf],
            });
            if (result) {
                const newPdfUris = [...pdfUris];
                newPdfUris[index] = result.uri;
                setPdfUris(newPdfUris);
                setName(result.name)
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
            }
        }
    };
    const triggerSuccess = () => {
        // Change success state to true
        setSuccess(true);

        // Set a timeout to change success state back to false after 2 seconds
        setTimeout(() => {
            setSuccess(false);
        }, 2000);
    };

    const triggerError = () => {
        // Change error state to true
        setError(true);

        // Set a timeout to change error state back to false after 2 seconds
        setTimeout(() => {
            setError(false);
        }, 2000);
    };

    const convertToMergedPdf = async () => {
        if (pdfUris.length < (currentPickerValue || 0) || pdfUris.includes(null)) {
            Alert.alert('Incomplete Selection', 'Please select all the required PDFs.');
            return;
        }

        try {
            setLoading(true)
            const fileContents = await Promise.all(
                pdfUris.map(async (uri, index) => {
                    if (uri) {
                        const fileContent = await RNFS.readFile(uri, 'base64');
                        return {
                            Name: `my_file${index + 1}.pdf`,
                            Data: fileContent,
                        };
                    }
                    return null;
                })
            );

            const filteredFileContents = fileContents.filter(Boolean);
            const response = await mergepdf(filteredFileContents);
            const pdfUrl = response?.data.Files[0].Url;
            const pdfResponse = await axios.get(pdfUrl, { responseType: 'blob' });
            const fileReaderInstance = new FileReader();
            fileReaderInstance.readAsDataURL(pdfResponse.data);
            fileReaderInstance.onload = async () => {
                const base64data = fileReaderInstance.result as string;
                const path = `/storage/emulated/0/Download/PDFgo/MergePdfs/${name}merged_pdf.pdf`;
                await RNFS.writeFile(path, base64data.split(',')[1], 'base64');
                setMergedPdfUri(`file://${path}`);
                triggerSuccess()
            };
        } catch (error) {
            console.error('Error merging files: ', error);
            triggerError()
        } finally {
            setLoading(false)
        }
    };

    const sharePdf = async () => {
        if (!mergedPdfUri) {
            Alert.alert('No PDF to Share', 'Please merge the PDFs first.');
            return;
        }

        try {
            const options = {
                title: 'Share PDF',
                url: mergedPdfUri,
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
            {!connectionStatus && (<NoInternetConnection />)}
            {loading && (<Loading message={'Merging..'} />)}
            {success && (<Success message={'Merge Success'} />)}
            {error && (<Error message={'Merge Failed'} />)}
            <HeaderBarOthers props={props} />
            <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 24, textAlign: 'center', marginVertical: 10 }}>
                Merge PDF Files
            </Text>
            {mergedPdfUri ? (
                <>
                    <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 22, textAlign: 'center', marginTop: 5 }}>
                        Preview Merged PDF
                    </Text>
                    <View style={{ height: screenHeight * 0.6, width: screenWidth }}>
                        <Pdf
                            source={{ uri: mergedPdfUri }}
                            style={{ flex: 1 }}
                        />
                    </View>
                    <View style={{ width: screenWidth }}>
                        <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 16, textAlign: 'center', marginTop: 20 }}>
                            PDF saved at: {mergedPdfUri}
                        </Text>
                    </View>
                    <Button
                        style={{ width: screenWidth * 0.6, alignSelf: 'center', margin: 10 }}
                        icon="share-variant"
                        mode="elevated"
                        onPress={sharePdf}
                    >
                        Share Merged PDF
                    </Button>
                </>
            ) : (
                <>
                    <View style={{ width: screenWidth * 0.8, zIndex: 10, alignSelf: 'center' }}>
                        <DropDownPicker
                            items={itemsPick}
                            open={isPickerOpen}
                            setOpen={setIsPickerOpen}
                            value={currentPickerValue}
                            setValue={setCurrentPickerValue}
                            autoScroll={true}
                            dropDownDirection='BOTTOM'
                            placeholder='Number of PDFs'
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

                    <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 16 }}>
                        {currentPickerValue && (
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 20 }}>
                                {Array.from({ length: currentPickerValue }).map((_, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={{ margin: 10 }}
                                        onPress={() => pickDocuments(index)}
                                    >
                                        <LottieView
                                            style={{ height: screenHeight * 0.15, width: screenWidth * 0.3 }}
                                            source={require('../assets/lotties/choosefile.json')}
                                            autoPlay
                                            loop
                                        />
                                        <Text style={{ color: COLORS.secondary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 16, textAlign: 'center' }}>
                                            Choose PDF {index + 1}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        {pdfUris.length === (currentPickerValue || 0) && !pdfUris.includes(null) && (
                            <Button
                                style={{ width: screenWidth * 0.4, alignSelf: 'center', margin: 5 }}
                                icon="file-pdf-box"
                                mode="elevated"
                                onPress={convertToMergedPdf}
                            >
                                Merge PDFs
                            </Button>
                        )}
                    </ScrollView>
                </>
            )}
        </SafeAreaView>
    );
};

export default MergePdfScreen;
