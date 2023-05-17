import { Alert, TextInput, ImageBackground, PermissionsAndroid, ScrollView, StyleSheet, View, Image, Text,Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react'
import MapView, { Callout, Marker } from 'react-native-maps';
import API from '../../service';
import Icon from 'react-native-vector-icons/Ionicons';
import Select2 from 'react-native-select-two';
import { Btn, Txt,TxtArea,Title } from '../../component';
import { useSelector } from 'react-redux';
import ScreenLoading from '../loading/ScreenLoading';
  
  const Map =()=> {
    const TOKEN = useSelector((state) => state.TokenReducer);
    const USER = useSelector((state) => state.UserReducer);
    const USER_ID = useSelector((state) => state.UserReducer.id);
    const { width, height } = Dimensions.get('window');
    const ASPECT_RATIO = width / height;
    const LATITUDE_DELTA = 0.4922;
    const [todos, setTodos] = useState([{'id' : 'Tunggak','name' : 'Tunggak'},{'id' : 'Segel','name' : 'Segel'},{'id' : 'Cabut','name' : 'Cabut'}])
    const [statusName, setStatusName] = useState('');
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState('');
    const [nextPage, setNextPage] = useState(0);
    const [previousPage, setPreviousPage] = useState(0);
    const [lastPage, setLastPage] = useState(0);
    const [totalPage, settotalPage] = useState('');
    const [search, setSearch] = useState("");
    const [searchStatus, setSearchStatus] = useState("");
    const [status, setStatus] = useState('');

    const dataMember = [{latitude : -8.739184, longitude: 115.171127}, {latitude : -8.459556, longitude: 115.046600}]
    
    const reset = () => {
      setSearchStatus("");
      setStatus('');
      setSearch('');
      setTodos([{'id' : 'notice','name' : 'Penyampaian Surat'},{'id' : 'lock','name' : 'Penyegelan'},{'id' : 'notice2','name' : 'Kunjungan'},{'id' : 'unplug','name' : 'Cabutan'}]);
      setLoading(true)
      API.maps(USER_ID+'?page=1'+'&search='+'',TOKEN).then((result) => {
          // setStaffs(result.data)
          console.log('staff',result)
          console.log('staff1',result.message)
          console.log('staff2',result.data.current_page)
          setData(result.data.data)
          setCurrentPage(result.data.current_page)
          setLastPage(result.data.last_page)
          settotalPage(result.data.total)
          setPreviousPage(result.data.current_page-1)
          setNextPage(result.data.current_page+1)
          setLoading(false)
      }).catch((e) => {
          console.log(e.request);
          setLoading(false)
      })
    }

    const AddPag = (val)=>{
      if(val === 0){
        if(currentPage > 1){
          console.log(previousPage)
          setLoading(true)
          API.maps(USER_ID+'?page='+previousPage+'&search='+search,TOKEN).then((result) => {
              // setStaffs(result.data)
              console.log('staff',result)
              console.log('staff1',result.message)
              console.log('staff2',result.data.current_page)
              setData(result.data.data)
              setCurrentPage(result.data.current_page)
              setLastPage(result.data.last_page)
              settotalPage(result.data.total)
              setPreviousPage(result.data.current_page-1)
              setNextPage(result.data.current_page+1)
              setLoading(false)
          }).catch((e) => {
              console.log(e.request);
              setLoading(false)
          })
        }
        else{
  
        }
      }
      else{
        if(currentPage < lastPage){
          console.log('test',nextPage)
          setLoading(true)
          API.maps(USER_ID+'?page='+nextPage+'&search='+search,TOKEN).then((result) => {
              // setStaffs(result.data)
              console.log('staff',result)
              console.log('staff1',result.message)
              console.log('staff2',result.data.current_page)
              setData(result.data.data)
              setCurrentPage(result.data.current_page)
              setLastPage(result.data.last_page)
              settotalPage(result.data.total)
              setPreviousPage(result.data.current_page-1)
              setNextPage(result.data.current_page+1)
              setLoading(false)
          }).catch((e) => {
              console.log(e.request);
              setLoading(false)
          })
        }
        else{
          // actionStaffListsAPi();
        }
      }
  
    }
    const actionStaffListsAPi = () => {
      setLoading(true)
      API.maps(USER_ID+'?page='+'1'+'&search='+search,TOKEN).then((result) => {
          // setStaffs(result.data)
          console.log('staff',result)
          console.log('staff1',result.message)
          console.log('staff2',result.data.current_page)
          setData(result.data.data)
          setCurrentPage(result.data.current_page)
          setLastPage(result.data.last_page)
          settotalPage(result.data.total)
          setPreviousPage(result.data.current_page-1)
          setNextPage(result.data.current_page+1)
          setLoading(false)
      }).catch((e) => {
          console.log(e.request);
          setLoading(false)
      })
  }
  
  const searchBy = () => {
    setSearchStatus('search')
    if(search == ""){
reset();
    }
    else{
    actionStaffListsAPi();
    }
  }
   
  const handleSearch = (value) => {
    if(value == "Cabut"){
      setStatus(4)
    }
     else if(value == "Segel"){
      setStatus(3)
     }
     else{
      setStatus(2)
     }
      setStatusName(value)
      console.log('1', value);
  }

    
  useEffect(() => {
    // if(isFocused){
    console.log('test')
    actionStaffListsAPi();
    //    }
}, [])
    return (
      <View style = {styles.container} >

<View style={{ flexDirection : "row", borderBottomWidth:1, paddingBottom:10 }}><Text style={styles.label1H}>Map</Text></View>

{/*         
<Txt title='Pilih Status:'/>

{loading &&
  <View style = {{borderColor: '#000000', borderWidth: 1, height:50,fontSize : 14,borderRadius:0, }}>
<Text style={{fontSize : 14, paddingTop: 10, paddingLeft : 10}}>{statusName}</Text>
</View>
}


                                    {!loading && todos && 
                                        <Select2
                                        
                                            searchPlaceHolderText='Cari Status'
                                            title='Status'
                                            
                                            isSelectSingle
                                            style={{  
                                                borderRadius: 0,
                                                borderColor: '#000000',
                                                borderWidth: 1,
                                                height:50
                                            }}
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
                                                handleSearch(data[0])
                                            }}
                                            onRemoveItem={data => {
                                                handleSearch(data[0])
                                            }} 
                                            selectButtonText ='Simpan'
                                            cancelButtonText='Batal'
                                      
                                        />
                                    }  */}
      <Text style={styles.label4}>No. SBG</Text>
      {loading &&
 <View style={styles.searchGroup}>
 <TextInput
  style={styles.search}
     placeholder="No. SBG"
     editable={false}
     value={search}
     onChangeText ={(value)=>  setSearch(value)}
 ></TextInput>

<View style={{ flexDirection :"row" }}>
<TouchableOpacity style={styles.button2} disabled={true}>
   <Text style={styles.label2white}>Reset</Text>
 </TouchableOpacity>
<TouchableOpacity style={styles.button2} disabled={true}>
   <Text style={styles.label2white}>Cari</Text>
 </TouchableOpacity>
</View>
</View>
      }
         {!loading &&
 <View style={styles.searchGroup}>
 <TextInput
  style={styles.search}
     placeholder="No. SBG"
     value={search}
     onChangeText ={(value)=>  setSearch(value)}
 ></TextInput>

<View style={{ flexDirection :"row" }}>
<TouchableOpacity style={styles.button2} onPress={()=> reset()}>
   <Text style={styles.label2white}>Reset</Text>
 </TouchableOpacity>
<TouchableOpacity style={styles.button2} onPress={()=> searchBy()}>
   <Text style={styles.label2white}>Cari</Text>
 </TouchableOpacity>
</View>
</View>
      }

{loading &&
 <View style = {{ height : 300 }}>
          <ScreenLoading/>
          </View>
        }
          {!loading && searchStatus == "search" &&
      <View style = {{ height : 300 }}>
     
      
     {data.map((item, key)=>{
          return <MapView key ={key} style ={{ flex : 1 }} //window pake Dimensions
      region={{
         latitude: item.lat ? item.lat : -8.459556,
         longitude: item.lng ? item.lng : 115.046600,
         latitudeDelta: 0.005,
         longitudeDelta: 0.005
      }} >
 <Marker

 coordinate={{
   latitude: item.lat ? item.lat : 0.000000,
   longitude: item.lng ? item.lng : 0.000000,
}}
 onPress={() => console.log(key)}
// draggable
>
  

 <Callout style={styles.plainView}>
   <View>
     <Text>{item.nomorrekening}-{item.namapelanggan}</Text>
   </View>
 </Callout>
</Marker>
     
   </MapView>
      }
        
      )

      }
   </View>
    }

          {!loading && searchStatus == "" &&
      <View style = {{ height : 300 }}>
     
      
    
      <MapView style ={{ flex : 1 }} //window pake Dimensions
     region={{
      latitude: -8.459556,
      longitude: 115.046600,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
   }} >
        {data.map((item, key)=>{
          return <Marker
key ={key}
 coordinate={{
   latitude: item.lat ? item.lat : 0.000000,
   longitude: item.lng ? item.lng : 0.000000,
}}
 onPress={() => console.log(key)}
// draggable
>
  

 <Callout style={styles.plainView}>
   <View>
     <Text>{item.nomorrekening}-{item.namapelanggan}</Text>
   </View>
 </Callout>
</Marker>
        }
        
        )

        }
   </MapView>
 
   </View>
    }


   {loading &&
  <View style ={styles.footer}> 
<View style={styles.paginate}>
<Text>{currentPage} of {lastPage} from {totalPage} data</Text>
<TouchableOpacity disabled={true}>
<Icon name='chevron-back-outline' size={20} color = {"rgb(255,0,0)"}/>
</TouchableOpacity>
<TouchableOpacity disabled={true}>
<Icon name='chevron-forward-outline' size={20} color = {"rgb(255,0,0)"}/>
</TouchableOpacity>
</View>
</View>
}
{!loading &&
  <View style ={styles.footer}> 
<View style={styles.paginate}>
<Text>{currentPage} of {lastPage} from {totalPage} data</Text>
<TouchableOpacity onPress={()=>AddPag(0)}>
<Icon name='chevron-back-outline' size={20} color = {"rgb(255,0,0)"}/>
</TouchableOpacity>
<TouchableOpacity onPress={()=>AddPag(1)}>
<Icon name='chevron-forward-outline' size={20} color = {"rgb(255,0,0)"}/>
</TouchableOpacity>
</View>
</View>
}
   </View>
    );
  }

export default Map

const windowWidht =Dimensions.get('window').width;
const windowHeight =Dimensions.get('window').height;

const styles = StyleSheet.create({
  container:
  {
    flex: 1,
    marginHorizontal : windowWidht*0.01,

  },
  label2white :{
    color:'#FFFFFF',
    fontSize: 20,
  },
  paginate : {
    flexDirection : "row",
marginLeft : "auto",
  },
  footer : {
    windowWidht : windowWidht*0.8,
    marginTop : windowHeight*0.01,
    padding : windowWidht*0.02,
    margin : "auto",
    borderWidth : 1,
    backgroundColor : "#FFFFFF",
    },
    button:{
      marginHorizontal : windowWidht*0.04,
      marginTop : windowHeight*0.01,
      width: windowWidht*0.9,
      borderRadius : 3,
      // borderWidth : 1,
      // borderColor : "red",
      height : windowHeight*0.05,
      backgroundColor:'#1DA0E0',
      alignItems : "center",
    },
    searchGroup:{
      alignItems : "center",
      marginBottom : windowHeight*0.01,
     },
     search:{
      width: windowWidht*0.95,
      borderRadius: 1,
      borderBottomWidth: 0.5,
      color:'#000000',
      borderColor: "rgba(0,0,0,0.5)",
      backgroundColor : "#FFFFFF",
      marginHorizontal: windowWidht*0.05,
      marginVertical : windowHeight*0.01
    },
    button2:{
      marginHorizontal : windowWidht*0.05,
      marginTop : windowHeight*0.01,
      width: windowWidht*0.4,
      borderRadius : 3,
      // borderWidth : 1,
      // borderColor : "red",
      height : windowHeight*0.05,
      backgroundColor:'#1DA0E0',
      alignItems : "center",
    },
    label1H :{
      width : windowWidht*0.8,
      fontSize: 20,
      color : "#000000",
      textAlign: "center",
      fontWeight : "bold"
    },
})