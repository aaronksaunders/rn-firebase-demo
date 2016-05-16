React Native Firebase GitHub Hack
-
######This is a hack, I know it is a hack, but I was just curious if it could be done. If anyone know where the non-minified code is for the library, I believe I can help with getting this to work properly. I believe the same model that is used to integrate AngularFire with cordova inappbrowser can be used here also.
-
So what I have done is use the `WebView` to go through the OAuth process since I was unable to get the AngularFire library to handle it themselves.

So we use Firebase to get the process started.
```Javascript
/**
* login in the user with the credentials, gets the whole process 
* started, [NOTE] probably can just construct the url myself?
*/
_doGitHubLogin() {
    this.props.fbRef.authWithOAuthRedirect("github", function (error) {
        if (error) {
            console.log("Authentication Failed!", error);
        } else {
            console.log("Authenticated successfully with payload:", authData);
        }
    });
}
```
The firebase library is looking for the browser `window` object to redirect to. We have added a object and are waiting for a redirect to come back from the Firebase Library
```javascript
// in constructor - Fake that I have a browser window..
window.location = {
    href: null
}
```
In `componentDidMount` I hacked together a process to listen for the url being set which then launches the `WebView` component
```Javascript
    componentDidMount() {

        // set this interval to check for me trying to redirect the window...
        var that = this
        that.inter = setInterval(function () {
            if (window.location && window.location.split) {

                // set the redirect on the url..
                var newLocation = window.location.split("redirectTo=null")[0]
                newLocation = newLocation + "redirectTo=https://auth.firebase.com/v2/clearlyinnovative-firebasestarterapp/auth/github/callback"

                // open the browser...
                that.setState({ url: newLocation })

                // clear the interval to stop waiting for the location to be set..
                clearInterval(that.inter)
            }
        }, 3000);


        this.props.fbRef.onAuth((_auth) => {
            console.log(_auth)
            this.setState({ auth: _auth })
        });
    }
```
The webview component
```Javascript
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
            onShouldStartLoadWithRequest={this._onShouldStartLoadWithRequest.bind(this) }
            />
    )
}
```

does its magic but we listen for the process to return us the `code` we need for next step in OAuth

```Javascript
_onShouldStartLoadWithRequest(_event) {

    // check if i have the code I am looking for...
    // if so then close the window
    if (_event.url.indexOf("code=") !== -1) {
        console.log("_event.url", _event.url)
        this._processTokenOrCode(_event.url)
        return true
    }
    return true
}
```
Now that we have a code, we need to get the `access_token` from github and pass it back to firebase calling the `authWithOAuthToken` function which if successful will return the auth data.
```Javascript
_processTokenOrCode(_url) {

    var code = _url.split("code=")[1].split("&")[0]

    console.log(_url)

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

            // login to Firebase using the credential returned from GitHub
            this.props.fbRef.authWithOAuthToken("github", responseData.access_token,
                function (error, authData) {
                    if (error) {
                        console.log("Login Failed!", error);
                    } else {
                        console.log("Authenticated successfully with payload:", authData);
                    }
                });
        })
        // when don clear the url so the component can render the proper
        // login state UI
        .done(() => { this.setState({ url: null }) });
}
```
