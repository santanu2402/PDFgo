import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid'

GoogleSignin.configure({
    webClientId: '994550970513-j409mamg25munsl43cm56bec6gb2uep2.apps.googleusercontent.com',
});

export const createUserWithEmailAndPassword = async (email: string, password: string) => {
    let message = '';
    let response: { userCredential: any, message: string, status: string, authType: string };

    try {
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        message = 'User account created & signed in!';
        response = { userCredential, message, status: 'success', authType: 'email' };
        return response;
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            message = 'That email address is already in use!';
        } else if (error.code === 'auth/invalid-email') {
            message = 'That email address is invalid!';
        } else {
            message = error.toString();
        }
        response = { userCredential: null, message, status: 'failed', authType: '' };
        return response;
    }
};

export const signInWithEmailAndPassword = async (email: string, password: string) => {
    let message = '';
    let response: { userCredential: any, message: string, status: string, authType: string };

    try {
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        message = 'User signed in!';
        response = { userCredential, message, status: 'success', authType: 'email' };
        return response;
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            message = 'No user found with that email address!';
        } else if (error.code === 'auth/wrong-password') {
            message = 'Incorrect password!';
        } else if (error.code === 'auth/invalid-email') {
            message = 'That email address is invalid!';
        } else {
            message = error.toString();
        }
        response = { userCredential: null, message, status: 'failed', authType: '' };
        return response;
    }
};

export const forgotPassword = async (email: string) => {
    let message = '';
    let response: { message: string, status: string };

    try {
        await auth().sendPasswordResetEmail(email);
        message = 'Password reset email sent!';
        response = { message, status: 'success' };
        return response;
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            message = 'No user found with that email address!';
        } else if (error.code === 'auth/invalid-email') {
            message = 'That email address is invalid!';
        } else {
            message = error.toString();
        }
        response = { message, status: 'failed' };
        return response;
    }
};

export const changeUserPassword = async (email: string, password: string) => {
    let message = '';
    let response: { message: string, status: string };

    try {
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        if (userCredential) {
            await auth().sendPasswordResetEmail(email);
            message = 'Password reset email sent!';
            response = { message, status: 'success' };
            return response;
        }
        else {
            message = 'No user found with that email address!';
            response = { message, status: 'failed' };
            return response;
        }

    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            message = 'No user found with that email address!';
        } else if (error.code === 'auth/wrong-password') {
            message = 'Incorrect password!';
        } else if (error.code === 'auth/invalid-email') {
            message = 'That email address is invalid!';
        } else {
            message = error.toString();
        }
        response = { message, status: 'failed' };
        return response;
    }
};

export const signInWithGoogle = async () => {
    let message = '';
    let response: { userCredential: any, message: string, status: string, authType: string };

    try {
        await GoogleSignin.hasPlayServices();
        const { idToken } = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        const userCredential = await auth().signInWithCredential(googleCredential);
        message = 'User signed in with Google!';
        response = { userCredential, message, status: 'success', authType: 'google' };
        return response;
    } catch (error: any) {
        message = error.toString();
        response = { userCredential: null, message, status: 'failed', authType: '' };
        return response;
    }
};

// export const signOutEmail = async () => {
//     let message = '';
//     let response: { status: string, message: string, };

//     try {
//         await auth().signOut();
//         message = 'User signed out from email authentication!';
//         response = { status: 'success', message };
//         return response;
//     } catch (error: any) {
//         message = error.toString();
//         response = { status: 'failed', message };
//         return response;
//     }
// };

// export const signOutGoogle = async () => {
//     let message = '';
//     let response: { status: string, message: string, };

//     try {
//         await auth().signOut();
//         await GoogleSignin.revokeAccess();
//         await GoogleSignin.signOut();
//         message = 'User signed out from Google authentication!';
//         response = { status: 'success', message };
//         return response;
//     } catch (error: any) {
//         message = error.toString();
//         response = { status: 'failed', message };
//         return response;
//     }
// };
export const getAuthType = async (uid: string) => {
    try {
        const userDoc = await firestore().collection('Users').doc(uid).get();
        if (!userDoc.exists) {
            return { status: 'failed', authType: null };
        }

        const userData = userDoc.data();
        if (!userData?.authType) {
            return { status: 'failed', authType: null };
        }
        return { status: 'success', authType: userData?.authType };
    } catch (error) {
        return { status: 'failed', authType: null };

    }
}

