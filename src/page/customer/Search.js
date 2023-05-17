import {ImageHeader,Images} from '../../assets'
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

import { faCamera, faVideo, faPlusCircle, faPlus, faTrash, faUndo, faFileImage, faImage, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Geolocation from 'react-native-geolocation-service';
import React, { useEffect, useState } from 'react';
import { Alert, ImageBackground, PermissionsAndroid, ScrollView, StyleSheet, View, Image, Text,Dimensions, TouchableOpacity } from 'react-native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import DropDownPicker from 'react-native-dropdown-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Select2 from 'react-native-select-two';
import { useSelector } from 'react-redux';
import { Btn, Footer, HeaderInput, Inpt, SelectCustomer, Spinner, Title, Txt, TxtArea, } from '../../component';
import Button from '../../component/Button';
import VideoPlayer from '../../component/Video';
import API from '../../service';
import { colors, Distance } from '../../utils';
import RNFetchBlob from 'rn-fetch-blob';
import { useIsFocused } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';

const ButtonImage = (props) => {
  const [qty, setQty] = useState(1)
  const [show, setShow] = useState(true)
  var myloop = [];
  for (let index = 0; index < qty; index++) {
      myloop.push(
          <View key={index} >
              <View style={{ marginVertical: 10, height: 200, alignItems: 'center' }}>
                  <Image
                      style={{ width: '98%', height: 200 }}
                      source={props.dataImage[index] == null ? require('../../assets/img/ImageFoto.png') : { uri: props.dataImage[index].uri }}
                  />
              </View>
              <View style={{ alignItems: 'center' }}>
                  <Button
                      // onPress={() => {props.Image(); props.dataImage ? setShow(false) : null}}
                      onPress={() => {
                          Alert.alert(
                              'Bukti Foto',
                              `Galery atau Camera? `,
                              [
                                  {
                                      text: 'Galery',
                                      onPress: () => props.ImageGalery()
                                  },
                                  {
                                      text: 'Camera',
                                      onPress: () => props.Image()
                                  }
                              ]
                          );
                          props.dataImage ? setShow(false) : null

                      }}
                      title="Ambil Foto"
                      width="80%"
                      backgroundColor='#1DA0E0'
                      icon={<FontAwesomeIcon icon={faCamera} color='#ffffff' />}
                  />
              </View>
              <Distance distanceV={5} />
              {/* {props.dataImage[index]==null &&
                  <View style={{alignItems : 'center'}}>
                      <Button
                          onPress={() => {props.Image(); props.dataImage ? setShow(false) : null}}
                          title="Ambil Foto"
                          width="80%"
                          backgroundColor='#1DA0E0'
                          icon = {<FontAwesomeIcon icon={faCamera} color='#ffffff'/>}
                      />
                  </View>
              } */}
          </View>
      )
  }

  return (

      <View >

          {myloop}
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '80%', marginVertical: 10 }}>
              {(props.dataImage[qty - 1] != null) &&
                  <TouchableOpacity style={{ flexDirection: 'row', height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.success, paddingHorizontal: 10, borderRadius: 5 }} onPress={() => { setQty(qty + 1); setShow(true) }}>
                      <FontAwesomeIcon icon={faPlusCircle} size={20} color={'#FFFFFF'} />
                      <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 15, marginLeft: 3 }}>Tambah</Text>
                  </TouchableOpacity>
              }
              <View style={{ marginHorizontal: 3 }} />
              <TouchableOpacity style={{ backgroundColor: colors.delete, flexDirection: 'row', paddingHorizontal: 10, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={() => { qty > 1 ? setQty(qty - 1) : alert('data tidak boleh dihapus'); props.deleteImage() }}>
                  <FontAwesomeIcon icon={faTrash} size={17} color={'#FFFFFF'} />
                  <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 15, marginLeft: 3 }}>Delete </Text>
              </TouchableOpacity>
              <View style={{ marginHorizontal: 3 }} />
              <TouchableOpacity style={{ backgroundColor: colors.detail, flexDirection: 'row', paddingHorizontal: 10, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={() => { setQty(1); props.resetImage() }}>
                  <FontAwesomeIcon icon={faUndo} size={17} color={'#FFFFFF'} />
                  <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Reset</Text>
              </TouchableOpacity>
          </View>
      </View>
  )
}



