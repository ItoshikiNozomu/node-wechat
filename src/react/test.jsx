var React = require('react')
var HelloMessage = React.createClass({
  render: function() {
    return (
        
        <div><span>hei you! {this.props.name}</span></div>
     
    );
  }
});

module.exports = HelloMessage;