import { View, Text, Dimensions, SafeAreaView } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';
import { COLORS, FONTFAMILY } from '../theme/theme';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Error = (props: any) => {
    return (
        <View>
            <SafeAreaView style={{ height: screenHeight, width: screenWidth, zIndex: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.lightBackground }}>
                <View style={{ width: screenWidth * 0.9, height: screenHeight * 0.4, borderRadius: 20, borderColor: COLORS.errorText, borderWidth: 2, backgroundColor: COLORS.errorBackground, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <LottieView style={{ height: screenHeight * 0.2, width: screenWidth * 0.8, alignSelf: 'center' }} source={require('../assets/lotties/error.json')} autoPlay loop />
                        <Text style={{ textAlign: "center", fontFamily: FONTFAMILY.poppins_bold, fontSize: 20, color: COLORS.errorText }}>{props.message} Error</Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default Error