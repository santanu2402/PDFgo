import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, Dimensions, SafeAreaView, StatusBar, View, FlatList } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import LottieView from 'lottie-react-native';
import { COLORS, FONTFAMILY } from '../theme/theme';
import Loading from '../components/Loading';
import Success from '../components/Success';
import Error from '../components/Error';
import { useStore } from '../store/store';
import { getUserStats, uploadPdfAndAddLink, getPdfForUser, deletePdfForUser } from '../data/firebase';
import HeaderBarOthers from '../components/HeaderBarOthers';
import Share from 'react-native-share';
import axios from 'axios';
import RNFS from 'react-native-fs';
import NetInfo from '@react-native-community/netinfo';
import NoInternetConnection from '../components/NoInternetConnection';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const DriveScreen = (props: any) => {
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
  const signInDone = useStore((state: any) => state.signInDone);
  const setActive = useStore((state: any) => state.setActive);
  const [pdfData, setPdfData] = useState<any>();
  const [pdfList, setPdfList] = useState<any[]>([]);
  const user = useStore((state: any) => state.user);
  const [size, setSize] = useState(0);
  const [number, setNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(false);
  const [signInSuccessMessage, setSignInSuccessMessage] = useState('');
  const [signInErrorMessage, setSignInErrorMessage] = useState('');
  const [visibleOptionsId, setVisibleOptionsId] = useState<string | null>(null);

  const handleDownload = async (id: any, name: any, link: any) => {
    const pdfResponse = await axios.get(link, { responseType: 'blob' });
    const fileReaderInstance = new FileReader();
    fileReaderInstance.readAsDataURL(pdfResponse.data);
    fileReaderInstance.onload = async () => {
      const base64data = fileReaderInstance.result as string;
      const path = `/storage/emulated/0/Download/PDFgo/PdfCloud/${name}drive.pdf`;
      await RNFS.writeFile(path, base64data.split(',')[1], 'base64');
      setSignInSuccessMessage('PDF Downloaded')
      triggerSuccess()
    };
  };
  const handleDelete = async (id: any, link: any, size: any) => {
    const response = await deletePdfForUser(user.uid, id, parseInt(size, 10))
    if (response.status === 'success') {
      setSignInSuccessMessage(response.message)
      triggerSuccess()
    }
    else {
      setSignInErrorMessage(response.message)
      triggerError()
    }
  };
  const handleShare = async (id: any, link: any) => {
    try {
      const options = {
        title: 'Share PDF',
        url: link,
      };
      await Share.open(options);
    } catch (error) {
      console.log('Error sharing PDF: ', error);
    }
  };
  const handleOpen = (item: object) => {
    props.navigation.push('DriveOpenScreen', { item: item })
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUserStats(user.uid);
        setSize(res.data?.size);
        setNumber(res.data?.number);
        const pdfs = await getPdfForUser(user.uid);
        setPdfList(pdfs);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };
    fetchData();
  }, [pdfData, success, error]);

  useEffect(() => {
    if (!user.uid) {
      props.navigation.replace('SignInScreen', { from: 'Drive' });
    }
    const fetchData = async () => {
      try {
        const res = await getUserStats(user.uid);
        setSize(res.data?.size);
        setNumber(res.data?.number);
        setActive('account');
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchData();

    if (!signInDone) {
      props.navigation.replace("SignUpScreen", { from: 'Drive' });
    }
  }, []);

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

  const showVisible = () => {
    setVisible(!visible);
  };

  const pickPdf = async () => {
    try {
      setLoading(true)
      if (number.toString() != '10') {
        const response = await DocumentPicker.pickSingle({
          type: [DocumentPicker.types.pdf],
          copyTo: 'cachesDirectory'
        });
        setPdfData(response);
        if (pdfData && (parseInt(pdfData.size, 10) + parseInt(size.toString(), 10)) / (1024 * 1024) < 20) {
          const res = await uploadPdfAndAddLink(user.uid, pdfData, pdfData.name, parseInt(pdfData.size, 10));
          if (res.status === 'success') {
            setSignInSuccessMessage(res.message);
            triggerSuccess();
          } else {
            setSignInErrorMessage(res.message);
            triggerError();
          }
        }
        else {
          setSignInErrorMessage('You do not have enough space');
          triggerError();
        }
      }
      else {
        setSignInErrorMessage('You can Only Upload upto 10 PDF files');
        triggerError();
      }

    } catch (err: any) {
      setSignInErrorMessage(err.toString());
      triggerError();
    } finally {
      setLoading(false)
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const dateOptions = { day: '2-digit', month: 'long', year: 'numeric' } as const;
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false } as const;
    const date = new Date(item.timestamp).toLocaleDateString('en-US', dateOptions);
    const time = new Date(item.timestamp).toLocaleTimeString('en-US', timeOptions);
    const formattedDate = `${date} ${time}`;
    const sizeInMB = (item.pdfsize / (1024 * 1024)).toFixed(2);


    return (
      <TouchableOpacity style={{ margin: 5, padding: 10, borderWidth: 2, borderColor: COLORS.secondary, backgroundColor: COLORS.tertiary, borderRadius: 20 }} onPress={() => setVisibleOptionsId(visibleOptionsId === item.pdfid ? null : item.pdfid)}>
        <Text style={{ fontFamily: FONTFAMILY.poppins_bold, fontSize: 16 }}>{item.pdfname}</Text>
        <Text style={{ fontFamily: FONTFAMILY.poppins_regular, fontSize: 14, color: COLORS.secondary }}>
          {formattedDate} - {sizeInMB} MB
        </Text>
        {visibleOptionsId === item.pdfid &&
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <Button icon="open-in-app" mode="text" style={{ width: 75, backgroundColor: COLORS.infoBackground, borderWidth: 1, borderColor: COLORS.infoText }} labelStyle={{ fontFamily: FONTFAMILY.poppins_bold, fontSize: 13.5, color: COLORS.infoText }} onPress={() => handleOpen(item)}>
              Open
            </Button>
            <Button icon="share" mode="text" style={{ width: 78, backgroundColor: COLORS.warningBackground, borderWidth: 1, borderColor: COLORS.warningText }} labelStyle={{ fontFamily: FONTFAMILY.poppins_bold, fontSize: 13.5, color: COLORS.warningText }} onPress={() => handleShare(item.pdfid, item.pdfLink)}>
              Share
            </Button>
            <Button icon="download" mode="text" style={{ width: 105, backgroundColor: COLORS.warningBackground, borderWidth: 1, borderColor: COLORS.warningText }} labelStyle={{ fontFamily: FONTFAMILY.poppins_bold, fontSize: 13.5, color: COLORS.warningText }} onPress={() => handleDownload(item.pdfid, item.pdfname, item.pdfLink)}>
              Download
            </Button>
            <Button icon="delete" mode="text" style={{ width: 80, backgroundColor: COLORS.errorBackground, borderWidth: 1, borderColor: COLORS.errorText }} labelStyle={{ fontFamily: FONTFAMILY.poppins_bold, fontSize: 13.5, color: COLORS.errorText }} onPress={() => handleDelete(item.pdfid, item.pdfLink, item.pdfsize)}>
              Delete
            </Button>
          </View>}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ height: screenHeight, width: screenWidth, backgroundColor: COLORS.lightBackground }}>
      <StatusBar backgroundColor={COLORS.lightBackground} barStyle={'dark-content'} />
      {!connectionStatus && (<NoInternetConnection />)}
      {loading && (<Loading message={'Uploading..'} />)}
      {success && (<Success message={signInSuccessMessage} />)}
      {error && (<Error message={signInErrorMessage} />)}
      <HeaderBarOthers props={props} />

      <View style={{ flexDirection: 'row', marginVertical: 10, alignSelf: 'center' }}>
        <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 24, textAlign: 'center' }}>
          PDF Cloud
        </Text>
        <IconButton icon="information-outline" style={{ alignSelf: 'center', marginTop: 0 }} iconColor={COLORS.primary} size={25} onPress={showVisible} />
      </View>
      {visible && (
        <View style={{ alignSelf: 'center', width: screenWidth * 0.9, borderRadius: 10, borderWidth: 1, borderColor: COLORS.tertiary }}>
          <Text style={{ fontSize: 16, marginBottom: 20, color: COLORS.secondary, marginLeft: 5 }}>
            Here you can upload a PDF, which will be saved on our secured cloud. From here, users can easily view, share, and delete PDFs.
          </Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: COLORS.primary, marginLeft: 5 }}>
            Limitations
          </Text>
          <Text style={{ fontSize: 14, marginBottom: 20, color: COLORS.secondary, lineHeight: 22, marginLeft: 5 }}>
            - Only PDF files are allowed.{'\n'}
            - You have a free limit of 20 MB and can upload up to 10 PDF files.{'\n'}
            - On reaching any of the limits, you will not be able to upload PDFs anymore. You can upload only after deleting previous PDFs.
          </Text>
        </View>
      )}
      <Button icon="plus-box-multiple" mode="text" style={{ alignSelf: 'flex-end' }} labelStyle={{ fontFamily: FONTFAMILY.poppins_bold, fontSize: 18, color: COLORS.secondary }} onPress={pickPdf}>
        Add Pdf
      </Button>
      <View style={{ width: screenWidth * 0.95, height: screenHeight * 0.78, borderRadius: 20, borderColor: COLORS.primary, borderWidth: 2, alignSelf: 'center', marginTop: 5 }}>
        <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 20, marginTop: 5, textAlign: 'center' }}>
          Your Uploaded PDF
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 5 }}>
          <Text style={{ fontFamily: FONTFAMILY.poppins_medium, fontSize: 14, color: COLORS.secondary }}>{`Space Used: ${(size / (1024 * 1024)).toFixed(2)}/20 MB`}</Text>
          <Text style={{ fontFamily: FONTFAMILY.poppins_medium, fontSize: 14, color: COLORS.secondary }}>{`No of PDF Uploaded: ${number}/10`}</Text>
        </View>

        {size === 0 ? (
          <LottieView
            style={{ height: screenHeight * 0.5, width: screenWidth * 0.5, alignSelf: 'center', marginVertical: 'auto' }}
            source={require('../assets/lotties/nodata.json')}
            autoPlay
            loop
          />
        ) : (
          <FlatList
            data={pdfList}
            renderItem={renderItem}
            keyExtractor={(item) => item.pdfid}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default DriveScreen;
