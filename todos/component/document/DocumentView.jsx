import React from 'react';
import AbstractDocumentView from 'ima/page/AbstractDocumentView';

export default class DocumentView extends AbstractDocumentView {

	static get masterElementId() {
		return 'page';
	}

	render() {
		let appCssFile = this.utils.$Settings.$Env !== 'dev' ? 'app.bundle.min.css' : 'app.css';
		appCssFile += `?version=${this.utils.$Settings.$Version}`;
		let jsBaseUrl = this.utils.$Router.getBaseUrl() + this.utils.$Settings.$Static.js;

		return (
			<html lang={'en'} data-framework="imajs">
				<head>
					<meta charSet="utf-8"/>
					<meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
					<meta name="viewport" content="width=device-width, initial-scale=1"/>
					<link rel="stylesheet" href={this.utils.$Router.getBaseUrl() + this.utils.$Settings.$Static.css + '/' + appCssFile}/>
					<title>
						{this.props.metaManager.getTitle()}
					</title>
					<script src={jsBaseUrl + '/todomvc-common-base.js'}/>
				</head>
				<body>
					<div id="page" dangerouslySetInnerHTML={{__html: this.props.page}}/>
					<script id="revivalSettings" dangerouslySetInnerHTML={{ __html: this.props.revivalSettings }}/>
					<script>
						{`if (!window.fetch) {
							document.write('<script src="${jsBaseUrl}/fetch-polyfill.js"></' + 'script>')
						}`}
					</script>
					{this.utils.$Settings.$Env === 'dev' ?
						<div id="scripts">{this.getSyncScripts()}</div>
					:
						<div id="scripts" dangerouslySetInnerHTML={{ __html: this.getAsyncScripts() }}/>
					}
				</body>
			</html>
		);
	}

	getSyncScripts() {
		return this.utils.$Settings.$Page.$Render.scripts
				.map((script, index) => {
					return <script src={script} key={'script' + index}/>;
				})
				.concat([
					<script key={'scriptRunner'}>{'$IMA.Runner.run();'}</script>
				]);
	}

	getAsyncScripts() {
		let scriptResources = `<script>
			$IMA.Runner = $IMA.Runner || {};
		 	$IMA.Runner.scripts = [
				${this.utils.$Settings.$Page.$Render.scripts
					.map((script) => `"${script}"`)
					.join()
				}
			];
		</script>`;

		let scriptTags = this.utils.$Settings.$Page.$Render.scripts.map((script) => {
			return `<script src="${script}" async onload="$IMA.Runner.load(this)"></script>`;
		});

		return [scriptResources].concat(scriptTags).join('');
	}
}
