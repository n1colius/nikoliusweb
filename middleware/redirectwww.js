export default function(ctx) {
    try {
        if(ctx.req.headers) {
            const ArrPartialUrl = ctx.req.headers.referer.split("//");
            const ProtocolUrl = ArrPartialUrl[0];
            const HostUrl = ArrPartialUrl[1];
            
            if (HostUrl.slice(0, 4) === 'www.') {
                let NewUrl = HostUrl.slice(4);
                ctx.redirect(301, ProtocolUrl+'//'+NewUrl);
            }
        }    
    } catch (error) {
        //error kosong aja
    }
}