export const getUser = async (uid: string) => {
    try {
        const userDoc = await firestore().collection('Users').doc(uid).get();
        if (!userDoc.exists) {
            return { status: 'failed', authType: null };
        }
        const userData = userDoc.data();
        console.log(userData)
        return userData;
    } catch (error) {
        return null;
    }
}

export const signOutUser = async (uid: string) => {
    let message = '';
    let response: { status: string, message: string };

    try {
        // Retrieve user data from Firestore
        const userDoc = await firestore().collection('Users').doc(uid).get();
        if (!userDoc.exists) {
            message = 'User document not found in Firestore.';
            response = { status: 'failed', message };
            return response;
        }

        const userData = userDoc.data();
        if (!userData?.authType) {
            message = 'AuthType not found in user document.';
            response = { status: 'failed', message };
            return response;
        }

        // Sign out based on authType
        switch (userData.authType) {
            case 'Email':
                await auth().signOut();
                message = 'User signed out from email authentication!';
                break;
            case 'Google':
                await auth().signOut();
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
                message = 'User signed out from Google authentication!';
                break;
            default:
                message = `Unsupported authType: ${userData.authType}`;
                response = { status: 'failed', message };
                return response;
        }

        response = { status: 'success', message };
        return response;
    } catch (error: any) {
        console.error('Error signing out:', error);
        message = error.toString();
        response = { status: 'failed', message };
        return response;
    }
};


export const addInitialInfoEmail = async (email: string, uid: string) => {
    try {
        console.log('add initial email')

        await firestore()
            .collection('Users')
            .doc(uid)
            .set({
                uid: uid,
                email: email,
                name: '',
                profilepic: '',
                pdfs: [],
                addInfo: false,
                size: 0,
                number: 0,
                authType: 'Email'
            });
        console.log('User added!');
    } catch (error) {
        console.error('Error adding user: ', error);
    }
};


export const addAdditionalInfoEmail = async (uid: string, name: string, profilepic: string) => {
    try {
        console.log('add additional email')
        const userDoc = firestore().collection('Users').doc(uid);
        const docSnapshot = await userDoc.get();
        if (docSnapshot.exists) {
            await userDoc.update({
                name: name,
                profilepic: profilepic,
                addInfo: true

            });
            console.log('User profile updated!');
        } else {
            console.log('User does not exist!');
        }
    } catch (error) {
        console.error('Error updating user: ', error);
    }
};


export const addInitialInfoGoogle = async (email: string, uid: string, name: string, profilepic: string) => {
    try {
        await firestore()
            .collection('Users')
            .doc(uid)
            .set({
                uid: uid,
                email: email,
                name: name,
                profilepic: profilepic,
                pdfs: [],
                size: 0,
                number: 0,
                authType: 'Google'
            });
        return { done: 'yes' }
    } catch (error) {
        return { done: 'no' }
    }
};



// export const getPdfLinksForUser = async (uid: string) => {
//     try {
//         const userDoc = firestore().collection('Users').doc(uid);

//         const docSnapshot = await userDoc.get();
//         if (docSnapshot.exists) {
//             const pdfLinks = docSnapshot.data()?.pdfs || [];
//             pdfLinks.sort((a: any, b: any) => a.timestamp - b.timestamp);
//             console.log('PDF links retrieved:', pdfLinks);
//             return pdfLinks;
//         } else {
//             console.log('User does not exist!');
//             return [];
//         }
//     } catch (error) {
//         console.error('Error retrieving PDF links: ', error);
//         return [];
//     }
// };

export const getPdfForUser = async (uid: string) => {
    try {
        const userDocRef = firestore().collection('Users').doc(uid);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
            const pdfs = userDoc.data()?.pdfs || [];
            console.log('PDFs retrieved:', pdfs);
            return pdfs;
        } else {
            console.log('User does not exist!');
            return [];
        }
    } catch (error) {
        console.error('Error retrieving PDFs:', error);
        return [];
    }
};

export const addPdfUser = async (uid: string, pdfname: string, pdfLink: string, pdfsize: number) => {
    const pdfid = `${uuid.v4()}${uid}`
    try {
        const userDoc = firestore().collection('Users').doc(uid);
        const docSnapshot = await userDoc.get();
        if (docSnapshot.exists) {
            const pdfs = docSnapshot.data()?.pdfs || [];
            const size = (docSnapshot.data()?.size).toString();
            const number = (docSnapshot.data()?.number).toString();
            const timestamp = new Date().toISOString();
            pdfs.push({ pdfid: pdfid, pdfname: pdfname, pdfLink: pdfLink, timestamp: timestamp, pdfsize: pdfsize });
            await userDoc.update({
                pdfs: pdfs,
                size: parseInt(size, 10) + pdfsize,
                number: parseInt(number, 10) + 1
            });
            return { status: 'success', message: 'PDF link added!' };
        } else {
            return { status: 'failed', message: 'User does not exist!' };
        }
    } catch (error: any) {
        return { status: 'failed', message: `Error adding PDF link: ${error.toString()}` };
    }
};

