import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Dimensions, StatusBar, Text } from 'react-native';
import Pdf from 'react-native-pdf';
import NetInfo from '@react-native-community/netinfo';

import HeaderBarOthers from '../components/HeaderBarOthers';
import { COLORS, FONTFAMILY } from '../theme/theme';
import NoInternetConnection from '../components/NoInternetConnection';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const DriveOpenScreen = (props: any) => {
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
    const [totalPages, setTotalPages] = useState<number | null>(null);
    const [curPages, setCurPages] = useState<number | null>(null);
    const item = props.route.params.item;
    console.log(item)
    return (
        <SafeAreaView style={{ height: screenHeight, width: screenWidth, backgroundColor: COLORS.lightBackground }}>
            {!connectionStatus && (<NoInternetConnection />)}
            <StatusBar
                backgroundColor={COLORS.lightBackground}
                barStyle={'dark-content'}
            />

            <HeaderBarOthers props={props} />
            <Text style={{ color: COLORS.primary, fontFamily: FONTFAMILY.poppins_bold, fontSize: 24, textAlign: 'center', marginVertical: 10 }}>
                PDF Viewer
            </Text>
            <SafeAreaView style={{ backgroundColor: COLORS.lightBackground }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 10, marginRight: 10 }}>
                    <Text style={{ backgroundColor: `${COLORS.secondary}20`, borderRadius: 10, padding: 5, fontFamily: FONTFAMILY.poppins_medium, fontSize: 12 }}>
                        {item.pdfname}
                    </Text>
                    <Text style={{ backgroundColor: `${COLORS.secondary}20`, borderRadius: 10, padding: 5, fontFamily: FONTFAMILY.poppins_medium, fontSize: 12 }}>
                        {`${curPages}/${totalPages}`}
                    </Text>
                </View>
                <Pdf
                    trustAllCerts={false}
                    source={{ uri: item.pdfLink, cache: true }}
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

            </SafeAreaView>
        </SafeAreaView>
    );
};

export default DriveOpenScreen;
