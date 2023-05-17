import { StyleSheet, Text,  ViewPropTypes, TouchableOpacity, View, TextInput, ScrollView, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import FingerprintScanner from 'react-native-fingerprint-scanner';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5'
import Footer from '../../component/Footer';

const Home = ({navigation}) => {

  const [data, setData] = useState('0')
  const [name, setName] = useState('')
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

  useEffect(() => {
    FingerprintScanner
    .isSensorAvailable()
    .then(biometryType => {})
    .catch(error => {alert(error.message)});
  });

  return (
    <View style={{ flex : 1 }}>
      <View style = {styles.header}>
      <Text style = {{paddingLeft : windowWidht*0.052, backgroundColor : '#FFFFFF', marginVertical : windowHeight*0.02 }}>2023</Text>
      <View style={[{flexDirection:'row'}]} >

<View style={ styles.month1 }>
<View style = {[styles.chart,{width : windowWidht*0.22,height : windowHeight*0.28*0.9, backgroundColor : '#24ff00'} ]}>
<Text style= { styles.textMonth }>
  90%
</Text>
</View>
<Text>Januari</Text>
</View>

<View style={ styles.month2 }>
<View style = {[styles.chart,{width : windowWidht*0.22,height : windowHeight*0.28*0.5,} ]}>
<Text style= { styles.textMonth }>
  70%
</Text>
</View>
<Text>Februari</Text>
</View>

<View style={ styles.month3 }>
<View style = {[styles.chart,{width : windowWidht*0.22,height : windowHeight*0.28*0.7, backgroundColor : '#FF7A00'} ]}>
<Text style= { styles.textMonth }>
  80%
</Text>
</View>
<Text>Maret</Text>
</View>
</View>

      </View>
      <View style={styles.menu}>
<Text style={{ marginVertical : windowHeight*0.02 }}>

  Nama User
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
<TouchableOpacity style={styles.btn} onPress={()=>{navigation.navigate('Leave')}}>
<Icon name="walking" size={windowHeight*0.08} color="#000000" />
</TouchableOpacity>
<Text style={styles.textButton}>Permisi</Text>
</View>

<View style={styles.groupButtonR}>
<TouchableOpacity style={styles.btn}>
<Icon name="toolbox" size={windowHeight*0.08} color="#000000" />
</TouchableOpacity>
<Text style={styles.textButton}>Dinas</Text>
</View>
</View>

{/* baris kedua */}

<View style={{ flexDirection : 'row' }}>
<View style={styles.groupButtonL}>
<TouchableOpacity style={styles.btn}>
<Icon name="tools" size={windowHeight*0.08} color="#000000" />
</TouchableOpacity>
<Text style={styles.textButton}>Lembur</Text>
</View>

<View style={styles.groupButtonM}>
<TouchableOpacity style={styles.btn}  onPress={()=>{navigation.navigate('Request')}}>
<Icon name="handshake" size={windowHeight*0.08} color="#000000" />
</TouchableOpacity>
<Text style={styles.textButton}>Pengajuan</Text>
</View>

<View style={styles.groupButtonR}>
<TouchableOpacity style={styles.btn}>
<Icon name="book" size={windowHeight*0.08} color="#000000" />
</TouchableOpacity>
<Text style={styles.textButton}>Histori</Text>
</View>
</View>

{/* baris ke 3 */}
<View style={{ flexDirection : 'row' }}>
<View style={styles.groupButtonL}>
<TouchableOpacity style={styles.btn}>
<Icon name="hospital-alt" size={windowHeight*0.08} color="#000000" />
</TouchableOpacity>
<Text style={styles.textButton}>Berhalangan</Text>
</View>

<View style={styles.groupButtonM}>
<TouchableOpacity style={styles.btn}>
<Icon name="hiking" size={windowHeight*0.08} color="#000000" />
</TouchableOpacity>
<Text style={styles.textButton}>Lembur</Text>
</View>

<View style={styles.groupButtonR}>
<TouchableOpacity style={styles.btn}>
<Icon name="people-carry" size={windowHeight*0.08} color="#000000" />
</TouchableOpacity>
<Text style={styles.textButton}>Tukar Lembur</Text>
</View>

</View>

      </View>
<Footer focus= 'Home' />

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

  marginRight : 'auto',
},
groupButtonM : {
marginRight : 'auto',
  marginLeft : 'auto',
},
groupButtonR : {
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
