/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity
} from 'react-native';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

export default class App extends Component {

  componentWillMount(){
    GoogleSignin.configure({
      iosClientId: '723363103557-cndlbhsoj61qh4n77h20fiah07d6gcm9.apps.googleusercontent.com',
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <TouchableOpacity onPress={()=>{
          this._fbAuth();
        }}>
          <Text style={{backgroundColor:'blue', padding:5, color:'white', fontWeight:'bold'}}>LOGIN FACEBOOK</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{
            this.handleSigninGoogle();
        }}>
          <Text style={{backgroundColor:'blue', padding:5, color:'white', fontWeight:'bold', marginTop:10}}>LOGIN GOOGLE</Text>
        </TouchableOpacity>
      </View>
    );
  }

  //LOGIN GOOGLE
    handleSigninGoogle(){
      GoogleSignin.signIn().then((user)=>{
         alert('USER: ' + JSON.stringify(user)); 
      }).catch((error)=>{
         alert('ERROR: ' + error);
      }).done();
    }

  //FUNCTION LOGIN FACEBOOK
  _fbAuth() {
    var that = this;
    LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(function (result){
      if(result.isCancelled){
        console.log("Login Cancelled");
      } else {
        console.log("Login AccessToken");
        AccessToken.getCurrentAccessToken().then(
          (data) => {
            let accessToken = data.accessToken;
            // alert(accessToken)
            const responseInfoCallback = (error, result) => {
              setTimeout(()=> {
                if(error){
                  alert("Error: " + error.toString());
                }else {
                    if(result.name !== undefined){
                      alert(JSON.stringify(result))
                    }else if(result.email == undefined){
                      alert("Error: Email address is required.");
                    } else {
                      alert("Error: " + result.email);
                    }
                }
              },200);
            }

            const infoRequest = new GraphRequest(
              '/me',
              {
                accessToken: accessToken,
                parameters:{
                  fields: {
                    string: 'email,name,first_name,middle_name,last_name'
                  }
                }
              },
              responseInfoCallback
            );

            //Start the graph request
            new GraphRequestManager().addRequest(infoRequest).start();

          })
      }
    }, function (error) {
      console.log("some error occurred!", error);
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