const Search = ({ navigation, route }) => {
  const [search, setSearch] = useState("");
  const [page,setPage] = useState("1");
  const [img, setImg] = useState(null);
  const [amount, setAmount] = useState(0);
  const [data, setData] = useState([{code :"45582", name : "I MADE SUARTA", adress :"PERUM PERDANA LESTARI 1", register:"2020-05-02", date : [{d : "05-2020", v:"200000"},{d : "05-2022", v:"300000"}]}, {code :"45582", name : "I MADE SUARTA", adress :"PERUM PERDANA LESTARI 2", register:"2020-05-02", date : [{d : "05-2020", v:"200000"},{d : "05-2022", v:"100000"},{d : "05-2022", v:"100000"}]}]);

  const imageBg = require('../../assets/img/BackgroundInput.png')
  DropDownPicker.setListMode("SCROLLVIEW");
  const TOKEN = useSelector((state) => state.TokenReducer);
  const [checked, setChecked] = useState('customer');
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState(null)
  const [customers, setCustomers] = useState(null)
  const [selectVisibleCustomer, setSelectVisibleCustomer] = useState(false)
  var defaultLoc = {};
  const USER = useSelector((state) => state.UserReducer);
  const formParams = route.params ? route.params.ticket : ''
  const [statusGps, setStatusGps] = useState('disabled')
  const [customer_id, setCustomer_id] = useState(formParams.customer_id ? formParams.customer_id : '')
  const [defcustomer_id, setDefcustomer_id] = useState('')
  // form
  const [form, setForm] = useState({
      title: formParams.title ? formParams.title : '',
      category_id: formParams.category_id ? formParams.category_id : '',
      description: formParams.description ? formParams.description : '',
      lat: formParams.lat ? formParams.lat : '',
      lng: formParams.lng ? formParams.lng : '',
      customer_id: formParams.customer_id ? formParams.customer_id : '',
      dapertement_id: USER.dapertement_id,
  })

  const [image, setImage] = useState({
      name: null,
      filename: null,
      data: null
  })
  const [video, setVideo] = useState(null)
  const [response, setResponse] = useState(null)
  const [responses, setResponses] = useState([]);
  const isFocused = useIsFocused()

  const handleChecked = (key, value, cust) => {
      setChecked(cust)
      handleForm(key, value)
  }

  useEffect(() => {
      // if(isFocused){
      setLoading(true)
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
          message: "<h2 style='color: #0af13e'>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
          ok: "YES",
          cancel: "NO",
      }).then(function (success) {
          setStatusGps(success.status)
          Promise.all([API.categories(TOKEN), API.defcustomer(TOKEN), requestLocationPermission()]).then((res) => {
              console.log('corrrrrr', res);
              setCategories(res[0].data)
              setDefcustomer_id(res[1].data)
              Geolocation.getCurrentPosition(
                  (position) => {
                      // console.log('posisi',position);
                      defaultLoc = {
                          latitude: position.coords.latitude,
                          longitude: position.coords.longitude,
                      }
                      // positionNew = position
                      console.log('posisiisii ', (position.coords.latitude));
                      setForm({
                          ...form,
                          lat: position.coords.latitude,
                          lng: position.coords.longitude
                      })
                      setLoading(false)
                  },
                  (error) => {
                      console.log(error);
                      setLoading(false)
                  },
                  { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000, accuracy: 'high' },
              );
          }).catch((e) => {
              // console.log(e);
              setLoading(false)
          })
      }).catch((error) => {

          API.categories(TOKEN).then((result) => {
              setCategories(result.data)
          }).catch(e => {
              alert('categories error')
              console.log(e);
          }).finally(f => { setStatusGps(error.message); setLoading(false) })
      });
      //    }
  }, [])

  useEffect(() => {
      if (isFocused) {
          setCustomer_id(formParams.customer_id ? formParams.customer_id : '')
          setForm({
              ...form,
              title: formParams.title ? formParams.title : '',
              category_id: formParams.category_id ? formParams.category_id : '',
              description: formParams.description ? formParams.description : '',
              lat: formParams.lat ? formParams.lat : '',
              lng: formParams.lng ? formParams.lng : '',
              customer_id: formParams.customer_id ? formParams.customer_id : '',
              dapertement_id: USER.dapertement_id,
          })
      }
  }, [isFocused])


  const handleForm = (key, value) => {
      setForm({
          ...form,
          [key]: value
      })
  }


  // get image 


  const getImageGalery = () => {
      launchImageLibrary(
          {
              mediaType: 'photo',
              includeBase64: true,
              maxHeight: 500,
              maxWidth: 500,
          },
          (response) => {
              if (response.assets) {
                  let dataImage = response.assets[0];
                  setResponses([...responses, dataImage])
              }
          }
      )
  }

  const getImage = () => {
    launchCamera(
        {
            mediaType: 'photo',
            includeBase64: true,
            maxHeight: 500,
            maxWidth: 500,
        },
        (response) => {
            if (response.assets) {
                let dataImage = response.assets[0];
                setResponses([...responses, dataImage])
            }
        }
    )
}


  const getVideo = () => {
      launchCamera(
          {
              mediaType: 'video',
              quality: 1,
              videoQuality: 'high'
              // includeBase64: true 
          },
          (response) => {
              if (response.assets) {
                  setVideo(response.assets[0]);
                  setForm({
                      ...form,
                      video: response.assets[0].fileName
                  })
                  // console.log(response.assets[0]);
              }
          })
  }
  const getVideoGalery = () => {
      launchImageLibrary(
          {
              mediaType: 'video',
              quality: 1,
              videoQuality: 'high'
          },
          (response) => {
              if (response.assets) {
                  setVideo(response.assets[0]);
                  setForm({
                      ...form,
                      video: response.assets[0].fileName
                  })
                  // console.log(response.assets[0]);
              }
          }
      )
  }


  const deleteImage = () => {
      if (responses.length > 1) {
          const lastIndex = responses.length - 1;
          setResponses(responses.filter((item, index) => index !== lastIndex));
      }
  }

  const resetImage = () => {
      if (responses.length > 0) {
          setResponses([]);
      }
  }


  const handleData = (position = null) => {
      console.log('formm', form);
      let dataUpload = [];
      let data = form;
      if (position != null) {
          data.lat = position.coords.latitude
          data.lng = position.coords.longitude
      }
      console.log('position', data.lat + ' ' + data.lng);

      let message = 'Mohon lengkapi data';
      let send = false;
      if ((responses.length > 0 && responses.length <= 3) && video !== null) {
          if (video.fileSize <= 20000000) {
              dataUpload =
                  [
                      // name: image adalah nama properti dari api kita
                      {
                          name: 'qtyImage',
                          data: JSON.stringify(responses.length)
                      },
                      {
                          name: 'video',
                          filename: video.fileName,
                          type: 'mp4',
                          data: RNFetchBlob.wrap(video.uri)
                          // String(imagefoto).replace('public/', '')
                          // data : "RNFetchBlob-file://"+video.uri
                      },
                      {
                          name: 'form',
                          data: JSON.stringify(form)
                      },
                  ];
              send = true
          } else {
              message = 'max video 20 mb'
          }

      } else if (responses.length >= 2 && responses.length <= 3) {
          dataUpload =
              [
                  // name: image adalah nama properti dari api kita
                  {
                      name: 'qtyImage',
                      data: JSON.stringify(responses.length)
                  },
                  {
                      name: 'form',
                      data: JSON.stringify(form)
                  },
              ];
          send = true;

      }

      let dataQtyImage = 1;
      for (let index = 0; index < responses.length; index++) {
          dataUpload.push(
              {
                  'name': 'image' + dataQtyImage,
                  'filename': responses[index].fileName,
                  'data': responses[index].base64
              }
          )
          dataQtyImage++;
      }


      console.log('dataUpload',dataUpload)
      console.log('defcustomer_id',defcustomer_id)
      if (form.title != '' && form.category_id != '' && form.description != '' && form.customer_id != '' && form.lat != '' && form.lng != '') {

          if (send) {
              setLoading(true)
              RNFetchBlob.fetch(
                  'POST',
                  'https://simpletabadmin.ptab-vps.com/api/close/admin/tickets',
                  {
                      Authorization: `Bearer ${TOKEN}`,
                      otherHeader: 'foo',
                      'Accept': 'application/json',
                      'Content-Type': 'multipart/form-data',
                  },
                  dataUpload
                 ,
              ).then((result) => {
                  setLoading(false)
                  let data = JSON.parse(result.data);
                  console.log('data post',data);
                  alert(data.message)
                  navigation.navigate('Menu')
              }).catch((e) => {
                  //    console.log(e);
                  setLoading(false)
              })
          } else {
              if (video != null && responses.length < 1) {
                  message = 'mohon gambar diisi min 1'
              }
              if (video == null && responses.length <= 2) {
                  message = 'Mohon isi gambar min 2 jika tidak tersedia video'
              }
              if (video == null && responses.length >= 3) {
                  message = 'Max upload 3 gambar'
              }

              alert(message)
          }
      } else {
          setLoading(false)
          alert('Mohon Lengkapi data')
      }
  }

  // action
  const handleAction = () => {

      setLoading(true)
      if (statusGps != 'disabled') {
          handleData()
      } else {
          LocationServicesDialogBox.checkLocationServicesIsEnabled({
              message: "<h2 style='color: #0af13e'>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
              ok: "YES",
              cancel: "NO",
          }).then(function (success) {
              setStatusGps(success.status)
              Promise.all([requestLocationPermission()]).then((res) => {
                  // console.log('corrrrrr',res);
                  Geolocation.getCurrentPosition(
                      (position) => {
                          // console.log('posisi',position);
                          defaultLoc = {
                              latitude: position.coords.latitude,
                              longitude: position.coords.longitude,
                          }
                          // positionNew = position
                          console.log('posisiisii ', (position.coords.latitude));
                          setForm({
                              ...form,
                              lat: position.coords.latitude,
                              lng: position.coords.longitude
                          })
                          handleData(position)
                      },
                      (error) => {
                          console.log(error);
                          setLoading(false)
                      },
                      { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000, accuracy: 'high' },
                  );
              }).catch((e) => {
                  console.log(e);
                  setLoading(false)
              })
          }).catch((error) => {
              console.log(error.message); // error.message => "disabled"
              //   navigation.navigate('Register')
              setStatusGps(error.message)
              setLoading(false)
          });
      }

  }

  const requestLocationPermission = async () => {
      let info = '';
      try {
          const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                  'title': 'Location Permission',
                  'message': 'MyMapApp needs access to your location'
              }
          )

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              //   setEnableLocation(true)
          } else {
              //   setEnableLocation(false)
          }
      } catch (err) {
          info = 1
      }
  }



  // real
  function toRupiah(amount){
    const rupiah = String(amount)
     .replace(/\B(?=(\d{3})+(?!\d))/g, '.')+',00';
     return rupiah;
   }

  function uploadImg(){
    const options = {};
   launchCamera(options, response=>{
      // console.log('hhh', response);
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      }
      else if(response.assets[0].uri){
        setImg(response.assets[0])
        // console.log('hhh', img.fileName);
      }
    })
    
  }
  function addImage(){
let addAmount = 1;
    if(amount>1){
      console.log('berhasil');
    }
    if(amount<1){
      console.log('gagal');
    }
addAmount = addAmount+amount;
    
    console.log(amount);
    setAmount(addAmount)

  }

  function getUploadImage() {
    if(img !== null){
      return (
        <Image source={{uri : img.uri}} style={styles.icon}/>
      )
    }
    else{
      return (
      <Image source={Images} style={styles.icon}/>
      )
    }
  }
  return (
    <View style={styles.container}>
      
{page == "1" &&<View style={styles.content}>
<View style={{ flexDirection : "row", borderBottomWidth:1, paddingBottom:10 }}><Text style={styles.label1H}>Meter Segel</Text></View>
      <Text style={styles.label4}>No. SBG/Nama</Text>
      <View style={styles.searchGroup}>
        <TextInput
         style={styles.search}
            placeholder="No. SBG/Nama"
            value={search}
            onChangeText ={(value)=>  setSearch(value)}
        ></TextInput>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.label2white}>Cari</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.data}>
{data.map((item)=>{
  <View style={styles.data1}>
  <View style={styles.col1}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>1). 45582</Text>
    <Text style={styles.label3}>I MADE SUARTA</Text>
    <Text style={styles.label3}>PERUM PERDANA LESTARI 1</Text>
    <Text style={{ textAlign: "right" }}>05-2022   : Rp{"180000"}</Text>
    <Text style={{ textAlign: "right" }}>06-2022   : Rp{"91.465"}</Text>
    <Text style={{ textAlign: "right" }}>Rp. 91.465</Text>
    <Text>21-07-2022 <Text style={styles.label3}>Penyampaian Surat</Text></Text> 
  </View>
  <View style={styles.col2}>
    <TouchableOpacity onPress={()=>{setPage("2")}}>
<Text>Buka <Icon name='chevron-forward-outline' size={12}/></Text>
</TouchableOpacity>
  </View>
</View>

})}
<View style={styles.data1}>
  <View style={styles.col1}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>1). 45582</Text>
    <Text style={styles.label3}>I MADE SUARTA</Text>
    <Text style={styles.label3}>PERUM PERDANA LESTARI 1</Text>
    <Text style={{ textAlign: "right" }}>05-2022   : Rp{"180000"}</Text>
    <Text style={{ textAlign: "right" }}>06-2022   : Rp{"91.465"}</Text>
    <Text style={{ textAlign: "right" }}>Rp. 91.465</Text>
    <Text>21-07-2022 <Text style={styles.label3}>Penyampaian Surat</Text></Text> 
  </View>
  <View style={styles.col2}>
    <TouchableOpacity onPress={()=>{setPage("2")}}>
