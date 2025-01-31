import { View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { COLORS, FONTFAMILY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Feather';
import SideDrawer from './SideDrawer';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const HeaderBarOthers = (props: any) => {
    const [sideBarVisible, setSideBarVisible] = useState(false);

    return (
        <>
            <View style={{ height: 50, width: screenWidth, backgroundColor: COLORS.lightBackground, borderRadius: 5, marginBottom: 10 }}>
                <View style={{ width: screenWidth, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => setSideBarVisible(!sideBarVisible)}>
                        <Icon name="menu" style={{ margin: 10, marginTop: 5 }} size={35} color={COLORS.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => props.props.navigation.push('HomeScreen')}>
                        <Text style={{ fontFamily: FONTFAMILY.poppins_regular, color: `${COLORS.secondary}150`,marginRight:10 }}>Home</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ position: 'absolute', bottom: -5, left: 0, right: 0, height: 5, backgroundColor: COLORS.tertiary, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, shadowColor: COLORS.tertiary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, }}>
                </View>
            </View>

            {sideBarVisible && (
                <>
                    <TouchableWithoutFeedback  onPress={() => setSideBarVisible(false)}>
                        <View style={{ zIndex:10,width: screenWidth, height: screenHeight, backgroundColor: `${COLORS.darkText2}10`, position: 'absolute', top: 0, left: 0 }} />
                    </TouchableWithoutFeedback>
                    <View style={{ position:'absolute',zIndex:20,width: screenWidth * 0.6 ,backgroundColor:COLORS.lightText1}}>
                        <SideDrawer props={props.props} />
                    </View>
                </>
            )}
        </>
    );
};

export default HeaderBarOthers;
