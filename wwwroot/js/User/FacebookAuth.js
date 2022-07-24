 window.fbAsyncInit = function () {
            //FB JavaScript SDK configuration and setup
            FB.init({
                appId: '761940751462794',  //'514445962697354', // FB App ID commented by usman nazir 29-07-2020
                status: true, // check login status
                cookie: false, // enable cookies to allow the server to access the session
                xfbml: true,  // parse XFBML
                version: 'v5.0' // use graph api version 2.8
            });
        };
        // Load the SDK asynchronously
        (function (d) {
            var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement('script'); js.id = id; js.async = true;
            js.src = "//connect.facebook.net/en_US/all.js";
            ref.parentNode.insertBefore(js, ref);
    }(document));
tBefore(js, ref);
//}(document));