<Text>Buka <Icon name='chevron-forward-outline' size={12}/></Text>
</TouchableOpacity>
  </View>
</View>
<View style={styles.data1}>
  <View style={styles.col1}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>2). 45583</Text>
    <Text style={styles.label3}>I MADE SUARTA</Text>
    <Text style={styles.label3}>PERUM PERDANA LESTARI 2</Text>
    <Text style={{ textAlign: "right" }}>05-2022   : Rp{toRupiah("1000000")}</Text>
    <Text style={{ textAlign: "right" }}>Rp{toRupiah("1000000")}</Text>
    <Text>21-07-2022 <Text style={styles.label3}>Penyampaian Surat</Text></Text> 
  </View>
  <View style={styles.col2}>
    <TouchableOpacity>
<Text>Buka <Icon name='chevron-forward-outline' size={12}/></Text>
</TouchableOpacity>
  </View>
</View>

      </ScrollView>
      </View>
    }

{page == "2" && <View style={styles.content}>
<View style={{ flexDirection : "row", borderBottomWidth:1, paddingBottom:10 }}>
  <TouchableOpacity onPress={()=> setPage('1')}><Text style={{ color : "rgb(255,0,0)" }}><Icon name='chevron-back-outline' size={12} color = {"rgb(255,0,0)"}/>BACK</Text></TouchableOpacity>
  <Text style={styles.label1H}>Meter Segel</Text></View>
  <View style={styles.top}>
      <Text style={[styles.label4, {textAlign:"center"}]}>{new Date().toLocaleString()}</Text>
      </View>
      <View style={styles.top}>
      <Text style={styles.label1}>PERUMDA TIRTA AMERTHA BUANA TABANAN</Text>
      </View>
      <View style={styles.top}>
      <Text style={{  fontSize: 16, color : "#000000", fontWeight : "bold" }}>Data Pelanggan</Text>
      </View>
      <ScrollView style={styles.formData}>

  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>No. SBG</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    45582</Text>
    </View>
  </View>
  
  </View>

  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>Nama</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    I MADE SUARTA</Text>
    </View>
  </View>
  </View>

  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>Alamat</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    PERUM PERDANA LESTARI 2</Text>
    </View>
  </View>
  </View>

  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>Golongan</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    C6</Text>
    </View>
  </View>
  </View>

  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>No Telp</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    08123456789</Text>
    </View>
  </View>
  </View>

  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>Tgl Pasang</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    2012-01-09</Text>
    </View>
  </View>
  </View>

  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>No. WM</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    080416141</Text>
    </View>
  </View>
  </View>

  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>Diameter WM</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    111</Text>
    </View>
  </View>
  </View>

      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={()=>setPage('4')}>
          <Text style={styles.label2white}>Penyampaian Surat</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={()=>setPage('3')}>
          <Text style={styles.label2white}>PROSES</Text>
        </TouchableOpacity>

        <Text style={ [styles.label3,{fontWeight:"bold", textAlign :"center"}]}>Operator : Tenaya</Text>        
        <TouchableOpacity style={styles.button} onPress={()=>setPage('1')}>
          <Text style={styles.label2white}>BATAL</Text>
        </TouchableOpacity>
      
      </View>
    }


