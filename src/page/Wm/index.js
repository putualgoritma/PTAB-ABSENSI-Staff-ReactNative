import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, ScrollView, StyleSheet, View, Image, Text, Dimensions, TouchableOpacity } from 'react-native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import DropDownPicker from 'react-native-dropdown-picker';
import Select2 from 'react-native-select-two';
import { useSelector } from 'react-redux';
import { Txt } from '../../component';
import API from '../../service';
import ScreenLoading from '../loading/ScreenLoading'
import Navbar from '../../component/Navbar'
import Icon1 from 'react-native-vector-icons/FontAwesome5'
import { useIsFocused } from '@react-navigation/native';



const Wm = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState("1");
  const [FilterBar, setFilterBar] = useState(true);
  const [data, setData] = useState([]);
  const [areas, setAreas] = useState([]);
  const [status, setStatus] = useState('');
  const [statusName, setStatusName] = useState('');
  const [currentPage, setCurrentPage] = useState([]);
  const [nextPage, setNextPage] = useState(0);
  const [previousPage, setPreviousPage] = useState(0);
  const [lastPage, setLastPage] = useState([]);
  const [totalPage, settotalPage] = useState([]);
  const [searchArea, setSearchArea] = useState('');

  const { width, height } = Dimensions.get('window');
  const [pag, setPag] = useState(1);
  DropDownPicker.setListMode("SCROLLVIEW");
  const TOKEN = useSelector((state) => state.TokenReducer);
  const [loading, setLoading] = useState(true)

  const USER = useSelector((state) => state.UserReducer);
  const USER_ID = useSelector((state) => state.UserReducer.id);
  const formParams = route.params ? route.params.ticket : ''

  // form
  const [form, setForm] = useState({
    lat: formParams.lat ? formParams.lat : '',
    lng: formParams.lng ? formParams.lng : '',
    customer_id: '',
    dapertement_id: USER.dapertement_id,
    memo: '',
    type: '',
    // staff_id : USER_ID,
    todo: ''
  })

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message:
            "needs access to your camera " +
            "so you can take pictures.",
          buttonNeutral: "Ask Me Later",
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

  useEffect(() => {
    if(isFocused){
    console.log('users', USER.roles[USER.roles.length-1].id)
    console.log('test')
    // ShowDetail();
    requestCameraPermission();
    getArea();
    actionStaffListsAPi();
    LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message: "<h2 style='color: #0af13e'>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
      ok: "YES",
      cancel: "NO",
    })
       }
  }, [isFocused])


  const AddPag = (val) => {
    console.log(pag);
    if (val === 0) {
      if (currentPage > 1) {
        console.log(previousPage)
        setLoading(true)
        API.watermeter(USER_ID, '?page=' + previousPage, status, searchPriority, statusSM, searchArea, search, orderType, order, TOKEN).then((result) => {
          // setStaffs(result.data)
          console.log('staff', result)
          console.log('staff1', result.message)
          console.log('staff2', result.data.current_page)
          setData(result.data.data)
          setCurrentPage(result.data.current_page)
          setLastPage(result.data.last_page)
          settotalPage(result.data.total)
          setPreviousPage(result.data.current_page - 1)
          setNextPage(result.data.current_page + 1)
          setLoading(false)
        }).catch((e) => {
          console.log(e.request);
          setLoading(false)
        })
      }
      else {

      }
    }
    else {
      if (currentPage < lastPage) {
        console.log('test', nextPage)
        setLoading(true)
        API.watermeter(USER_ID, '?page=' + nextPage, status, searchPriority, statusSM, searchArea, search,orderType, order, TOKEN).then((result) => {
          // setStaffs(result.data)
          console.log('staff', result)
          console.log('staff1', result.message)
          console.log('staff2', result.data.current_page)
          setData(result.data.data)
          setCurrentPage(result.data.current_page)
          setLastPage(result.data.last_page)
          settotalPage(result.data.total)
          setPreviousPage(result.data.current_page - 1)
          setNextPage(result.data.current_page + 1)
          setLoading(false)
        }).catch((e) => {
          console.log(e.request);
          setLoading(false)
        })
      }
      else {
        // actionStaffListsAPi();
      }
    }

  }
  const actionStaffListsAPi = () => {
    console.log(String(pag))
    setLoading(true)
    API.watermeter(USER_ID, '?page=1', status, searchPriority, statusSM, searchArea, search, orderType, order, TOKEN).then((result) => {
      // setStaffs(result.data)
      console.log('staff', status)
      console.log('staff1', result.message)
      console.log('staff2', result.data.current_page)
      setData(result.data.data)
      setCurrentPage(result.data.current_page)
      setLastPage(result.data.last_page)
      settotalPage(result.data.total)
      setPreviousPage(result.data.current_page - 1)
      setNextPage(result.data.current_page + 1)
      setLoading(false)
    }).catch((e) => {
      console.log(e.request);
      setLoading(false)
    })
  }

  const getArea = () => {
    // setLoading(true)
    API.areas(TOKEN).then((result) => {
      console.log('dat', result.data)
      setAreas(result.data)
      // setLoading(false)
    }).catch((e) => {
      console.log(e.request);
      setLoading(false)
    })
  }



  const handleSearch = () => {
    console.log(String(pag))
    setLoading(true)
    console.log('data terkirim :',status, searchPriority, statusSM, searchArea, search)
    API.watermeter(USER_ID, '?page=1', status, searchPriority, statusSM, searchArea, search, orderType, order, TOKEN).then((result) => {
      // setStaffs(result.data)
      console.log('staff', status)
      console.log('staff1', result.message)
      console.log('staff2', result.data.current_page)
      setData(result.data.data)
      setCurrentPage(result.data.current_page)
      setLastPage(result.data.last_page)
      settotalPage(result.data.total)
      setPreviousPage(result.data.current_page - 1)
      setNextPage(result.data.current_page + 1)
      setLoading(false)
    }).catch((e) => {
      console.log(e.request);
      setLoading(false)
    })
  }

  const sortHandle = (ordType, ord) =>{
    setLoading(true)
    console.log('data terkirim :',status, searchPriority, statusSM, searchArea, search)
    API.watermeter(USER_ID, '?page=1', status, searchPriority, statusSM, searchArea, search, ordType, ord, TOKEN).then((result) => {
      // setStaffs(result.data)
      setOrder(ord)
      setOrderType(ordType)
      console.log('staff', status)
      console.log('staff1', result.message)
      console.log('staff2', result.data.current_page)
      setData(result.data.data)
      setCurrentPage(result.data.current_page)
      setLastPage(result.data.last_page)
      settotalPage(result.data.total)
      setPreviousPage(result.data.current_page - 1)
      setNextPage(result.data.current_page + 1)
      setLoading(false)
    }).catch((e) => {
      console.log(e.request);
      setLoading(false)
    })
  }

  const reset = () => {
    setStatus('')
    setSearchPriority('')
    setStatusSM('')
    setSearchArea('')
    setSearch('')
    setFilter([{ "id": "1", "name": "Semua", "value": "", "checked": true },
    { "id": "2", "name": "WM Kabur", "value": "WM Kabur", "checked": false },
    { "id": "3", "name": "WM Rusak", "value": "WM Rusak", "checked": false },
    { "id": "4", "name": "WM Mati", "value": "WM Mati", "checked": false },
    ])
setFilterPriority([{ "id": "1", "name": "Semua", "value": "", "checked": true },
{ "id": "2", "name": "Hight", "value": "hight", "checked": false },
{ "id": "3", "name": "Medium", "value": "medium", "checked": false },
{ "id": "4", "name": "Low", "value": "low", "checked": false },
])
setFilterStatus([{ "id": "1", "name": "Semua", "value": "", "checked": true },
{ "id": "2", "name": "Active", "value": "active", "checked": false },
{ "id": "3", "name": "Work", "value": "work", "checked": false },
{ "id": "4", "name": "Close", "value": "close", "checked": false },
])
  getArea()
  actionStaffListsAPi()

  navigation.replace('Wm')
  }



  const handleForm1 = (id) => {
    let newArray = [...filter];
    let oldArray = [];
    for (let i = 0; i < newArray.length; i++) {
      newArray[i].checked = false
      console.log(i)
    }
    console.log(newArray)
    newArray[id - 1].checked = true
    console.log(newArray);
    setFilter(
      newArray);
    setStatusSM(newArray[id - 1].value)
    console.log('llll', status);
  }

  const handleForm2 = (id) => {
    let newArray = [...areas];
    for (let i = 0; i < newArray.length; i++) {
      newArray[i].checked = false;
      console.log(newArray[i].id + '-' + newArray[i].checked)
    }
    console.log(newArray)
    newArray[id - 1].checked = true;
    console.log(newArray);
    setAreas(newArray);
    setSearchArea(newArray[id - 1].value)
    console.log('llll', status);
  }

  const handleForm3 = (id) => {
    let newArray = [...filterPriority];
    for (let i = 0; i < newArray.length; i++) {
      newArray[i].checked = false;
      console.log(newArray[i].id + '-' + newArray[i].checked)
    }
    console.log(newArray)
    newArray[id - 1].checked = true;
    console.log(newArray);
    setFilterPriority(newArray);
    setSearchPriority(newArray[id - 1].value)
    console.log('llll', status);
  }

  const handleForm4 = (id) => {
    let newArray = [...filterStatus];
    for (let i = 0; i < newArray.length; i++) {
      newArray[i].checked = false;
      console.log(newArray[i].id + '-' + newArray[i].checked)
    }
    console.log(newArray)
    newArray[id - 1].checked = true;
    console.log(newArray);
    setFilterStatus(newArray);
    setStatus(newArray[id - 1].value)
    console.log('llll', status);
  }

  const [filter, setFilter] = useState([{ "id": "1", "name": "Semua", "value": "", "checked": true },
  { "id": "2", "name": "WM Kabur", "value": "WM Kabur", "checked": false },
  { "id": "3", "name": "WM Rusak", "value": "WM Rusak", "checked": false },
  { "id": "4", "name": "WM Mati", "value": "WM Mati", "checked": false },
  ]);

  const [filterPriority, setFilterPriority] = useState([{ "id": "1", "name": "Semua", "value": "", "checked": true },
  { "id": "2", "name": "Hight", "value": "hight", "checked": false },
  { "id": "3", "name": "Medium", "value": "medium", "checked": false },
  { "id": "4", "name": "Low", "value": "low", "checked": false },
  ]);

  const [filterStatus, setFilterStatus] = useState([{ "id": "1", "name": "Semua", "value": "", "checked": true },
  { "id": "2", "name": "Active", "value": "active", "checked": false },
  { "id": "3", "name": "Work", "value": "work", "checked": false },
  { "id": "4", "name": "Close", "value": "close", "checked": false },
  ]);
  const [dpdwn, setDpdwn] = useState(false);
  const [searchPriority, setSearchPriority] = useState('');
  const [statusSM, setStatusSM] = useState('');
  const [order, setOrder] = useState('');
  const [orderType, setOrderType] = useState('');



  return (
    <View style={styles.container}>
      <Navbar handleForm4={handleForm4} reset={reset} filterStatus={filterStatus} handleForm3={handleForm3} filterPriority={filterPriority} areas={areas} setAreas={setAreas} handleSearch={handleSearch} FilterBar={FilterBar} setFilterBar={setFilterBar} totalPage={totalPage} filter={filter} handleForm={handleForm1} handleForm2={handleForm2} dpdwn={dpdwn} setDpdwn={setDpdwn} />
      <View style={styles.content}>


        <ScrollView style={FilterBar ? styles.data : styles.data2}>
          {loading &&
            <ScreenLoading />
          }
          {!loading && data.map((item, key) => {
            return <View key={key} style={styles.data1}>
              <View style={styles.col1}>
                <Text style={[styles.label3, { fontWeight: "bold" }]}>{key + 1 + (10 * (currentPage - 1))}). {item.code}</Text>
                <Text style={styles.label3}>Priority : {item.priority === "3"? "Hight" :item.priority === "2"? "Medium" : "Low" }</Text>
                <Text style={styles.label3}>SBG : {item.nomorrekening}</Text>
                {/* <Text style={styles.label3}>{item.alamat}</Text> */}
                <Text style={styles.label3}>Kondisi WM : {item.status_wm}</Text>

                <View style={[styles.label3, { flexDirection: 'row' }]}>
                  <Text style={{ color: '#000000' }}>Status : </Text>

                  <Text style={[item.status == "active" ? styles.ss1 : item.status == "work" ? styles.ss2 : styles.ss3, { color: '#FFFFFF' }]}>{item.status}</Text>

                </View>

              </View>
              

                { USER.roles[USER.roles.length-1].id === 7? <View style={styles.col2}>
                  <TouchableOpacity onPress={() => navigation.navigate('LoadingWM', { id: item.id, status: item.status })}>

                  {item.status != "close" &&
                    <Text>Kerjakan <Icon name='chevron-forward-outline' size={12} /></Text>
                  }
                  {item.status == "close" &&
                    <Text>History <Icon name='chevron-forward-outline' size={12} /></Text>
                  }

                </TouchableOpacity>
                </View> : 
                <View style={styles.col2}>
               

                {item.status != "close" &&
                 <TouchableOpacity onPress={() => navigation.navigate('AddStaffIndex', { id: item.id, status: item.status })}>
                  <Text>Add Staff<Icon name='chevron-forward-outline' size={12} /></Text>
                  </TouchableOpacity>
                }
                {item.status == "close" &&
                  <TouchableOpacity onPress={() => navigation.navigate('HistoryShowWM', { id: item.id, status: item.status })}>
                  <Text>History <Icon name='chevron-forward-outline' size={12} /></Text>
                  </TouchableOpacity>
                 
                }

              
              </View> 

                }
                
             
            </View>

          })}
        </ScrollView>




        {loading &&
          <View style={styles.footer}>
            <View style={styles.paginate}>
              <Text>{currentPage} of {lastPage} from {totalPage} data</Text>
              <TouchableOpacity disabled={true}>
                <Icon name='chevron-back-outline' size={20} color={"rgb(255,0,0)"} />
              </TouchableOpacity>
              <TouchableOpacity disabled={true}>
                <Icon name='chevron-forward-outline' size={20} color={"rgb(255,0,0)"} />
              </TouchableOpacity>
            </View>
          </View>
        }
        {!loading &&
          <View style={styles.footer}>
            <View style={styles.paginate}>
              <Text>{currentPage} of {lastPage} from {totalPage} data</Text>
              <TouchableOpacity onPress={() => AddPag(0)}>
                <Icon name='chevron-back-outline' size={20} color={"rgb(255,0,0)"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => AddPag(1)}>
                <Icon name='chevron-forward-outline' size={20} color={"rgb(255,0,0)"} />
              </TouchableOpacity>
            </View>
          </View>
        }


      </View>

      {dpdwn &&
        <View style={styles.dropdown}>
          <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => { setDpdwn(false) }}>
            <Icon1 name="times" size={24} color="#9B9B9B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setDpdwn(false), sortHandle('DESC', 'action_wms.update_at') }}>
            <Text>tanggal(Besar ke kecil)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setDpdwn(false), sortHandle('ASC', 'action_wms.update_at') }}>
            <Text>tanggal(Kecil ke Besar)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setDpdwn(false), sortHandle('DESC', 'priority') }}>
            <Text>Priority(Besar ke Kecil)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setDpdwn(false), sortHandle('ASC', 'priority') }}>
            <Text>Priority(Kecil ke Besar)</Text>
          </TouchableOpacity>
        </View>
      }




    </View>

  )
}

