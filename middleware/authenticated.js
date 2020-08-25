export default function (context) {
    //Cek ada token atau tidak
    if(!context.store.state.authen.UserToken) {
        context.redirect('/error');
    } else {
        //Refresh Token
        context.$axios.get("authen/refresh")
            .then((res) => {
                const payload = {
                    UserToken: res.data.DataReturn.Token,
                    UserId: res.data.DataReturn.UserId,
                    UserEmail: res.data.DataReturn.UserEmail,
                    UserFullname: res.data.DataReturn.UserFullname
                };
                context.store.dispatch("authen/SetLogin", payload);
            })
            .catch(function (error) {
                context.redirect('/error');
            });
    }
}