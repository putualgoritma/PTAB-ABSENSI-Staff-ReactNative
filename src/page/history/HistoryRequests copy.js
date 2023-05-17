import { StyleSheet, Text, TouchableOpacity, View ,RefreshControl} from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Dimensions } from 'react-native'
import API from '../../service'
import { useEffect } from 'react'
import { useState } from 'react'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { launchCamera } from 'react-native-image-picker';
import ScreenLoading from '../loading/ScreenLoading';
import { useSelector } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'

const HistoryRequest = ({navigation}) => {
  const TOKEN = useSelector((state) => state.TokenReducer);
  const USER = useSelector((state) => state.UserReducer);
  const USER_ID = useSelector((state) => state.UserReducer.id);
const [loading,setLoading] = useState(true)
const [data, setData] = useState([])
const [date, setDate] = useState("0000-00-00");
const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
const [date2, setDate2] = useState("0000-00-00");
const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
const [refreshing, setRefreshing] = React.useState(false);

const onRefresh = React.useCallback(() => {
  setRefreshing(true);
  setTimeout(() => {
    setRefreshing(false);
  }, 2000);
}, []);

const showDatePicker = () => {
  setDatePickerVisibility(true);
};

const hideDatePicker = () => {
  setDatePickerVisibility(false);
};
const handleConfirm = (date) => {
  // setLoading(true);
  const dated = date.getFullYear() + "-" + ('0' + (date.getMonth()+1)).slice(-2) + "-" + ('0' + (date.getDate())).slice(-2);
  console.log('ssssssaa',dated)
  setDate(dated);
  hideDatePicker();

};

const showDatePicker2 = () => {
  setDatePickerVisibility2(true);
};

const hideDatePicker2 = () => {
  setDatePickerVisibility2(false);
};
const handleConfirm2 = (date) => {
  // setLoading(true);
  const dated = date.getFullYear() + "-" + ('0' + (date.getMonth()+1)).slice(-2) + "-" + ('0' + (date.getDate())).slice(-2);
  console.log('ssssssaa',dated)
  setDate2(dated);
  hideDatePicker2();

};

  useEffect(() => {
      getData();
}, []);

  const getData = () =>{
    setLoading(true)
    API.absenceHistoryRequests(USER_ID,date == "0000-00-00" ? "" : date, date2 == "0000-00-00" ? "" : date2).then((result) => {
      if(result){
        console.log(result.data)
        setData(result.data)
        setLoading(false)
      }
        else{
          alert(result.message);
      }
      });
  }
  const filterData = () =>{
getData();
  }

  const resetData = () =>{
    setLoading(true)
    setDate('0000-00-00')
    setDate2('0000-00-00')
    API.absenceHistory("", "").then((result) => {
      if(result){
        console.log(result.data)
        setData(result.data)
        setLoading(false)
      }
        else{
          alert(result.message);
      }
      });
      }

      if(!loading){
        return (
          <View style={{ flex : 1 }}>
             <SafeAreaView style={{ flex: 1}}>
            <View style={{ flexDirection : 'row' }}>
            <View style ={styles.left}>
              <Text style={styles.title}>Dari</Text>
            <TouchableOpacity style={styles.date} onPress={showDatePicker} ><Text style={styles.btnText}>{date}</Text></TouchableOpacity>
                            <DateTimePickerModal
                              isVisible={isDatePickerVisible}
                              mode="date"
                              onConfirm={handleConfirm}
                              onCancel={hideDatePicker}
                            />
              <TouchableOpacity style={[styles.btn, {backgroundColor : '#e6bc15'}]} onPress ={()=>{resetData()}}>
              <Text style={styles.btnText}>Reset</Text>
              </TouchableOpacity>
            </View>
            <View style ={styles.right}>
            <Text style={styles.title}>Sampai</Text>
      <TouchableOpacity style={styles.date} onPress={showDatePicker2} ><Text style={styles.btnText}>{date2}</Text></TouchableOpacity>
                            <DateTimePickerModal
                              isVisible={isDatePickerVisible2}
                              mode="date"
                              onConfirm={handleConfirm2}
                              onCancel={hideDatePicker2}
                            />
                                  <TouchableOpacity style={[styles.btn,{backgroundColor : '#24A0ED'}]} onPress={()=>{filterData()}}>
                                    <Text style={styles.btnText}>Filter</Text>
      
      </TouchableOpacity>
              </View>
            </View>
        
         <ScrollView
        contentContainerStyle={styles.scrollView}
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
      
      
        {data && data.map((value, key)=>{
          return <View style ={styles.data} key={key}>
        
      <Text style={[{fontSize : 16, fontWeight : 'bold', color : '#000000', marginVertical : windowHeight*0.01}]}>{value.category == "visit"? "Dinas(D)" : value.category == "duty"? "Dinas(L)" : value.category == "extra"? "Lembur" : value.category == "excuse"? "Permisi" : value.category == "leave"? "Cuti" : value.category == "geolocation_off"? "Absen Diluar" : value.category == "permission"? "Izin" :value.type == "sick"? "Sakit" : value.category == "3"? "Lain-lain" : "" }</Text>
        <View style ={{ flexDirection : 'row' }}>
      <Text style={styles.title}>Tanggal</Text>
        <Text style={styles.value}>: {value.start.substring(0, 10)}</Text>
        </View>
        <View style ={{ flexDirection : 'row' }}>
      <Text style={styles.title}>Berakhir</Text>
        <Text style={styles.value}>: {value.end.substring(0, 10)}</Text>
        </View>
        <View style ={{ flexDirection : 'row' }}>
      <Text style={styles.title}>Jam</Text>
        <Text style={styles.value}>: {value.time}</Text>
        </View>
      <View style ={{ flexDirection : 'row' }}>
      <Text style={styles.title}>Deskripsi</Text>
        <Text style={styles.value}>: {value.description}</Text>
        </View>

        <View style ={{ flexDirection : 'row' }}>
      <Text style={styles.title}>Status</Text>
        <Text style={styles.value}>: {value.status}</Text>
        </View>
      {value.type == "sick" ?
      <View>
      <TouchableOpacity style={{ backgroundColor : '#09aeae' }} onPress ={()=>navigation.navigate('FileApprove', {id : value.id})}>
      <Text style={{ color : '#FFFFFF', paddingHorizontal :8 }}>Tambah Bukti</Text>
      </TouchableOpacity>

<TouchableOpacity style={{ backgroundColor : '#09aeae' }} onPress ={()=>navigation.navigate('ListFile', {id : value.id, start : value.start.substring(0, 10), end : value.end.substring(0, 10), type : value.type})}>
<Text style={{ color : '#FFFFFF', paddingHorizontal :8 }}>Tambah Bukti</Text>
</TouchableOpacity>
      </View>
      :
<TouchableOpacity></TouchableOpacity>
      }
      
      {/* {value.type == "leave" ?
      <TouchableOpacity style={{ backgroundColor : '#e6bc15' }}>
      <Text style={{ color : '#FFFFFF', paddingHorizontal :8 }}>Selesai Cuti</Text>
      </TouchableOpacity>
      
      :
<TouchableOpacity></TouchableOpacity>
      } */}

      </View>
        })
      
        }
      
      </ScrollView>
    </SafeAreaView>
          </View>
        )
      }
      else{
        return(
          <View>
             <ScreenLoading/>
          </View>
        )
      }


}

