import React, { useState, useCallback } from 'react';
import { 
  View, 
  SafeAreaView, 
  StyleSheet,
  TouchableOpacity,
  TextInput
} from 'react-native';
import MonthPicker from 'react-native-month-year-picker';
const datemonth = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const showPicker = useCallback((value) => setShow(value), []);

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;

      showPicker(false);
      setDate(selectedDate);
    },
    [date, showPicker],
  );

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => showPicker(true)}>
        <View style={styles.month}>
          <TextInput placeholder="<--Pilih Bulan dan Tahun-->" editable = {false}/>
        </View>
      </TouchableOpacity>
      {show && (
        <MonthPicker
          onChange={onValueChange}
          value={date}
          minimumDate={new Date(2020,12)}
          maximumDate={new Date(2025,12)}
          locale="en"
        />
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  month:{
    backgroundColor:'#ffffff',
    borderRadius:5,
    borderWidth:1,
    borderColor: '#087CDB' ,
    height:50,
    width:200,
    alignItems:'center'
  }
})
export default datemonth;