
import Icon from 'react-native-vector-icons/Ionicons';

import React, { useEffect, useState } from 'react';
import {ScrollView, StyleSheet, View,ImageBackground, Image, Text,Dimensions, Modal, Button,TouchableOpacity, TouchableHighlight } from 'react-native';
import API from '../../service';
import {HeaderView,DataView,Footer,Title, Spinner} from '../../component'
import { useSelector } from 'react-redux';
import ScreenLoading from '../loading/ScreenLoading';
import ImageViewer from 'react-native-image-zoom-viewer';


const HistoryShow = ({ navigation, route }) => {
    const id = route.params.id;
const lock_id = route.params.lock_id ? route.params.lock_id : '';
  const [imgOld, setImgOld] = useState([]);
  const [imgNew, setImgNew] = useState([]);
  const [imgDone, setImgDone] = useState([]);
  const [dataShow, setDataShow] = useState({'nomorrekening' : '', 'namapelanggan' : '', 'alamat' : '', 'idgol' : '',
  'nomorhp' : '', 'tglentry' : '', 'wmnomor' : '', 'wmukuran' : ''
  });
  const TOKEN = useSelector((state) => state.TokenReducer);
  const [date, setDate] = useState("0000-00-00");
  const [loading, setLoading] = useState(true)
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [status, setStatus] = useState('');
  const [showImageOld, setShowImageOld] = useState(false)
  const [imagesOld, setImagesOld] = useState('')
  const [showImageNew, setShowImageNew] = useState(false)
  const [imagesNew, setImagesNew] = useState('')
  const [showImageDone, setShowImageDone] = useState(false)
  const [imagesDone, setImagesDone] = useState('')
  // const [imagesOld2, setImagesOld2] = useState('')

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  
const ShowDetail = (id) => {
  console.log(id)
  setLoading(true)
  let d1 = [];
  let d2 = [];
  let d3 = [];
  API.HistoryShowWM(id,TOKEN).then((result) => {
      setDataShow(result.data)
      console.log('data',result.data)
      console.log('datasss',JSON.parse(result.data.old_image))

      setImgOld(JSON.parse(result.data.old_image))
    //   simpan foto
    result.data.old_image && result.data.old_image != "" && JSON.parse(result.data.old_image).map((item, index) => {
      d1.push({
        url: `https://simpletabadmin.ptab-vps.com` + `${String(item).replace('public/', '')}?time="${new Date()}`,
              })
          })
          console.log('gggs',d1)
          setImagesOld(d1);

          setImgNew(JSON.parse(result.data.new_image))
          //   simpan foto
          result.data.new_image && result.data.new_image != "" && JSON.parse(result.data.new_image).map((item, index) => {
            d2.push({
              url: `https://simpletabadmin.ptab-vps.com` + `${String(item).replace('public/', '')}?time="${new Date()}`,
                    })
                })
                console.log('gggs2',d2)
                setImagesNew(d2);

                      setImgDone(JSON.parse(result.data.image_done))
                      //   simpan foto
                      result.data.image_done && result.data.image_done != "" && JSON.parse(result.data.image_done).map((item, index) => {
                        d3.push({
                          url: `https://simpletabadmin.ptab-vps.com` + `${String(item).replace('public/', '')}?time="${new Date()}`,
                                })
                            })
                            console.log('gggs3',d3)
                            setImagesDone(d3);
      setLoading(false)
  }).catch((e) => {
      console.log(e.request);
      setLoading(false)
  })
}


  

useEffect(() => {
  // if(isFocused){
  console.log('test')
  // ShowDetail();
  // ShowDetail(6);
  ShowDetail(id)
  //    }
}, [])


  return (
    <View style={styles.container}> 
        {/* <View style ={{ marginLeft : 10 }}> */}
   
    <View style={styles.top}>
        <Text style={[styles.label4, {textAlign:"center"}]}>{new Date().getDate() + "-"+ parseInt(new Date().getMonth()+1) +"-"+new Date().getFullYear()}</Text>
        </View>
        <View style={styles.top}>
        <Text style={styles.label1}>PERUMDA TIRTA AMERTHA BUANA TABANAN</Text>
        </View>
        <View style={styles.top}>
        <Text style={{  fontSize: 16, color : "#000000", fontWeight : "bold" }}>Data Pelanggan</Text>
        </View>
        {loading &&
          <ScreenLoading/>
          }
            {!loading &&
      
        <ScrollView style={styles.formData}>
  <ImageBackground style={{ backgroundColor : '#FFFFFF', marginLeft : 'auto', marginRight : 'auto', width : windowWidht*0.95, paddingBottom : windowHeight*0.01 }}>
    <View style={styles.formGroup}>
    <View style={styles.formField}>
      <View style={styles.col21}>
      <Text style={[styles.label3,{fontWeight:"bold"}]}>No. SBG</Text>
      </View>
      <View style={styles.col22}>
      <Text style={styles.label3}>:    {dataShow.nomorrekening}</Text>
      </View>
    </View>
    
    </View>
  
    <View style={styles.formGroup}>
    <View style={styles.formField}>
      <View style={styles.col21}>
      <Text style={[styles.label3,{fontWeight:"bold"}]}>Nama</Text>
      </View>
      <View style={styles.col22}>
      <Text style={styles.label3}>:    {dataShow.namapelanggan}</Text>
      </View>
    </View>
    </View>
  
    <View style={styles.formGroup}>
    <View style={styles.formField}>
      <View style={styles.col21}>
      <Text style={[styles.label3,{fontWeight:"bold"}]}>Alamat</Text>
      </View>
      <View style={styles.col22}>
      <Text style={styles.label3}>:    {dataShow.alamat}</Text>
      </View>
    </View>
    </View>
  
    <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>Golongan</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    {dataShow.idgol}</Text>
    </View>
  </View>
  </View>

  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>No Telp</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    {dataShow.telp}</Text>
    </View>
  </View>
  </View>

  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>Status WM</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    {dataShow.status_wm}</Text>
    </View>
  </View>
  </View>

  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>Status</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    {dataShow.status}</Text>
    </View>
  </View>
  </View>

  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>Priority</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    {dataShow.priority === "3"? "Hight" :dataShow.priority === "2"? "Medium" : "Low" }</Text>
    </View>
  </View>
  </View>   

  <View style={{ marginTop : windowHeight*0.02 }}>
    <Text style={[styles.label3,{fontWeight:"bold", fontSize : 18}]}>Water Meter Lama</Text>
    </View>

    <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>No</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    {dataShow.noWM1}</Text>
    </View>
  </View>
  </View> 
  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>Merk</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    {dataShow.brandWM1}</Text>
    </View>
  </View>
  </View> 
  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>Stand</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    {dataShow.standWM1}</Text>
    </View>
  </View>
  </View> 

  <View style={{ marginTop : windowHeight*0.02 }}>
    <Text style={[styles.label3,{fontWeight:"bold", fontSize : 18}]}>Water Meter Baru</Text>
    </View>

    <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>No</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    {dataShow.noWM2}</Text>
    </View>
  </View>
  </View> 
  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>Merk</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    {dataShow.brandWM2}</Text>
    </View>
  </View>
  </View> 
  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>Stand</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    {dataShow.standWM2}</Text>
    </View>
  </View>
  </View> 

    <DataView title='Bukti Foto Pra Kerja'/>
             <Modal visible={showImageOld} transparent={true} enablePreload={true}
                 onRequestClose={() => setShowImageOld(false)}
                 onDoubleClick={() => setShowImageOld(true)}
             >
                 <ImageViewer imageUrls={imagesOld}/>
             </Modal>
             <TouchableHighlight onPress ={() =>{ setShowImageOld(true);console.log('tess',imagesOld);}}>
             <ScrollView style={{flexDirection:'row',}}horizontal={true}>
             {/* {loadingImage && <Text style={{textAlign : 'center', fontSize : 17}}>Image Is Loading...</Text>} */}
             <ImageBackground source={require('../../assets/img/ImageLoading.gif') } style={{ height : 220, width : 280}} >
             {
                   imgOld.map((item, index) => {
                     return (
                         <Image 
                             key={index} 
                             style={{height : 220, width : 280, marginVertical : 10}} 
                             source = {{uri : `https://simpletabadmin.ptab-vps.com` + `${String(item).replace('public/', '')}`}}
                             // onLoadEnd={() => setLoadingImage(false)}
                             // onLoadStart={() => setLoadingImage(true)}
                             />
                     )
                 })
             }
             </ImageBackground>
            

            
             </ScrollView> 
             </TouchableHighlight> 


             <DataView title='Bukti Foto Alat'/>
             <Modal visible={showImageNew} transparent={true} enablePreload={true}
                 onRequestClose={() => setShowImageNew(false)}
                 onDoubleClick={() => setShowImageNew(true)}
             >
                 <ImageViewer imageUrls={imagesNew}/>
             </Modal>
             <TouchableHighlight onPress ={() =>{ setShowImageNew(true);console.log('tess',imagesNew);}}>
             <ScrollView style={{flexDirection:'row',}}horizontal={true}>
             {/* {loadingImage && <Text style={{textAlign : 'center', fontSize : 17}}>Image Is Loading...</Text>} */}
             <ImageBackground source={require('../../assets/img/ImageLoading.gif') } style={{ height : 220, width : 280}} >
             {
                   imgNew.map((item, index) => {
                     return (
                         <Image 
                             key={index} 
                             style={{height : 220, width : 280, marginVertical : 10}} 
                             source = {{uri : `https://simpletabadmin.ptab-vps.com` + `${String(item).replace('public/', '')}`}}
                             // onLoadEnd={() => setLoadingImage(false)}
                             // onLoadStart={() => setLoadingImage(true)}
                             />
                     )
                 })
             }
             </ImageBackground>
            

            
             </ScrollView> 
             </TouchableHighlight> 


             <DataView title='Bukti Foto Selesai'/>
             <Modal visible={showImageDone} transparent={true} enablePreload={true}
                 onRequestClose={() => setShowImageDone(false)}
                 onDoubleClick={() => setShowImageDone(true)}
             >
                 <ImageViewer imageUrls={imagesDone}/>
             </Modal>
             <TouchableHighlight onPress ={() =>{ setShowImageDone(true);console.log('tess',imagesOld);}}>
             <ScrollView style={{flexDirection:'row',}}horizontal={true}>
             {/* {loadingImage && <Text style={{textAlign : 'center', fontSize : 17}}>Image Is Loading...</Text>} */}
             <ImageBackground source={require('../../assets/img/ImageLoading.gif') } style={{ height : 220, width : 280}} >
             {
                   imgDone.map((item, index) => {
                     return (
                         <Image 
                             key={index} 
                             style={{height : 220, width : 280, marginVertical : 10}} 
                             source = {{uri : `https://simpletabadmin.ptab-vps.com` + `${String(item).replace('public/', '')}`}}
                             // onLoadEnd={() => setLoadingImage(false)}
                             // onLoadStart={() => setLoadingImage(true)}
                             />
                     )
                 })
             }
             </ImageBackground>
            

            
             </ScrollView> 
             </TouchableHighlight> 
             

             </ImageBackground>
        </ScrollView>
     
       
  }
   </View>
        // </View>
 
  )
}

