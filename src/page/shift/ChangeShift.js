import {     StyleSheet,
    View,
    ScrollView,
    TextInput,
    Text,
    TouchableOpacity, 
    Dimensions} from 'react-native'
  import React from 'react'
  import { useState } from 'react';
  import Textarea from 'react-native-textarea';
  import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
  import DateTimePicker from '@react-native-community/datetimepicker';
  import DateTimePickerModal from "react-native-modal-datetime-picker";
  import API from '../../service';
  import { useEffect } from 'react';
  import ScreenLoading from '../loading/ScreenLoading';
  import Select2 from 'react-native-select-two';
import { useSelector } from 'react-redux';
  
  
  const ChangeShift = ({navigation,route}) => { 
  
    const TOKEN = useSelector((state) => state.TokenReducer);
    const USER = useSelector((state) => state.UserReducer);
    const USER_ID = useSelector((state) => state.UserReducer.id);
    const [date1, setDate1] = useState(new Date(1598051730000));
    const [date, setDate] = useState("0000-00-00");
    const [staffList, setStaffList] = useState([]);
    const [time, setTime] = useState("00:00");
    const [show, setShow] = useState(false);
    const [shift, setShift] = useState("");
    const [type, setType] =useState('start');
    const [memo, setMemo] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [mode, setMode] = useState('date');
    const [loading, setLoading] = useState(true)
    const [loadingList, setLoadingList] = useState(false)
    const [form, setForm] = useState({
      staff_id : USER_ID,
      description : '',
      date : '',
      id : '',
      shift_id : '',
      shift_change_id : route.params.id,
  })

  const [form1, setForm1] = useState({
    staff_id : USER_ID.toString(),
    description : '1',
    date : '1',
    id : '1',
    shift_id : '1',
    shift_change_id : '1',
})
  const [todos, setTodos] = useState([])
  
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
    getStaffList(dated,form.shift_id.toString())
    setForm({...form, date : dated})
    setDate(dated);
    hideDatePicker();
  
  };

  const getStaffList = (date,shift) =>{
    console.log(date,shift)
    setLoadingList(true)
    API.shift_staff(USER.id, date, shift).then((result) => {
      if(result){
        console.log(result.data)
        setStaffList(result.data)
        if(todos.length < 1){
          setTodos(result.data2)
        }
      
        setLoadingList(false)
      }
        else{
          alert(result.message);
      }
      });
  }
  
    // Api start
    const handleAction = () => {
      console.log('data',form)
      // setLoading(true)
      let dataUpload = []
      dataUpload =
      [
          {
              name: 'form',
              data: JSON.stringify(form)
          },
      ];

      console.log(dataUpload);
  
      
      console.log('data',JSON.stringify(form));
        if(form.description != null){
            API.shiftChangeStore({
              form : JSON.stringify(form)
          }).then((result) => {
                if(result.message != 'failed'){
                    console.log(result);
                    // navigation.goBack()
                    alert(result.message)
                    setLoading(false)
                    
  
                }else{
                    alert("Tanggal Pengjuan Minimal Sehari Sebelum")
                    setLoading(false)
                }
            });
        }else{
            alert('mohon lengkapi data')
            setLoading(false)
        }
    }
    // Api end
  
    const onChangeStart = (event, selectedDate) => {
      const currentDate = selectedDate || date1;
       setShow(Platform.OS === 'ios');
       let hours = currentDate.getHours();
       let minutes = currentDate.getMinutes();
       
       let time = `${hours}:${minutes}`
       setTime(time);
       setForm({...form, start : currentDate.getHours()+":"+currentDate.getMinutes()+":00"})
       console.log(time);
       setDate1(currentDate);
     };
     const showMode = (currentMode) => {
      setShow(true);
      setMode(currentMode);
    };
     const showTimepicker = () => {
      showMode('time');
    };
  
    useEffect(() => {
      // if(isFocused){
        getStaffList()
      console.log('test')
      setLoading(false)
      //    }
    }, [])
  
    if(!loading){
      return (
        <View style={{flex : 1}}>
          <ScrollView>
            <Text style={{ marginVertical : windowHeight*0.01, marginRight : 'auto', marginLeft : 'auto', fontWeight : 'bold', fontSize : 20, color : '#000000' }}>
              Tukar Shift
            </Text>
    
            <Text style={styles.title}>Tanggal</Text>
     <TouchableOpacity style={styles.input} onPress={showDatePicker} ><Text style={styles.text}>{date}</Text></TouchableOpacity>
                        <DateTimePickerModal
                          isVisible={isDatePickerVisible}
                          mode="date"
                          onConfirm={handleConfirm}
                          onCancel={hideDatePicker}
                        />

<Text style={styles.title}>Pilih Shift</Text>
   <Select2
                                        
                                        searchPlaceHolderText='Cari Status'
                                        title='Status'
                                        listEmptyTitle = "Data Kosong"
                                        isSelectSingle
                                        style={styles.input}
                                        buttonStyle={{ 
                                            backgroundColor:'#0C5CBF',
                                            height:45,
                                            borderRadius:0
                                        }}
                                        buttonTextStyle={{
                                            color:'#FFFFFF'                                        
                                        }}
                                        colorTheme={'#0C5CBF'}
                                        popupTitle='Pilih Status'
                                        data={todos}
                                        onSelect={data => {
                                           getStaffList(form.date,data)
                                            setForm({...form, shift_id : data.toString()})
                                            console.log(todos)
                                        }}
                                        onRemoveItem={data => {
                                          getStaffList(form.date,data)
                                           setForm({...form, shift_id : data.toString()})
                                        }} 
                                        selectButtonText ='Simpan'
                                        cancelButtonText='Batal'
                                  
                                    />
                     
                     <Text style={styles.title}>Pilih Staff</Text>
                     {loadingList &&
                      <View  style={styles.input}>
                      <Text>Tunggu....</Text>
                     </View>
                     }
                      {!loadingList &&                     
   <Select2
                                        
                                        searchPlaceHolderText='Cari Status'
                                        title='Status'
                                        
                                        isSelectSingle
                                        listEmptyTitle = "Data Kosong"
                                        style={styles.input}
                                        buttonStyle={{ 
                                            backgroundColor:'#0C5CBF',
                                            height:45,
                                            borderRadius:0
                                        }}
                                        buttonTextStyle={{
                                            color:'#FFFFFF'                                        
                                        }}
                                        colorTheme={'#0C5CBF'}
                                        popupTitle='Pilih Status'
                                        data={staffList}
                                        onSelect={data => {
                                            setForm({...form, id : data.toString()})
                                            console.log(staffList)
                                        }}
                                        onRemoveItem={data => {
                                            setForm({...form, id : data.toString()})
                                        }} 
                                        selectButtonText ='Simpan'
                                        cancelButtonText='Batal'
                                  
                                    />
                                      }

{show && (
                                <DateTimePicker
                                testID="dateTimePicker"
                                value={date1}
                                mode={mode}
                                is24Hour={true}
                                display="default"
                                onChange={type == 'end' ? onChangeEnd : onChangeStart}
                                />
                                )}
    
                              <Text style={styles.title}>Memo</Text>
                              <Textarea
       containerStyle={styles.textareaContainer}
       style={styles.textarea}
         placeholder="memo"
         editable={true}
         maxLength={255}
         value={form.description}
         onChangeText ={(value)=>  setForm({...form, description : value})}
     ></Textarea>
    

                              
    
   
    
    </ScrollView>
    
    
    <TouchableOpacity style={styles.btn} onPress={()=>{handleAction()}}>
        <Text style={{ color : '#FFFFFF', fontSize : 24, fontWeight : 'bold' }}>
          Absen
          </Text>
        </TouchableOpacity>
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
  
  export default ChangeShift
  
  const windowWidht =Dimensions.get('window').width;
  const windowHeight =Dimensions.get('window').height;
  
  const styles = StyleSheet.create({
    input : {
      width : windowWidht*0.7,
      height : windowHeight*0.043,
      borderWidth : 1,
      backgroundColor : '#FFFFFF',
      marginRight : 'auto',
      marginLeft : 'auto',
      marginVertical : windowHeight*0.01,
    },
     text :{
      fontSize : 14,
      paddingTop: 10,
      paddingLeft : 10
     },
     textareaContainer: {
      width : windowWidht*0.7,
      // height: 120,
      borderRadius:10,
      padding: 5,
      backgroundColor: '#FFFFFF',
      borderWidth:1,
      marginRight : 'auto',
      marginLeft : 'auto',
  },
  textarea: {
      textAlignVertical: 'top', 
      fontSize: 14,
      color: '#696969',
  },
  title: {
    marginLeft : windowWidht*0.02,
    fontWeight : 'bold',
    color : '#000000',
  },
  btn : {
    width : windowWidht*0.76,
     height : windowHeight*0.07,
   backgroundColor : '#00B2FF',
   marginLeft : 'auto',
   marginRight : 'auto',
   alignItems : 'center',
   justifyContent : 'center',
  }
  })