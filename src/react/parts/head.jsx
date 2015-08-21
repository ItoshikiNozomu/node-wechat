var React = require('react')

var HeadTag = React.createClass({
	render:function(){
		var scripts = this.props.scripts
		
		return (
			<head>
				<meta charset="utf-8"/>
				<meta charset="utf-8"/>
				{scripts.map(function(script){
					return <script src="{script}"></script>
				})}
				
			</head>
			)
	}
})

module.exports = HeadTag