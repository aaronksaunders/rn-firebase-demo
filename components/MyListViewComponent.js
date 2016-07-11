'use strict';

import Firebase from 'firebase'

import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    ListView,
    View,
    TouchableOpacity,
    Navigator
} from 'react-native';
import styles from '../styles';



class ListDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemData: props.route.passProps
        }
    }
    render() {
        const leftButtonConfig = {
            title: 'Back',
            handler: () => {
                this.props.navigator.pop();
            },
        };
        const titleConfig = {
            title: 'List Detail Page',
        };
        return (
            <View style={styles.tabContent}>
                <NavigationBar
                    title={titleConfig}
                    leftButton={leftButtonConfig} />
                <Text style={styles.welcome}>
                    {JSON.stringify(this.state.itemData, null, 2) }
                </Text>
            </View>
        )
    }
}



class MyListViewComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            navigator: props.navigator
        }
    }

    componentWillReceiveProps(nextProps, curProps) {
        if (nextProps.items) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(nextProps.items)
            });
        }
    }

    _onClickRow(_item) {
        console.log("row clicked", _item)

        this.state.navigator.push({
            name: 'ListDetailPage',
            component: ListDetailPage,
            passProps: _item
        });
    }

    _renderListItems(_item) {
        return (
            <TouchableOpacity onPress={() => this._onClickRow(_item) } >
                <View style={styles.li}>
                    <Text style={styles.item_title}>{_item.title}</Text>
                    <Text style={styles.item_desc}>{_item.description}</Text>
                    <Text style={styles.item_time}>{_item.timestamp}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {

        const rightButtonConfig = {
            title: 'Back',
            handler: () => {
                this.props.logoutAction();
            },
        }
        const titleConfig = {
            title: 'Main List Page',
        }

        return (
            <View style={styles.list_container}  >
                <NavigationBar
                    title={titleConfig}
                    rightButton={rightButtonConfig} />
                <ListView
                    ref="listViewComponent"
                    dataSource={this.state.dataSource}
                    renderRow={(d) => this._renderListItems(d) }
                    enableEmptySections={true}
                    />
            </View>
        )
    }
}

module.exports = MyListViewComponent;