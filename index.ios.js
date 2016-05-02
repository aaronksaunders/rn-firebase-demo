/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';

import Firebase from 'firebase'
import ListComponent from './components/ListComponent'
import LoginComponent from './components/LoginComponent'

import React, {
  AppRegistry,
  Component,
  Text,
  View,
  TouchableHighlight,
  Navigator,
  StyleSheet
} from 'react-native';


const FirebaseUrl = 'https://clearlyinnovative-firebasestarterapp.firebaseio.com/';

class firebaseReactApp extends Component {

  constructor(props) {
    super(props);
    this.itemsRef = this.getRef().child('textItems');
    this.state = {
      loggedIn: false,
      itemsRef: this.itemsRef,
      items: []
    };
  }

  /**
   * 
   */
  getRef() {
    return new Firebase(FirebaseUrl);
  }
  /**
   * 
   */
  handleLogout() {

    // logout of firebase
    this.getRef().unauth();

    // set the state appropriately
    this.setState({
      loggedIn: false,
      items: []
    });
  }
  /**
   * 
   */
  listenForItems(itemsRef) {

    this.setState({ 'loggedIn': true })

    this.itemsRef.on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        items.push({
          title: child.val().title,
          timestamp: child.val().timestamp,
          description: child.val().description,
          _key: child.key()
        });
      });

      this.setState({
        items: items
      });

    });
  }

  /**
   * 
   */
  componentDidMount() {
    var that = this
    // Register the callback to be fired every time auth state changes
    this.getRef().onAuth(function authDataCallback(authData) {
      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
      } else {
        console.log("User is logged out");
      }
    });
  }


  render() {
    if (this.state.loggedIn === false) {
      return (
        <Navigator
          style={{
            flex: 1
          }}
          initialRoute={{
            title: 'LoginComponent',
            component: LoginComponent,
          }}
          configureScene = {() => {
            return Navigator.SceneConfigs.FloatFromRight;
          } }
          renderScene = {(route, navigator) => {
            return <route.component route={route}
              navigator={navigator}
              fbRef={ this.getRef() }
              loginSuccess={() => {
                this.listenForItems(this.getRef())
              } }/>;
          } }
          />
      )
    } else {
      return (
        <View style={{ backgroundColor: '#F5FCFF', flex: 1 }}>
          <ListComponent
            ref="listComponent"
            items={this.state.items}
            itemsRef={this.state.itemsRef}
            logoutAction = {() => { this.handleLogout() } }>
          </ListComponent>
        </View>
      )
    }
  }
}

AppRegistry.registerComponent('firebaseReactApp', () => firebaseReactApp);
