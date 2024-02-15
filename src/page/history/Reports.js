import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import API from '../../service';
import Loading from '../../Components/Loading';

const Reports = ({navigation, route}) => {
  const TOKEN = useSelector(state => state.TokenReducer);
  const type = route.params.type;
  const USER = useSelector(state => state.UserReducer);
  const [data, setData] = useState();
  const [date, setDate] = useState(
    route.params.start ? route.params.start : '0000-00-00',
  );
  const [loading, setLoading] = useState(true);
  const [date2, setDate2] = useState(
    route.params.end ? route.params.end : '0000-00-00',
  );

  const getData = () => {
    setLoading(true);
    API.report(
      USER.staff_id,
      type,
      date == '0000-00-00' ? '' : date,
      date2 == '0000-00-00' ? '' : date2,
      TOKEN,
    ).then(result => {
      if (result) {
        setData(result);
        setLoading(false);
      } else {
        // alert(result.message);
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View>
      {!loading ? (
        <View style={styles.hero}>
          <Text style={styles.title}>
            Report Absen {date} - {date2}
          </Text>
          <Text></Text>
          <View style={styles.header}>
            <Text style={[styles.th, {width: windowWidth * 0.08}]}> No</Text>
            <Text style={[styles.th, {width: windowWidth * 0.6}]}>
              {' '}
              Kategori
            </Text>
            <Text style={[styles.th, {width: windowWidth * 0.2}]}> Jumlah</Text>
          </View>

          <View style={styles.header}>
            <Text style={[styles.tr, {width: windowWidth * 0.08}]}> 1</Text>
            <Text style={[styles.tr, {width: windowWidth * 0.6}]}> Masuk</Text>
            <Text style={[styles.tr, {width: windowWidth * 0.2}]}>
              {' ' + data.jumlah_masuk}
            </Text>
          </View>
          <View style={styles.header}>
            <Text style={[styles.tr, {width: windowWidth * 0.08}]}> 2</Text>
            <Text style={[styles.tr, {width: windowWidth * 0.6}]}>
              {type == 'shift' ? ' Kontrol 1' : ' Kegiatan 1'}
            </Text>
            <Text style={[styles.tr, {width: windowWidth * 0.2}]}>
              {' ' + data.jumlah_k1}
            </Text>
          </View>
          <View style={styles.header}>
            <Text style={[styles.tr, {width: windowWidth * 0.08}]}> 3</Text>
            <Text style={[styles.tr, {width: windowWidth * 0.6}]}>
              {type == 'shift' ? ' Kontrol 2' : ' Kegiatan 2'}
            </Text>
            <Text style={[styles.tr, {width: windowWidth * 0.2}]}>
              {' ' + data.jumlah_k2}
            </Text>
          </View>
          <View style={styles.header}>
            <Text style={[styles.tr, {width: windowWidth * 0.08}]}> 4</Text>
            <Text style={[styles.tr, {width: windowWidth * 0.6}]}>
              {' Dinas Dalam'}
            </Text>
            <Text style={[styles.tr, {width: windowWidth * 0.2}]}>
              {' ' + data.jumlah_dinasDalam}
            </Text>
          </View>
          <View style={styles.header}>
            <Text style={[styles.tr, {width: windowWidth * 0.08}]}> 5</Text>
            <Text style={[styles.tr, {width: windowWidth * 0.6}]}>
              {' Dinas Luar'}
            </Text>
            <Text style={[styles.tr, {width: windowWidth * 0.2}]}>
              {' ' + data.jumlah_dinasLuar}
            </Text>
          </View>
          <View style={styles.header}>
            <Text style={[styles.tr, {width: windowWidth * 0.08}]}> 6</Text>
            <Text style={[styles.tr, {width: windowWidth * 0.6}]}> Cuti</Text>
            <Text style={[styles.tr, {width: windowWidth * 0.2}]}>
              {' ' + data.jumlah_cuti}
            </Text>
          </View>
          <View style={styles.header}>
            <Text style={[styles.tr, {width: windowWidth * 0.08}]}> 7</Text>
            <Text style={[styles.tr, {width: windowWidth * 0.6}]}> Lembur</Text>
            <Text style={[styles.tr, {width: windowWidth * 0.2}]}>
              {' ' + data.jumlah_lembur}
            </Text>
          </View>
          <View style={styles.header}>
            <Text style={[styles.tr, {width: windowWidth * 0.08}]}> 8</Text>
            <Text style={[styles.tr, {width: windowWidth * 0.6}]}>
              {' '}
              Permisi
            </Text>
            <Text style={[styles.tr, {width: windowWidth * 0.2}]}>
              {' ' + data.jumlah_permisi}
            </Text>
          </View>

          <View style={styles.header}>
            <Text style={[styles.tr, {width: windowWidth * 0.08}]}> 9</Text>
            <Text style={[styles.tr, {width: windowWidth * 0.6}]}> Izin</Text>
            <Text style={[styles.tr, {width: windowWidth * 0.2}]}>
              {' ' + data.jumlah_izin}
            </Text>
          </View>
          <View style={styles.header}>
            <Text style={[styles.tr, {width: windowWidth * 0.08}]}> 9</Text>
            <Text style={[styles.tr, {width: windowWidth * 0.6}]}> Sakit</Text>
            <Text style={[styles.tr, {width: windowWidth * 0.2}]}>
              {' ' + data.jumlah_sakit}
            </Text>
          </View>
          <View style={styles.header}>
            <Text style={[styles.tr, {width: windowWidth * 0.08}]}> 11</Text>
            <Text style={[styles.tr, {width: windowWidth * 0.6}]}> Dispen</Text>
            <Text style={[styles.tr, {width: windowWidth * 0.2}]}>
              {' ' + data.jumlah_dispen}
            </Text>
          </View>
          <View style={styles.header}>
            <Text style={[styles.tr, {width: windowWidth * 0.08}]}> 12</Text>
            <Text style={[styles.tr, {width: windowWidth * 0.6}]}>
              {' '}
              {data.tidakHadir}
            </Text>
            <Text style={[styles.tr, {width: windowWidth * 0.2}]}>
              {' ' + data.alpha}
            </Text>
          </View>
          <View style={styles.header}>
            <Text style={[styles.tr, {width: windowWidth * 0.08}]}> 13</Text>
            <Text style={[styles.tr, {width: windowWidth * 0.6}]}>
              {' '}
              Hari Kerja
            </Text>
            <Text style={[styles.tr, {width: windowWidth * 0.2}]}>
              {' ' + data.jumlah_kerja}
            </Text>
          </View>
          <View style={styles.header}>
            <Text style={[styles.tr, {width: windowWidth * 0.08}]}> 13</Text>
            <Text style={[styles.tr, {width: windowWidth * 0.6}]}> Libur</Text>
            <Text style={[styles.tr, {width: windowWidth * 0.2}]}>
              {' ' + data.jumlah_libur}
            </Text>
          </View>
        </View>
      ) : (
        <Loading />
      )}
    </View>
  );
};

export default Reports;

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  hero: {
    margin: windowWidth * 0.04,
    padding: windowWidth * 0.02,
    backgroundColor: '#FFFFFF',
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
  },
  th: {
    // width: windowWidth * 0.2933333333333333,
    borderWidth: 1,
    fontWeight: 'bold',
  },
  tr: {
    // width: windowWidth * 0.2933333333333333,
    borderWidth: 1,
    color: '#000000',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
});
