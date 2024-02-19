import {
  Dimensions,
  StyleSheet,
  Text,
  PermissionsAndroid,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ImageBackground,
  Alert,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {MultyDevice} from '../../assets';
import Footer from '../../component/Footer';
import {useSelector} from 'react-redux';
import API from '../../service';
import {SafeAreaView} from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import {useIsFocused} from '@react-navigation/native';
import ScreenLoading from '../loading/ScreenLoading';
import myFunctions from '../../functions';
import SelectDropdown from 'react-native-select-dropdown';
import reactNativeAndroidLocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import JailMonkey from 'jail-monkey';

const Home = ({navigation}) => {
  const TOKEN = useSelector(state => state.TokenReducer);
  const USER = useSelector(state => state.UserReducer);
  const [data, setData] = useState({staff: [], messageM: '', messageCount: ''});
  const [message, setMessage] = useState();
  const [refreshing, setRefreshing] = React.useState(false);
  const isFocused = useIsFocused();
  const [data2, setData2] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('di home');
    if (Platform.OS === 'android') {
      reactNativeAndroidLocationServicesDialogBox
        .checkLocationServicesIsEnabled({
          message:
            "<h2 style='color: #0af13e'>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
          ok: 'YES',
          cancel: 'NO',
        })
        .then(function (success) {
          if (success) {
          }
        })
        .catch(error => {
          console.log(error.message);
          // alert('gps harus aktif');
          // setLoading(false);
        });
    }
    Promise.all([
      myFunctions.checkFingerprint(),
      myFunctions.permissionCamera(),
      myFunctions.permissionLocation(),
    ])
      .then(res => {
        console.log('promise all', res);
        getData();
        getChart();
        // setLoading(false);
      })
      .catch(e => {
        console.log('err promise all', e);
        // setLoading(false);
      });
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData();
    setRefreshing(false);
  }, []);

  DeviceInfo.getDeviceName().then(deviceName => {
    console.log('nama hp', deviceName);
  });

  let model = DeviceInfo.getModel();
  console.log('nama hp', model);
  DeviceInfo.getFingerprint().then(fingerprint => {
    console.log('nama hp', fingerprint);
  });

  const getData = () => {
    API.menu(USER.staff_id, TOKEN).then(result => {
      if (result) {
        console.log('data2', result);
        setData(result);
        if (result.versionNow == 'not') {
          Alert.alert(result.version);
        }
        setLoading(false);
      } else {
        Alert.alert(result.message);
      }
    });
  };

  const getChart = () => {
    API.chart(USER.staff_id, TOKEN).then(result => {
      if (result) {
        console.log('data2', result);
        setData2(result);
        // setLoading(false)
      } else {
        Alert.alert(result.message);
      }
    });
  };

  if (JailMonkey.isJailBroken()) {
    // Alternative behaviour for jail-broken/rooted devices.
    return (
      <View>
        <Text>Device Anda di root tolong kembalikan seperti semula</Text>
      </View>
    );
  } else if (!loading) {
    return (
      <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
          <ScrollView
            // style={{ backgroundColor : 'blue'}}
            scrollEnabled={true}
            contentContainerStyle={styles.scrollView}
            nestedScrollEnabled={true}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {/* <Text>{data.staff.type}</Text> */}
            <View style={{backgroundColor: '#16D5FF', width: windowWidht * 1}}>
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  width: windowWidht * 0.85,
                  marginBottom: windowHeight * 0.08,
                  marginTop: windowHeight * 0.02,
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('User', {screen: 'User'})}>
                  <Image
                    style={styles.iconRadius}
                    source={{
                      uri:
                        `https://simpletabadmin.ptab-vps.com` +
                        `${String(data.staff.image).replace('public/', '')}`,
                    }}
                  />
                </TouchableOpacity>

                <View style={{marginLeft: windowHeight * 0.01}}>
                  <Text style={{color: '#FFFFFF'}}>{USER.name}</Text>
                  <Text style={{color: '#FFFFFF'}}>{USER.phone}</Text>
                </View>
                <TouchableOpacity
                  style={{marginLeft: 'auto', marginTop: windowHeight * 0.01}}
                  onPress={() => {
                    navigation.navigate('message', {
                      lat: data.staff.lat,
                      lng: data.staff.lng,
                      radius: data.staff.radius,
                    });
                  }}>
                  <Icon
                    name="bell"
                    size={windowHeight * 0.04}
                    color="#FFFFFF"
                    solid
                  />
                  {data.messageCount != '' && (
                    <View
                      style={{
                        justifyContent: 'center',
                        marginTop: -40,
                        backgroundColor: 'red',
                        width: windowWidht * 0.05,
                        height: windowWidht * 0.05,
                        borderRadius: (windowWidht * 0.05) / 2,
                      }}>
                      <Text
                        style={{
                          color: '#FFFFFF',
                          textAlign: 'center',
                          fontSize: 10,
                        }}>
                        {data.messageCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              <View
                style={{
                  backgroundColor: '#FFFFFF',
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                }}>
                <View style={styles.floatingView}>
                  {/* <Text style={{color: '#000000'}}>
                    {data.messageM.length < 22
                      ? `${data.messageM}`
                      : `${data.messageM.substring(0, 21)}...`}
                  </Text> */}
                </View>

                <Image
                  style={{height: windowHeight * 0.23, width: windowWidht}}
                  source={MultyDevice}></Image>

                <View
                  style={{
                    flexDirection: 'row',
                    width: windowWidht * 0.8,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: windowHeight * 0.03,
                  }}>
                  <View style={{marginRight: 'auto'}}>
                    <TouchableOpacity
                      style={[styles.btnRadius, {backgroundColor: '#22820030'}]}
                      onPress={() =>
                        navigation.navigate('ListAbsence', {
                          type: data.staff.type,
                        })
                      }>
                      <Icon
                        name="fingerprint"
                        size={windowHeight * 0.03}
                        color="#228200"
                      />
                    </TouchableOpacity>
                    <Text style={{textAlign: 'center'}}>Absen</Text>
                  </View>
                  <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
                    <TouchableOpacity
                      style={[styles.btnRadius, {backgroundColor: '#82008530'}]}
                      onPress={() => navigation.navigate('Request')}>
                      <Icon
                        name="handshake"
                        size={windowHeight * 0.03}
                        color="#820085"
                      />
                    </TouchableOpacity>
                    <Text style={{textAlign: 'center'}}>Pengajuan</Text>
                  </View>
                  {console.log('sssssddd', data)}
                  <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
                    {data.staff.type == 'reguler' ? (
                      <TouchableOpacity
                        style={[
                          styles.btnRadius,
                          {backgroundColor: '#22820030'},
                        ]}
                        onPress={() => {
                          navigation.navigate('Schedule');
                        }}>
                        <Icon
                          name="calendar"
                          size={windowHeight * 0.03}
                          color="#228200"
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.btnRadius,
                          {backgroundColor: '#22820030'},
                        ]}
                        onPress={() => navigation.navigate('ScheduleShift')}>
                        <Icon
                          name="calendar"
                          size={windowHeight * 0.03}
                          color="#228200"
                        />
                      </TouchableOpacity>
                    )}

                    <Text style={{textAlign: 'center'}}>Jadwal</Text>
                  </View>
                  <View style={{marginLeft: 'auto'}}>
                    <TouchableOpacity
                      style={[styles.btnRadius, {backgroundColor: '#8B000030'}]}
                      onPress={() =>
                        navigation.navigate('ListHistory', {
                          type: data.staff.type,
                        })
                      }>
                      <Icon
                        name="book"
                        size={windowHeight * 0.03}
                        color="#8B0000"
                      />
                    </TouchableOpacity>
                    <Text style={{textAlign: 'center'}}>Histori</Text>
                  </View>
                </View>
                {/* row 2 */}
                <View
                  style={{
                    flexDirection: 'row',
                    width: windowWidht * 0.8,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: windowHeight * 0.03,
                  }}>
                  <View style={{marginRight: 'auto'}}>
                    <TouchableOpacity
                      style={[styles.btnRadius, {backgroundColor: '#82008530'}]}
                      onPress={() => navigation.navigate('Holiday')}>
                      <Icon
                        name="hiking"
                        size={windowHeight * 0.03}
                        color="#820085"
                      />
                    </TouchableOpacity>
                    <Text style={{textAlign: 'center'}}>Libur</Text>
                  </View>
                  <View
                    style={{
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      width: windowWidht * 0.15,
                      height: windowWidht * 0.15,
                    }}>
                    {/* <TouchableOpacity style={[styles.btnRadius, { backgroundColor: "#82008530" }]} onPress={()=>navigation.navigate('Holiday')} >
            <Icon name="handshake" size={windowHeight * 0.03} color="#820085" />
          </TouchableOpacity> */}
                    {/* <Text style={{ textAlign : 'center' }} >Hari Libur</Text> */}
                  </View>
                  <View
                    style={{
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      width: windowWidht * 0.15,
                      height: windowWidht * 0.15,
                    }}>
                    {/* <TouchableOpacity style={[styles.btnRadius, { backgroundColor: "#AB9A0030" }]} onPress={()=>navigation.navigate('ShiftStaff')} >
            <Icon name="people-carry" size={windowHeight * 0.03} color="#AB9A00" />
          </TouchableOpacity>
          <Text style={{ textAlign : 'center' }} >Shift</Text> */}
                  </View>
                  <View
                    style={{
                      marginLeft: 'auto',
                      width: windowWidht * 0.15,
                      height: windowWidht * 0.15,
                    }}>
                    {/* <TouchableOpacity style={[styles.btnRadius, { backgroundColor: "#8B000030" }]} onPress={()=>navigation.navigate('ListHistory')}>
            <Icon name="book" size={windowHeight * 0.03} color="#8B0000" />
          </TouchableOpacity>
          <Text style={{ textAlign : 'center' }} >Histori</Text> */}
                  </View>
                </View>
              </View>
            </View>

            {/* grapich */}

            <View style={[styles.header, {justifyContent: 'space-between'}]}>
              <Text
                style={{
                  paddingLeft: windowWidht * 0.052,
                  backgroundColor: '#FFFFFF',
                  marginVertical: windowHeight * 0.02,
                  // backgroundColor: 'red',
                }}>
                {data2.year}
              </Text>
              <View style={[{flexDirection: 'row'}]}>
                <View style={styles.month3}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Report', {
                        start: data2.start3,
                        end: data2.end3,
                        type: data.staff.type,
                      })
                    }
                    style={[
                      styles.chart,
                      {
                        width: windowWidht * 0.22,
                        height: data2.nMonth3
                          ? windowHeight * 0.28 * (data2.nMonth3 / 100)
                          : windowHeight * 0.28,
                        backgroundColor: data2.colorChart3
                          ? data2.colorChart3
                          : '#7a8793',
                      },
                    ]}>
                    <Text style={styles.textMonth}>
                      {data2.nMonth3 ? data2.nMonth3 + '' : ''}
                    </Text>
                  </TouchableOpacity>
                  <Text>{data2.monthName3}</Text>
                </View>

                <View style={styles.month2}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Report', {
                        start: data2.start2,
                        end: data2.end2,
                        type: data.staff.type,
                      })
                    }
                    style={[
                      styles.chart,
                      {
                        width: windowWidht * 0.22,
                        height: data2.nMonth2
                          ? windowHeight * 0.28 * (data2.nMonth2 / 100)
                          : windowHeight * 0.28,
                        backgroundColor: data2.colorChart2
                          ? data2.colorChart2
                          : '#7a8793',
                      },
                    ]}>
                    <Text style={styles.textMonth}>
                      {data2.nMonth2 ? data2.nMonth2 + '' : ''}
                    </Text>
                  </TouchableOpacity>
                  <Text>{data2.monthName2}</Text>
                </View>

                <View style={styles.month1}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Report', {
                        start: data2.start1,
                        end: data2.end1,
                        type: data.staff.type,
                      })
                    }
                    style={[
                      styles.chart,
                      {
                        width: windowWidht * 0.22,
                        height: data2.nMonth1
                          ? windowHeight * 0.28 * (data2.nMonth1 / 100)
                          : windowHeight * 0.28,
                        backgroundColor: data2.colorChart1
                          ? data2.colorChart1
                          : '#7a8793',
                      },
                    ]}>
                    <Text style={styles.textMonth}>
                      {data2.nMonth1 ? data2.nMonth1 + '%' : ''}
                    </Text>
                  </TouchableOpacity>
                  <Text>{data2.monthName1}</Text>
                </View>
              </View>
            </View>
            <View
              style={{flexDirection: 'row', marginTop: windowHeight * 0.02}}>
              <View
                style={{
                  width: windowWidht * 0.05,
                  height: windowWidht * 0.05,
                  marginLeft: windowWidht * 0.02,
                  backgroundColor: data2.colorBox1
                    ? data2.colorBox1
                    : '#7a8793',
                }}></View>
              <Text>Kurang</Text>

              <View
                style={{
                  width: windowWidht * 0.05,
                  height: windowWidht * 0.05,
                  marginLeft: windowWidht * 0.02,
                  backgroundColor: data2.colorBox2
                    ? data2.colorBox2
                    : '#7a8793',
                }}></View>
              <Text>Cukup</Text>

              <View
                style={{
                  width: windowWidht * 0.05,
                  height: windowWidht * 0.05,
                  marginLeft: windowWidht * 0.02,
                  backgroundColor: data2.colorBox3
                    ? data2.colorBox3
                    : '#7a8793',
                }}></View>
              <Text>baik</Text>

              <View
                style={{
                  width: windowWidht * 0.05,
                  height: windowWidht * 0.05,
                  marginLeft: windowWidht * 0.02,
                  backgroundColor: data2.colorBox4
                    ? data2.colorBox4
                    : '#7a8793',
                }}></View>
              <Text>sangat baik</Text>
            </View>
          </ScrollView>
          {/* <View style={{ flex : 1, backgroundColor : 'red', fontWeight : 'bold', paddingTop : 'auto', paddingnLeft : 'auto', paddingRight : windowWidht*0.02 }}>
      <Text >V-23.01.30</Text>
      </View> */}
          <Text
            style={{
              marginTop: 'auto',
              marginLeft: 'auto',
              marginRight: windowWidht * 0.02,
              backgroundColor: '#FFFFFF',
            }}>
            V-24.02.19
          </Text>
        </SafeAreaView>
        <Footer focus="Home" navigation={navigation} />
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

