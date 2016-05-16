//////
import Firebase from 'firebase'

import React, {
    Component,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Navigator,
    WebView,
    LinkingIOS
} from 'react-native';


class LoginComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {}

        window.cordova = {}

        window.open = this._windowOpen.bind(this)
        window.close = this._windowClose.bind(this)
        _onShouldStartLoadWithRequest = this._onShouldStartLoadWithRequest.bind(this)

        this.props.fbRef.onAuth(function (_auth) {
            console.log(_auth)
        });
    }

    _windowOpen(_p1, _p2, _p3, _p4) {
                
        this.setState({ url: _p1.replace("true", "false") })
        console.log(this.state.url)
        return true
    }


    _windowClose( _url) {

        var code = _url.split("code=")[1].split("&")[0]

        console.log(_url)
        console.log("code", code)
        
        this.setState({ url: null })
        fetch("https://github.com/login/oauth/access_token?",
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "client_id": "2d2838a445a8c0681c15",
                    "client_secret": "39101055c1b37dea00f755943c860f7194fae944",
                    "code": code
                })
            })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData)

                this.props.fbRef.authWithOAuthToken("github", responseData.access_token,
                    function (error, authData) {
                        if (error) {
                            console.log("Login Failed!", error);
                        } else {
                            console.log("Authenticated successfully with payload:", authData);
                        }
                    });
            })
            .done();
    }





    /**
 * login in the user with the credentials
 */
    _doPressAction() {
        this.props.fbRef.authWithOAuthPopup("github", function (error) {
            if (error) {
                console.log("Authentication Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
            }
        });
    }

    /**
     * login in the user with the credentials
     */
    _REALdoPressAction() {
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

    onNavigationStateChange(navState) {
        this.setState({
            backButtonEnabled: navState.canGoBack,
            forwardButtonEnabled: navState.canGoForward,
            url: navState.url,
            status: navState.title,
            loading: navState.loading,
            scalesPageToFit: true
        });
    }


    _onShouldStartLoadWithRequest(_event) {

        // check if i have the code I am looking for...
        // if so then close the window
        if (_event.url.indexOf("code=") !== -1) {
            console.log("_event.url", _event.url)
            window.close(_event.url)
            return true
        }
        return true
    }

    _renderWebView() {

        return (
            <WebView
                style={{
                    height: 350,
                }}
                source={{
                    uri: this.state.url
                }}
                scalesPageToFit={false}
                javaScriptEnabled={true}
                startInLoadingState={false}
                getAuth
                onShouldStartLoadWithRequest={this._onShouldStartLoadWithRequest}
                />
        )
    }

    _renderLoginView() {
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
    render() {

        if (this.state.url) {
            return this._renderWebView()
        } else {

            return this._renderLoginView()
        }
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