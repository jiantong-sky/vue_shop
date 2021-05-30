import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
// 导入全局css样式文件
import './assets/css/global.css'

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 设置axios请求拦截器
axios.interceptors.request.use(config => {
	// console.log(config);
	config.headers.Authorization = sessionStorage.getItem('token');
	return config
});
// 向所有组件暴露 axios
Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')
