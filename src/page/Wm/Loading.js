import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenLoading from '../loading/ScreenLoading'
import { useEffect } from 'react'

const Loading = ({navigation, route}) => {

useEffect(() =>{
  console.log(route.params.status)
  if( route.params.status != "close")
  {
    navigation.replace('ShowWM',{id : route.params.id, status : route.params.status })
  }
  else{
    navigation.replace('HistoryShowWM',{id : route.params.id, status : route.params.status })
    // navigation.replace('Done',{id : route.params.id, status : route.params.status })
  }
 

},[])

  return (
      <ScreenLoading/>
  )
}

export default Loading

const styles = StyleSheet.create({})