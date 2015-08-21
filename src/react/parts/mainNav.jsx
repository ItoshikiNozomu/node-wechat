var React = require('react');
var mainNav =React.createClass({
	render:function(){
		return (
			<ul>{
			this.props.links.map(function(linkObj){
				return <li><a href={linkObj.href}>{linkObj.name}</a></li>
			})
			}</ul>
		)
	}
})
module.exports=mainNav