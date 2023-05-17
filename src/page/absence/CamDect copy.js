'use strict';
import React, { PureComponent } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

class CamDect extends PureComponent {
  state = {
    fd: true,
    isFaceDetected: false,
    btnAble: true,
    test: "Off"
  }

  componentDidMount() {
    // console.log(this.props.route.params.lat)
    setInterval(() => {
      this.setState({
        btnAble: true,
        test: "Off"
      })
    }, 1000)
  }

  

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          faceDetectionClassifications={RNCamera.Constants.FaceDetection.Classifications.all}
          faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
          onFacesDetected={face => {
            
            if (this.state.fd) {
              // this.setState({ fd: face.faces.length === 0, btnAble: false, test: "uuuu" });
              // this.setState({ test: "gggg" })
              this.setState({btnAble: false, test: "On"})
              // alert(JSON.stringify(face));
              
            }

          
          }}
          // onFaceDetectionError={

          //   // this.setState({ test: "kkkk" })
          //   alert("test2")

          // }
        // onGoogleVisionBarcodesDetected={({ barcodes }) => {
        //   console.log(barcodes);
        // }}
        />
        <Text style={{ backgroundColor: 'red' }}>Arahkan Kamera Ke Wajah{this.state.test}</Text>
        {/* {this.state.test == "On" && */}
 <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
 {/* <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture} disabled={this.state.btnAble}> */}
 <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
   <Text style={{ fontSize: 14 }}> Take</Text>
 </TouchableOpacity>
</View>
        {/* // } */}
             {/* {this.state.test == "Off" &&
 <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
 <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture} disabled={this.state.btnAble}>
   <Text style={{ fontSize: 14 }}> Arahkan Ke Wajah </Text>
 </TouchableOpacity>
</View>
        } */}
       
      </View>
    );
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      // this.props.navigation.navigate('Absence',{ lat : this.props.route.params.lat, lng : this.props.route.params.lng, radius: this.props.route.params.radius, id : this.props.route.params.id, queue : this.props.route.params.queue,  absence_id : this.props.route.params.absence_id, type : this.props.route.params.type, image : data })
      console.log('tesss',data);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default CamDect