export default Home;

const windowWidht = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  btnRadius: {
    backgroundColor: '#D9D9D9',
    width: windowWidht * 0.15,
    height: windowWidht * 0.15,
    borderRadius: (windowWidht * 0.15) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRadius: {
    backgroundColor: '#FFFFFF',
    width: windowWidht * 0.11,
    height: windowWidht * 0.11,
    borderRadius: (windowWidht * 0.11) / 2,
  },
  floatingView: {
    // borderWidth: 2,
    // borderColor: '#00000020',
    width: windowWidht * 0.675,
    height: windowHeight * 0.1,
    // backgroundColor: '#FFFFFF',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: -windowHeight * 0.04,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    height: windowHeight * 0.35,
    elevation: 5,
    backgroundColor: '#FFFFFF',
    paddingBottom: windowHeight * 0.02,
  },
  month1: {
    alignItems: 'center',
    marginRight: 'auto',
    marginTop: 'auto',
    marginLeft: windowWidht * 0.05,
  },
  month2: {
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 'auto',
  },
  month3: {
    alignItems: 'center',
    marginLeft: 'auto',
    marginTop: 'auto',
    marginRight: windowWidht * 0.05,
  },
  chart: {
    backgroundColor: '#FFE600',
    width: windowWidht * 0.22,
    height: windowHeight * 0.28 * 0.5,
  },
  textMonth: {
    color: '#FFFFFF',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginTop: 'auto',
    marginRight: 'auto',
  },
});