{page == "4" && <View style={styles.content}>
<View style={{ flexDirection : "row", borderBottomWidth:1, paddingBottom:10 }}>
  <TouchableOpacity onPress={()=> setPage('2')}><Text style={{ color : "rgb(255,0,0)" }}><Icon name='chevron-back-outline' size={12} color = {"rgb(255,0,0)"}/>BACK</Text></TouchableOpacity>
  <Text style={styles.label1H}>Meter Segel</Text></View>
  <View style={styles.top}>
      <Text style={[styles.label4, {textAlign:"center"}]}>{new Date().toLocaleString()}</Text>
      </View>
      <View style={styles.top}>
      <Text style={styles.label1}>PERUMDA TIRTA AMERTHA BUANA TABANAN</Text>
      </View>
      <View style={styles.top}>
      <Text style={{  fontSize: 16, color : "#000000", fontWeight : "bold" }}>Data Pelanggan</Text>
      </View>
      <ScrollView style={styles.formData}>

  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>No. SBG</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    45582</Text>
    </View>
  </View>
  
  </View>

  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>Nama</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    I MADE SUARTA</Text>
    </View>
  </View>
  </View>

  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>Alamat</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    PERUM PERDANA LESTARI 2</Text>
    </View>
  </View>
  </View>

  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>Golongan</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    C6</Text>
    </View>
  </View>
  </View>

  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>No Telp</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    08123456789</Text>
    </View>
  </View>
  </View>

  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>Tgl Pasang</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    2012-01-09</Text>
    </View>
  </View>
  </View>

  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>No. WM</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    080416141</Text>
    </View>
  </View>
  </View>

  <View style={styles.formGroup}>
  <View style={styles.formField}>
    <View style={styles.col21}>
    <Text style={[styles.label3,{fontWeight:"bold"}]}>Diameter WM</Text>
    </View>
    <View style={styles.col22}>
    <Text style={styles.label3}>:    111</Text>
    </View>
  </View>
  </View>

      </ScrollView>
<Text style ={styles.label1}>Penyampaian Surat</Text>
<View style={{ flexDirection : "row" }}>
      <Image source={Images} style={styles.imageSend}/>
      <Image source={Images} style={styles.imageSend}/>
      </View>
      </View>
    }

