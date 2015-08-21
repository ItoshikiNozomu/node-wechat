var React = require('react')
var Layout = require('./layouts/default')
var AppNav = require('./parts/mainNav')
var NiceSelect = require('./parts/niceSelect')
var app = React.createClass({
	render:function(){
		return (
			<Layout 
			title={this.props.title} 
			scripts={this.props.scripts}
			styleSheets={this.props.styleSheets} 
			>
				<AppNav 
					links={this.props.mainNavLinks}
				/>
				<NiceSelect options={this.props.options}/>
				
			</Layout>
		)
	}
})
module.exports=app