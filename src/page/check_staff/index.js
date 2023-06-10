import { Dimensions, StyleSheet, Text, View, ScrollView, PermissionsAndroid, TouchableOpacity, Image, Alert, } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Callout, Marker, Circle } from 'react-native-maps';
import reactNativeAndroidLocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import Geolocation from '@react-native-community/geolocation';
import { useSelector } from 'react-redux';
import API from '../../service';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import RNFetchBlob from 'rn-fetch-blob';
import { getDistance } from 'geolib';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { launchCamera } from 'react-native-image-picker';
import ScreenLoading from '../loading/ScreenLoading';
import myFunctions from '../../functions';


const Check_Staff = ({ navigation, route }) => {
  const TOKEN = useSelector((state) => state.TokenReducer);
  const USER = useSelector((state) => state.UserReducer);
  const USER_ID = useSelector((state) => state.UserReducer.id);
  const STAFF_ID = useSelector((state) => state.UserReducer.staff_id);
  const [timeD, setTimeD] = useState(0)
  const [isMounted, setIsMounted] = useState(true)
  const [courseDetails, setCourseDetails] = useState()
  const [jarak, setJarak] = useState('1')
  const [test, setTest] = useState('')
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.4922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const [time, setTime] = React.useState(30);
  const [form, setForm] = useState({
    lat: '',
    lng: '',
    customer_id: '',
    memo: '',
    type: '',
    // staff_id : USER_ID,
    todo: ''
  })
  const [loading, setLoading] = useState(true)

  const [image, set_image] = useState({
    base64: "",
    fileName: "",
    fileSize: 0,
    height: 0,
    type: "",
    uri: "",
    width: 0,
    from: 'api'
  });

  const authCurrent = () => {
    FingerprintScanner
      .authenticate({ title: 'Verifikasi Bahwa Ini Benar Anda' })
      .then(() => {
        setLoading(true);
        handleAction()
        // navigation.navigate('Test1')
        FingerprintScanner.release();

      }).catch(error => {
        setLoading(false);
        if (error.name == 'DeviceLocked') {
          if (timeD > 0) {
            alert('Tunggu beberapa saat dan klik ulang tombol absen')
          }
          else {
            alert('Tunggu 30 detik dan klik ulang tombol absen')
          }

          setTimeD(30);
        }
        else if (error.name == 'DeviceLockedPermanent') {
          alert('Kunci HP Anda dan masuk dengan sandi anda')
        }
        else if (error.name == 'DeviceLockedPermanent') {
          alert('Kunci HP Anda dan masuk dengan sandi anda')
        }
        else if (error.name == 'FingerprintScannerNotEnrolled') {
          alert('Aktifkan Fingerprint anda, masuk ke setting/sandi&keamanan pilih sidik jari')
        }
        else {
          // alert('Aktifkan Fingerprint anda, masuk ke setting/sandi&keamanan pilih sidik jari')
          // test
          alert(error.name)
        }
        FingerprintScanner.release();
      });

  }

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (timeD > 0) {
        setTimeD(timeD - 1);
        // saad = saad-1;
      }
      console.log('wwww', timeD)
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };

  }, [timeD]);

  React.useEffect(() => {
    // let saad = timeD;
    if (isMounted) {
      const timer = setInterval(() => {
        setTime(new Date().getDate() + "-" + parseInt(new Date().getMonth() + 1) + "-" + new Date().getFullYear() + " " + (new Date().getHours()) + ":" + new Date().getMinutes() + ":" + new Date().getSeconds());

        Promise.all([myFunctions.checkFingerprint(), myFunctions.permissionCamera(), myFunctions.permissionLocation()])
          .then(res => {
            console.log('rpromise all', res);
            setLoading(true);
            //if fingerprint off
            if (!res[0]) {
              setFinger('OFF');
            }
            //if perrmission loc
            if (res[2]) {
              //check gps
              myFunctions.checkGps(false).then(function (gps) {
                if (!gps.status) {
                  console.log('checkGps useeffect', 'false');
                } else {
                  console.log('position', gps.data);
                  const j = getDistance(gps.data, {
                    latitude: parseFloat(route.params.lat),
                    longitude: parseFloat(route.params.lng),
                  })
                  // Working with W3C Geolocation API

                  setTest(j);
                  if (j > route.params.radius) {
                    setJarak('1')
                  }
                  else {
                    setJarak('2')
                  }

                  // positionNew = position
                  // console.log('posisiisii ', (gps.data.latitude),(gps.data.longitude));
                  setForm({
                    ...form,
                    lat: gps.data.latitude,
                    lng: gps.data.longitude
                  })
                  // handleData(position)
                  console.log("saaaa");
                  setLoading(false);
                }
              })
                .catch(error => {
                  console.log('err checkGps useeffect', error.message);
                  setLoading(false);
                });
            } else {
              Alert.alert('Location Permission', 'Location Permission tidak diizinkan.');
            }
            setLoading(false);
          })
          .catch(e => {
            console.log('err promise all', e);
            setLoading(false);
          });
          setLoading(false);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }

  }, [setCourseDetails]);


  useEffect(() => {
    return () => {
      setCourseDetails(null);
      setIsMounted(false);
    }
  }, []);

  useEffect(() => {
    console.log(route.params)
    setLoading(true)

    Promise.all([myFunctions.checkFingerprint(), myFunctions.permissionCamera(), myFunctions.permissionLocation()])
      .then(res => {
        console.log('rpromise all', res);
        setLoading(true);
        //if fingerprint off
        if (!res[0]) {
          setFinger('OFF');
        }
        //if perrmission loc
        if (res[2]) {
          //check gps
          myFunctions.checkGps(false).then(function (gps) {
            if (!gps.status) {
              console.log('checkGps useeffect', 'false');
            } else {
              console.log('position', gps.data);
              console.log(
                'You are ',
                getDistance(gps.data, {
                  latitude: parseFloat(route.params.lat),
                  longitude: parseFloat(route.params.lng),
                }),
                'meters away from 51.525, 7.4575'
              );
              console.log('posisiisii ', (gps.data.latitude), (gps.data.longitude));
              setForm({
                ...form,
                lat: gps.data.latitude,
                lng: gps.data.longitude
              })
              setLoading(false);
            }
          })
            .catch(error => {
              console.log('err checkGps useeffect', error.message);
              setLoading(false);
            });
        } else {
          Alert.alert('Location Permission', 'Location Permission tidak diizinkan.');
        }
        setLoading(false);
      })
      .catch(e => {
        console.log('err promise all', e);
        setLoading(false);
      });
      setLoading(false);
  }, [])

  const handleAction = () => {
    setLoading(true)
    const data = {
      lat: form.lat,
      lng: form.lng,

    }
    console.log(form.lat, form.lng)
    if (form.lat != "" && form.lng != "") {
      API.checkStaff({ id: route.params.id, lng: form.lng, lat: form.lat }, TOKEN).then((result) => {
        console.log('tessaaaaaas')
        navigation.goBack()
        setLoading(true)
        // resetData()
      }).catch((e) => {
        console.log(e);

      })
    }

    else {
      alert('Lengkapi data terlebih dahulu')
    }

  }

  if (!loading && jarak != "") {
    return (

      <View style={{ flex: 1 }}>
        {/* <Text>{timeD}</Text> */}
        <ScrollView>
          <View style={{ alignItems: 'center' }}>

            <Text style={[{ marginVertical: windowHeight * 0.01 }, jarak == "1" ? { color: '#ff0000' } : '']}>
              anda berada di {jarak == "1" ? 'Diluar Jangkauan' : 'Dalam Jangkauan'}, {test}
            </Text>

            <Text style={[{ marginVertical: windowHeight * 0.05, fontSize: 24 }]}>
              Absen
            </Text>
            <View style={{ height: windowHeight * 0.3, width: windowWidht * 0.8, backgroundColor: '#FFFFFF' }}>

              <MapView style={{ flex: 1 }} //window pake Dimensions
                showsUserLocation={true}
                showsMyLocationButton={true}

                region={{
                  latitude: parseFloat(route.params.lat),
                  longitude: parseFloat(route.params.lng),
                  latitudeDelta: 0.00683,
                  longitudeDelta: 0.0035
                }} >
                <Circle
                  center={{
                    latitude: parseFloat(route.params.lat),
                    longitude: parseFloat(route.params.lng),

                  }}

                  radius={route.params.radius}
                  strokeWidth={1}
                  strokeColor='#ff0000'
                  fillColor='#ff000030'
                />


                <Marker

                  coordinate={{
                    latitude: parseFloat(route.params.lat),
                    longitude: parseFloat(route.params.lng),
                  }}

                >
                  <Callout>
                    <View>
                      <Text>Posisi Kantor</Text>
                    </View>
                  </Callout>
                </Marker>




              </MapView>
            </View>


            {/* <View style={styles.mapS}>

        </View> */}
            <Text>Map</Text>

          </View>
        </ScrollView>

        {jarak != 1 && timeD == 0 &&
          <TouchableOpacity style={[styles.btn]} onPress={() => { authCurrent() }}>
            <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' }}>
              Absen
            </Text>
          </TouchableOpacity>
        }

        {timeD != 0 &&
          <Text style={{ textAlign: 'center', color: '#d72503' }}>Tunggu {timeD} detik</Text>
        }

      </View>
    )
  }
  else {

    return (
      <View>
        <ScreenLoading />
      </View>
    )

  }

}

export default Check_Staff

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
    width: windowWidht * 0.70,
    height: windowHeight * 0.3233,
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
  }
})