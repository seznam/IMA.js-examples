import RouteNames from 'ima/router/RouteNames';

export let init = (ns, oc, config) => {
	let router = oc.get('$Router');

	router
		.add(RouteNames.ERROR, '/error', ns.app.page.error.Controller, ns.app.page.error.View)
		.add(RouteNames.NOT_FOUND, '/not-found', ns.app.page.notFound.Controller, ns.app.page.notFound.View)
		.add('home', '/', ns.app.page.home.Controller, ns.app.page.home.View)
		.add('category', '/:category', ns.app.page.home.Controller, ns.app.page.home.View)
		.add('post', '/:category/:itemId', ns.app.page.detail.Controller, ns.app.page.detail.View);
};
