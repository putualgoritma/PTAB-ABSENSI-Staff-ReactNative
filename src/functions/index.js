import {Alert, Platform, View} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import Geolocation from '@react-native-community/geolocation';
import reactNativeAndroidLocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import {
  isMockingLocation,
  MockLocationDetectorErrorCode,
} from 'react-native-turbo-mock-location-detector';

const permissionCamera = async () => {
  //setLoading(true);
  try {
    const res = await check(
      Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.CAMERA,
      }),
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
        }),
      );
      if (res2 === RESULTS.GRANTED) {
        console.log('CameraGranted request', 'Yes');
        //setLoading(false);
        console.log('tesss1');
        return true;
      } else {
        console.log('CameraGranted request', 'No');
        //setLoading(false);
        console.log('tesss2');
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
      }),
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
        }),
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

const checkGps = async accuracy => {
  // setLoading(true);
  // if (Platform.OS === 'android') {
  //   reactNativeAndroidLocationServicesDialogBox
  //     .checkLocationServicesIsEnabled({
  //       message:
  //         "<h2 style='color: #0af13e'>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
  //       ok: 'YES',
  //       cancel: 'NO',
  //     })
  //     .then(function (success) {
  //       if (success) {
  //       }
  //     })
  //     .catch(error => {
  //       console.log(error.message);
  //       // alert('gps harus aktif');
  //       // setLoading(false);
  //     });
  // }
  console.log('accuracy', accuracy);
  const opt = {
    // enableHighAccuracy: accuracy,
    enableHighAccuracy: accuracy,
    timeout: 20000,
    // timeout: 30000,
    // maximumAge: 10000,
    maximumAge: 0,
    // accuracy: 'high',
  };
  const getCurrentPosition = () =>
    new Promise((resolve, error) =>
      Geolocation.getCurrentPosition(resolve, error, opt),
    );
  try {
    const position = await getCurrentPosition();
    //setLoading(false);
    console.log('GPSSS : ', position.coords);
    return {status: true, data: position.coords};
  } catch (err) {
    console.log('errrggggg', err);
    // Alert.alert('GPS', 'GPS mati, tolong hidupkan GPS!');
    //setLoading(false);
    return {status: false, data: null};
  }
};

const checkFingerprint = async () => {
  try {
    const fingerprint = await FingerprintScanner.isSensorAvailable()
      .then(biometryType => {
        console.log('biometryType', biometryType);
        return true;
      })
      .catch(error => {
        if (error.name == 'PasscodeNotSet') {
          Alert.alert(
            'Aktifkan Fingerprint/Facedetection (khusus ios) anda',
            'masuk ke setting/sandi&keamanan pilih sidik jari/Facedetection',
          );
          //test
          //Alert.alert(error.name)
          return true;
        } else if (error.name == 'FingerprintScannerNotSupported') {
          // Alert.alert('Fingerprint Off');
          Alert.alert(
            'HP tidak support fingerprint',
            'Konfirmasi ke admin untuk menonaktifkan fitur fingerprint *abaikan jika sudah konfirmasi ke admin',
          );
          return true;
          // return false;
        } else {
          Alert.alert('Fingerprint tidak jalan: ' + error.message);
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

const fakeGps = async () => {
  console.log('Fake GPS');
  // return true;
  await isMockingLocation()
    .then(({isLocationMocked}) => {
      if (isLocationMocked === true) {
        // Alert.alert('gps palsu');
        // console.log('fake');
        return true;
      } else {
        // console.log('real');
        // Alert.alert('gps asli');
        return true;
      }

      // isLocationMocked: boolean
      // boolean result for Android and iOS >= 15.0
    })
    .catch(error => {
      // error.message - descriptive message
      switch (error.code) {
        case MockLocationDetectorErrorCode.GPSNotEnabled: {
          // user disabled GPS
          console.log('fake 1');
          return true;
        }
        case MockLocationDetectorErrorCode.NoLocationPermissionEnabled: {
          // user has no permission to access location
          console.log('fake 2');
          return true;
        }
        case MockLocationDetectorErrorCode.CantDetermine: {
          console.log('fake 3');
          return true;
          // always for iOS < 15.0
          // for android and iOS if couldn't fetch GPS position
        }
      }
    });
};

const myFunctions = {
  permissionCamera,
  permissionLocation,
  checkGps,
  fakeGps,
  checkFingerprint,
};

export default myFunctions;
