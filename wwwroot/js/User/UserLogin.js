
var NK = NK || {};

NK.UserLogin = {
    name: "",
    data: "",
    message: "",
    languageCode: 11,
    resources: {},
    nationalityLsitResources: {},
    setCulture: function () {
        NK.UserLogin.resources = NK.Common.getLanguageCulture(NK.LoginCulture);
        $("#login-heading").text(NK.UserLogin.resources.loginHeading);
        $("#txtUsername").attr("placeholder", NK.UserLogin.resources.userNamePlaceholder);
        $("#txtPassword").attr("placeholder", NK.UserLogin.resources.passwordPlaceholder);
        $("#ckbRememberMe span").text(NK.UserLogin.resources.rememberMeText);
        $("#linkForgotPassword").text(NK.UserLogin.resources.forgotPasswordText);
        $("#btnLogin").text(NK.UserLogin.resources.loginButtonText);
        $("#linkToRegisteration").text(NK.UserLogin.resources.RegiserButtonText);
        $("#div-CopyRights .copy-right").text(NK.UserLogin.resources.CopyRightText);

    },
    getLanguageCode: function (code) {
        NK.UserLogin.languageCode = code;
        NK.UserLogin.setCulture();
    },
    validateForm: function () {
        let count = 0;
        let userName = $("#txtUsername").val();
        let password = $("#txtPassword").val();
        if (userName == "" || userName == undefined || userName == null) {
            $("#ErrorMessageUsername").html(NK.UserLogin.resources.errorMessageUsername);
            count++;
        }
        else {
            $("#ErrorMessageUsername").html("");
        }
        if (password == "" || password == undefined || password == null) {
            $("#ErrorMessagePassword").html(NK.UserLogin.resources.errorMessagePassword);
            count++;
        }
        else {
            $("#ErrorMessagePassword").html('');
        }

        if (count > 1)
            return false;
        return true;
    },
    loginUser: function () {
        if (NK.UserLogin.validateForm()) {
            var url = "/patients/AuthenticatePatientInline";
            let userName = $("#txtUsername").val();
            let password = $("#txtPassword").val();
            var data = {
                "Username": userName,
                "Password": password,
            }
            NK.CommonRequest.AjaxCall(url, data, function (response) {
                let loggedInUser = response.Userinfo
                NK.Common.setLoggedInUser(loggedInUser);
                if (!NK.Common.logInFromPartialView) {
                    window.location.href = "../";
                }
                else {
                    $("#loginModal").modal("hide");
                    window.location.href = "/Service/ShowPatientProfile";
                }

            }, function (response) {
                var msg = "msgCode" + response.ResponseStatus.STATUSCODE;
                NK.Common.ShowSuccessModal(NK.UserLogin.resources[msg]);
            });
        }
    }
}
$(document).ready(function () {
    NK.UserLogin.setCulture();
});
