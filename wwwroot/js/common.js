var NK = NK || {};
NK.Common = {
    CurrentLanguage: 'en',
    apiBasePath: 'https://hhcnode.innotech-sa.com/api',
    apiBasePathMedia: 'https://hhcmedia.innotech-sa.com/api',
    webAPIMediaAccessToken:"",
    logInFromPartialView: false,
    //*** input validation
    isNumber: function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    },
    userTypes: [
        { Id: 1, TitlePlang: "Patient", TitleSlang: "صبور" },
        { Id: 2, TitlePlang: "Employee", TitleSlang: "الموظف" }
    ],
    isFloatValue: function (evt, ExistingValue) {
        let ValuesList = ExistingValue.split('.');
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode == 46) {
            if (ExistingValue.indexOf(".") == -1)
                return true;
            else
                return false;
        }
        else {
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
            }

        }

        if (ValuesList.length > 1) {
            if (ValuesList[1].length >= 2)
                return false;
        }
        else if (ValuesList[0].length >= 3)
            return false;

        return true;

    },
    //*** Culture base
    CultureList: [
        { Id: 1, Code: 'ar' },
        { Id: 11, Code: 'en' }
    ],
    LanguageCulture: {
        Current: false,
        Culture: 'en'
    },
    GetCultureCode: function () {

        //let code = NK.Common.LanguageCulture.Culture;
        //if (!NK.Common.LanguageCulture.Current) {
        //    if (NK.Common.loggedInUserInfo) {

        //        let prefLangId = NK.Common.loggedInUserInfo.PreferredLanguage;
        //        code = NK.Common.CultureList.filter(function (f) {
        //            return f.Id == prefLangId
        //        });
        //        if (code.length == 0) {
        //            code = 'en';
        //        }
        //        else {
        //            code = code[0].Code;
        //        }
        //    }
        //}
        let code = NK.Common.CurrentLanguage;
        if (code.length == 0) code = 'en';
        return code;
    },
    getLanguageCulture: function (culture) {
        try {
            return culture[NK.Common.GetCultureCode(false)];
        } catch (e) {
            console.error(culture)
            console.error(Error().stack);
        }
    },
    getPreferredLanguageTitle: function (obj, pColName, sColName) {
        let pTitle = obj[pColName];
        let sTitle = obj[sColName];
        let title = '';

        if (NK.Common.loggedInUserInfo.IsPrimaryLanguageSelected) {
            if (pTitle == null || pTitle == undefined || pTitle == '') {
                title = sTitle;
            }
            else {
                title = pTitle;
            }
        }
        else {
            if (sTitle == null || sTitle == undefined || sTitle == '') {
                title = pTitle;
            }
            else {
                title = sTitle;
            }
        }

        return title;
    },
    getTitleFromLanguage: function (pTitle, sTitle) {
        let title = '';

        if (NK.Common.CurrentLanguage == 'en') {
            if (pTitle == null || pTitle == undefined || pTitle == '') {
                title = sTitle;
            }
            else {
                title = pTitle;
            }
        }
        else {
            if (sTitle == null || sTitle == undefined || sTitle == '') {
                title = pTitle;
            }
            else {
                title = sTitle;
            }
        }

        return title;
    },
    validateEmail: function (inputText) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (mailformat.test(inputText.val())) {
            return true;
        }
        else {
            return false;
        }
    },

    encryptData: function (salt, text) {
        const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
        const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
        const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
        return text
            .split("")
            .map(textToChars)
            .map(applySaltToChar)
            .map(byteHex)
            .join("");
    },
    //function Calling common.decrypt("salt", "426f666665"); // -> Hello
    decryptData: function (salt, encoded) {
        const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
        const applySaltToChar = (code) =>
            textToChars(salt).reduce((a, b) => a ^ b, code);
        return encoded
            .match(/.{1,2}/g)
            .map((hex) => parseInt(hex, 16))
            .map(applySaltToChar)
            .map((charCode) => String.fromCharCode(charCode))
            .join("");
    },

    ShowSuccessModal: function (Msg) {
        if (Msg && Msg != null && Msg != "") {
            $('.Success-Modal-Msg').html(Msg);
            $('#successModal').modal('show');
        }
    },
    ShowPatientSuccessModal: function (Msg) {
        if (Msg && Msg != null && Msg != "") {
            $('.PSuccess-Modal-Msg').html(Msg);
            $('#PatientsuccessModal').modal('show');
        }
    },
    setLanguage: function (v) {
        NK.Common.CurrentLanguage = v;
        localStorage.setItem("CurrentLanguage", v);
    },
    getLanguage: function () {
        var lang = localStorage.getItem("CurrentLanguage");
        if (lang == null) lang = 'ar';

        return lang;
    },
    setCategoryDisplayId: function (v) {
        localStorage.setItem("CategoryDisplayId", v);
    },
    getCategoryDisplayId: function () {
        var id = localStorage.getItem("CategoryDisplayId");
        return id;
    },
    setCatCategoryId: function (v) {
        localStorage.setItem("setCatCategoryId", v);
    },
    getServiceProviderCartType: function () {
        var id = localStorage.getItem("ServiceProviderCartType");
        return id;
    },
    setServiceProviderCartType: function (v) {
        localStorage.setItem("ServiceProviderCartType", v);
    },
    getCatCategoryId: function () {
        var id = localStorage.getItem("setCatCategoryId");
        return id;
    },
    setServicesCart: function (v) {
        localStorage.setItem("ServicesCart", JSON.stringify(v));
    },
    getServicesCart: function () {
        var s = localStorage.getItem("ServicesCart");
        return JSON.parse(s);
    },
    setSpecialitiesCart: function (v) {
        localStorage.setItem("SpecialitiesCart", JSON.stringify(v));
    },
    getSpecialitiesCart: function () {
        var s = localStorage.getItem("SpecialitiesCart");
        return JSON.parse(s);
    },
    setLoggedInUser: function (v) {
        localStorage.setItem("LoggedInUser", JSON.stringify(v));
    },
    getLoggedInUser: function () {
        var s = localStorage.getItem("LoggedInUser");
        return JSON.parse(s);
    },
    checkLoggedInUserandSetMenu: function () {
        let loggedInUser = NK.Common.getLoggedInUser();
        if (loggedInUser == null || loggedInUser == "") {
            $(".loggedin-item").remove();
            $(".not-loggedin-item").removeClass("hide");
        }
        else {
            $(".not-loggedin-item").remove();
            $(".loggedin-item").removeClass("hide");
            let profileImagePath = "/images/user.png"
            if (loggedInUser.ImagePath != null && loggedInUser.ImagePath != "") {
                profileImagePath = loggedInUser.ImagePath;
            }
            $("#menuProfileImage").attr("src", profileImagePath)
            $("#menuProfileName").text(loggedInUser.Fullname)
            $("#menuProfileNumber").text(loggedInUser.CellNumber)

        }
    },
    getMediaAPIToken: function () {
        var settings = {
            "url": NK.Common.apiBasePathMedia + "/authValidator/GetToken",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
                "grant_type": "password",
                "apikey": "15F79088-0CE7-4274-9725-EB48CF58AD56",
                "platformId": "1"
            }
        };
        $.ajax(settings).done(function (response) {
            NK.Common.webAPIMediaAccessToken = response.access_token;
        });
    },
}
NK.CommonRequest = {
    //*** Ajax Calls
    LogError: function (errorMessage, errorDetails, errorStackTrace, urlReferer, formName) {

        try {
            let data = {
                errorMessage: (typeof errorMessage == undefined || errorMessage == null) ? "---" : errorMessage,
                errorDetails: (typeof errorDetails == undefined || errorDetails == null) ? "---" : errorDetails,
                errorStackTrace: (typeof errorStackTrace == undefined || errorStackTrace == null) ? "---" : errorStackTrace,
                urlReferer: (typeof urlReferer == undefined || urlReferer == null) ? "---" : urlReferer,
                formName: (typeof formName == undefined || formName == null) ? "---" : formName,
            };

            let url = "LogError/LogError";
            NK.CommonRequest.AjaxControllerCall(url, data, function (response) {
                //console.log("Log ")
            });
        }
        catch (ex) {
            console.log("Exception has been occurred while error log, Following is exception object.");
            console.log(ex);
        }

    },
    Ajax: function (type, url, data, dataType, blockUI, successCallBack, errorCallBack, isController) {
        let headers = { "Authorization": NK.Common.webAPIAccessToken };
        let ajaxRequest = function (successCallBack, errorCallBack) {
            $.ajax({
                type: type,
                url: url,
                data: data,
                dataType: dataType,
                async: true,
                cache: false,
                headers: headers,
                success: function (response) {
                    NK.CommonRequest.RequestCommonSuccessCallback(response, dataType, blockUI, successCallBack, errorCallBack);
                },
                error: function (err) {
                    NK.CommonRequest.RequestCommonErrorCallback(err, blockUI, errorCallBack);
                },
                complete: function () {
                },

            });
        };
        ajaxRequest(successCallBack, errorCallBack);
    },
    NodeAPIAjax: function (type, url, data, dataType, blockUI, successCallBack, errorCallBack, isController) {
        debugger;
        let headers = { "Authorization": NK.Common.webAPIAccessToken, "Content-Type": "application/json" };
        let ajaxRequest = function (successCallBack, errorCallBack) {
            $.ajax({
                type: type,
                url: url,
                data: data,
                dataType: dataType,
                async: true,
                timeout: 0,
                processData: false,
                contentType: false,
                contentType: 'application/json',
                headers: headers,
                success: function (response) {
                    NK.CommonRequest.RequestCommonSuccessCallback(response, dataType, blockUI, successCallBack, errorCallBack);
                },
                error: function (err) {
                    NK.CommonRequest.RequestCommonErrorCallback(err, blockUI, errorCallBack);
                },
                complete: function () {
                },

            });
        };
        ajaxRequest(successCallBack, errorCallBack);
    },
    NodeAPIAjaxMedia: function (type, url, data, dataType, blockUI, successCallBack, errorCallBack, isController) {
        debugger;
        headers = {
            "Authorization": "Bearer" + NK.Common.webAPIMediaAccessToken
        };
        let ajaxRequest = function (successCallBack, errorCallBack) {
            $.ajax({
                url: url,
                method: type,
                timeout: 0,
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                data: data,
                headers: headers,
                success: function (response) {
                    debugger;
                    var data = JSON.parse(response);
                    NK.CommonRequest.RequestCommonSuccessCallback(data, dataType, blockUI, successCallBack, errorCallBack);
                },
                error: function (err) {
                    debugger;
                    NK.CommonRequest.RequestCommonErrorCallback(err, blockUI, errorCallBack);
                },
                complete: function () {
                },

            });
        };
        ajaxRequest(successCallBack, errorCallBack);
    },
    AjaxSync: function (type, url, data, dataType, blockUI, successCallBack, errorCallBack, isController) {

        let headers = { "Authorization": NK.Common.webAPIAccessToken };
        let ajaxRequest = function (successCallBack, errorCallBack) {
            $.ajax({
                type: type,
                url: url,
                data: data,
                dataType: dataType,
                async: false,
                cache: false,
                headers: headers,
                success: function (response) {
                    //if (typeof response == "string" && response.includes('"IsSessionOut":true')) {
                    //    NK.Common.logoutUser();
                    //    return;
                    //}
                    NK.CommonRequest.RequestCommonSuccessCallback(response, dataType, blockUI, successCallBack, errorCallBack);
                },
                error: function (err) {
                    NK.CommonRequest.RequestCommonErrorCallback(err, blockUI, errorCallBack);
                },
                complete: function () {
                    //try {
                    //    if (blockUI) {
                    //        $.unblockUI();
                    //    }
                    //} catch (e) {

                    //}
                },

            });
        };
        ajaxRequest(successCallBack, errorCallBack);
    },
    AjaxCall: function (url, data, successCallBack, errorCallBack) {

        url = NK.Common.apiBasePath + url;
        return NK.CommonRequest.Ajax("POST", url, data, "json", true, successCallBack, errorCallBack);
    },
    NodeAPIAjaxCall: function (url, data, successCallBack, errorCallBack) {
        url = NK.Common.apiBasePath + url;
        return NK.CommonRequest.NodeAPIAjax("POST", url, data, "json", true, successCallBack, errorCallBack);
    },
    NodeAPIAjaxCallMedia: function (url, data, successCallBack, errorCallBack) {
        debugger;
        url = NK.Common.apiBasePathMedia + url;
        return NK.CommonRequest.NodeAPIAjaxMedia("POST", url, data, "json", true, successCallBack, errorCallBack);
    },
    AjaxGetCall: function (url, data, successCallBack, errorCallBack) {

        url = NK.Common.apiBasePath + url;
        return NK.CommonRequest.Ajax("GET", url, data, "json", true, successCallBack, errorCallBack);
    },
    AjaxGetSyncCall: function (url, data, successCallBack, errorCallBack) {

        url = NK.Common.apiBasePath + url;
        return NK.CommonRequest.AjaxSync("GET", url, data, "json", true, successCallBack, errorCallBack);
    },
    AjaxCustomCall: function (type, dataType, url, data, successCallBack, errorCallBack, _blockui) {
        /*url = NK.CommonRequest.apiBasePath + url;*/

        let blockui = true;

        if (typeof _blockui != undefined && _blockui != null) {
            blockui = false;
        }

        return NK.CommonRequest.Ajax(type, url, data, dataType, blockui, successCallBack, errorCallBack);
    },
    AjaxFileCall: function (url, data, successCallBack, errorCallBack) {

        debugger
        var ajaxObj = $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: "json",
            contentType: false,
            processData: false,
            headers: { "Authorization": NK.Common.webAPIAccessToken },
            success: function (uploadresponse) {
                debugger;
                successCallBack(uploadresponse);
            },
            error: errorCallBack
        });

        return ajaxObj;
    },
    AjaxControllerCall: function (url, data, successCallBack, errorCallBack, _blockui) {
        /* url = NK.CommonRequest.rootUrl + url;*/
        let blockui = true;
        if (typeof _blockui != undefined && _blockui != null) {
            blockui = false;
        }

        return NK.CommonRequest.Ajax("POST", url, data, "json", blockui, successCallBack, errorCallBack, true);
    },
    AjaxCustomControllerCall: function (type, dataType, url, data, successCallBack, errorCallBack, blockUI) {
        /*url = NK.CommonRequest.rootUrl + url;*/
        blockUI = (blockUI == null || blockUI == undefined) ? true : blockUI;
        return NK.CommonRequest.Ajax(type, url, data, dataType, blockUI, successCallBack, errorCallBack, true);
    },
    getMsg: function (response) {
        return response;
    },
    RequestCommonSuccessCallback: function (response, dataType, blockUI, successCallBack, errorCallBack) {

        response = NK.CommonRequest.getMsg(response);
        if (typeof successCallBack !== "undefined") {
            if (dataType != 'json') {
                successCallBack(response);
            }
            else if (response.ResponseStatus.STATUSCODE == 200) {
                successCallBack(response);
            }
            else {
                //var err = {
                //    responseText: JSON.stringify(response)
                //};

                //if (err.responseText.toLowerCase() == "sessionout") {
                //    NK.Common.destroyUserSession();
                //}
                // else {
                NK.CommonRequest.RequestCommonErrorCallback(response, blockUI, errorCallBack);
            }
        }

        //}

    },
    RequestCommonErrorCallback: function (err, blockUI, errorCallBack) {
        if (typeof errorCallBack !== "undefined") {
            errorCallBack(err);
        }
    },
    NodeFileUpload: function (_url, fd) {
        let headers = { "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoS2V5IjoiMTVGNzkwODgtMENFNy00Mjc0LTk3MjUtRUI0OENGNThBRDU2Iiwia2V5QmFzZVRpbWUiOiIyMDIyLTA3LTEzVDA4OjEzOjE0WiIsImlhdCI6MTY1NzY5OTk5NCwiZXhwIjoxNjU3Nzg2Mzk0fQ.MUIlDgpZx2K6X9eDv_qL7SesKsuYo9XHWtVtyPUP9Pc", "Content-Type": "application/json" };
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "https://hhcmedia.innotech-sa.com/api/common/TestMedia",
            data: { "dddd": 2 },
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            headers: headers,
            success: function (data) {
                debugger;
                //$("#result").text(data);
                //console.log("SUCCESS : ", data);
                //$("#btnSubmit").prop("disabled", false);

            },
            error: function (e) {
                debugger;
                //$("#result").text(e.responseText);
                console.log("ERROR : ", e);
                //$("#btnSubmit").prop("disabled", false);

            }
        });

        //$.ajax({
        //    type: "POST",
        //    url: "https://hhcmedia.innotech-sa.com/api/common/uploadTest",
        //    contentType: false,
        //    processData: false,
        //    dataType: "json",
        //    enctype: "multipart/form-data", 
        //    data: fd,
        //    headers: { "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoS2V5IjoiMTVGNzkwODgtMENFNy00Mjc0LTk3MjUtRUI0OENGNThBRDU2Iiwia2V5QmFzZVRpbWUiOiIyMDIyLTA3LTA2VDEzOjI3OjQ1WiIsImlhdCI6MTY1NzExNDA2NSwiZXhwIjoxNjU3MjAwNDY1fQ.9Y1SSk41TiceMX-4_XYbEvFtHW4eiYzJazkMNAmwbqg" },
        //    success: function (response) {
        //        debugger;
        //    },
        //    error: function (response) {
        //        debugger;
        //    }
        //    , xhr: function () {
        //        debugger;
        //    }
        //});
    }
}
NK.CacheObjects = {
    //*** set Cache Object
    setCache: function (cacheManager) {
        if (cacheManager) {
            if (cacheManager.mediaBaseUrl) {
                NK.Common.mediaBaseUrl = cacheManager.mediaBaseUrl;
            }
        }
    }
};


