import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'
import { COLORS, FONTFAMILY } from '../theme/theme';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const NoInternetConnection = () => {
  return (
    <View style={{ backgroundColor: COLORS.tertiary, width: screenWidth, height: screenHeight }}>
      <LottieView
        style={{ height: screenHeight * 0.9, width: screenWidth * 0.9, alignSelf: 'center' }}
        source={require('../assets/lotties/nointernet.json')}
        autoPlay
        loop
      />
      <Text style={{ fontFamily: FONTFAMILY.poppins_black, fontSize: 35, color: COLORS.secondary, textAlign: 'center', marginTop: -200 }}>No Internet!!</Text>
    </View>
  )
}

export default NoInternetConnection