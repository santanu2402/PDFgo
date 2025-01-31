import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AccountScreen from './src/screens/AccountScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import DriveScreen from './src/screens/DriveScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import HomeScreen from './src/screens/HomeScreen';
import ImageToPdfScreen from './src/screens/ImageToPdfScreen';
import OpenPdfScreen from './src/screens/OpenPdfScreen';
import PdfCompressionScreen from './src/screens/PdfCompressionScreen';
import PdfToImageScreen from './src/screens/PdfToImageScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import SplashScreen from './src/screens/SplashScreen';
import WordToPdfScreen from './src/screens/WordToPdfScreen';
import PptToPdfScreen from './src/screens/PptToPdfScreen';
import { useStore } from './src/store/store';
import { requestPermission } from './src/Permission/PermissionRequest';
import RNFS from 'react-native-fs';
import { LogBox, PermissionsAndroid, Platform } from 'react-native';
import ExcelToPdfScreen from './src/screens/ExcelToPdfScreen';
import MergePdfScreen from './src/screens/MergePdfScreen';
import WatermarkScreen from './src/screens/WatermarkScreen';
import EncryptScreen from './src/screens/EncryptScreen';
import DecryptPdfScreen from './src/screens/DecryptPdfScreen';
import SplitPdfScreen from './src/screens/SplitPdfScreen';
import AdditionalInformationScreen from './src/screens/AdditionalInformationScreen';
import DriveOpenScreen from './src/screens/DriveOpenScreen';
const Stack = createNativeStackNavigator();

const App = (): React.JSX.Element => {
  const active = useStore((state: any) => state.active);
  const setActive = useStore((state: any) => state.setActive);
  useEffect(() => {
    setActive('');
    requestPermission();
  }, []);

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your storage to create files',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  useEffect(() => {
    const createDirectories = async () => {
      const baseDir = `${RNFS.ExternalStorageDirectoryPath}/Download`;
      const pdfgoDir = `${baseDir}/PDFgo`;

      const directories = [
        'AddWatermark',
        'Decryption',
        'Encryption',
        'ExcelToPdf',
        'ImageToPdf',
        'MergePdfs',
        'PdfCloud',
        'PdfCompressor',
        'PdfToImage',
        'PowerpointToPdf',
        'SplitToPdf',
        'WordToPdf',
      ];

      const hasPermission = Platform.OS === 'ios' || await requestStoragePermission();

      if (!hasPermission) {
        console.log('Permission denied');
        return;
      }

      try {
        // Check if pdfgo directory already exists
        const pdfgoDirExists = await RNFS.exists(pdfgoDir);

        if (!pdfgoDirExists) {
          await RNFS.mkdir(pdfgoDir);
          console.log(`PDFgo directory created: ${pdfgoDir}`);
        } else {
          console.log(`PDFgo directory already exists: ${pdfgoDir}`);
        }

        // Create subdirectories
        for (const dir of directories) {
          const subDirPath = `${pdfgoDir}/${dir}`;
          const subDirExists = await RNFS.exists(subDirPath);

          if (!subDirExists) {
            await RNFS.mkdir(subDirPath);
            console.log(`Subdirectory created: ${subDirPath}`);
          } else {
            console.log(`Subdirectory already exists: ${subDirPath}`);
          }
        }

        console.log('All directories created successfully');
      } catch (error) {
        console.error('Error creating directories: ', error);
      }
    };

    createDirectories();
  }, []);

  LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.']);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name='SplashScreen'
            component={SplashScreen}
            options={{ animation: 'fade' }}
          ></Stack.Screen>
          <Stack.Screen
            name='DriveOpenScreen'
            component={DriveOpenScreen}
            options={{ animation: 'slide_from_left' }}
          ></Stack.Screen>
          <Stack.Screen
            name='AdditionalInformationScreen'
            component={AdditionalInformationScreen}
            options={{ animation: 'slide_from_left' }}
          ></Stack.Screen>
          <Stack.Screen
            name='HomeScreen'
            component={HomeScreen}
            options={{ animation: 'fade' }}
          ></Stack.Screen>
          <Stack.Screen
            name='AccountScreen'
            component={AccountScreen}
            options={{ animation: 'slide_from_left' }}
          ></Stack.Screen>
          <Stack.Screen
            name='ChangePasswordScreen'
            component={ChangePasswordScreen}
            options={{ animation: 'slide_from_left' }}
          ></Stack.Screen>
          <Stack.Screen
            name='DriveScreen'
            component={DriveScreen}
            options={{ animation: 'slide_from_left' }}
          ></Stack.Screen>
          <Stack.Screen
            name='ForgotPasswordScreen'
            component={ForgotPasswordScreen}
            options={{ animation: 'slide_from_left' }}
          ></Stack.Screen>
          <Stack.Screen
            name='ImageToPdfScreen'
            component={ImageToPdfScreen}
            options={{ animation: 'slide_from_left' }}
          ></Stack.Screen>
          <Stack.Screen
            name='OpenPdfScreen'
            component={OpenPdfScreen}
            options={{ animation: 'slide_from_left' }}
          ></Stack.Screen>
          <Stack.Screen
            name='PdfCompressionScreen'
            component={PdfCompressionScreen}
            options={{ animation: 'slide_from_left' }}
          ></Stack.Screen>
          <Stack.Screen
            name='PdfToImageScreen'
            component={PdfToImageScreen}
            options={{ animation: 'slide_from_left' }}
          ></Stack.Screen>
          <Stack.Screen
            name='SignInScreen'
            component={SignInScreen}
            options={{ animation: 'slide_from_left' }}
          ></Stack.Screen>
          <Stack.Screen
            name='SplitPdfScreen'
            component={SplitPdfScreen}
            options={{ animation: 'slide_from_left' }}
          ></Stack.Screen>
          <Stack.Screen
            name='SignUpScreen'
            component={SignUpScreen}
            options={{ animation: 'slide_from_left' }}
          ></Stack.Screen>
          <Stack.Screen
            name='WordToPdfScreen'
            component={WordToPdfScreen}
            options={{ animation: 'slide_from_left' }}
          ></Stack.Screen>
          <Stack.Screen
            name='WatermarkScreen'
            component={WatermarkScreen}
            options={{ animation: 'slide_from_left' }}
          ></Stack.Screen>
          <Stack.Screen
            name='PptToPdfScreen'
            component={PptToPdfScreen}
            options={{ animation: 'slide_from_left' }}
          ></Stack.Screen>
          <Stack.Screen
            name='ExcelToPdfScreen'
            component={ExcelToPdfScreen}
            options={{ animation: 'slide_from_left' }}
          ></Stack.Screen>
          <Stack.Screen
            name='MergePdfScreen'
            component={MergePdfScreen}
            options={{ animation: 'slide_from_left' }}
          ></Stack.Screen>
          <Stack.Screen
            name='EncryptScreen'
            component={EncryptScreen}
            options={{ animation: 'slide_from_left' }}
          ></Stack.Screen>
          <Stack.Screen
            name='DecryptPdfScreen'
            component={DecryptPdfScreen}
            options={{ animation: 'slide_from_left' }}
          ></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
};

export default App;

// import NetInfo from '@react-native-community/netinfo';
// const [connectionStatus, setConnectionStatus] = useState(true);
// useEffect(() => {
//   const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
//   NetInfo.fetch().then((state) => {
//     setConnectionStatus(state.isInternetReachable ?? false);
//   });
//   return () => {
//     unsubscribe();
//   };
// }, []);

// const handleConnectivityChange = (state: any) => {
//   setConnectionStatus(state.isConnected);
// };