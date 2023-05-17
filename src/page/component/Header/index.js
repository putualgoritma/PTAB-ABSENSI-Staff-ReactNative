import React from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image,
    Dimensions
  } from 'react-native';

  const header=(props)=>{
    return(
        <View style={styles.Container}>
            {/* <Image source={require('../../assets/img/header.png')} style={{width: Dimensions.get('window').width,height: Dimensions.get('window').height/100*19}}/> */}
            <Text style={styles.Text}>{props.text}</Text>
        </View>
    )
  }
const styles = StyleSheet.create({
    Container:{
        alignItems:'center'
    },
    Text:{
        fontSize:17, 
        color:'#FFFFFF', 
        position:'absolute', 
        fontWeight:'bold', 
        top:100, 
        left:30
    }
});
  export default header