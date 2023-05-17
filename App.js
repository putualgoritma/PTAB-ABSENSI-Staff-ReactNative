// import { StyleSheet, Text,  ViewPropTypes, TouchableOpacity, View, TextInput } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import FingerprintScanner from 'react-native-fingerprint-scanner';
// import BiometricPopup from './BiometricPopup';
// import PropTypes from 'prop-types';

// const App = () => {

//   const [data, setData] = useState('0')
//   const authCurrent=()=> {
//     FingerprintScanner
//       .authenticate({ title: 'Verifikasi Bahwa Ini Benar Anda' })
//       .then(() => {
      
//         setData('3');
//         FingerprintScanner.release();
   
//       }).catch(error => {
       
//         setData('4');
//         FingerprintScanner.release();
//       });
    
//   }

//   useEffect(() => {
//     FingerprintScanner
//     .isSensorAvailable()
//     .then(biometryType => {})
//     .catch(error => {alert(error.message)});
//   });

//   return (
//     <View>
//       <Text>App</Text>
//       <Text>{data}</Text>
//       {/* <BiometricPopup/> */}

//       <TouchableOpacity onPress={()=>{authCurrent()}}>
//         <Text>JJJKKKKKK</Text>
//       </TouchableOpacity>

// <TextInput/>

//       <TouchableOpacity style={{ marginTop : 100 }} onPress={()=>{FingerprintScanner.release()}}>
//         <Text>JJJKKKKss</Text>
//       </TouchableOpacity>
//     </View>
  
//   )
// }

// App.propTypes = {
//   onAuthenticate: PropTypes.func.isRequired,
//   handlePopupDismissedLegacy: PropTypes.func,
//   style: ViewPropTypes.style,
// };

// export default App



// const styles = StyleSheet.create({})


import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Router from './src/router';
import { LogBox } from 'react-native';
import {store} from './src/redux'
import {Provider} from 'react-redux'


export default function App() {
    LogBox.ignoreLogs(['Setting a timer', 'Animated: `useNativeDriver`'])
    return(
      <Provider store = {store}>
        <NavigationContainer>
          <Router/>
        </NavigationContainer>
      </Provider>
    )
  
}


