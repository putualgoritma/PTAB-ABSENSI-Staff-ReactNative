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
  RefreshControl,
  Platform,
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
import {SafeAreaView} from 'react-native-safe-area-context';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const Absence = ({navigation, route}) => {
  const TOKEN = useSelector(state => state.TokenReducer);
  const USER = useSelector(state => state.UserReducer);
  const USER_ID = useSelector(state => state.UserReducer.id);
  const STAFF_ID = useSelector(state => state.UserReducer.staff_id);
  const [timeD, setTimeD] = useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [j1, setJ1] = useState(0);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    console.log(route.params);
    setLoading(true);
    // console.log(route.params.data.duty)
    Geolocation.getCurrentPosition({
      message:
        "<h2 style='color: #0af13e'>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
      ok: 'YES',
      cancel: 'NO',
    })
      .then(function (success) {
        if (success) {
          Promise.all([requestLocationPermission()])
            .then(res => {
              // console.log('corrrrrr',res);
              Geolocation.getCurrentPosition(
                position => {
                  // Working with W3C Geolocation API

                  console.log(
                    'You are ',
                    getDistance(position.coords, {
                      latitude: parseFloat(route.params.lat),
                      longitude: parseFloat(route.params.lng),
                    }),
                    'meters away from 51.525, 7.4575',
                  );

                  // tesss1

                  const j = getDistance(position.coords, {
                    latitude: parseFloat(route.params.lat),
                    longitude: parseFloat(route.params.lng),
                  });
                  // Working with W3C Geolocation API

                  setTest(j);
                  if (j > route.params.radius) {
                    setJarak('1');
                    setJ1(j);
                  } else {
                    setJarak('2');
                  }
                  console.log(
                    'posisiisii ',
                    position.coords.latitude,
                    position.coords.longitude,
                  );
                  setForm({
                    ...form,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  });
                  setLoading(false);
                  // alert(position.coords.latitude);
                  // handleData(position)
                },
                error => {
                  console.log(error);
                  setLoading(false);
                },
                {
                  enableHighAccuracy: route.params.highAccuracy,
                  timeout: 120000,
                  maximumAge: 1000,
                  accuracy: 'high',
                },
              );
            })
            .catch(e => {
              console.log(e);
              setLoading(false);
            });
        }
      })
      .catch(error => {
        console.log(error.message); // error.message => "disabled"
        //   navigation.navigate('Register')
        // setStatusGps(error.message)
        setLoading(false);
      });
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // if(route.params.img == {}){
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

  const sendDataNoImg = position => {
    console.log('3');
    setLoading(true);
    RNFetchBlob.fetch(
      'POST',
      'https://simpletabadmin.ptab-vps.com/api/close/absence/absence/store',
      {
        // Authorization: `Bearer ${TOKEN}`,
        // otherHeader: 'foo',
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      [
        {name: 'id', data: route.params.id.toString()},
        {name: 'absence_id', data: route.params.absence_id.toString()},
        {name: 'type', data: route.params.type.toString()},
        {name: 'queue', data: route.params.queue.toString()},
        {name: 'staff_id', data: STAFF_ID.toString()},
        {name: 'lat', data: position.coords.latitude.toString()},
        {name: 'lng', data: position.coords.longitude.toString()},
        {name: 'accuracy', data: form.accuracy.toString()},
        {name: 'distance', data: form.distance.toString()},
        {name: 'status', data: '0'},
      ],
    )
      .then(result => {
        let data = JSON.parse(result.data);
        if (data.data) {
          console.log(result);
          setLoading(false);
          navigation.goBack();

          alert(data.message);
        } else {
          setLoading(false);
          alert(data.message);
        }

        // navigation.navigate('Action')
      })
      .catch(e => {
        // console.log(e);
        alert('lokasi tidak ditemukan');
        setLoading(false);
      });
  };

  const sendData = position => {
    console.log('3');
    setLoading(true);
    RNFetchBlob.fetch(
      'POST',
      'https://simpletabadmin.ptab-vps.com/api/close/absence/absence/store',
      {
        // Authorization: `Bearer ${TOKEN}`,
        // otherHeader: 'foo',
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
        {name: 'lat', data: position.coords.latitude.toString()},
        {name: 'lng', data: position.coords.longitude.toString()},
        {name: 'accuracy', data: form.accuracy.toString()},
        {name: 'distance', data: form.distance.toString()},
        {name: 'status', data: '0'},
      ],
    )
      .then(result => {
        let data = JSON.parse(result.data);
        if (data.data) {
          console.log(result);
          setLoading(false);
          navigation.goBack();

          alert(data.message);
        } else {
          setLoading(false);
          alert(data.message);
        }
        // navigation.navigate('Action')
      })
      .catch(e => {
        // console.log(e);
        alert('lokasi tidak ditemukan');
        setLoading(false);
      });
  };

  const authCurrent = () => {
    FingerprintScanner.authenticate({title: 'Verifikasi Bahwa Ini Benar Anda'})
      .then(() => {
        handleAction();
        // navigation.navigate('Test1')
        FingerprintScanner.release();
      })
      .catch(error => {
        if (error.name == 'DeviceLocked') {
          // if(timeD > 0){
          //   alert('Tunggu beberapa saat dan klik ulang tombol absen')
          // }
          // else{
          alert('Tunggu sekitar 30 detik dan klik ulang tombol absen');
          // }

          // setTimeD(30);
          // handleActionErr()
        } else if (error.name == 'DeviceLockedPermanent') {
          alert('Kunci HP Anda dan masuk dengan sandi anda');
        } else if (error.name == 'DeviceLockedPermanent') {
          alert('Kunci HP Anda dan masuk dengan sandi anda');
        } else if (error.name == 'FingerprintScannerNotEnrolled') {
          alert(
            'Aktifkan Fingerprint anda, masuk ke setting/sandi&keamanan pilih sidik jari',
          );
        } else {
          // alert('Aktifkan Fingerprint anda, masuk ke setting/sandi&keamanan pilih sidik jari')
          // test
          alert(error.name);
        }
        FingerprintScanner.release();
      });
  };

  const [isMounted, setIsMounted] = useState(true);
  const [courseDetails, setCourseDetails] = useState();
  const [jarak, setJarak] = useState('1');
  const [test, setTest] = useState('');
  const {width, height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.4922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const [time, setTime] = React.useState(30);
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

  const requestLocationPermission = async () => {
    let info = '';
    try {
      const granted = await request(
        Platform.select({
          android: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        }),
        {
          title: 'Location Permission',
          message: 'MyMapApp needs access to your location',
        },
      );

      if (granted === RESULTS.GRANTED) {
        //   setEnableLocation(true)
      } else {
        //   setEnableLocation(false)
      }
    } catch (err) {
      info = 1;
    }
  };
  useEffect(() => {
    console.log(route.params);
    setLoading(true);

    FingerprintScanner.isSensorAvailable()
      .then(biometryType => {})
      .catch(error => {
        if (error.name == 'PasscodeNotSet') {
          alert(
            'Aktifkan Fingerprint anda, masuk ke setting/sandi&keamanan pilih sidik jari',
          );
          // test
          // alert(error.name)
        } else if (error.name == 'FingerprintScannerNotSupported') {
          setFinger('OFF');
        }
      });
    // console.log(route.params.data.duty)
    Geolocation.getCurrentPosition({
      message:
        "<h2 style='color: #0af13e'>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
      ok: 'YES',
      cancel: 'NO',
    })
      .then(function (success) {
        if (success) {
          Promise.all([requestLocationPermission()])
            .then(res => {
              // console.log('corrrrrr',res);
              Geolocation.getCurrentPosition(
                position => {
                  console.log('tess', position);

                  console.log(
                    'You are ',
                    getDistance(position.coords, {
                      latitude: parseFloat(route.params.lat),
                      longitude: parseFloat(route.params.lng),
                    }),
                    'meters away from 51.525, 7.4575',
                  );

                  // tesss1

                  const j = getDistance(position.coords, {
                    latitude: parseFloat(route.params.lat),
                    longitude: parseFloat(route.params.lng),
                  });
                  // Working with W3C Geolocation API

                  setTest(j);
                  if (j > route.params.radius) {
                    setJarak('1');
                    setJ1(j);
                    if (position.coords.accuracy > 40) {
                      Alert.alert(
                        'Peringatan',
                        'Anda berada di luar jangkauan, akurasi GPS: ' +
                          position.coords.accuracy +
                          ', tolong kalibrasi GPS atau pakai Internet yang lebih kuat.',
                      );
                    }
                  } else {
                    setJarak('2');

                    // }
                  }

                  // positionNew = position
                  console.log(
                    'posisiisii ',
                    position.coords.latitude,
                    position.coords.longitude,
                  );
                  setForm({
                    ...form,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    distance: j,
                  });
                  setLoading(false);
                  // alert(position.coords.latitude);
                  // handleData(position)
                },
                error => {
                  console.log(error);
                  setLoading(false);
                },
                {
                  enableHighAccuracy: route.params.highAccuracy,
                  timeout: 120000,
                  maximumAge: 1000,
                  accuracy: 'high',
                },
              );
            })
            .catch(e => {
              console.log(e);
              setLoading(false);
            });
        }
      })
      .catch(error => {
        console.log(error.message); // error.message => "disabled"
        //   navigation.navigate('Register')
        // setStatusGps(error.message)
        setLoading(false);
      });
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const granted = await request(
        Platform.select({
          android: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        }),
        {
          title: 'Location Permission',
          message: 'MyMapApp needs access to your location',
        },
      );
      if (granted === RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleAction = () => {
    const data = {
      lat: form.lat,
      lng: form.lng,
    };
    setLoading(true);

    Geolocation.getCurrentPosition({
      message:
        "<h2 style='color: #0af13e'>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
      ok: 'YES',
      cancel: 'NO',
    })
      .then(function (success) {
        if (success) {
          Promise.all([requestLocationPermission()])
            .then(res => {
              // console.log('corrrrrr',res);
              Geolocation.getCurrentPosition(
                position => {
                  // Working with W3C Geolocation API

                  console.log(
                    'You are ',
                    getDistance(position.coords, {
                      latitude: parseFloat(route.params.lat),
                      longitude: parseFloat(route.params.lng),
                    }),
                    'meters away from 51.525, 7.4575',
                  );

                  // tesss1

                  // start input
                  const j = getDistance(position.coords, {
                    latitude: parseFloat(route.params.lat),
                    longitude: parseFloat(route.params.lng),
                  });
                  // Working with W3C Geolocation API
                  console.log('j = ', j);
                  setTest(j);
                  if (j > route.params.radius) {
                    console.log('1');

                    if (j - j1 < 20) {
                      if (route.params.selfie == 'OFF') {
                        sendDataNoImg(position);
                      } else if (route.params.image == null) {
                        alert('Pilih Gambar Terlebih dahulu');
                        setLoading(false);
                      } else if (
                        form.lat != '' &&
                        form.lng != '' &&
                        route.params.image.filename != null &&
                        route.params.image.filename != ''
                      ) {
                        sendData(position);
                      } else {
                        alert('Lengkapi data terlebih dahulu');
                        setLoading(false);
                      }
                    } else {
                      setJarak('1');
                      alert('diluar area');
                    }
                  } else {
                    setJarak('2');
                    setLoading(true);
                    if (route.params.selfie == 'OFF') {
                      sendDataNoImg(position);
                    } else if (route.params.image == null) {
                      alert('Pilih Gambar Terlebih dahulu');
                      setLoading(false);
                    } else if (
                      form.lat != '' &&
                      form.lng != '' &&
                      route.params.image.filename != null &&
                      route.params.image.filename != ''
                    ) {
                      sendData(position);
                    } else {
                      alert('Lengkapi data terlebih dahulu');
                      setLoading(false);
                    }
                  }
                  // end input
                },
                error => {
                  console.log(error);
                  setLoading(false);
                  alert('lokasi tidak ditemukan');
                },
                {
                  enableHighAccuracy: route.params.highAccuracy,
                  timeout: 120000,
                  maximumAge: 1000,
                  accuracy: 'high',
                },
              );
            })
            .catch(e => {
              console.log(e);
              setLoading(false);
            });
        }
      })
      .catch(error => {
        console.log(error.message);
        setLoading(false);
      });
  };

  if (!loading && jarak != '') {
    return (
      <SafeAreaView style={{flex: 1}}>
        {/* <Text>{timeD}</Text> */}
        <ScrollView
          scrollEnabled={true}
          contentContainerStyle={styles.scrollView}
          nestedScrollEnabled={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={{alignItems: 'center'}}>
            <Text
              style={[
                {marginVertical: windowHeight * 0.01},
                jarak == '1' ? {color: '#ff0000'} : '',
              ]}>
              anda berada di{' '}
              {jarak == '1' ? 'Diluar Jangkauan' : 'Dalam Jangkauan'}
            </Text>

            <Text style={[{marginVertical: windowHeight * 0.05, fontSize: 24}]}>
              Absen
            </Text>
            <View
              style={{
                height: windowHeight * 0.3,
                width: windowWidht * 0.8,
                backgroundColor: '#FFFFFF',
              }}>
              <MapView
                style={{flex: 1}} //window pake Dimensions
                // showsUserLocation={true}
                showsMyLocationButton={true}
                region={{
                  latitude: parseFloat(route.params.lat),
                  longitude: parseFloat(route.params.lng),
                  latitudeDelta: 0.00683,
                  longitudeDelta: 0.0035,
                }}>
                <Circle
                  center={{
                    latitude: parseFloat(route.params.lat),
                    longitude: parseFloat(route.params.lng),
                  }}
                  radius={route.params.radius}
                  strokeWidth={1}
                  strokeColor="#ff0000"
                  fillColor="#ff000030"
                />

                <Marker
                  coordinate={{
                    latitude: parseFloat(route.params.lat),
                    longitude: parseFloat(route.params.lng),
                  }}>
                  <Callout>
                    <View>
                      <Text>Posisi Kantor</Text>
                    </View>
                  </Callout>
                </Marker>

                <Marker
                  pinColor={'blue'}
                  coordinate={{
                    latitude: form.lat,
                    longitude: form.lng,
                  }}>
                  <Callout>
                    <View>
                      <Text>Posisi Anda</Text>
                    </View>
                  </Callout>
                </Marker>
              </MapView>
            </View>

            {/* <View style={styles.mapS}>

        </View> */}
            <Text>Map</Text>

            {/* untuk gambar start */}
            {route.params.selfie == 'ON' && (
              <View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('CamDect', {
                      highAccuracy: route.params.highAccuracy,
                      fingerfrint: route.params.fingerfrint,
                      selfie: route.params.selfie,
                      link: 'Absence',
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
                <Text>Image</Text>
              </View>
            )}

            {/* untuk gambar end */}
          </View>
        </ScrollView>
        {jarak != 1 && finger == 'ON' && route.params.fingerfrint == 'ON' && (
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

        {jarak != 1 && route.params.fingerfrint == 'OFF' && finger == 'ON' && (
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

        {jarak != 1 && route.params.fingerfrint == 'ON' && finger == 'OFF' && (
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
      </SafeAreaView>
    );
  } else {
    return (
      <View>
        <ScreenLoading />
      </View>
    );
  }
};

export default Absence;

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
});
