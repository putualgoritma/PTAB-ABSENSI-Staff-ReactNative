import { Dimensions, StyleSheet, Text, View, ScrollView, PermissionsAndroid, TouchableOpacity, Image, Alert, } from 'react-native'
import React , { useEffect, useState }  from 'react'
import MapView, { Callout, Marker, Circle } from 'react-native-maps';
import reactNativeAndroidLocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import Geolocation from '@react-native-community/geolocation';
import { useSelector } from 'react-redux';
import API from '../../service';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import RNFetchBlob from 'rn-fetch-blob';
import { getDistance } from 'geolib';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { launchCamera } from 'react-native-image-picker';
import ScreenLoading from '../loading/ScreenLoading';


const Absence = ({navigation, route}) => {
  const TOKEN = useSelector((state) => state.TokenReducer);
  const USER = useSelector((state) => state.UserReducer);
  const USER_ID = useSelector((state) => state.UserReducer.id);
  const STAFF_ID = useSelector((state) => state.UserReducer.staff_id);
  const [timeD,setTimeD] = useState(0)


  const [image, set_image] = useState({
    base64: "",
    fileName: "",
    fileSize: 0,
    height: 0,
    type: "",
    uri: "",
    width: 0,
    from :'api'
});




// React.useEffect(() => {
//   const timer = setInterval(() => {
//     if(timeD > 0){
//       setTimeD(timeD - 1);
//     }
//   }, 1000);

//   // return () => {
//   //   clearInterval(timer);
//   // };

// }, []);

const authCurrent=()=> {
  FingerprintScanner
    .authenticate({ title: 'Verifikasi Bahwa Ini Benar Anda' })
    .then(() => {
      handleAction()
      // navigation.navigate('Test1')
      FingerprintScanner.release();
 
    }).catch(error => {
     
      if(error.name == 'DeviceLocked')
      {
        if(timeD > 0){
          alert('Tunggu beberapa saat dan klik ulang tombol absen')
        }
        else{
          alert('Tunggu 30 detik dan klik ulang tombol absen')
        }

        setTimeD(30);
      }
      else if(error.name == 'DeviceLockedPermanent'){
        alert('Kunci HP Anda dan masuk dengan sandi anda')
      }
      else if(error.name == 'DeviceLockedPermanent'){
        alert('Kunci HP Anda dan masuk dengan sandi anda')
      }
      else if( error.name == 'FingerprintScannerNotEnrolled')
      {
        alert('Aktifkan Fingerprint anda, masuk ke setting/sandi&keamanan pilih sidik jari')
      }
      else{
        // alert('Aktifkan Fingerprint anda, masuk ke setting/sandi&keamanan pilih sidik jari')
        // test
        alert(error.name)
      }
      FingerprintScanner.release();
    });
  
}

    const [isMounted ,setIsMounted] = useState(true)
    const [courseDetails, setCourseDetails] = useState()
    const [jarak, setJarak] = useState('1')
    const [test, setTest] = useState('')
    const { width, height } = Dimensions.get('window');
    const ASPECT_RATIO = width / height;
    const LATITUDE_DELTA = 0.4922;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
    const [time, setTime] = React.useState(30);
    const [form, setForm] = useState({
      lat: '',
      lng: '',
      customer_id: '',
      memo : '',
      type : '',
      // staff_id : USER_ID,
      todo : ''
  })
  const [loading, setLoading] = useState(true)

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

 useEffect(()=>{
  const timerId = setTimeout(() => {
    if(timeD > 0 ){
      setTimeD(timeD-1);
      // saad = saad-1;
    }
    console.log('wwww',timeD)
  }, 1000);

  return () => {
    clearTimeout(timerId);
  };
    
  },[timeD]);

  React.useEffect(() => {
    // let saad = timeD;
    if (isMounted) {
    const timer = setInterval(() => {
      setTime(new Date().getDate() + "-" + parseInt(new Date().getMonth() + 1) + "-" + new Date().getFullYear() + " " + (new Date().getHours()) + ":" + new Date().getMinutes() + ":" + new Date().getSeconds());



      // timeD = 10

      Geolocation.getCurrentPosition(
        (position) => {
          if(position){


          const j =  getDistance(position.coords, {
                       latitude:  parseFloat(route.params.lat),
            longitude:  parseFloat(route.params.lng),
    })
// Working with W3C Geolocation API

setTest(j);
    if(j> route.params.radius){
      setJarak('1')
    }
    else{
      setJarak('2')
    }

            // positionNew = position
            // console.log('posisiisii ', (position.coords.latitude),(position.coords.longitude));
            setForm({
                ...form,
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
            // handleData(position)
            console.log("saaaa");
          }
        },
        (error) => {
          console.log("sssss");
            console.log(error);
            setLoading(false)
        },
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000, accuracy: 'high' },
    );

    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }

  }, [setCourseDetails]);


  useEffect(() => {
    return () => {
        setCourseDetails(null);
        setIsMounted(false);
    }
}, []);

    useEffect(() => {
      console.log(route.params)
setLoading(true)
      // console.log(route.params.data.duty)
      reactNativeAndroidLocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: "<h2 style='color: #0af13e'>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
        ok: "YES",
        cancel: "NO",
    }).then(function (success) {
      if(success){
        Promise.all([requestLocationPermission()]).then((res) => {
            // console.log('corrrrrr',res);
            Geolocation.getCurrentPosition(
                (position) => {

// Working with W3C Geolocation API

        console.log(
            'You are ',
            getDistance(position.coords, {
                   latitude:  parseFloat(route.params.lat),
            longitude:  parseFloat(route.params.lng),
            }),
            'meters away from 51.525, 7.4575'
        );


                    // console.log('posisi',position);
                    // defaultLoc = {
                    //     latitude: position.coords.latitude,
                    //     longitude: position.coords.longitude,
                    // }
                    // positionNew = position
                    console.log('posisiisii ', (position.coords.latitude),(position.coords.longitude));
                    setForm({
                        ...form,
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                    setLoading(false)
                    // alert(position.coords.latitude);
                    // handleData(position)
                },
                (error) => {
                    console.log(error);
                    setLoading(false)
                },
                { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000, accuracy: 'high' },
            );
        }).catch((e) => {
            console.log(e);
            setLoading(false)
        })
      }
    }).catch((error) => {
        console.log(error.message); // error.message => "disabled"
        //   navigation.navigate('Register')
        // setStatusGps(error.message)
        setLoading(false)
    });
    requestCameraPermission()
  }, [])


  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          'title': 'Camera Permission',
          'message':
            'App need to use camera access to take an Image',
        //   buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };


  const handleAction = ()=>{
    setLoading(true)
   const data={
        lat : form.lat,
        lng : form.lng,

   }
   console.log(form.lat,form.lng)
   if(form.lat != "" && form.lng != "" && image.fileName !=""  && image.fileName !=null)
   {
   RNFetchBlob.fetch(
    'POST',
    'https://simpletabadmin.ptab-vps.com/api/close/absence/absence/store',
    {
      // Authorization: `Bearer ${TOKEN}`,
      // otherHeader: 'foo',
      'Accept' : 'application/json' ,
      'Content-Type': 'multipart/form-data',
    },
       [
       {
    'name' : 'image' ,
    'filename' : image.fileName,
    'data' : image.base64,
},
{ 'name' : 'id', 'data' : route.params.id.toString()},
{ 'name' : 'absence_id', 'data' : route.params.absence_id.toString()},
{ 'name' : 'type', 'data' : route.params.type.toString()},
{ 'name' : 'queue', 'data' : route.params.queue.toString()},
{ 'name' : 'staff_id','data' :  STAFF_ID.toString()},
{ 'name' : 'lat','data' :  form.lat.toString()},
{ 'name' : 'lng', 'data' : form.lng.toString()},
{ 'name' : 'status', 'data' : "0"},
],).then((result) => {
    let data = JSON.parse(result.data);
    console.log(result);
    navigation.goBack()
    setLoading(false)
    alert(data.message)
    // navigation.navigate('Action')
}).catch((e) => {
    // console.log(e);
    setLoading(false)
})
   }

   else{
    alert('Lengkapi data terlebih dahulu')
   }

  }
  

//   dataUpload.push(                       {
//     'name' : 'image' ,
//     'filename' : image.fileName,
//     'data' : image.base64
// });


if(!loading && jarak != ""){
  return (

    <View style = {{ flex: 1 }}>
      {/* <Text>{timeD}</Text> */}
        <ScrollView>
        <View style ={{   alignItems : 'center' }}>

       <Text style = {[{marginVertical : windowHeight*0.01},jarak == "1" ? {color : '#ff0000'}:'']}>
       anda berada di {jarak == "1" ? 'Diluar Jangkauan':'Dalam Jangkauan'}, {test}
        </Text>

       <Text style = {[{marginVertical : windowHeight*0.05, fontSize : 24}]}>
      Absen
       </Text>
       <View style = {{ height : windowHeight*0.3,  width : windowWidht*0.8,  backgroundColor : '#FFFFFF' }}>

       <MapView style ={{ flex : 1 }} //window pake Dimensions
          showsUserLocation={true}
          showsMyLocationButton={true}
 
          region={{
               latitude: parseFloat(route.params.lat),
            longitude: parseFloat(route.params.lng),
             latitudeDelta: 0.00683,
longitudeDelta: 0.0035
          }} >
 <Circle 
  center={{
       latitude: parseFloat(route.params.lat),
            longitude: parseFloat(route.params.lng),

 }}

 radius = { route.params.radius}
 strokeWidth = {1}
 strokeColor = '#ff0000'
 fillColor = '#ff000030'
 />


<Marker

coordinate={{
  latitude: parseFloat(route.params.lat),
  longitude: parseFloat(route.params.lng),
}}

>
<Callout>
   <View>
     <Text>Posisi Kantor</Text>
   </View>
 </Callout>
</Marker>



         
       </MapView>
       </View>


        {/* <View style={styles.mapS}>

        </View> */}
      <Text>Map</Text>






      <TouchableOpacity onPress={
() => 
          launchCamera(
                         {
                             mediaType: 'photo',
                             includeBase64:true,
                             maxHeight: 500,
                             maxWidth: 500,
                             cameraType : 'front'
                         },
                         (response) => {
                             // console.log('ini respon', response);
                             if(response.assets){
                             
                                 let image = response.assets[0];
                                 set_image(image)
                             
                             }
                         }
                     )
                 }
             >
              
{image.uri == "" || image.uri == null ?
 <View style={styles.image}>
 <Icon name="camera-retro" size={windowHeight*0.08} color="#000000" />
</View>
:
<Image
                                                style={styles.image}
                                                source={{ uri : image.uri}}
                                                // source={image.uri=='' || image.uri==null ? require('../../../assets/img/ImageFoto.png'): {uri: image.from=='local' ? image.uri : `https://simpletabadmin.ptab-vps.com/` + `${String(image.uri).replace('public/', '')}?time="${new Date()}`}}
                                            />
                                            
                                           
 }



</TouchableOpacity>

<Text>Image</Text>

    </View>
    </ScrollView>

{jarak != 1 && timeD == 0 &&
 <TouchableOpacity style={[styles.btn]} onPress={()=>{authCurrent()}}>
 <Text style={{ color : '#FFFFFF', fontSize : 24, fontWeight : 'bold' }}>
   Absen
   </Text>
 </TouchableOpacity>
}

{timeD != 0 &&
  <Text style={{ textAlign : 'center', color : '#d72503' }}>Tunggu {timeD} detik</Text>
}

{/* <TouchableOpacity style={[styles.btn]} onPress={()=>{setTimeD(40); console.log('dldldld', timeD)}}>
 <Text style={{ color : '#FFFFFF', fontSize : 24, fontWeight : 'bold' }}>
   Absen
   </Text>
 </TouchableOpacity>
        */}

{/* {jarak != 1 &&
 <TouchableOpacity style={[styles.btn]} onPress={()=>{handleAction()}}>
 <Text style={{ color : '#FFFFFF', fontSize : 24, fontWeight : 'bold' }}>
   Absen
   </Text>
 </TouchableOpacity>
} */}

     
           {/* <TouchableOpacity style={[styles.btn]} onPress={()=>{handleAction()}}>
     <Text style={{ color : '#FFFFFF', fontSize : 24, fontWeight : 'bold' }}>
       Absen
       </Text>
     </TouchableOpacity> */}
   
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

export default Absence

const windowWidht =Dimensions.get('window').width;
const windowHeight =Dimensions.get('window').height;

const styles = StyleSheet.create({
    mapS : {
        width : windowWidht*0.8,
        height : windowHeight*0.25,
        backgroundColor : '#FFFFFF',
    },
    image : {
      alignItems : 'center',
      justifyContent : 'center',
        width : windowWidht*0.70,
        height : windowHeight*0.3233,
        backgroundColor : '#00000010',
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