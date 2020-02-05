import React, { Component } from 'react';

import ReactFitText from 'react-fittext';
import readXlsxFile from 'read-excel-file'
import html2canvas from 'html2canvas';

import './App.css';

function download(img) {
	var link = document.createElement("a");
	link.href = img;
	link.download = 'Image.png';
	link.style.display = "none";
	var evt = new MouseEvent("click", {
		"view": window,
		"bubbles": true,
		"cancelable": true
	});

	document.body.appendChild(link);
	link.dispatchEvent(evt);
	document.body.removeChild(link);
	console.log("Downloading...");
}


class App extends Component {

	constructor() {
		super();

		this.state = {
			text_data: [],
			index: 0,

			title_color: {
				color: 'red'
			},
			content_color: {
				color: 'black'
			}

		}

		this.setColor = this.setColor.bind(this);

		this.generateThisImage = this.generateThisImage.bind(this);
		this.generateImages = this.generateImages.bind(this);
	}

	componentDidMount() {
		const input = document.getElementById('input')

		input.addEventListener('change', () => {
			readXlsxFile(input.files[0]).then((rows) => {

				const data = rows.slice(1, rows.length);
				this.setState({
					text_data: data
				})
			})
		})
	}

	generateThisImage() {
		document.body.scrollTop = document.documentElement.scrollTop = 0;
		const input = document.querySelector('#imageContainer');
		html2canvas(input, {
			useCORS: true,
			allowTaint: false,
			scale: 2,
			width: input.scrollWidth,
			height: input.scrollHeight
		})
			.then((canvas) => {
				const imgData = canvas.toDataURL('image/jpeg');
				download(imgData);
			})
	}
	generateImages() {
		document.body.scrollTop = document.documentElement.scrollTop = 0;
		for (var i = 0; i < this.state.text_data.length; i++) {
			const input = document.querySelector('.class' + i);
			html2canvas(input, {
				useCORS: true,
				allowTaint: false,
				scale: 2,
				width: input.scrollWidth,
				height: input.scrollHeight
			})
				.then((canvas) => {
					const imgData = canvas.toDataURL('image/jpeg');
					download(imgData);
				})
		}
	}

	setColor() {
		const t_color = document.getElementById('title_color').value;
		const c_color = document.getElementById('content_color').value;

		this.setState({
			title_color: {
				color: t_color
			},
			content_color: {
				color: c_color
			}
		})
	}

	render() {
		const text_data = this.state.text_data;
		const index = this.state.index;

		return (
			<div className="App" >
				<div>
					<input type="file" id="input" />
					<hr />
					{
						text_data.map((e, index) => (
							<div key={index}>

								<button onClick={() => this.setState({ index: index })}> Preview This</button>

								<p style={{ color: 'red' }}>{e[0]}</p>
								<p>{e[1]}</p>
								<hr />
							</div>

						))
					}
				</div>
				<div>
					Title Color
					<input id='title_color' defaultValue={this.state.title_color.color} style={{ margin: '20px' }} />
					Content Color
					<input id='content_color' defaultValue={this.state.content_color.color} style={{ margin: '20px' }} />
					<button onClick={this.setColor} style={{ margin: '20px' }} > Change Color</button>
					<hr />
				</div>
				<button onClick={this.generateThisImage}> Download Current Image</button>
				<button onClick={this.generateImages}> Download All Images</button>

				<div style={{ position: 'fixed' }}>
					{
						text_data.map((e, index) => (
							<div id='imageContainerHidden' className={'class' + index} key={index}>
								<img src='Template.png' style={{ width: '100%' }} alt='Template' />
								{
									text_data[index] !== undefined &&
									<div className='textOverlay'>
										<div className='titleSection'>
											<ReactFitText compressor={1.5} >
												<p className='title' style={this.state.title_color}> {text_data[index][0]}</p>
											</ReactFitText>
										</div>
										<div className='contentSection'>
											<ReactFitText compressor={3}>
												<p className='content' style={this.state.content_color}> {text_data[index][1]}</p>
											</ReactFitText>
										</div>
									</div>
								}
							</div>
						))
					}
				</div>

				<h3>Image Preview</h3>
				<div className='preview'>
					<div id='imageContainer'>
						<img src='Template.png' style={{ width: '100%' }} alt='Template' />
						{
							text_data[index] !== undefined &&
							<div className='textOverlay'>
								<div className='titleSection'>
									<ReactFitText compressor={1.5} >
										<p className='title' style={this.state.title_color}> {text_data[index][0]}</p>
									</ReactFitText>
								</div>
								<div className='contentSection'>
									<ReactFitText compressor={2.8}>
										<p className='content' style={this.state.content_color}> {text_data[index][1]}</p>
									</ReactFitText>
								</div>
							</div>
						}
					</div>
				</div>

			</div >
		);
	}
}

export default App;