export default Wm


const windowWidht = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  listSeal: {
    marginHorizontal: windowWidht * 0.0,

    width: windowWidht * 0.9,
    // height : windowHeight*0.1,
    // backgroundColor : "blue",
  },
  colom: {
    width: windowWidht * 0.3,
    borderWidth: 1,
  },
  colomGroup: {
    width: windowWidht * 0.9,
    flexDirection: "row",
  },
  colomGroupH: {
    width: windowWidht * 0.9,
    flexDirection: "row",
    backgroundColor: '#F0F8FF',
  },
  footer: {
    windowWidht: windowWidht * 0.8,
    marginTop: windowHeight * 0.01,
    padding: windowWidht * 0.02,
    margin: "auto",
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
  },
  paginate: {
    flexDirection: "row",
    marginLeft: "auto",
  },
  scrollV: {

    height: windowHeight * 0.89
  },
  container:
  {
    flex: 1,

  },
  formField: {
    flexDirection: "row",
    paddingVertical: windowHeight * 0.015,
  },
  data: {
    // marginTop : windowHeight*0.02,
    width: windowWidht * 0.95,
    marginHorizontal: windowWidht * 0.005,
    height: windowHeight * 0.685,
    backgroundColor: '#FFFFFF',
  },
  data2: {
    // marginTop : windowHeight*0.02,
    width: windowWidht * 0.95,
    marginHorizontal: windowWidht * 0.005,
    height: windowHeight * 0.43,
    backgroundColor: '#FFFFFF',
  },
  top: {
    marginTop: windowHeight * 0.01,
  },

  formData: {
    marginTop: windowHeight * 0.02,
    width: windowWidht * 0.95,
    marginHorizontal: windowWidht * 0.005,
    height: windowHeight * 0.75,
    backgroundColor: '#FFFFFF',
  },
  data1: {
    flexDirection: "row",
    marginHorizontal: windowWidht * 0.05,
    width: windowWidht * 0.9,
    marginVertical : windowHeight*0.01,
    // paddingBottom : windowHeight*0.03,
    borderBottomWidth: 1,
  },
  formGroup: {
    width: windowWidht * 0.8,
  },
  col1: {
    width: windowWidht * 0.68,
  },
  col2: {
    marginVertical: windowHeight * 0.05,
    width: windowWidht * 0.2,
  },

  col21: {
    width: windowWidht * 0.3,
  },
  col22: {
    width: windowWidht * 0.645,
  },
  content: {
    paddingTop: windowHeight * 0.02,
    paddingHorizontal: windowWidht * 0.02,
  },
  loadingImg: {
    alignItems: "center",
    paddingTop: windowHeight * 0.04,
  },
  loading: {
    alignItems: "center",
  },
  historyDay: {
    backgroundColor: "#FFFFFF",
    height: windowHeight * 0.18,
    width: windowWidht * 0.9,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.5)",
  },
  floatingScreen: {
    marginTop: windowHeight * 0.02,
    width: windowWidht * 0.9,
    height: windowWidht * 0.12,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.5)",

  },
  labelTitle: {
    fontSize: 30,
    color: "#FFFFFF",
    marginBottom: windowHeight * 0.03,
    textAlign: "center",
    fontWeight: "bold"
  },
  label1: {
    fontSize: 14,
    color: "#000000",
    textAlign: "center",
    fontWeight: "bold"
  },

  label1H: {
    width: windowWidht * 0.8,
    fontSize: 20,
    color: "#000000",
    textAlign: "center",
    fontWeight: "bold"
  },
  label2: {
    fontSize: 20,
  },
  label2white: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  label2whitecenter: {
    textAlign: "center",
    color: '#FFFFFF',
    fontSize: 20,
  },
  label3: {
    color: "#000000",
    fontSize: 16,

  },
  label4: {
    color: "#000000",
    fontSize: 12,

  },
  label3white: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  label2blue: {
    fontSize: 20,
    color: 'rgba(0,0,255,1)',
  },
  center: {
    // marginTop: windowHeight*0.1,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
  },

  iconGroup: {
    flexDirection: 'row',
  },

  square: {
    alignItems: "center",
    height: windowWidht * 0.22,
    width: windowWidht * 0.22,
    marginTop: windowWidht * 0.05,
    marginHorizontal: windowWidht * 0.1,
    backgroundColor: "rgba(0,191,255,0.1)",
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: "rgba(0,191,255,0.01)",

  },

  iconBack: {
    alignItems: "center",
    height: windowWidht * 0.6,
    width: windowWidht * 0.8,
    marginVertical: windowWidht * 0.1,
    marginHorizontal: windowWidht * 0.1,
    backgroundColor: "#FFFFFF",

  },
  imageSend: {
    marginVertical: windowHeight * 0.01,
    marginHorizontal: windowWidht * 0.022,
    width: windowWidht * 0.4,
    height: windowWidht * 0.2,
    borderWidth: 5,
    borderColor: "red",

  },

  icon: {
    marginVertical: windowHeight * 0.01,
    width: windowWidht * 0.78,
    height: windowWidht * 0.58,
    borderWidth: 5,
    borderColor: "red",

  },
  images: {
    width: windowHeight * 0.36,
    height: windowHeight * 0.36,
    marginRight: 10,
    borderRadius: 150 / 2,
    marginTop: windowHeight * 0.01,
    overflow: "hidden",
    // borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",

  },
  imagesLoading: {
    width: windowHeight * 0.12,
    height: windowHeight * 0.12,
    marginRight: 10,
    // borderRadius : 150/2,
    marginTop: windowHeight * 0.01,
    overflow: "hidden",
    // borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",

  },


  centerModal: {
    marginTop: windowHeight * 0.19,

    alignItems: 'center',
  },
  marginH: {
    marginHorizontal: windowWidht * 0.04,
    marginTop: windowHeight * 0.02,
  },
  leftButton: {
    width: windowWidht * 0.9,
  },
  marginTop: {
    marginTop: windowHeight * 0.05,
  },
  search: {
    width: windowWidht * 0.95,
    borderRadius: 1,
    borderBottomWidth: 0.5,
    color: '#000000',
    borderColor: "rgba(0,0,0,0.5)",
    backgroundColor: "#FFFFFF",
    marginHorizontal: windowWidht * 0.05,
    marginVertical: windowHeight * 0.01
  },
  searchGroup: {
    alignItems: "center",
  },
  button: {
    marginHorizontal: windowWidht * 0.01,
    marginTop: windowHeight * 0.01,
    width: windowWidht * 0.95,
    borderRadius: 3,
    // borderWidth : 1,
    // borderColor : "red",
    height: windowHeight * 0.05,
    backgroundColor: '#1DA0E0',
    alignItems: "center",
  },
  buttonRed: {
    marginHorizontal: windowWidht * 0.01,
    marginTop: windowHeight * 0.01,
    width: windowWidht * 0.95,
    borderRadius: 3,
    // borderWidth : 1,
    // borderColor : "red",
    height: windowHeight * 0.05,
    backgroundColor: 'red',
    alignItems: "center",
  },
  button2: {
    marginHorizontal: windowWidht * 0.05,
    marginTop: windowHeight * 0.01,
    width: windowWidht * 0.4,
    borderRadius: 3,
    // borderWidth : 1,
    // borderColor : "red",
    height: windowHeight * 0.05,
    backgroundColor: '#1DA0E0',
    alignItems: "center",
  },
  dropdown: {
    position: 'absolute',
    marginLeft: windowWidht * 0.68,
    backgroundColor: '#FFFFFF',
    marginTop: windowHeight * 0.05,
    width: windowWidht * 0.3,
    padding: windowWidht * 0.02,
    zIndex: 100,
    elevation: 5,
  },
  ss1: {
    backgroundColor: '#e8e337',
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
  },
  ss2: {
    backgroundColor: '#76BA1B',
    padding: 5,
    borderRadius: 5,
    marginBottom: 5
  },
  ss3: {
    backgroundColor: '#2a9df4',
    padding: 5,
    borderRadius: 5,
    marginBottom: 5
  }
})