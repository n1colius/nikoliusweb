export default function ({ $axios, store, $toast, redirect  }) {

    //Intercep sebelum axios lakukan request
    $axios.interceptors.request.use(request => {
        // Get token dari local storage aja
        const token = store.state.authen.UserToken;
    
        // Update token axios header
        if (token) {
            request.headers.common['Authorization'] = token;
        }
        
        return request;
    })

    $axios.onError(error => {
        if(error.response.status === 401) {
            //masalah authen
            store.dispatch("authen/SetLogout");
            if (process.client) { //Hanya ketika di akses dari client side
                $toast.show(
                    '<img src="/images/error.png" width="24" />&nbsp;&nbsp;<p>Sorry, There is a problem on your authentication</p>',
                    {
                        type: "error"
                    }
                );
            }
        }
        redirect('/error'); //biar di redirect ke halaman error
    });
};