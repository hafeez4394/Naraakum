/////********Google account registration************///////////

NK.SocialAccount = {
    userName: "",
    userEmail: "",
    userImage: "",
    userId: "",
    googleUser: {},
    resources: {},
    googleStartApp: function () {
        gapi.load('auth2', function () {
            auth2 = gapi.auth2.init({
               // 910644427880-6c65u68f14md2bda9lafg1idn5e5lej9.apps.googleusercontent.com
                client_id: '910644427880-6c65u68f14md2bda9lafg1idn5e5lej9.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
            });
            NK.SocialAccount.googleAttachSignin(document.getElementById('customBtn'));
        });
    },
    googleAttachSignin: function (element) {
        auth2.attachClickHandler(element, {},
            function (googleUser) {
                debugger;
                userName = googleUser.getBasicProfile().getName();
                userEmail = googleUser.getBasicProfile().getEmail();
                userImage = googleUser.getBasicProfile().getImageUrl();
                userId = googleUser.getBasicProfile().getId();
                NK.SocialAccount.registerPatient();
                
                const encrypt = (salt, text) => {
                const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
                const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
                const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
  
    return text
      .split("")
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join("");
  };
                //alert(userId);
            }, function (error) {
                //alert(JSON.stringify(error, undefined, 2));
            });
    },
    registerPatient: function () {
        debugger;
        var url = "/patients/RegisterPatientbySocialmedia";

        var data = {
            "Username": userName,
            "FullName": userName,
            "CellNumber": "121q21212",
            "Email": userEmail,
            "RegistrationPlatformId": 1,
            "RegistrationTypeId": 2,
            "DeviceId": "Web",
            "CatSocialServerId": 1,
            "UniqueSocialId": userId,
            "CatUserTypeId": 1,
            "CatNationalityId": 1
        }
        //var data = {
        //    "Username": userName,
        //    "FullName": userName,
        //    "CellNumber": "",
        //    "Email": userEmail,
        //    "RegistrationPlatformId": 1,
        //    "RegistrationTypeId": 2,
        //    "CatSocialServerId": 1,
        //    "UniqueSocialId": userId,
        //    "DeviceId": "Web"
        //}
        NK.CommonRequest.AjaxCall(url, data, function (response) {
            debugger;
            var msg = "msgCode" + response.ResponseStatus.STATUSCODE;
            NK.Common.ShowPatientSuccessModal(NK.UserRegistration.resources[msg]);
        }, function (response) {
            var msg = "msgCode" + response.ResponseStatus.STATUSCODE;
            NK.Common.ShowPatientSuccessModal(NK.UserRegistration.resources[msg]);
        });
    },
    /******Facebook register****/
    setCulture: function () {
        debugger;
        //NK.SocialAccount.resources = NK.Common.getLanguageCulture(NK.UserRegistrationCulture);
    },
    FBLogin: function () {
        debugger;
        // Check whether the user already logged in the website using Facebook login
        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                //If user already logged in the Facebook then check the
                //Get the Facebook user's info
                NK.SocialAccount.verify_user();
            }
            else {
                FB.login(function (response) {
                    if (response.authResponse) {
                        NK.SocialAccount.verify_user();
                    } else {
                        //alert('User cancelled login or did not fully authorize.');
                    }
                }, { scope: 'email' });
            }
        });
    },
    verify_user: function () {
        FB.api('/me', { locale: 'en_US', fields: 'id, name, email ,first_name,last_name,middle_name,picture ', },
            function (response) {
                debugger;
                userEmail = response.email
                userName = response.name
                userId = response.id
                NK.SocialAccount.registerPatient();
            });
    },
    FBLogout: function () {
        FB.logout(function () { document.location.reload(); });
    },
}

$(document).ready(function () {
    window.fbAsyncInit = function () {
        //FB JavaScript SDK configuration and setup
        FB.init({
            appId: '1308075626663078',  //'514445962697354', // FB App ID commented by usman nazir 29-07-2020
            status: true, // check login status
            cookie: true, // enable cookies to allow the server to access the session
            xfbml: true,  // parse XFBML
            version: 'v13.0' // use graph api version 2.8
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
    NK.SocialAccount.googleStartApp();
    NK.UserRegistration.setCulture();
});







