import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
function saveSolarTerms (data: object) {
	return request({
		url: '/api/solarTerms/',
		method: 'post',
		data,
	});
}

function getSolarTerms (name: string) {
	return request({
		url: `/api/solarTerms/${name}`,
		method: 'get',
	});
}

function deleteSolarTerms (id: string) {
	return request({
		url: `/api/solarTerms/${id}`,
		method: 'delete',
	});
}

export default {
	saveSolarTerms,
	getSolarTerms,
	deleteSolarTerms
};
