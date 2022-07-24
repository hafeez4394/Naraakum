
var NK = NK || {};

NK.UserRegistration = {
    name: "",
    data: "",
    message: "",
    languageCode: 11,
    resources: {},
    nationalityLsitResources: {},
    setCulture: function () {
        NK.UserRegistration.resources = NK.Common.getLanguageCulture(NK.PatientRegistrationCulture);
        $("#FullName").attr("placeholder", NK.UserRegistration.resources.fullNameTitle);
        $("#UserName").attr("placeholder", NK.UserRegistration.resources.userNameTitle);
        $("#PhoneNumber").attr("placeholder", NK.UserRegistration.resources.phoneNumber);
        $("#Email").attr("placeholder", NK.UserRegistration.resources.emailTitle);
        $("#Password").attr("placeholder", NK.UserRegistration.resources.passwordTitle);
        $("#RePassword").attr("placeholder", NK.UserRegistration.resources.rePasswordTitle);
        $("#TermConditionTitle").text(NK.UserRegistration.resources.termsandCondationTitle);
        $("#SignUp").text(NK.UserRegistration.resources.btnRegisterTitle);
        $("#AlreadyAccount").text(NK.UserRegistration.resources.alreadyAccountTitle);
        $("#AlreadyLogin").text(NK.UserRegistration.resources.btnAlreadyLoginTitle);
        $("#FormHeading").text(NK.UserRegistration.resources.formHeadingTitle);
        $("#ImageHeading").text(NK.UserRegistration.resources.imageHeadingTitle);
        $("#NationalityTitle").text(NK.UserRegistration.resources.nationalityTitle);

        NK.UserRegistration.fillNationalityList();
    },
    getLanguageCode: function (code) {
        NK.UserRegistration.languageCode = code;
        NK.UserRegistration.setCulture();
    },
    validateForm: function () {
        var count = 0;
        var MSG_REQ = "";
        var userName = $('#UserName').val();
        var fullName = $('#FullName').val();
        var email = $('#Email').val();
        var txtrePassword = $('#RePassword').val();
        var nationality = $('#Nationality').val();
        var phoneNumber = $('#PhoneNumber').val();
        var dob = $('#Dob').val();


        if (nationality == "" || nationality == undefined || nationality == "Select Country" || nationality == 'حدد الدولة') {
            $("#MessageNationality").html(NK.UserRegistration.resources.msgCountry);
            count++;
        }
        else {
            $("#MessageNationality").html("");
        }
        if (fullName == "" || fullName == undefined || fullName == '') {
            $("#MessageFullname").html(NK.UserRegistration.resources.msgFullName);
            count++;
        }
        else {
            $("#MessageFullname").html('');
        }
        if (userName == "" || userName == undefined || userName == '') {
            $("#MessageUserName").html(NK.UserRegistration.resources.msgUserName1);
            count++;
        }
        else {

            var spaceCount = (userName.split(" ").length - 1);
            var regex = /^[a-zA-Z0-9-_.]*$/;
            //  var regex = "^[a-zA-Z0-9_]*$";
            if (spaceCount > 0) {
                $("#MessageUserName").html(NK.UserRegistration.resources.msgUserName2);
                count++;
            }
            else if (!regex.test(userName)) {
                $("#MessageUserName").html(NK.UserRegistration.resources.msgUserName2);
                count++;
            }
            else {
                $("#MessageUserName").html("").css("color", "");
            }
        }


        if (phoneNumber == "" || phoneNumber == undefined || phoneNumber == '') {
            $(phoneNumber).css("border-color", "#FF0000");
            $("#MessagePhoneNumber").html(NK.UserRegistration.resources.msgPhoneNumber);
            count++;
        }
        else {
            $("#MessagePhoneNumber").html('');
        }

        if (email == "" || email == undefined || email == '') {
            $("#MessageEmail").html(NK.UserRegistration.resources.msgEmail);
            count++;
        }
        else if (!NK.Common.validateEmail($('#Email'))) {
            $("#MessageEmail").html(NK.UserRegistration.resources.msgEmail2);
            count++;
        }
        else {
            $("#MessageEmail").html('');
        }
        var textpassword = $('#Password').val();

        // NK.PatientRegistration.encryptPassword(password);
        if (textpassword == "" || textpassword == undefined) $("#MessageConfirmPassword").html(NK.UserRegistration.resources.msgPassword);
        else if (txtrePassword == "" || txtrePassword == undefined) $("#MessageConfirmPassword").html(NK.UserRegistration.resources.msgPassword);
        else if (txtrePassword != textpassword) {
            $("#MessageConfirmPassword").html(NK.UserRegistration.resources.msgPassword2);
            count++;
        }
        else {
            $("#MessageConfirmPassword").html("");
        }

        if ($("#TermCondition").prop('checked') == false) {
            $("#MessagetermCondition").html(NK.UserRegistration.resources.msgTermsAndCondation);
        }
        else {
            $("#MessagetermCondition").html("");
        }

        if (dob == "" || dob == undefined) {
            $("#MessageDob").html(NK.UserRegistration.resources.msgDob);
        }
        else {
            $("#MessageDob").html("");
        }

        if (count > 1) return false; else return true;
    },
    registerPatient: function () {
        var url = "/patients/RegisterPatient";
        var data = {
            "Username": $('#UserName').val(),
            "Password": $('#Password').val(),
            "FullName": $('#FullName').val(),
            "CellNumber": $('#PhoneNumber').val(),
            "Email": $('#Email').val(),
            "RegistrationPlatformId": 1,
            "RegistrationTypeId": 1,
            "DeviceId": 'Web',
            "CatUserTypeId": 1,
            "CatNationalityId": $('#Nationality').val(),
            "DateofBirth": $('#Dob').val()
         //   "DateofBirth": "1984-09-09"
        }
        debugger;
        if (NK.UserRegistration.validateForm()) {
            NK.CommonRequest.AjaxCall(url, data, function (response) {
                debugger;
                var msg = "msgCode" + response.ResponseStatus.STATUSCODE;
                NK.UserRegistration.clearPatientInfo();
                NK.Common.ShowSuccessModal(NK.UserRegistration.resources[msg]);
            }, function (response) {
                debugger;
                var msg = "msgCode" + response.ResponseStatus.STATUSCODE;
                NK.Common.ShowSuccessModal(NK.UserRegistration.resources[msg]);
            });
        }
    },
    clearPatientInfo: function () {
        $('#FullName').val('');
        $('#PhoneNumber').val('');
        $('#Email').val('');
        $('#Password').val('');
        $('#RePassword').val('');
        $('#UserName').val('');
        $("#TermCondition").prop("checked", false);
    },
    getNationalityList: function (response) {

        var url = "/patients/GetAllNationalities";
        NK.CommonRequest.AjaxGetSyncCall(url, null, function (response) {
            NK.UserRegistration.nationalityLsitResources = response.Data;
        });
    },
    fillNationalityList: function () {
        var data = NK.UserRegistration.nationalityLsitResources;
        var option = "";
        for (var i = 0; i < data.length; i++) {
            if (NK.Common.GetCultureCode() == 'en') option += '<option value="' + data[i].Id + '">' + data[i].TitlePlang + '</option>';
            else option += '<option value="' + data[i].Id + '">' + data[i].TitleSlang + '</option>';
        }
        $("#Nationality").append(option);
    },
    ImageUpload: function () {
        $("#PatientImage").click();
    }
}
$(document).ready(function () {
    $("#Dob").datepicker();
    NK.UserRegistration.getNationalityList();
    NK.UserRegistration.setCulture();
});
