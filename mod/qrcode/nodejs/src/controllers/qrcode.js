var QRCode = require('qrcode');

QRCode.toDataURL('i am a pony!',function(err,url){
    console.log(url);
});
