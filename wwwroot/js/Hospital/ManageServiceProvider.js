
var NK = NK || {};
NK.ManageServiceProvider = {
    name: "",
    data: "",
    message: "",
    languageCode: 11,
    resources: {},
    imagePath: "",
    pageSize: 10,
    userloginInfoId:"",
    nationalityLsitResources: {},
    specialtyIds: "",
    roleListResources: {},
    setCulture: function () {
        NK.ManageServiceProvider.resources = NK.Common.getLanguageCulture(NK.ServiceProviderCulture);
        $("#FullName").attr("placeholder", NK.ManageServiceProvider.resources.fullNameTitle);
        $("#UserName").attr("placeholder", NK.ManageServiceProvider.resources.userNameTitle);
        $("#PhoneNumber").attr("placeholder", NK.ManageServiceProvider.resources.phoneNumber);
        $("#Email").attr("placeholder", NK.ManageServiceProvider.resources.emailTitle);
        $("#Password").attr("placeholder", NK.ManageServiceProvider.resources.passwordTitle);
        $("#RePassword").attr("placeholder", NK.ManageServiceProvider.resources.rePasswordTitle);
        NK.ManageServiceProvider.fillNationalityList();
        NK.ManageServiceProvider.fillRoleList();
    },
    getLanguageCode: function (code) {
        NK.ManageServiceProvider.languageCode = code;
        NK.ManageServiceProvider.setCulture();
    },
    validateForm: function () {
        var count = 0;
        var MSG_REQ = "";
        var role = $('#ServiceRole').val();
        var userName = $('#UserName').val();
        var fullName = $('#FullName').val();
        var email = $('#Email').val();
        var textpassword = $('#Password').val();
        var txtrePassword = $('#RePassword').val();
        var nationality = $('#Nationality').val();
        var phoneNumber = $('#PhoneNumber').val();
        var dob = $('#Dob').val();

        if (dob == "" || dob == undefined) {
            $("#MessageDob").html(NK.ManageServiceProvider.resources.msgDob);
            count++;
        }
        else {
            $("#MessageDob").html("");
        }

        if (role == "" || role == undefined || role == 'Select Role') {
            $("#MessageServiceServiceRole").html(NK.ManageServiceProvider.resources.msgRole);
            count++;
        }
        else {
            $("#MessageServiceServiceRole").html("");
        }


        if (nationality == "" || nationality == undefined || nationality == "Select Country" /*|| nationality == 'حدد الدولة'*/) {
            $("#MessageNationality").html(NK.ManageServiceProvider.resources.msgCountry);
            count++;
        }
        else {
            $("#MessageNationality").html("");
        }
        if (fullName == "" || fullName == undefined || fullName == '') {
            $("#MessageFullName").html(NK.ManageServiceProvider.resources.msgFullName);
            count++;
        }
        else {
            $("#MessageFullName").html('');
        }
        if (userName == "" || userName == undefined || userName == '') {
            $("#MessageUserName").html(NK.ManageServiceProvider.resources.msgUserName1);
            count++;
        }
        //else {
        //    var spaceCount = (userName.split(" ").length - 1);
        //    var regex = /^[a-zA-Z0-9-_.]*$/;
        //    if (spaceCount > 0) {
        //        $("#MessageUserName").html(NK.ManageServiceProvider.resources.msgUserName2);
        //        count++;
        //    }
        //    else if (!regex.test(userName)) {
        //        $("#MessageUserName").html(NK.ManageServiceProvider.resources.msgUserName2);
        //        count++;
        //    }
        //    else {
        //        $("#MessageUserName").html("").css("color", "");
        //    }
        //}


        if (phoneNumber == "" || phoneNumber == undefined || phoneNumber == '') {
            $(phoneNumber).css("border-color", "#FF0000");
            $("#MessagePhoneNumber").html(NK.ManageServiceProvider.resources.msgPhoneNumber);
            count++;
        }
        else {
            $("#MessagePhoneNumber").html('');
        }

        if (email == "" || email == undefined || email == '') {
            $("#MessageEmail").html(NK.ManageServiceProvider.resources.msgEmail);
            count++;
        }
        else if (!NK.Common.validateEmail($('#Email'))) {
            $("#MessageEmail").html(NK.ManageServiceProvider.resources.msgEmail2);
            count++;
        }
        else {
            $("#MessageEmail").html('');
        }

        if (textpassword == "" || textpassword == undefined) $("#MessageConfirmPassword").html(NK.ManageServiceProvider.resources.msgPassword);
        else if (txtrePassword == "" || txtrePassword == undefined) $("#MessageConfirmPassword").html(NK.ManageServiceProvider.resources.msgPassword);
        else if (txtrePassword != textpassword) {
            $("#MessageConfirmPassword").html(NK.ManageServiceProvider.resources.msgPassword2);
            count++;
        }
        else {
            $("#MessageConfirmPassword").html("");
        }


        if ($("#TermCondition").prop('checked') == false) {
            $("#MessagetermCondition").html(NK.ManageServiceProvider.resources.msgTermsAndCondation);
        }
        else {
            $("#MessagetermCondition").html("");
        }

        if (dob == "" || dob == undefined) {
            $("#MessageDob").html(NK.ManageServiceProvider.resources.msgDob);
        }
        else {
            $("#MessageDob").html("");
        }
        if (count > 1) return false; else return true;
    },
    save: function () {
        if ($('#UserloginInfoId').val() == "") {
            var url = "/organization/AddServiceProvider";
            var data = {
                "OrganizationId": 1,
                "CatuserRoleId": $('#ServiceRole').val(),
                "Username": $('#UserName').val(),
                "Password": $('#Password').val(),
                "FullName": $('#FullName').val(),
                "CellNumber": $('#PhoneNumber').val(),
                "Email": $('#Email').val(),
                "RegistrationPlatformId": 1,
                "DeviceId": 'Web',
                "CatNationalityId": $('#Nationality').val(),
                "DateofBirth": $('#Dob').val(),
                "ImagePath": NK.ManageServiceProvider.imagePath,

            }
        }
        else {
            var url = "/organization/UpdateServiceProvider";
            var data = {
                "OrganizationId": 1,
                "CatuserRoleId": $('#ServiceRole').val(),
                "UserloginInfoId": $('#UserloginInfoId').val() == "" ? 0 : $('#UserloginInfoId').val(),
                "FullName": $('#FullName').val(),
                "CellNumber": $('#PhoneNumber').val(),
                "RegistrationPlatformId": 1,
                "DeviceId": 'Web',
                "CatNationalityId": $('#Nationality').val(),
                "DateofBirth": $('#Dob').val(),
                "ImagePath": NK.ManageServiceProvider.imagePath,
            }
        }
        if (NK.ManageServiceProvider.validateForm()) {
            NK.CommonRequest.AjaxCall(url, data, function (response) {
                var msg = "msgCode" + response.ResponseStatus.STATUSCODE;
                $("#myModal").modal('hide');
                NK.Common.ShowSuccessModal(NK.ManageServiceProvider.resources[msg]);
                NK.ManageServiceProvider.initServiceProviers();
            }, function (response) {
                var msg = "msgCode" + response.ResponseStatus.STATUSCODE;
                NK.Common.ShowSuccessModal(NK.ManageServiceProvider.resources[msg]);
            });
        }
    },
    imageUpload: function (file) {
        var url = "/common/upload";
        var form = new FormData();
        form.append("file", file);
        form.append("UserType", "2");
        form.append("ResourceCategory", "1");
        form.append("ResourceType", "1");
        NK.CommonRequest.NodeAPIAjaxCallMedia(url, form, function (response) {
            NK.ManageServiceProvider.imagePath = response.Data.Path;
            // NK.Common.ShowSuccessModal(NK.ManageServiceProvider.resources.msgImage);
        }, function (response) {
            NK.Common.ShowSuccessModal(response.ResponseStatus.message);
        });
    },
    clearInfo: function () {
        $('#FullName').val('');
        $('#PhoneNumber').val('');
        $('#Email').val('').removeAttr("disabled");;
        $('#Password').val('').removeAttr("disabled");;
        $('#RePassword').val('').removeAttr("disabled");;
        $('#UserName').val('').removeAttr("disabled");
        $('#UserloginInfoId').val('');
        $('#ServiceRole').val('Select Role');
        $('#Nationality').val('Select Country');
        $('#Dob').val('');

        $('#MessageFullName').text('');
        $('#MessagePhoneNumber').text('');
        $('#MessageEmail').text('');
        $('#MessagePassword').text('');
        $('#MessageRePassword').text('');
        $('#MessageUserName').text('');
        $('#MessageUserloginInfoId').text('');
        $('#MessageServiceRole').text('');
        $('#MessageNationality').text('');
        $('#MessageDob').text('');
        $('#MessageServiceServiceRole').text('');
        $('#MessageConfirmPassword').text('');
        $("#blah").attr("src", "/images/default.png");
    },
    getNationalityList: function (response) {
        var url = "/patients/GetAllNationalities";
        NK.CommonRequest.AjaxGetSyncCall(url, null, function (response) {
            NK.ManageServiceProvider.nationalityLsitResources = response.Data;
        });
    },
    getRoelList: function (response) {
        var url = "/Catalogue/GetServiceProviderRolelist";
        NK.CommonRequest.AjaxGetSyncCall(url, null, function (response) {
            NK.ManageServiceProvider.roleListResources = response.list;
        });
    },
    fillNationalityList: function () {
        var data = NK.ManageServiceProvider.nationalityLsitResources;
        var option = "";
        for (var i = 0; i < data.length; i++) {
            if (NK.Common.GetCultureCode() == 'en') option += '<option value="' + data[i].Id + '">' + data[i].TitlePlang + '</option>';
            else option += '<option value="' + data[i].Id + '">' + data[i].TitleSlang + '</option>';
        }
        $("#Nationality").append(option);
    },
    fillRoleList: function () {
        var data = NK.ManageServiceProvider.roleListResources;
        var option = "";
        for (var i = 0; i < data.length; i++) {
            if (NK.Common.GetCultureCode() == 'en') option += '<option value="' + data[i].Id + '">' + data[i].TitlePlang + '</option>';
            else option += '<option value="' + data[i].Id + '">' + data[i].TitleSlang + '</option>';
        }
        $("#ServiceRole").append(option);
    },

    initServiceProviers: function () {
        $('#StudentTableContainer').jtable({
            title: 'Service Provider List',
            paging: true, //Enable paging
            pageSize: 10, //Set page size (default: 10)
            sorting: false, //Enable sorting
            defaultSorting: 'Name ASC', //Set default sorting
            actions: {
                listAction: NK.ManageServiceProvider.loadServiceProviders
            },
            fields: {
                Username: {
                    title: 'User Name'
                },
                UserRolePlang: {
                    title: 'User Role',
                },
                Email: {
                    title: 'Email address',
                },
                CellNumber: {
                    title: 'Phone Number',
                },
                myAction: {
                    width: '5%',
                    sorting: false,
                    // title: ASM.CreatePairedItem.resources.lblAction,
                    title: 'Action',
                    listClass: 'jtable-top-center-align-td',
                    display: function (data) {
                        var actions = $("#linksAction").clone();
                        $(".lnkEditSP", actions).data("dataItem", data.record);
                        $(".lnkEditSP", actions).attr("onclick", "NK.ManageServiceProvider.getServiceProviderInfo(this);");
                        $(".linksActionSP", actions).attr("onclick", "NK.ManageServiceProvider.getServicesOrSpecilaty(this);");
                        $(".linksActionSP", actions).data("dataItem", data.record);

                        // var actions = $("#linksActionSP").clone();
                        //$(".linksActionSP", actions).data("dataItem", data.record);
                        //$(".linksActionSP", actions).attr("onclick", "NK.ManageServiceProvider.getServiceProviderInfo(this);");
                        return actions.find("a");
                    }
                }
            }
        });
        //Load student list from server
        $('#StudentTableContainer').jtable('load');
    },
    loadServiceProviders: function (_, criteria) {

        if (criteria === undefined)
            return;
        NK.ManageServiceProvider.pageSize = criteria.jtPageSize;
        var userName = $("#SearchInfo").val();
        var pageNumber = ((criteria.jtStartIndex / NK.ManageServiceProvider.pageSize) + 1);// - 1;  
        var url = "/organization/GetServiceProvidersByOrganizationId";
        var data = {
            "OrganizationId": 1,
            "Username": userName,
            "PageNumber": pageNumber,
            "PageSize": NK.ManageServiceProvider.pageSize
        }
        var ret;
        return $.Deferred(function ($dfd) {
            NK.CommonRequest.AjaxCall(url, data, function (response) {
                $(".dvMainManageTask").show();
                ret = {
                    'Result': "OK",
                    'Records': response.ServiceProviders,
                    'TotalRecordCount': response.TotalRecord
                };

                $dfd.resolve(ret);
            });
        });
    },
    reloadServiceProvider: function () {

        $('#StudentTableContainer').jtable("load");
    },
    refreshServiceProvider: function () {

        $("#SearchInfo").val("");
        $('#StudentTableContainer').jtable("load");
    },

    getServiceProviderInfo: function (ui) {
        debugger;
        var spData = $(ui).data("dataItem");
        $('#ServiceRole').val(spData.CatUserRoleId);
        $('#UserloginInfoId').val(spData.UserloginInfoId);
        $('#UserName').val(spData.Username);
        $('#UserName').attr("disabled", true);
        $('#FullName').val(spData.Fullname);
        $('#Email').val(spData.Email);
        $('#Password').val("*******");
        $('#RePassword').val("*******");
        $('#Nationality').val(spData.CatNationalityId);
        $('#PhoneNumber').val(spData.CellNumber);
        $('#Dob').val(spData.DateofBirth);
        NK.ManageServiceProvider.imagePath = spData.ImagePath;
        $("#blah").attr("src", NK.Common.apiBasePathMedia + spData.ImagePath);
        $('#UserName').attr("disabled", true);
        $('#Password').attr("disabled", true);
        $('#RePassword').attr("disabled", true);
        $('#Email').attr("disabled", true);
        $("#myModal").modal('show');
    },
    readURL: function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#blah').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
        NK.ManageServiceProvider.imageUpload(input.files[0]);
    },
    ImageLoader: function () {
        $("#imgInp").click();
    },
    getServicesOrSpecilaty: function (ui) {
        $("#OfferdData").html("");
        var spData = $(ui).data("dataItem");
        NK.ManageServiceProvider.userloginInfoId = spData.UserloginInfoId;
        debugger;
        var url = "/organization/GetSpecialtyListByOrganizationAndServiceProvider";
        var data = {
            "UserloginInfoId": spData.UserloginInfoId,
            "OrganizationId": spData.OrganizationId
        }
        NK.CommonRequest.AjaxCall(url, data, function (response) {
            debugger;
            
            if (response.Data != undefined &&  response.Data.length > 0) {
                const uniquescategory = response.Data.filter((value, index, self) =>
                    self.findIndex(v => v.CatCategoryId === value.CatCategoryId) === index
                );
                $(uniquescategory).each(function (ind, offerd) {
                    debugger;
                    var currentItem = $(".dataItem", ".Custom").clone();
                    $(currentItem).find("input:first").addClass("Catcheckbox");
                    $(currentItem).find(".Catcheckbox").attr("id", offerd.CatCategoryId);
                    $(currentItem).find(".Catcheckbox").attr("name", offerd.CatCategoryId);
                    $(currentItem).find(".Catcheckbox").attr("onchange", "NK.ManageServiceProvider.selectAll(" + offerd.CatCategoryId + ")");
                    $(currentItem).find(".CatTxtTitle").text(offerd.CategoryTitlePlang);
                    $(currentItem).find(".SpecilaityList").addClass(offerd.CatCategoryId)
                   
                    const uniqueSpecilaty = response.Data.filter((person) => person.CatCategoryId == offerd.CatCategoryId);
                    $(uniqueSpecilaty).each(function (ind, offerdSp) {
                        var currentItem2 = $(".dataItem", ".Custom2").clone();
                        $(currentItem2).find("input:first").addClass("Spcheckbox");
                        $(currentItem2).find(".Spcheckbox").attr("id", offerdSp.CatSpecialtyId);
                        $(currentItem2).find(".Spcheckbox").attr("name", offerdSp.SpecialtyTitlePlang);
                        $(currentItem2).find(".Spcheckbox").attr("CatId", offerdSp.CatCategoryId);
                        $(currentItem2).find(".Spcheckbox").attr("userLoginId", offerdSp.UserloginInfoId);
                        $(currentItem2).find(".SpTxtTitle").text(offerdSp.SpecialtyTitlePlang);
                        $(currentItem2).find(".Spcheckbox").addClass(offerdSp.CatCategoryId)
                        debugger
                        if (offerdSp.UserloginInfoId != null) $(currentItem2).find(".Spcheckbox").prop("checked", true);
                        $(".SpecilaityList", currentItem).append(currentItem2);
                    });
                    $("#OfferdData").append(currentItem);
                });
            }
        });
        $("#SpecilaityAndServicesModal").modal("show");
    },
    SaveServiceProviderSpeciality: function () {
        NK.ManageServiceProvider.specialtyIds = "";
        if ($("#OfferdData").html() == "") { return; }
        var serviceList = new Array();
        var specialtyIds = "";
        $($("#OfferdData").find("li.catli")).each(function (idx, ch) {
            $(ch).find(".Spcheckbox:checked").each(function (ix, SpData) {
                var obj = new Object();
                obj.CatCategoryId = $(SpData).attr("CatId");
                obj.CatSpecialtyId = $(SpData).attr("Id");
                userLoginId = $(SpData).attr("userLoginId");
                serviceList.push(obj);
            })
        });
        var url = "/organization/AssignSpecialtyListToServiceProvider";
        var data = {
            "OrganizationId": 1,
            "UserloginInfoId": NK.ManageServiceProvider.userloginInfoId,
            "Specialties": serviceList
        }
        NK.CommonRequest.NodeAPIAjaxCall(url,JSON.stringify(data), function (response) {
            var msg = "msgCode" + response.ResponseStatus.STATUSCODE;
            $("#SpecilaityAndServicesModal").modal('hide');
            NK.Common.ShowSuccessModal(NK.ManageServiceProvider.resources[msg]);
            NK.ManageServiceProvider.initServiceProviers();
        }, function (response) {
            var msg = "msgCode" + response.ResponseStatus.STATUSCODE;
            NK.Common.ShowSuccessModal(NK.ManageServiceProvider.resources[msg]);
        });
    },

    selectAll: function (ui) {
        debugger;
        if ($("#" + ui).prop("checked") == true) {
            $("." + ui).prop("checked", true);
        }
        else {
            $("." + ui).prop("checked", false);
        }
    }
}
$(document).ready(function () {
    $("#Dob").datepicker();
    $("body").removeClass("rtl");
    NK.Common.CurrentLanguage = 'en';
    NK.Menu.loadLanguage();
    $('#myModal').on('hidden.bs.modal', function () {
        NK.ManageServiceProvider.clearInfo();
    })
    NK.ManageServiceProvider.getNationalityList();
    NK.ManageServiceProvider.getRoelList();
    NK.ManageServiceProvider.initServiceProviers();
    NK.ManageServiceProvider.setCulture();
});



