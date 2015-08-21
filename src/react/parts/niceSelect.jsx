var React = require('react')

var niceSelect = React.createClass({
	render:function(){
		var a = 'aaa'
		return (
		<div>
		<h4>nice select</h4>
		<select className="aaa"
			onChange={this.handleChange}
		>
			{this.props.options.map(function(option){
				return <option value={option.value}>{option.displayName}</option>
			})}
		</select>
		</div>
		)
	},
	handleChange:function(evt){
		alert(evt.target.value)
	}
})

module.exports = niceSelect