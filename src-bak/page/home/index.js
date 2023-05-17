import { Dimensions, StyleSheet, Text, PermissionsAndroid, View, Image, TouchableOpacity, ScrollView,RefreshControl, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'


const Home = ({navigation}) => {
 return(
  <View>
    <TouchableOpacity onPress={()=>{navigation.navigate('Test1')}}>
    <Text color="black" size={10} style={{ textAlign: "center", width: 200, height: 80, position: 'relative'}}  >Take control of what your kids watch on the internet.{"\n"}{"\n"}
                  Discover kid-friendly channels for your kids.{"\n"}
                  Choose only the creators that make family- friendly videos.
</Text>
    </TouchableOpacity>
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
},
header : {
  height : windowHeight*0.35,
  elevation: 5,
  backgroundColor : '#FFFFFF',
  paddingBottom : windowHeight*0.02,

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