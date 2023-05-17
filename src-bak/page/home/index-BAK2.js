import { StyleSheet, Text,  ViewPropTypes, TouchableOpacity, View, TextInput, ScrollView, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import FingerprintScanner from 'react-native-fingerprint-scanner';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5'
import Footer from '../../component/Footer';
import API from '../../service';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import ScreenLoading from '../loading/ScreenLoading';

const Home = ({navigation, route}) => {

  const TOKEN = useSelector((state) => state.TokenReducer);
  const USER = useSelector((state) => state.UserReducer);
  const USER_ID = useSelector((state) => state.UserReducer.id);
  const isFocused = useIsFocused();
  const [month1, setMonth1] = useState(0)
  const [month2, setMonth2] = useState(0)
  const [month3, setMonth3] = useState(0)
  const [monthN1, setMonthN1] = useState(0)
  const [monthN2, setMonthN2] = useState(0)
  const [monthN3, setMonthN3] = useState(0)
  const [data, setData] = useState([])
  const [duty, setDuty] = useState({})
  const [extra, setExtra] = useState({})
  const [permit, setPermit] = useState({})
  const [isMounted ,setIsMounted] = useState(true)
  const [courseDetails, setCourseDetails] = useState()
  const [loading, setLoading] = useState(true)
  // const authCurrent=()=> {
  //   FingerprintScanner
  //     .authenticate({ title: 'Verifikasi Bahwa Ini Benar Anda' })
  //     .then(() => {
      
  //       navigation.navigate('Test1')
  //       FingerprintScanner.release();
   
  //     }).catch(error => {
      
  //       FingerprintScanner.release();
  //     });
    
  // }
  let num1 = 0;
  let num2 = 0;
  let num3 = 0;
//   useEffect(() => {
//     // if(!loading){
//     if (isMounted) {
// console.log('ddd')

//   const timer = setInterval(() => {
//     if(num1 < route.params.monthN1){
//     num1 = num1+1;
//     setMonth1(num1/100)
//     console.log(num1)
//   }
  
//   if(num2 < route.params.monthN2){
//     num2 = num2+1;
//     setMonth2(num2/100)
//     console.log(num2)
//   }
  
//   if(num3 < route.params.monthN3){
//     num3 = num3+1;
//     setMonth3(num3/100)
//     console.log(num3)
//   }
//   },10)
// // }



 

//   console.log(num1)

//   } 

// }, [setCourseDetails]);

//   useEffect(() => {
//     return () => {
//         setCourseDetails(null);
//         setIsMounted(false);
//     }
// }, []);


React.useEffect(() => {
    if(isFocused){
    FingerprintScanner
    .isSensorAvailable()
    .then(biometryType => {})
    .catch(error => {alert(error.message)});

    }

  },[isFocused]);

  return (
    <View style={{ flex : 1 }}>
      <View style = {styles.header}>
      <Text style = {{paddingLeft : windowWidht*0.052, backgroundColor : '#FFFFFF', marginVertical : windowHeight*0.02 }}>2023</Text>
      <View style={[{flexDirection:'row', height : windowHeight*0.28,}]} >

<View style={ styles.month1 }>
<View style = {[styles.chart,{width : windowWidht*0.22,height : windowHeight*0.28*month1, backgroundColor : '#24ff00'} ]}>
<Text style= { styles.textMonth }>
  {(month1*100).toFixed(1)}%
</Text>
</View>
<Text>Januari</Text>
</View>

<View style={ styles.month2 }>
<View style = {[styles.chart,{width : windowWidht*0.22,height : windowHeight*0.28*month2,} ]}>
<Text style= { styles.textMonth }>
  {(month2*100).toFixed(1)}%
</Text>
</View>
<Text>Februari</Text>
</View>

<View style={ styles.month3 }>
<View style = {[styles.chart,{width : windowWidht*0.22,height : windowHeight*0.28*month3, backgroundColor : '#FF7A00'} ]}>
<Text style= { styles.textMonth }>
{(month3*100).toFixed(1)}%
</Text>
</View>
<Text>Maret</Text>
</View>
</View>

      </View>
      <View style={styles.menu}>
<Text style={{ marginVertical : windowHeight*0.02 }}>

  {USER.name}
</Text>
{/* baris pertama */}
<View style={{ flexDirection : 'row' }}>
      <View style={styles.groupButtonL}>
<TouchableOpacity style={styles.btn} onPress={()=>{navigation.navigate('AbsenceLoading')}}>
<Icon name="fingerprint" size={windowHeight*0.08} color="#000000" />
</TouchableOpacity>
<Text style={styles.textButton}>Absen</Text>
</View>

<View style={styles.groupButtonM}>
<TouchableOpacity style={[styles.btn, route.params.duty != null ? {borderColor : '#ff0000', borderWidth:1} : route.params.extra != null  ? {borderColor : '#ff0000' , borderWidth:1} : route.params.permit != null  ? {borderColor : '#ff0000', borderWidth:1}  : {}]} onPress={()=>{navigation.navigate('LocationAbsence', {duty : route.params.duty, permit : route.params.permit, extra:route.params.extra})}}>
<Icon name="walking" size={windowHeight*0.08} color="#000000" />
</TouchableOpacity>
<Text style={styles.textButton}>Absen Lokasi</Text>
</View>

<View style={styles.groupButtonR}>
<TouchableOpacity style={styles.btn}  onPress={()=>{navigation.navigate('Request')}}>
<Icon name="handshake" size={windowHeight*0.08} color="#000000" />
</TouchableOpacity>
<Text style={styles.textButton}>Pengajuan</Text>
</View>
</View>

{/* baris kedua */}

<View style={{ flexDirection : 'row' }}>
<View style={styles.groupButtonL}>
<TouchableOpacity style={styles.btn}  onPress={()=>{navigation.navigate('History')}}>
<Icon name="book" size={windowHeight*0.08} color="#000000" />
</TouchableOpacity>
<Text style={styles.textButton}>Histori</Text>
</View>

<View style={styles.groupButtonM}>
<TouchableOpacity style={styles.btn} onPress={()=>{navigation.navigate('HistoryRequest')}}>
<Icon name="book-open" size={windowHeight*0.08} color="#000000" />
</TouchableOpacity>
<Text style={styles.textButton}>Histori P.</Text>
</View>

<View style={styles.groupButtonR}>
<TouchableOpacity style={styles.btn} onPress={()=>{navigation.navigate('ShiftStaff')}}>
<Icon name="people-carry" size={windowHeight*0.08} color="#000000" />
</TouchableOpacity>
<Text style={styles.textButton}>Tukar Shift</Text>
</View>
</View>

{/* baris ke 3 */}
<View style={{ flexDirection : 'row' }}>
<View style={styles.groupButtonL}>
<TouchableOpacity style={styles.btn} onPress={()=>{navigation.navigate('HistoryCShift')}}>
<Icon name="people-carry" size={windowHeight*0.08} color="#000000" />
</TouchableOpacity>
<Text style={styles.textButton}>Histori T.Shift</Text>
</View>

<View style={styles.groupButtonM}>
{/* <TouchableOpacity style={styles.btn}>
<Icon name="hiking" size={windowHeight*0.08} color="#000000" />
</TouchableOpacity>
<Text style={styles.textButton}>Lembur</Text> */}
</View>

<View style={styles.groupButtonR}>
{/* <TouchableOpacity style={styles.btn}>
<Icon name="people-carry" size={windowHeight*0.08} color="#000000" />
</TouchableOpacity>
<Text style={styles.textButton}>Tukar Shift</Text> */}
</View>

</View>

      </View>
<Footer focus= 'Home' navigation={navigation} />

    </View>
  
  )

}

// Home.propTypes = {
//   onAuthenticate: PropTypes.func.isRequired,
//   handlePopupDismissedLegacy: PropTypes.func,
//   style: ViewPropTypes.style,
// };

export default Home


const windowWidht =Dimensions.get('window').width;
const windowHeight =Dimensions.get('window').height;
const styles = StyleSheet.create({
btn : {
  // flexDirection : 'row',
  width : windowWidht*0.22,
  backgroundColor : '#FFFFFF',
  padding : windowWidht*0.012,
  paddingVertical : windowWidht*0.001,
  borderWidth : 1,
  borderColor : '#00000020',
alignItems : 'center',
  marginTop : windowHeight*0.01,
  borderRadius : 2,
},
groupButtonL : {
  width : windowWidht*0.22,
  marginRight : 'auto',
},
groupButtonM : {
  width : windowWidht*0.22,
marginRight : 'auto',
  marginLeft : 'auto',
},
groupButtonR : {
  width : windowWidht*0.22,
    marginLeft : 'auto',
  },
textButton :{
  fontSize : 10,
  marginTop : 'auto',
  marginBottom : 'auto',
  marginLeft : 'auto',
  marginRight : 'auto'
},
header : {
  height : windowHeight*0.35,
  elevation: 5,
  backgroundColor : '#FFFFFF',
  paddingBottom : windowHeight*0.02,

},
menu : {
  marginHorizontal : windowWidht*0.05,

},
month1 : {
alignItems : 'center',
  marginRight : 'auto',
  marginTop : 'auto',
  marginLeft : windowWidht*0.05,
},
month2 : {
  alignItems : 'center',
marginRight : 'auto',
  marginLeft : 'auto',
  marginTop : 'auto',
},
month3 : {
  alignItems : 'center',
    marginLeft : 'auto',
    marginTop : 'auto',
    marginRight : windowWidht*0.05,
  },
  chart : {
    backgroundColor :'#FFE600',
    width : windowWidht*0.22,
    height : windowHeight*0.28*0.5,
  },
  textMonth : {
    color : '#FFFFFF',
    marginBottom : 'auto',
    marginLeft : 'auto',
marginTop : 'auto',
marginRight : 'auto',
  }

})
