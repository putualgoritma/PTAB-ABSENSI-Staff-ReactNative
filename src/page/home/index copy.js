import { Dimensions, StyleSheet, Text, PermissionsAndroid, View, Image, TouchableOpacity, ScrollView,RefreshControl, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { MultyDevice } from '../../assets'
import Footer from '../../component/Footer'
import { useSelector } from 'react-redux'
import FingerprintScanner from 'react-native-fingerprint-scanner';
import API from '../../service'
import { SafeAreaView } from 'react-native-safe-area-context'
import DeviceInfo from 'react-native-device-info';
import { useIsFocused } from '@react-navigation/native'

const Home = ({navigation}) => {
  const TOKEN = useSelector((state) => state.TokenReducer);
  const USER = useSelector((state) => state.UserReducer);
const [data, setData] = useState({staff : [], messageM : "", messageCount : ""})
  const [message, setMessage] = useState();
  const [refreshing, setRefreshing] = React.useState(false);
  const isFocused = useIsFocused();


  const requestLocationPermission = async () => {
    let info = '';
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                'title': 'Location Permission',
                'message': 'MyMapApp needs access to your location'
            }
        )

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //   setEnableLocation(true)
        } else {
            //   setEnableLocation(false)
        }
    } catch (err) {
        info = 1
    }
}

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData()
    setRefreshing(false);
  }, []);

  DeviceInfo.getDeviceName().then((deviceName) => {
 console.log('nama hp', deviceName)
  });

  let model = DeviceInfo.getModel();
  console.log('nama hp', model)
  DeviceInfo.getFingerprint().then((fingerprint) => {
    console.log('nama hp', fingerprint)
  });

  const getData =()=>{
    API.menu(USER.staff_id).then((result) => {
      if(result){
        console.log('data2',result)
        setData(result)
        // setLoading(false)
      }
        else{
          alert(result.message);
      }
      });
  }

    useEffect(() => {
      if (isFocused) {
      FingerprintScanner
      .isSensorAvailable()
      .then(biometryType => {})
      .catch(error => {
        if(error.name == "PasscodeNotSet"){
          alert('Aktifkan Fingerprint anda, masuk ke setting/sandi&keamanan pilih sidik jari')
          // test
          alert(error.name)
        }
      });
      getData()

      

      requestLocationPermission()
    }

      // API.listRequest(USER.id).then((result) => {
      //   if(result){
      //     console.log('t',result.duty)
      //     console.log('w',result.duty.lenght)
      //     setMessage(result.duty)
      //   }
      //     else{
      //       alert(result.message);
      //   }
      //   });
    },[isFocused]);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
    <ScrollView
    // style={{ backgroundColor : 'blue'}}
    scrollEnabled={false}
        contentContainerStyle={styles.scrollView}
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
          {/* <Text>{data.staff.type}</Text> */}
          <View style={{ backgroundColor: '#16D5FF', width : windowWidht*1 }}>
      <View style={{ flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto', width: windowWidht * 0.85, marginBottom: windowHeight * 0.08, marginTop: windowHeight * 0.02 }}>
       <TouchableOpacity onPress={()=>navigation.navigate('User', {screen : 'User'})}>
       <Image style={styles.iconRadius}  source = {{uri : `https://simpletabadmin.ptab-vps.com` + `${String(data.staff.image).replace('public/', '')}`}} />
       </TouchableOpacity>
       
        <View style={{marginLeft : windowHeight*0.01  }} >
          <Text style={{ color : '#FFFFFF' }} >{USER.name}</Text>
          <Text style={{ color : '#FFFFFF' }} >{USER.phone}</Text>
        </View>
        <TouchableOpacity style={{ marginLeft: 'auto', marginTop: windowHeight * 0.01 }} onPress = {()=>{navigation.navigate('message', {lat : data.staff.lat, lng : data.staff.lng, radius : data.staff.radius})}}>

          <Icon name="bell" size={windowHeight * 0.04} color="#FFFFFF" solid />
          {data.messageCount != "" &&
 <View style={{justifyContent : 'center',marginTop: -40, backgroundColor: 'red', width: windowWidht * 0.05, height: windowWidht * 0.05, borderRadius: windowWidht * 0.05 / 2 }}>
 <Text style={{ color: '#FFFFFF', textAlign: 'center', fontSize : 10 }}>{data.messageCount}</Text>
</View>
          }
         

        </TouchableOpacity>
      </View>
      <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
        <View style={styles.floatingView} >
<Text style={{ color : '#000000' }} > 
{data.messageM.length < 22
                ? `${data.messageM}`
                : `${data.messageM.substring(0, 21)}...`}
</Text>
        </View>

        <Image style={{ height: windowHeight * 0.23, width: windowWidht }} source={MultyDevice} >

        </Image>

        <View style={{ flexDirection: "row", width: windowWidht * 0.8, marginLeft: 'auto', marginRight: 'auto', marginTop: windowHeight * 0.03 }} >
          <View style={{  marginRight: 'auto'  }} >
          <TouchableOpacity style={[styles.btnRadius, { backgroundColor: "#22820030" }]} onPress={()=>navigation.navigate('ListAbsence')}>
            <Icon name="fingerprint" size={windowHeight * 0.03} color="#228200" />
          </TouchableOpacity>
          <Text style={{ textAlign : 'center' }} >Absen</Text>
          </View>
          <View style={{  marginLeft: 'auto', marginRight: 'auto' }} >
          <TouchableOpacity style={[styles.btnRadius, { backgroundColor: "#82008530" }]} onPress={()=>navigation.navigate('Request')} >
            <Icon name="handshake" size={windowHeight * 0.03} color="#820085" />
          </TouchableOpacity>
          <Text style={{ textAlign : 'center' }} >Pengajuan</Text>
</View>
{console.log('sssssddd', data)}
<View style={{  marginLeft: 'auto', marginRight: 'auto' }} >
  {data.staff.type == "reguler" ?
   <TouchableOpacity style={[styles.btnRadius, { backgroundColor: "#22820030" }]} onPress={()=>{navigation.navigate('Schedule')}}>
   <Icon name="calendar" size={windowHeight * 0.03} color="#228200" />
 </TouchableOpacity>
 :
 <TouchableOpacity style={[styles.btnRadius, { backgroundColor: "#22820030" }]} onPress={()=>navigation.navigate('ScheduleShift')}>
 <Icon name="calendar" size={windowHeight * 0.03} color="#228200" />
</TouchableOpacity>
  }

          <Text style={{ textAlign : 'center' }} >Jadwal</Text>
</View>
<View style={{  marginLeft: 'auto' }} >
<TouchableOpacity style={[styles.btnRadius, { backgroundColor: "#8B000030" }]} onPress={()=>navigation.navigate('ListHistory')}>
            <Icon name="book" size={windowHeight * 0.03} color="#8B0000" />
          </TouchableOpacity>
          <Text style={{ textAlign : 'center' }} >Histori</Text>
</View>
          
          
       
          
         
        </View>
        {/* row 2 */}
        <View style={{ flexDirection: "row", width: windowWidht * 0.8, marginLeft: 'auto', marginRight: 'auto', marginTop: windowHeight * 0.03 }} >
          <View style={{  marginRight: 'auto'  }} >
         

              <TouchableOpacity style={[styles.btnRadius, { backgroundColor: "#82008530" }]} onPress={()=>navigation.navigate('Holiday')} >
            <Icon name="hiking" size={windowHeight * 0.03} color="#820085" />
          </TouchableOpacity>
          <Text style={{ textAlign : 'center' }} >Libur</Text>
          </View>
          <View style={{  marginLeft: 'auto', marginRight: 'auto', width: windowWidht * 0.15, height: windowWidht * 0.15 }} >
          {/* <TouchableOpacity style={[styles.btnRadius, { backgroundColor: "#82008530" }]} onPress={()=>navigation.navigate('Holiday')} >
            <Icon name="handshake" size={windowHeight * 0.03} color="#820085" />
          </TouchableOpacity> */}
          {/* <Text style={{ textAlign : 'center' }} >Hari Libur</Text> */}
</View>
<View style={{  marginLeft: 'auto', marginRight: 'auto' , width: windowWidht * 0.15, height: windowWidht * 0.15}} >
{/* <TouchableOpacity style={[styles.btnRadius, { backgroundColor: "#AB9A0030" }]} onPress={()=>navigation.navigate('ShiftStaff')} >
            <Icon name="people-carry" size={windowHeight * 0.03} color="#AB9A00" />
          </TouchableOpacity>
          <Text style={{ textAlign : 'center' }} >Shift</Text> */}
</View>
<View style={{  marginLeft: 'auto', width: windowWidht * 0.15, height: windowWidht * 0.15 }} >
{/* <TouchableOpacity style={[styles.btnRadius, { backgroundColor: "#8B000030" }]} onPress={()=>navigation.navigate('ListHistory')}>
            <Icon name="book" size={windowHeight * 0.03} color="#8B0000" />
          </TouchableOpacity>
          <Text style={{ textAlign : 'center' }} >Histori</Text> */}
</View>
          
          
       
          
         
        </View>
       
      </View>
        </View>
      
      </ScrollView>
      {/* <View style={{ flex : 1, backgroundColor : 'red', fontWeight : 'bold', paddingTop : 'auto', paddingnLeft : 'auto', paddingRight : windowWidht*0.02 }}>
      <Text >V-23.01.30</Text>
      </View> */}
       <Text style={{ marginTop : 'auto', marginLeft : 'auto', marginRight : windowWidht*0.02, backgroundColor : '#FFFFFF' }} >V-23.03.13</Text>
  
    </SafeAreaView>
      <Footer focus= 'Home' navigation={navigation} />
     </View>
      
  
   
  )
}

export default Home

const windowWidht = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  btnRadius: {
    backgroundColor: '#D9D9D9',
    width: windowWidht * 0.15,
    height: windowWidht * 0.15,
    borderRadius: windowWidht * 0.15 / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconRadius: {
    backgroundColor: '#FFFFFF',
    width: windowWidht * 0.11,
    height: windowWidht * 0.11,
    borderRadius: windowWidht * 0.11 / 2
  },
  floatingView : { 
    borderWidth : 2, 
    borderColor : '#00000020', 
    width: windowWidht * 0.675, 
    height: windowHeight * 0.1, 
    backgroundColor: "#FFFFFF", 
    marginLeft: 'auto', 
    marginRight: 'auto', 
    marginTop: -windowHeight * 0.04, 
    borderRadius: 10,
    alignItems : 'center',
    justifyContent : 'center'
}
})