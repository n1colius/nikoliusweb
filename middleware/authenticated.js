export default function (context) {
    //console.log('context.store.state :>> ', context.store.state);
    
    if(process.server === true) { //Jika SERVER SIDE!!!!!!!!!!!!!!!
        //Cara cepatnya langsung redirect ke index aja untuk security
        context.redirect('/');

        /*console.log('server side called :>> ', 'server side called');
        return context.$axios.get("authen/check_session_ssr")
            .then((res) => {
                console.log('res sukses :>> ', res);
            })
            .catch(function (error) {
                console.log('error :>> ', error);
                //context.redirect('/error');
            });*/
    } else { //Jika CLIENT SIDE!
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
}