export default HistoryRequest

const windowWidht =Dimensions.get('window').width;
const windowHeight =Dimensions.get('window').height;
const styles = StyleSheet.create({
left : {
width : windowWidht*0.5,
alignItems : 'center',
},
right : {
  width : windowWidht*0.5,
  alignItems : 'center',
},
date :
{
  width : windowWidht*0.4,
  height : windowHeight*0.04,
  backgroundColor : '#09aeae',
  marginVertical : windowHeight*0.01,
  alignItems : 'center',
  justifyContent : 'center',
},
btn : {
  width : windowWidht * 0.32,
  height : windowHeight*0.04,
  marginBottom : windowHeight*0.02,
  alignItems : 'center',
  justifyContent : 'center',
},
data : {
  width : windowWidht*0.84,
  paddingBottom : windowHeight*0.01,
  backgroundColor : '#FFFFFF',
  marginLeft : 'auto',
  marginRight : 'auto',
  marginVertical : windowHeight*0.01,
  alignItems : 'center',
  borderWidth :2,
  borderColor : '#00000020'
},
title : {
  width : windowWidht*0.3,
  color : '#000000',
  fontSize : 14,
  fontWeight : 'bold',
},
value : {
  width : windowWidht*0.5,
  color : '#000000',
},
 btnText : {
  color : '#FFFFFF',
  fontWeight : 'bold',
 }

})