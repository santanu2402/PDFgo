import { SafeAreaView, Dimensions, StatusBar } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Video from 'react-native-video';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const SplashScreen = (props: any) => {
  const [durationLimit, setDurationLimit] = useState(false);
  const minTimeDuration = async () => {
    const delay = () => new Promise(resolve => setTimeout(resolve, 3000));
    await delay();
    setDurationLimit(true);
  };

  const navToScreen = () => {
    if (durationLimit) {
      return props.navigation.replace('HomeScreen');
    }
  };

  useEffect(() => {
    minTimeDuration();
  }, []);

  useEffect(() => {
    navToScreen();
  }, [durationLimit]);

  return (
    <SafeAreaView style={{ backgroundColor: '#D9D4D4', height: screenHeight, width: screenWidth }}>
      <StatusBar
        backgroundColor={'#D9D4D4'}
        barStyle={'dark-content'}
      />

      <Video
        source={require('../assets/videos/ss.mp4')}
        paused={false}
        repeat={true}
        style={{
          height: screenHeight,
          width: screenWidth
        }}
      />

    </SafeAreaView>
  )
}

export default SplashScreen