export default HistoryShow


const windowWidht =Dimensions.get('window').width;
const windowHeight =Dimensions.get('window').height;

const styles = StyleSheet.create({

  footer : {
    windowWidht : windowWidht*0.8,
    marginTop : windowHeight*0.01,
    padding : windowWidht*0.02,
    margin : "auto",
    borderWidth : 1,
    backgroundColor : "#FFFFFF",
    },
      paginate : {
        flexDirection : "row",
    marginLeft : "auto",
      },
  container:
  {
    flex: 1,
    paddingTop : windowHeight*0.02,
    paddingHorizontal : windowWidht*0.02,

  },
  date: {
    width : windowWidht*0.9,
    height : windowHeight*0.03,
    borderWidth : 1,
    marginHorizontal : windowWidht*0.04,
color : "#000000",
backgroundColor : "#FFFFFF",
  },
  formField:{
flexDirection : "row",
paddingVertical : windowHeight*0.015,
  },
  data : {
    marginTop : windowHeight*0.02,
    width: windowWidht*1,
    height : windowHeight*0.44,
    backgroundColor : '#FFFFFF',
  },
  dataCollom : {
    flexDirection : "row",
    marginTop : windowHeight*0.05,
    width: windowWidht*0.9,
    marginHorizontal : windowWidht*0.025,
    backgroundColor : '#FFFFFF',
  },
  top : {
    marginTop : windowHeight*0.01,
    marginBottom : windowHeight*0.02,
  },

  formData : {
   
 
    // marginLeft : 'auto',
    // marginRight : 'auto',
    // height : windowHeight*0.65,
    backgroundColor : '#FFFFFF',
  },
  data1 : {
    flexDirection : "row",
   marginHorizontal : windowWidht*0.01,
    width :windowWidht*1,
    // paddingBottom : windowHeight*0.03,
borderBottomWidth : 1,
  },
  formGroup : {
    width :windowWidht*0.8,
  },
  col1 : {
    width :windowWidht*0.68,
  },
  col2 : {
    marginVertical : windowHeight*0.05,
    width :windowWidht*0.3,
  },
  col3 : {
    width :windowWidht*0.3,
  },
  col4 : {
    width :windowWidht*0.3,
  },

  col21 : {
    width :windowWidht*0.3,
  },
  col22 : {
    width :windowWidht*0.64,
  },
  content : {
    paddingTop : windowHeight*0.02,
    paddingHorizontal : windowWidht*0.02,
  },
  loadingImg :{ 
    alignItems : "center", 
    paddingTop:  windowHeight*0.04,
},
loading :{ 
  alignItems : "center", 
},
historyDay :{
  backgroundColor : "#FFFFFF",
height:  windowHeight*0.18,
width:  windowWidht*0.9,
borderWidth: 1,
borderColor: "rgba(0,0,0,0.5)",
},
  floatingScreen :{
    marginTop : windowHeight*0.02,
    width : windowWidht *0.9,
    height:  windowWidht*0.12,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor : "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.5)",

  },
  labelTitle :{
    fontSize: 30,
    color : "#FFFFFF",
    marginBottom : windowHeight*0.03,
    textAlign: "center",
    fontWeight : "bold"
  },
  label1 :{
    fontSize: 14,
    color : "#000000",
    textAlign: "center",
    fontWeight : "bold"
  },

  label1H :{
    width : windowWidht*0.8,
    fontSize: 20,
    color : "#000000",
    textAlign: "center",
    fontWeight : "bold"
  },
  label2 :{
    fontSize: 20,
  },
  label2white :{
    color:'#FFFFFF',
    fontSize: 20,
  },
  label2whitecenter :{
    textAlign : "center",
    color:'#FFFFFF',
    fontSize: 20,
  },
  label3 :{
    color:"#000000",
    fontSize: 16,

  },
  label4 :{
    color:"#000000",
    fontSize: 12,

  },
  label3white :{
    color:'#FFFFFF',
    fontSize: 16,
  },
  label2blue :{
    fontSize: 20,
    color:'rgba(0,0,255,1)',
  },
  center : {
    // marginTop: windowHeight*0.1,
    alignItems: 'center',
  },
  header:{
    alignItems: 'center',
  },

  iconGroup:{
    flexDirection: 'row',
  },

  square:{
    alignItems : "center",
    height:  windowWidht*0.22,
    width: windowWidht*0.22,
    marginTop : windowWidht*0.05,
    marginHorizontal : windowWidht*0.1,
    backgroundColor : "rgba(0,191,255,0.1)",
    borderRadius : 2,
    borderWidth: 0.5,
    borderColor : "rgba(0,191,255,0.01)",

  },

  iconBack:{
    alignItems : "center",
    height:  windowWidht*0.6,
    width: windowWidht*0.8,
    marginVertical : windowWidht*0.1,
    marginHorizontal : windowWidht*0.1,
    backgroundColor : "#FFFFFF",

  },
  imageSend:{
    marginVertical : windowHeight*0.01,
    marginHorizontal : windowWidht*0.022,
    width: windowWidht*0.4,
    height:  windowWidht*0.2,
    borderWidth: 5,
    borderColor: "red",

  },

  icon:{
    marginVertical : windowHeight*0.01,
    width: windowWidht*0.78,
    height:  windowWidht*0.58,
    borderWidth: 5,
    borderColor: "red",

  },
  images :{
    width: windowHeight*0.42,
    height:  windowHeight*0.56,
    marginHorizontal : windowHeight*0.02,
    marginTop:windowHeight*0.01,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "red",
  
  },
  imagesLoading :{
    width: windowHeight*0.12,
    height:  windowHeight*0.12,
    marginRight:10,
    // borderRadius : 150/2,
    marginTop:windowHeight*0.01,
    overflow: "hidden",
    // borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
  
  },
 

  centerModal : {
    marginTop: windowHeight*0.19,

    alignItems: 'center',
  },
  marginH : {
    marginHorizontal : windowWidht*0.04,
    marginTop : windowHeight*0.02,
  },
  leftButton : {
    width:  windowWidht*0.9,
  },
  marginTop : {
    marginTop : windowHeight*0.05,
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
  searchGroup:{
   alignItems : "center",
  },
  button:{
    marginHorizontal : windowWidht*0.05,
    marginTop : windowHeight*0.01,
    width: windowWidht*0.87,
    borderRadius : 3,
    // borderWidth : 1,
    // borderColor : "red",
    height : windowHeight*0.05,
    backgroundColor:'#1DA0E0',
    alignItems : "center",
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
  }
})