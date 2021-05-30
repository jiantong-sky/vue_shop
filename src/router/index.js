import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'

Vue.use(VueRouter)

const routes = [
	{ path: '/', redirect: '/login' },
	{ path: '/login', component: Login },
	{
		path: '/home',
		component: Home,
		redirect: '/welcome',
		children: [
			{ path: '/welcome', component: Welcome },
			{ path: '/users', component: Users }
		]
	}
]

const router = new VueRouter({
	routes
});

// 注册一个全局导航守卫
router.beforeEach((to, from, next) => {
	// to: 即将要访问的路径
	// from: 当前导航正要离开的路由
	// next: 是一个函数，表示放行
	//   next(): 放行     next('/login'): 强制跳转路由
	if (to.path === '/login') return next();
	const tokenStr = window.sessionStorage.getItem('token');
	if (!tokenStr) return next('/login');
	next();
});

export default router
