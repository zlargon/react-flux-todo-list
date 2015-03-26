var actions = require('../actions/AppActionCreator');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var Footer = React.createClass({

	mixins: [PureRenderMixin],

  render: function() {

  	return (
      <footer className="footer">
        <span className="licensing">
            All rights reserved, fullstackrocks.com 2015
        </span>
      </footer>
    );
  },


});

module.exports = Footer;
