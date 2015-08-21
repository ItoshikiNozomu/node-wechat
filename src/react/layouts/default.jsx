var React = require('react');

var layout = React.createClass({
  render: function() {
    
    
    return (
      <html>
        <head>
        {this.props.scripts.map(function(script){
          return <script src={script}></script>
        })}
        <title>{this.props.title}</title></head>
        <body>{this.props.children}</body>
      </html>
    );
  }
});

module.exports = layout;