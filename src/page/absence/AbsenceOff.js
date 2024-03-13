import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
  PermissionsAndroid,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {Callout, Marker, Circle} from 'react-native-maps';
import reactNativeAndroidLocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import Geolocation from '@react-native-community/geolocation';
import {useSelector} from 'react-redux';
import API from '../../service';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import RNFetchBlob from 'rn-fetch-blob';
import {getDistance} from 'geolib';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {launchCamera} from 'react-native-image-picker';
import ScreenLoading from '../loading/ScreenLoading';
import Textarea from 'react-native-textarea';
import myFunctions from '../../functions';
import {
  isMockingLocation,
  MockLocationDetectorErrorCode,
} from 'react-native-turbo-mock-location-detector';
import Config from 'react-native-config';

const AbsenceOff = ({navigation, route}) => {
  const TOKEN = useSelector(state => state.TokenReducer);
  const USER = useSelector(state => state.UserReducer);
  const USER_ID = useSelector(state => state.UserReducer.id);
  const STAFF_ID = useSelector(state => state.UserReducer.staff_id);
  const [timeD, setTimeD] = useState(0);

  const [image, set_image] = useState({
    base64: '',
    fileName: '',
    fileSize: 0,
    height: 0,
    type: '',
    uri: '',
    width: 0,
    from: 'api',
  });
  const [isMounted, setIsMounted] = useState(true);
  const [courseDetails, setCourseDetails] = useState();
  const [jarak, setJarak] = useState('');
  const [test, setTest] = useState('');
  const {width, height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.4922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const [time, setTime] = React.useState();
  const [imageUri, setImageUri] = useState('');
  const [finger, setFinger] = useState('ON');
  const [form, setForm] = useState({
    lat: 0,
    lng: 0,
    customer_id: '',
    memo: '',
    type: '',
    accuracy: '',
    distance: '',
    // staff_id : USER_ID,
    todo: '',
  });
  const [loading, setLoading] = useState(true);
  const [fakeGpsV, setfakeGpsV] = useState(0);

  const fakeGps = async () => {
    console.log('Fake GPS');
    // return true;
    await isMockingLocation()
      .then(({isLocationMocked}) => {
        if (isLocationMocked === true) {
          // alert('gps falsu');
          setfakeGpsV(2);
          return (
            <View>
              <Text>
                Anda Menggunakan Fake GPS Tolong Matikan Fake GPS dan restart HP
                Anda Kembali
              </Text>
            </View>
          );
          // return true;
        } else {
          // alert('gps asli');
          setfakeGpsV(3);
          return (
            <View>
              <Text>
                Anda Menggunakan Fake GPS Tolong Matikan Fake GPS dan restart HP
                Anda Kembali
              </Text>
            </View>
          );
          // return true;
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

  useEffect(() => {
    console.log(route.params);
    setLoading(true);
    fakeGps();
    Promise.all([
      myFunctions.checkFingerprint(),
      myFunctions.permissionCamera(),
      myFunctions.permissionLocation(),
    ])
      .then(res => {
        setLoading(true);
        //if fingerprint off
        if (!res[0]) {
          setFinger('OFF');
        }
        //if perrmission loc
        if (res[2]) {
          //check gps
          myFunctions
            .checkGps(false)
            .then(function (gps) {
              if (!gps.status) {
                setLoading(false);
                console.log('checkGps useeffect', 'false');
              } else {
                console.log('position', gps.data);
                console.log(
                  'posisiisii ',
                  gps.data.latitude,
                  gps.data.longitude,
                );
                setForm({
                  ...form,
                  lat: gps.data.latitude,
                  lng: gps.data.longitude,
                  accuracy: gps.data.accuracy,
                });
                setLoading(false);
              }
            })
            .catch(error => {
              console.log('err checkGps useeffect', error.message);
              setLoading(false);
            });
        } else {
          Alert.alert(
            'Location Permission',
            'Location Permission tidak diizinkan.',
          );
        }
        setLoading(false);
      })
      .catch(e => {
        console.log('err promise all', e);
        setLoading(false);
      });

    setLoading(false);
  }, []);

  const authCurrent = () => {
    FingerprintScanner.authenticate({title: 'Verifikasi Bahwa Ini Benar Anda'})
      .then(() => {
        setLoading(true);
        handleAction();
        // navigation.navigate('Test1')
        FingerprintScanner.release();
      })
      .catch(error => {
        setLoading(false);
        if (error.name == 'DeviceLocked') {
          // handleActionErr()
          // if(timeD > 0){
          //   Alert.alert('Tunggu beberapa saat dan klik ulang tombol absen')
          // }
          // else{
          Alert.alert(
            'Tunggu kurang lebih 30 detik dan klik ulang tombol absen',
          );
          // }

          // setTimeD(30);
        } else if (error.name == 'DeviceLockedPermanent') {
          Alert.alert('Kunci HP Anda dan masuk dengan sandi anda');
        } else if (error.name == 'DeviceLockedPermanent') {
          Alert.alert('Kunci HP Anda dan masuk dengan sandi anda');
        } else if (error.name == 'FingerprintScannerNotEnrolled') {
          Alert.alert(
            'Aktifkan Fingerprint anda, masuk ke setting/sandi&keamanan pilih sidik jari',
          );
        } else {
          // Alert.alert('Aktifkan Fingerprint anda, masuk ke setting/sandi&keamanan pilih sidik jari')
          // test
          Alert.alert(error.name);
        }
        FingerprintScanner.release();
      });
  };

  const sendDataNoImg = () => {
    setLoading(true);
    RNFetchBlob.fetch(
      'POST',
      Config.REACT_APP_BASE_URL + '/close/absence/absence/storeN3w',
      {
        Authorization: `Bearer ${TOKEN}`,
        otherHeader: 'foo',
        Accept: 'application/json',
        // 'Content-Type': 'multipart/form-data',
      },
      [
        {name: 'id', data: route.params.id.toString()},
        {name: 'absence_id', data: route.params.absence_id.toString()},
        {name: 'type', data: route.params.type.toString()},
        {name: 'queue', data: route.params.queue.toString()},
        {name: 'staff_id', data: STAFF_ID.toString()},
        {name: 'lat', data: form.lat ? form.lat.toString() : ''},
        {name: 'lng', data: form.lng ? form.lng.toString() : ''},
        {name: 'status', data: '0'},
        {name: 'accuracy', data: form.accuracy.toString()},
        {name: 'distance', data: form.distance.toString()},
      ],
    )
      .then(result => {
        let data = JSON.parse(result.data);
        if (data.data) {
          console.log(result);
          setLoading(false);
          navigation.goBack();

          Alert.alert(data.message);
        } else {
          setLoading(false);
          Alert.alert(data.message);
        }
        // navigation.navigate('Action')
      })
      .catch(e => {
        // console.log(e);
        setLoading(false);
      });
  };

  const sendData = () => {
    setLoading(true);
    RNFetchBlob.fetch(
      'POST',
      Config.REACT_APP_BASE_URL + '/close/absence/absence/storeN3w',
      {
        Authorization: `Bearer ${TOKEN}`,
        otherHeader: 'foo',
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      [
        {
          name: 'image',
          filename: route.params.image.filename,
          data: route.params.image.base64,
        },
        {name: 'id', data: route.params.id.toString()},
        {name: 'absence_id', data: route.params.absence_id.toString()},
        {name: 'type', data: route.params.type.toString()},
        {name: 'queue', data: route.params.queue.toString()},
        {name: 'staff_id', data: STAFF_ID.toString()},
        {name: 'lat', data: form.lat ? form.lat.toString() : ''},
        {name: 'lng', data: form.lng ? form.lng.toString() : ''},
        {name: 'status', data: '0'},
        {name: 'accuracy', data: form.accuracy.toString()},
        {name: 'distance', data: form.distance.toString()},
      ],
    )
      .then(result => {
        let data = JSON.parse(result.data);
        if (data.data) {
          console.log(result);
          setLoading(false);
          navigation.goBack();

          Alert.alert(data.message);
        } else {
          setLoading(false);
          Alert.alert(data.message);
        }

        // navigation.navigate('Action')
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
      });
  };

  const handleAction = () => {
    const data = {
      lat: form.lat,
      lng: form.lng,
    };
    console.log(form.lat, form.lng);
    if (route.params.selfie == 'OFF') {
      sendDataNoImg();
    } else if (route.params.image == null) {
      Alert.alert('Pilih Gambar Terlebih dahulu A');
      setLoading(false);
    } else if (
      // form.lat != null &&
      // form.lng != null &&
      route.params.image.filename != '' &&
      route.params.image.filename != null
    ) {
      sendData();
    } else {
      console.log('data : ', route.params.image);
      console.log(
        'lat : ',
        form.lat.toString(),
        form.lat != '',
        'lng : ',
        form.lng.toString(),
        form.lng != '',
        'file',
        1 * 2 === 2,
        route.params.image.filename != 'dddd',
        route.params.image.filename != 'aasxx',
      );
      Alert.alert('Lengkapi data terlebih dahulu B');
    }
  };

  if (fakeGpsV === 2 && fakeGpsV != 0) {
    return (
      <View>
        <Text>
          Anda Menggunakan Fake GPS Tolong Matikan Fake GPS dan restart HP Anda
          Kembali
        </Text>
      </View>
    );
  } else if (!loading) {
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          <View style={{alignItems: 'center'}}>
            <Text style={[{marginVertical: windowHeight * 0.01}]}>
              anda bisa absen mengabaikan radius
            </Text>

            <Text style={[{marginVertical: windowHeight * 0.05, fontSize: 24}]}>
              Absen
            </Text>

            {/* <View style={styles.mapS}>

        </View> */}

            {/* untuk gambar start */}
            {route.params.selfie == 'ON' && (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    console.log(route.params.type, route.params.image.filename);
                  }}>
                  {/* <Text>Tesssssx</Text> */}
                </TouchableOpacity>
                {route.params.type == 'break' ? (
                  <TouchableOpacity
                    onPress={() =>
                      launchCamera(
                        {
                          mediaType: 'photo',
                          includeBase64: true,
                          maxHeight: 900,
                          maxWidth: 900,
                          cameraType: 'front',
                        },
                        response => {
                          console.log('ini respon', response);
                          if (response.assets) {
                            let image = response.assets[0];
                            route.params.image = image;
                            route.params.image.filename = image.fileName;
                            route.params.image.uri = image.uri;
                            setImageUri(image.uri);
                          }
                        },
                      )
                    }>
                    {imageUri == '' ? (
                      <View style={styles.image}>
                        <Icon
                          name="camera-retro"
                          size={windowHeight * 0.08}
                          color="#000000"
                        />
                      </View>
                    ) : (
                      <Image
                        style={styles.image}
                        source={{uri: imageUri}}
                        // source={image.uri=='' || image.uri==null ? require('../../../assets/img/ImageFoto.png'): {uri: image.from=='local' ? image.uri : `https://simpletabadmin.ptab-vps.com/` + `${String(image.uri).replace('public/', '')}?time="${new Date()}`}}
                      />
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('CamDect', {
                        highAccuracy: route.params.highAccuracy,
                        fingerfrint: route.params.fingerfrint,
                        selfie: route.params.selfie,
                        link: 'AbsenceOff',
                        lat: route.params.lat,
                        lng: route.params.lng,
                        radius: route.params.radius,
                        id: route.params.id,
                        queue: route.params.queue,
                        absence_id: route.params.absence_id,
                        type: route.params.type,
                        image: null,
                      })
                    }>
                    {route.params.image == null ? (
                      <View style={styles.image}>
                        <Icon
                          name="camera-retro"
                          size={windowHeight * 0.08}
                          color="#000000"
                        />
                      </View>
                    ) : (
                      <Image
                        style={styles.image}
                        source={{uri: route.params.image.uri}}
                      />
                    )}
                  </TouchableOpacity>
                )}
                <Text>Image</Text>
              </View>
            )}

            {/* untuk gambar end */}

            <Textarea
              containerStyle={styles.textareaContainer}
              style={styles.textarea}
              placeholder="Tuliskan Memo"
              editable={true}
              maxLength={255}
              value={form.memo}
              onChangeText={value =>
                setForm({...form, memo: value})
              }></Textarea>
          </View>
        </ScrollView>

        {/* <TouchableOpacity style={[styles.btn]} onPress={()=>{authCurrent()}}>
     <Text style={{ color : '#FFFFFF', fontSize : 24, fontWeight : 'bold' }}>
       Absen
       </Text>
     </TouchableOpacity> */}
        {finger == 'ON' && route.params.fingerfrint == 'ON' && (
          <TouchableOpacity
            style={[styles.btn]}
            onPress={() => {
              authCurrent();
            }}>
            <Text style={{color: '#FFFFFF', fontSize: 24, fontWeight: 'bold'}}>
              Absen
            </Text>
          </TouchableOpacity>
        )}

        {route.params.fingerfrint == 'OFF' && finger == 'ON' && (
          <TouchableOpacity
            style={[styles.btn]}
            onPress={() => {
              handleAction();
            }}>
            <Text style={{color: '#FFFFFF', fontSize: 24, fontWeight: 'bold'}}>
              Absen
            </Text>
          </TouchableOpacity>
        )}

        {route.params.fingerfrint == 'ON' && finger == 'OFF' && (
          <TouchableOpacity
            style={[styles.btn]}
            onPress={() => {
              handleAction();
            }}>
            <Text style={{color: '#FFFFFF', fontSize: 24, fontWeight: 'bold'}}>
              Absen
            </Text>
          </TouchableOpacity>
        )}

        {/* <TouchableOpacity style={[styles.btn]} onPress={()=>{handleAction()}}>
     <Text style={{ color : '#FFFFFF', fontSize : 24, fontWeight : 'bold' }}>
       Absen
       </Text>
     </TouchableOpacity>
    */}
      </View>
    );
  } else {
    return (
      <View>
        <ScreenLoading />
      </View>
    );
  }
};

export default AbsenceOff;

const windowWidht = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  mapS: {
    width: windowWidht * 0.8,
    height: windowHeight * 0.25,
    backgroundColor: '#FFFFFF',
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidht * 0.7,
    height: windowWidht * 1.0,
    backgroundColor: '#00000010',
  },
  btn: {
    width: windowWidht * 0.76,
    height: windowHeight * 0.07,
    backgroundColor: '#00B2FF',
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textareaContainer: {
    width: windowWidht * 0.7,
    height: 120,
    borderRadius: 10,
    padding: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  textarea: {
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#696969',
  },
});
