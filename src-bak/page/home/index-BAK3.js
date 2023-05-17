import { Dimensions, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView,RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { MultyDevice } from '../../assets'
import Footer from '../../component/Footer'
import { useSelector } from 'react-redux'
import FingerprintScanner from 'react-native-fingerprint-scanner';
import API from '../../service'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRef } from 'react'

const Home = ({navigation}) => {
  const y = useRef()
  const TOKEN = useSelector((state) => state.TokenReducer);
  const USER = useSelector((state) => state.UserReducer);

  const [message, setMessage] = useState();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    console.log('tesss')
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

    useEffect(() => {
      FingerprintScanner
      .isSensorAvailable()
      .then(biometryType => {})
      .catch(error => {alert(error.message)});

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
    });

  return (
    <View style={{ flex: 1, backgroundColor: '#16D5FF' }}>
    <SafeAreaView style={{ flex: 1, backgroundColor: '#16D5FF' }}>
    <View 
     onTouchStart={e=> y.current = e.nativeEvent.pageY}
     onTouchEnd={e => {
       // some threshold. add whatever suits you
       if (y.current - e.nativeEvent.pageY < 40) {
         onRefresh()
       }
     }}
    >
      <View style={{ flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto', width: windowWidht * 0.85, marginBottom: windowHeight * 0.08, marginTop: windowHeight * 0.02 }}>
        <Image style={styles.iconRadius}  source = {{uri : `https://simpletabadmin.ptab-vps.com` + `${String(USER.image).replace('public/', '')}`}} />
        <View style={{marginLeft : windowHeight*0.01  }} >
          <Text style={{ color : '#FFFFFF' }} >{USER.name}</Text>
          <Text style={{ color : '#FFFFFF' }} >{USER.phone}</Text>
        </View>
        <TouchableOpacity style={{ marginLeft: 'auto', marginTop: windowHeight * 0.01 }}>

          <Icon name="bell" size={windowHeight * 0.04} color="#FFFFFF" solid />
          
          <View style={{marginTop: -40, backgroundColor: 'red', width: windowWidht * 0.05, height: windowWidht * 0.05, borderRadius: windowWidht * 0.05 / 2 }}>
            <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>1</Text>
          </View>

        </TouchableOpacity>
      </View>
      <View style={{ backgroundColor: '#FFFFFF', flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
        <View style={styles.floatingView} >
<Text style={{ fontWeight : 'bold', color : '#000000' }} >V-23.01.30</Text>
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
<View style={{  marginLeft: 'auto', marginRight: 'auto' }} >
<TouchableOpacity style={[styles.btnRadius, { backgroundColor: "#AB9A0030" }]} onPress={()=>navigation.navigate('ShiftStaff')} >
            <Icon name="people-carry" size={windowHeight * 0.03} color="#AB9A00" />
          </TouchableOpacity>
          <Text style={{ textAlign : 'center' }} >Shift</Text>
</View>
<View style={{  marginLeft: 'auto' }} >
<TouchableOpacity style={[styles.btnRadius, { backgroundColor: "#8B000030" }]} onPress={()=>navigation.navigate('ListHistory')}>
            <Icon name="book" size={windowHeight * 0.03} color="#8B0000" />
          </TouchableOpacity>
          <Text style={{ textAlign : 'center' }} >Histori</Text>
</View>
          
       
          
         
        </View>
        <Text style={{ fontWeight : 'bold', marginTop : 'auto', marginLeft : 'auto', marginRight : windowWidht*0.02 }} >V-23.01.30</Text>
      </View>
      </View>
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