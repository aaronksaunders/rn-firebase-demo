const React = require('react-native')
const {StyleSheet} = React

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#f2f2f2',
    },
    list_container: {
        flex: 1,
        backgroundColor: '#ff2f',
    },
    listview: {
        flex: 1,
    },
    item_title: {
        backgroundColor: '#fff',
        paddingTop: 2,
        paddingBottom: 2,
        fontSize: 18,
        color: 'green'
    },
    item_desc: {
        backgroundColor: '#fff',
        paddingTop: 2,
        paddingBottom: 2,
    },
    li: {
        backgroundColor: '#fff',
        borderBottomColor: '#eee',
        borderColor: 'transparent',
        borderWidth: 1,
        paddingLeft: 16,
        paddingTop: 2,
        paddingBottom: 2,
    },
    liContainer: {
        flex: 1,
    },
});
module.exports = styles;