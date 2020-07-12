import React from 'react'
import { StyleSheet, View, BackHandler, PixelRatio, } from 'react-native'
import { StackNavigator } from 'react-navigation'
import YouTube from 'react-native-youtube'

import { Images, Metrics, Fonts, Colors } from "../../themes";
const MyApiKey = "AIzaSyD01aiO53L3PL-88hqIfFvzYzwASk7Yjxo"
export default class YouTubeVideo extends React.Component{
    static navigationOptions = {
        headerTitle: 'YouTube',
        headerStyle: {
            backgroundColor: '#000'
        }, 
        headerTitleStyle: {
            color: '#fff'
        }
    }

    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
        };
    }

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    

    handleBackButtonClick = () => {
        this.props.navigation.navigate("ViewSong");
        return true;
    };

    render() {
        return (
          <View style={styles.container}>
                <YouTube
                    videoId={this.props.navigation.state.params.youtubeId}   
                    play={true}
                    fullscreen={true}
                    loop={false}
                    apiKey={MyApiKey}
                    onReady={e => this.setState({ isReady: true })}
                    onChangeState={e => this.setState({ status: e.state })}
                    onChangeQuality={e => this.setState({ quality: e.quality })}
                    onError={e => this.setState({ error: e.error })}
                    // style={{ alignSelf: 'stretch', height: 300 }}
                    style={{ alignSelf: 'stretch', height:  Metrics.WIDTH * (9 / 16) }}
                />
          </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    }
})