{page == "3" && 
<View style={styles.content}>
<View style={{ flexDirection : "row", borderBottomWidth:1, paddingBottom:10 }}>
  <TouchableOpacity onPress={()=> setPage('2')}><Text style={{ color : "rgb(255,0,0)" }}><Icon name='chevron-back-outline' size={12} color = {"rgb(255,0,0)"}/>BACK</Text></TouchableOpacity>
  <Text style={styles.label1H}>Meter Segel</Text></View>
                <ScrollView style={styles.scrollV}>
                    {/* <HeaderInput /> */}
                    <View style={{ alignItems: 'center' }}>
                        <View style={{ width: '100%' }}>
                            <View style={styles.baseBoxShadow} >
                                <View style={styles.boxShadow} >
                                    {/* <Title title='Tambah Tiket' paddingVertical={5} /> */}
                                    <Txt title='Ambil Gambar' />
                                    <ButtonImage Image={getImage} ImageGalery={getImageGalery} dataImage={responses} deleteImage={() => deleteImage()} resetImage={() => resetImage()} />


                                    <Txt title='Ambil Video' />
                                    <View style={{ paddingVertical: 10, height: 220 }}>
                                        {video == null && (
                                            <View style={{ alignItems: 'center' }}>
                                                <Image source={require('../../assets/img/ImageVideo.png')} style={{ width: '90%', height: 150 }} />
                                            </View>
                                        )}
                                        {video && (
                                            <VideoPlayer
                                                src={{ uri: video.uri }}
                                            />

                                        )}
                                    </View>


                                    <View style={{ alignItems: 'center' }}>
                                        <Button
                                            title="Ambil Video"
                                            width="80%"
                                            backgroundColor='#1DA0E0'
                                            icon={<FontAwesomeIcon icon={faVideo} color='#ffffff' />}
                                            onPress={() => (
                                                Alert.alert(
                                                    'Peringatan',
                                                    `Video tidak boleh lebih besar dari 5mb ! `,
                                                    [
                                                        {
                                                            text: 'Tidak',
                                                            // onPress : () => console.log('tidak')
                                                        },
                                                        {
                                                            text: 'Ya',
                                                            // onPress : () => {generateCodeOTP(); setModalVisible(true)}
                                                            onPress: () =>

                                                                launchCamera(
                                                                    {
                                                                        mediaType: 'video',
                                                                        quality: 1,
                                                                        videoQuality: 'high'
                                                                        // includeBase64: true 
                                                                    },
                                                                    (response) => {
                                                                        if (response.assets) {
                                                                            setVideo(response.assets[0]);
                                                                            setForm({
                                                                                ...form,
                                                                                video: response.assets[0].fileName
                                                                            })
                                                                            // console.log(response.assets[0]);
                                                                        }
                                                                    })

                                                            // Alert.alert(
                                                            //     'Bukti Video',
                                                            //     `Galery atau Camera? `,
                                                            //     [
                                                            //         {
                                                            //             text : 'Galery',
                                                            //             onPress : () => getVideoGalery()
                                                            //         },
                                                            //         {
                                                            //             text : 'Camera',
                                                            //             onPress : () => getVideo()
                                                            //         }
                                                            //     ]
                                                            // )
                                                        }
                                                    ]
                                                )
                                            )}
                                        />
                                    </View>



                                    <View style={{ alignItems: 'center' }}>
                                        <Distance distanceV={10} />
                                        <Btn title='Simpan' onPress={handleAction} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
        </View>
      
    }

      </View>
 
  )
}

