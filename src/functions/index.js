import {
    Alert,
    Platform,
} from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import Geolocation from '@react-native-community/geolocation';

const permissionCamera = async () => {
    //setLoading(true);
    try {
        const res = await check(
            Platform.select({
                android: PERMISSIONS.ANDROID.CAMERA,
                ios: PERMISSIONS.IOS.CAMERA,
            })
        );
        if (res === RESULTS.GRANTED) {
            console.log('CameraGranted check', 'Yes');
            //setLoading(false);
            return true;
        } else if (res === RESULTS.DENIED) {
            const res2 = await request(
                Platform.select({
                    android: PERMISSIONS.ANDROID.CAMERA,
                    ios: PERMISSIONS.IOS.CAMERA,
                })
            );
            if (res2 === RESULTS.GRANTED) {
                console.log('CameraGranted request', 'Yes');
                //setLoading(false);
                return true;
            } else {
                console.log('CameraGranted request', 'No');
                //setLoading(false);
                return false;
            }
        }
    } catch (err) {
        console.log('err CameraGranted request', err);
        //setLoading(false);
        return false;
    }
};

const permissionLocation = async () => {
    //setLoading(true);
    try {
        const res = await check(
            Platform.select({
                android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
            })
        );
        if (res === RESULTS.GRANTED) {
            console.log('LocationGranted check', 'Yes');
            //setLoading(false);
            return true;
        } else if (res === RESULTS.DENIED) {
            const res2 = await request(
                Platform.select({
                    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
                })
            );
            if (res2 === RESULTS.GRANTED) {
                console.log('LocationGranted request', 'Yes');
                //setLoading(false);
                return true;
            } else {
                console.log('LocationGranted request', 'No');
                //setLoading(false);
                return false;
            }
        }
    } catch (err) {
        console.log('err LocationGranted request', err);
        //setLoading(false);
        return false;
    }
};

const checkGps = async (accuracy) => {
    //setLoading(true);
    const opt = {
        enableHighAccuracy: accuracy,
        timeout: 15000,
        maximumAge: 10000,
        accuracy: 'high',
    };
    const getCurrentPosition = () => new Promise((resolve, error) => Geolocation.getCurrentPosition(resolve, error, opt));
    try {
        const position = await getCurrentPosition();
        //setLoading(false);
        return { status: true, data: position.coords };
    } catch (err) {
        Alert.alert('GPS', 'GPS mati, tolong hidupkan GPS!');
        //setLoading(false);
        return { status: false, data: null };
    }
};

const checkFingerprint = async () => {
    try{
    const fingerprint = await FingerprintScanner.isSensorAvailable()
        .then(biometryType => { console.log('biometryType', biometryType); return true; })
        .catch(error => {
            if (error.name == 'PasscodeNotSet') {
                Alert.alert(
                    'Aktifkan Fingerprint anda, masuk ke setting/sandi&keamanan pilih sidik jari',
                );
                //test
                //Alert.alert(error.name)
                return true;
            } else if (error.name == 'FingerprintScannerNotSupported') {
                Alert.alert(
                    'Fingerprint Off',
                );
                return false;
            } else {
                Alert.alert(
                    'Fingerprint tidak jalan: ' + error.message,
                );
                return true;
            }
        });
        return fingerprint;
    } catch (err) {
        Alert.alert('Fingerprint err', 'Fingerprint tidak jalan!');
        //setLoading(false);
        return true;
    }
};

const myFunctions = {
    permissionCamera,
    permissionLocation,
    checkGps,
    checkFingerprint
}

export default myFunctions;