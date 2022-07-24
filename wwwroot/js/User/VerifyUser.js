
var NK = NK || {};
NK.UserVerification = {
    name: "",
    data: "",
    message: "",
    resources: {},
    setCulture: function () {
        NK.UserVerification.resources = NK.Common.getLanguageCulture(NK.VerifyUserCulture);
        $("#MessageHeading").text(NK.UserVerification.resources.messageHeading);
        $("#BtnChange").text(NK.UserVerification.resources.btnChange);
        $("#BtnConfirm").text(NK.UserVerification.resources.btnConfirmTitle);
        $("#NotReceivedHeading").text(NK.UserVerification.resources.notReceivedHeading);
        $("#ResendCode").text(NK.UserVerification.resources.resendCode);
        $("#BtnLogin").text(NK.UserVerification.resources.btnLogin);
        $("#AlreadyAccount").text(NK.UserVerification.resources.alreadyAccount);
    },
    verifyUser: function () {
        var code1 = $('#Code1').val();
        var code2 = $('#Code2').val();
        var code3 = $('#Code3').val();
        var code4 = $('#Code4').val();
        var code5 = $('#Code5').val();
        let finalCode = code1.concat(code2, code3, code4, code5);
        var url = "/patients/VerifyRegisteredUser";
        var data = {
            "UserId": NK.Common.decryptData("salt", $("#UserId").val()),
            "VerificationCode": finalCode,
            "VerificationPlatformId": 1
        }
        NK.CommonRequest.AjaxCall(url, data, function (response) {
            var msg = "msgCode" + response.ResponseStatus.STATUSCODE;
            NK.Common.ShowSuccessModal(NK.UserVerification.resources[msg]);
        }, function (response) {
            var msg = "msgCode" + response.ResponseStatus.STATUSCODE;
            NK.Common.ShowSuccessModal(NK.UserVerification.resources[msg]);
        });
    },
    resendCode: function () {
        var url = "/patients/ResendRegistrationCode";
        var data = {
            "UserId": NK.Common.decryptData("salt", $("#UserId").val())
        }
        NK.CommonRequest.AjaxCall(url, data, function (response) {
            var msg = "msgCode" + response.ResponseStatus.STATUSCODE;
            NK.Common.ShowSuccessModal(NK.UserVerification.resources[msg]);

        }, function (response) {
            
            var msg = "msgCode" + response.ResponseStatus.STATUSCODE;
            NK.Common.ShowSuccessModal(NK.UserVerification.resources[msg]);
        });
    }
}
$(document).ready(function () {
    NK.UserVerification.setCulture();
});
