import Firebase from 'firebase'

import React, {
    Component,
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
        console.log("in do press action")

        var that = this

        this.props.fbRef.authWithPassword({
            email: 'd@mail.com',
            password: 'password'
        }, function authHandler(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {

                // check to see if user exists, here is 
                // where you will add user to firebase
                var usersRef = that.props.fbRef.child('users/' + authData.uid)
                usersRef.once('value', function (snapshot) {
                    if (snapshot.hasChild("displayName")) {
                        console.log("user exists...")
                    } else {
                        console.log("user does not exists... ")
                    }

                    // call function passed in to let the parent know 
                    // we have successfully logged in so start listening 
                    // for  data
                    that.props.loginSuccess();
                }, function (_error) {
                    console.log("user does not exists... " + _error.message)
                    that.props.loginSuccess();
                });


            }
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