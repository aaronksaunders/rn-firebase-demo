import Firebase from 'firebase'


import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Navigator
} from 'react-native';


class LoginComponent extends Component {

    /**
     * login in the user with the credentials
     */
    _doPressAction() {

        firebase.auth().signInWithEmailAndPassword('aaronksaunders@mail.com', 'password').catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
        });
    }

    render() {
        return (
            <View ref="loginView" style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1
            }}>
                <Text style={{ color: 'black', }}>YOU NEED TO LOGIN</Text>
                <Text style={{ color: 'black', }}>YOU NEED USERNAME</Text>
                <Text style={{ color: 'black', }}>YOU NEED PASSWORD</Text>
                <View>
                    <TouchableHighlight
                        style={LoginComponentStyles.button}
                        underlayColor='#99d9f4'
                        onPress={() => { this._doPressAction() } }>
                        <Text style={LoginComponentStyles.buttonText}>
                            LOGIN
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}


const LoginComponentStyles = StyleSheet.create({
    buttonText: {
        fontSize: 12,
        color: 'white',
        alignSelf: 'center'
    },
    button: {
        marginTop: 10,
        height: 32,
        width: 60,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 2,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    }
});

module.exports = LoginComponent;