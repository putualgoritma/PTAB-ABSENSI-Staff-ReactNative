import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { Spinner, Title } from '../component';
import { colors, Distance } from '../../../utils';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import API from '../../../service';
import { useSelector } from 'react-redux';
import { Col, Rows, TableWrapper, Table, Row } from 'react-native-table-component';
import { useIsFocused } from '@react-navigation/native';
import { BtnAdd, Txt } from '../../../component';
import ScreenLoading from '../../loading/ScreenLoading';


const Aksi =(props) => {
    // useEffect(() => {
    //     props.action_staffs_list.map((list) => {
    //         if(list.staff_id == props.data.id){
    //             setBlock(true)
    //             // if(list.status == 'pending'){
    //             //     setBlock(true)
    //             // }
    //         }
    //     })

    //     props.action_staffs.staff.map((action_staff) => {
    //         if(action_staff.id == props.data.id){
    //             setBlock(true)
    //         }
    //     })
    // }, [props.loading])

    
    return (
        <View style ={{alignItems : 'center', justifyContent :'center'}}>
            <TouchableOpacity  
                disabled={props.block}
                style ={[styles.btn, {backgroundColor : props.block ? 'grey' : '#FF5733'}]} onPress={props.block ? null : props.onPress}>
                <Text style={{color : '#ffffff', fontWeight : 'bold'}}>Delete</Text>
            </TouchableOpacity>
        </View>
    )
}


const AddStaff=({navigation, route})=>{

    const [loading, setLoading] = useState(true)
    const tableHead = ['NO','Unit Kerja' ,'Nama', 'No. Hp', 'Aksi'];
    const TOKEN = useSelector((state) => state.TokenReducer);
    const [tableNo, setTableNo] = useState()
    const [tableData, setTableData] = useState()
    const isFocused = useIsFocused();
    const [staffs, setStaffs] = useState()

    useEffect(() => {
        let isAmounted = true
        // if(isAmounted){
        //     actionStaffListsAPi();
        // }
        if (isFocused){
            actionStaffListsAPi();
        }

    }, [isFocused])


    const actionStaffListsAPi = () => {
        API.addStaffIndex(route.params.id, TOKEN).then((result) => {
            console.log('hasil',result.data)
            let data = []
            let no = []
            console.log('hasil1')
            result.data.map((item, index) => {
                // console.log(Object.keys(result.data[index]));
                no[index] = index + 1;
                data[index] = [
                    item.work_unit_name,
                    item.name,
                    item.phone,
                   
                    [<Aksi 
                            // action_staffs_list = {result.data.action_staff_lists}
                            // action_staffs = {result.data.action_staffs}
                            key ={index}
                            data={item} 
                            block = {item.action_wm_id != null ? true : false}
                            navigation={navigation} 
                            action_id = {route.params.action_id}
                            // delete={() => handleDelete(item.id)}
                            onPress={() => handleAction(item.id)}
                        />],
                ]
            })
            console.log('hasil2')
            setTableData(data)
            setTableNo(no)
            setStaffs(result.data)

            console.log(result.data);
            setLoading(false)
        }).catch((e) => {
            console.log(e.request);
            setLoading(false)
        })
    }


    const handleAction =(id) => {
        
        Alert.alert(
            'Yakin ?',
            `menghapus petugas`,
            [
                {
                    text: 'Yakin',
                    onPress: () => {   setLoading(true)
                        API.addStaffDelete({
                            id : id,
                        }, TOKEN).then((result)=>{
                            if(result.message.constructor === Array){
                                alert( result.message.toString())
                            }else{
                                alert(result.message)
                                actionStaffListsAPi();
                            }
                            setLoading(false)
                        }).catch((e) => {
                            console.log(e.request);
                            setLoading(false)
                        })}
                },
                {
                    text: 'Tidak',
                }
            ]
        );

     
    }
    return(
        <View style={styles.container}>
                {loading && <ScreenLoading/> }
                <View style={{alignItems:'center', flex : 1}}>
                {!loading &&
                    <View style={{width:'90%'}}>
                    <BtnAdd
                                title="Tambah Staff"
                                width='60%'
                                icon={faPlusCircle}
                                onPress={()=>navigation.navigate('AddStaff', {id : route.params.id})}
                            />
                        {/* <Title title='Tambah Staff'/> */}
                        <Txt title='Staff Bertugas'/>
                        <Distance distanceV={10}/>
                        {staffs &&  
                             <View style={{height : '82%'}} >
                                <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                                    <Row data={tableHead} flexArr={[1,2, 2, 2,2]} style={styles.head} textStyle={styles.text}/>
                                </Table>
             
                                {/*  table data */}
                                <ScrollView style={styles.dataWrapper}>
                                    <Table borderStyle={{borderWidth: 1, borderColor:'#C1C0B9'}}>
                                        <TableWrapper style={styles.wrapper}>
                                            <Col data={tableNo} style={styles.no} heightArr={[80]} textStyle={styles.text}/>
                                            <Rows data={tableData} flexArr={[2,2,2, 2]} style={styles.row} textStyle={styles.text}/>
                                        </TableWrapper>
                                    </Table>       
                                </ScrollView>
                            </View>
                        }
                    </View>
}
                </View>
                
       </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#FFFFFF'
    },
    btn : {
        width : 60,
        height : 30,
        marginVertical : 2, 
        justifyContent : 'center',
        alignItems : 'center',
        borderRadius : 5,

    },
    head: {  height: 60,  backgroundColor: '#f1f8ff'  },
    wrapper: { flexDirection: 'row',},
    no: { flex: 1, backgroundColor: '#f6f8fa' },
    row: {  height: 80  },
    text: { textAlign: 'center' },
    dataWrapper: { marginTop: -1 },
})
export default AddStaff
