export const state = () => ({
	IsLogin: false,
	UserToken: null,
	UserId: null,
	UserEmail: null,
	UserFullname: null
});

export const mutations = {
	SET_ISLOGIN(state, payload) {
		state.IsLogin = payload.IsLogin;
		state.UserToken = payload.UserToken;
	},
	SET_USERLOGIN(state, payload) {
		state.UserId = payload.UserId;
		state.UserEmail = payload.UserEmail;
		state.UserFullname = payload.UserFullname;
	}
};

export const actions = {
	SetLogin({ commit, dispatch, state }, payload) {
		const ParUserIsLogin = {
			IsLogin: true,
			UserToken: payload.UserToken
		};
		const ParUserLogin = {
			UserId: payload.UserId,
			UserEmail: payload.UserEmail,
			UserFullname: payload.UserFullname
		};

		commit("SET_ISLOGIN", ParUserIsLogin);
		commit("SET_USERLOGIN", ParUserLogin);
	},
	SetLogout({ commit, dispatch, state }) {
		const ParUserIsLogin = {
			IsLogin: false,
			UserToken: null
		};
		const ParUserLogin = {
			UserId: null,
			UserEmail: null,
			UserFullname: null
		};
		commit("SET_ISLOGIN", ParUserIsLogin);
		commit("SET_USERLOGIN", ParUserLogin);
	}
};  