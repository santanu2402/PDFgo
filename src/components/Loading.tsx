import { View, Text, Dimensions, SafeAreaView } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';
import { COLORS, FONTFAMILY } from '../theme/theme';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const Loading = (props:any) => {
    return (
        <SafeAreaView style={{ height: screenHeight, width: screenWidth, zIndex: 20, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: screenWidth * 0.9, height: screenHeight * 0.3, borderRadius: 20, borderColor: COLORS.primary, borderWidth: 2, backgroundColor: COLORS.tertiary, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flexDirection: 'column',alignItems:'center',justifyContent:'center' }}>
                    <Text style={{ textAlign: "center", fontFamily: FONTFAMILY.poppins_bold, fontSize: 25, color: COLORS.secondary }}>{props.message}</Text>
                    <LottieView style={{ height: screenHeight * 0.2, width: screenWidth * 0.8, alignSelf: 'center',marginTop:-30 ,marginBottom:-70}} source={require('../assets/lotties/loading.json')} autoPlay loop />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Loading