export default function(ctx) {
    try {
        if(ctx.req.headers) {
            
            let ArrPartialUrl = ctx.req.headers.referer.split("//");
            let ProtocolUrl = ArrPartialUrl[0];
            let HostUrl = ArrPartialUrl[1];

            if (HostUrl.slice(0, 4) === 'www.') {
                let NewUrl = HostUrl.slice(4);
                ctx.redirect(301, ProtocolUrl+'//'+NewUrl);
            }
        }    
    } catch (error) {
        //error kosong aja
    }
}