export default Search


const windowWidht =Dimensions.get('window').width;
const windowHeight =Dimensions.get('window').height;

const styles = StyleSheet.create({

    scrollV:{

height : windowHeight*0.89
    },
  container:
  {
    flex: 1,

  },
  formField:{
flexDirection : "row",
paddingVertical : windowHeight*0.015,
  },
  data : {
    marginTop : windowHeight*0.02,
    width: windowWidht*0.9,
    marginHorizontal : windowWidht*0.025,
    height : windowHeight*0.71,
    backgroundColor : '#FFFFFF',
  },
  top : {
    marginTop : windowHeight*0.01,
  },

  formData : {
    marginTop : windowHeight*0.02,
    width: windowWidht*0.9,
    marginHorizontal : windowWidht*0.025,
    height : windowHeight*0.50,
    // backgroundColor : 'red',
  },
  data1 : {
    flexDirection : "row",
   marginHorizontal : windowWidht*0.05,
    width :windowWidht*0.8,
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
    width :windowWidht*0.12,
  },

  col21 : {
    width :windowWidht*0.3,
  },
  col22 : {
    width :windowWidht*0.6,
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
    width: windowHeight*0.36,
    height:  windowHeight*0.36,
    marginRight:10,
    borderRadius : 150/2,
    marginTop:windowHeight*0.01,
    overflow: "hidden",
    // borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
  
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
    width: windowWidht*0.87,
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
  }
})