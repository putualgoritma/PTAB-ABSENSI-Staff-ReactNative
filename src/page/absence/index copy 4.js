import {captureScreen} from 'react-native-view-shot';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      imageURI:
        'https://raw.githubusercontent.com/AboutReact/sampleresource/master/sample_img.png',
      savedImagePath: 'uri',
    };
  }
  takeScreenShot = () => {
    captureScreen({
      format: 'jpg',
      quality: 0.8,
    }).then(
      (uri) => {
        this.setState({
          imageURI: uri,
          savedImagePath: uri,
        });
      },
      (error) => console.error('Oops, Something Went Wrong', error),
    );
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <Text style={styles.titleText}>React Native Take Screenshot</Text>
          <Image
            source={{uri: this.state.imageURI}}
            style={{
              width: 200,
              height: 300,
              resizeMode: 'contain',
              marginTop: 5,
              borderWidth: 1,
              borderColor: 'red',
              marginBottom: 5,
              borderRadius: 3,
            }}
          />
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={this.takeScreenShot}>
            <Text style={styles.buttonTextStyle}>Get Screenshot</Text>
          </TouchableOpacity>
          <Text style={styles.textStyle}>Your Screenshot url is</Text>

          <Text style={styles.textLinkStyle}>
            {this.state.savedImagePath
              ? ` \n ${this.state.savedImagePath}`
              : ''}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textStyle: {
    textAlign: 'center',
    padding: 10,
  },
  textLinkStyle: {
    textAlign: 'center',
    padding: 10,
    color: 'blue',
  },
  buttonStyle: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'green',
    padding: 5,
    minWidth: 250,
  },
  buttonTextStyle: {
    padding: 5,
    color: 'white',
    textAlign: 'center',
  },
});