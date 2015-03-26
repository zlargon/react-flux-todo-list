// 這是 root view，也稱為 controller-view

var Header = require('./Header.jsx');
var Footer = require('./Footer.jsx');
var InputBox = require('./InputBox.jsx');
var ListContainer = require('./ListContainer.jsx');

//
var MainApp = React.createClass({

    //
    componentWillMount: function() {
    },

    //
    componentDidMount: function() {
    },

    // 元件將從畫面上移除時，要做善後工作
    componentWillUnmount: function() {
        TodoStore.removeChangeListener( this._onChange );
    },

    componentDidUnmount: function() {
    },

    // 在 render() 前執行，有機會可先處理 props 後用 setState() 存起來
    componentWillReceiveProps: function(nextProps) {
        //
    },

    //
    shouldComponentUpdate: function(nextProps, nextState) {
    },

    // 這時已不可用 setState()
    componentWillUpdate: function(nextProps, nextState) {
    },

    //
    componentDidUpdate: function(prevProps, prevState) {
    },

    //
    render: function() {

        return (

            <div className="wrapper">

                <Header />

                <div className="main-box">
                    <InputBox />
                    <ListContainer />
                </div>

                <Footer />
            </div>
        )
    },


});

module.exports = MainApp;
