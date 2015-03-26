//
var actions = require('../actions/AppActionCreator');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

//
var Header = React.createClass({

	mixins: [PureRenderMixin],

  //
  render: function() {


    return (

      <header className="header">

        <p className="logo">Sample App</p>

        <input className="search-box right"
               type="text"
               placeholder="Entery keyword"
               onChange={this.handleChange} />

      </header>
    );

  },

  //
  handleChange: function(evt){
      var val = evt.target.value.trim();
      actions.doSearch(val);
  },

  //
  noop: function(){
  }

});

module.exports = Header;