export const uploadPdfAndAddLink = async (uid: string, pdfFile: any, pdfName: string, pdfsize: any) => {
    try {
        const storageRef = storage().ref(`pdf/${uid}/${pdfName}`);
        await storageRef.putFile(pdfFile.fileCopyUri);
        const pdfLink = await storageRef.getDownloadURL();
        await addPdfUser(uid, pdfName, pdfLink, pdfsize);
        return { status: 'success', message: 'PDF uploaded!' };
    } catch (error: any) {
        return { status: 'failed', message: `Error adding PDF link: ${error.toString()}` };
    }
};

export const deletePdfForUser = async (uid: string, pdfid: string, pdfsize: any) => {
    try {
        const userDocRef = firestore().collection('Users').doc(uid);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
            const pdfs = userDoc.data()?.pdfs || [];
            const size = (userDoc.data()?.size).toString();
            const number = (userDoc.data()?.number).toString();

            // Filter out the PDF with the specified pdfid
            const updatedPdfs = pdfs.filter((pdf: any) => pdf.pdfid !== pdfid);

            // Update the user document with the filtered PDFs array and adjusted size/number
            await userDocRef.update({
                pdfs: updatedPdfs,
                size: (Math.max(parseInt(size, 10) - pdfsize, 0)), // Ensure size doesn't go below 0
                number: (Math.max(parseInt(number, 10) - 1, 0)) // Ensure number doesn't go below 0
            });

            console.log('PDF deleted successfully.');
            return { status: 'success', message: 'PDF deleted successfully.' };
        } else {
            console.log('User does not exist!');
            return { status: 'failed', message: 'User does not exist.' };
        }
    } catch (error) {
        console.error('Error deleting PDF:', error);
        return { status: 'error', message: `Error deleting PDF: ${error}` };
    }
};

export const getUserStats = async (uid: string) => {
    try {
        const userDocRef = firestore().collection('Users').doc(uid);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
            const { size, number } = userDoc.data() || { size: 0, number: 0 }; // Default to 0 if data is undefined

            console.log('User stats retrieved:', { size, number });
            return { status: 'success', data: { size, number } };
        } else {
            console.log('User does not exist!');
            return { status: 'failed', data: { size: 0, number: 0 } };
        }
    } catch (error) {
        console.error('Error retrieving user stats:', error);
        return { status: 'error', message: `Error retrieving user stats: ${error}` };
    }
};

export const uploadImageAndAddProfilePic = async (uid: string, imageFile: any, name: string) => {
    try {
        const storageRef = storage().ref(`images/${uid}/profile_pic`);
        await storageRef.putFile(imageFile.fileCopyUri);
        const profilepicLink = await storageRef.getDownloadURL();
        await addAdditionalInfoEmail(uid, name, profilepicLink);
        return { status: 'success', message: 'Image uploaded and profile updated!' }
    } catch (error) {
        console.error('Error uploading image and updating profile: ', error);
        return { status: 'failed', message: `Error uploading image and updating profile: ${error}` }
    }
};

export const getAddInfoValue = async (uid: string) => {
    try {
        const userDoc = await firestore()
            .collection('Users')
            .doc(uid)
            .get();

        if (userDoc.exists) {
            const userData = userDoc.data();
            const addInfo = userData?.addInfo;
            console.log('addInfo value:', addInfo);
            return addInfo;
        } else {
            console.log('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error getting addInfo value: ', error);
        return null;
    }
};

export const setAddInfoTrue = async (uid: string) => {
    try {
        const userDocRef = firestore().collection('Users').doc(uid);

        // Check if the document exists
        const userDoc = await userDocRef.get();
        if (userDoc.exists) {
            // Update the addInfo field to true
            await userDocRef.update({
                addInfo: true
            });
            console.log('addInfo value updated to true!');
        } else {
            console.log('No such document!');
        }
    } catch (error) {
        console.error('Error updating addInfo value: ', error);
    }
};