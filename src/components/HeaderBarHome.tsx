import { View, Dimensions, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { COLORS, FONTFAMILY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Feather';
import ProfilePic from './ProfilePic';
import SideDrawer from './SideDrawer';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const HeaderBarHome = (props: any) => {
    const [sideBarVisible, setSideBarVisible] = useState(false);

    return (
        <>
            <View style={{ height: 50, width: screenWidth, borderRadius: 5 }}>
                <View style={{ width: screenWidth, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => setSideBarVisible(!sideBarVisible)}>
                        <Icon name="menu" style={{ margin: 10, marginTop: 5 }} size={35} color={COLORS.primary} />
                    </TouchableOpacity>
                    <ProfilePic props={props.props} />
                </View>
            </View>

            {sideBarVisible && (
                <>
                    <TouchableWithoutFeedback onPress={() => setSideBarVisible(false)}>
                        <View style={{ zIndex:10,width: screenWidth, height: screenHeight, backgroundColor: `${COLORS.darkText2}10`, position: 'absolute', top: 0, left: 0 }} />
                    </TouchableWithoutFeedback>
                    <View style={{ zIndex:20,position: 'absolute', top: 0, left: 0, width: screenWidth * 0.6, backgroundColor:COLORS.lightText1 }}>
                        <SideDrawer props={props.props} />
                    </View>
                </>
            )}
        </>
    );
}

export default HeaderBarHome;
