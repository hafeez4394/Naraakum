NK = NK || {};
NK.ShowPatientProfile = {
    dv_HospitalTemplate: "#HospitalsTemplate",
    refferelUserList: "#refferelUserList",

    dv_cart: "#dv_cart",
    dv_HospitalCart: "#HospitalCartTemplate",
    singleRefferelUserTemplate: "#singleRefferelUserTemplate",
    addRefferelUserTemplate: "#addRefferelUserTemplate",
    loadRefferelUsers: function () {
        let loggedInUserId = NK.Common.getLoggedInUser().Id;
        if (loggedInUserId) {
            let data = { "UserId": loggedInUserId };
            let url = '/user/GetRefferalUsersByUserId';
            NK.CommonRequest.AjaxCall(url, data, function (response) {
                $(NK.ShowPatientProfile.refferelUserList).empty();
                if (response.RefferelUserList) {
                    NK.ShowPatientProfile.RefferelUserList = response.RefferelUserList;

                    if (NK.ShowPatientProfile.RefferelUserList && NK.ShowPatientProfile.RefferelUserList.length > 0) {
                        $.each(NK.ShowPatientProfile.RefferelUserList, function (idx, user) {
                            let id = user.Id;
                            let fullName = user.Fullname;
                            let cellNumber = user.CellNumber;
                            let email = user.Email;
                            let dateofBirth = user.DateofBirth;
                            let relationshipTitle = NK.Common.getTitleFromLanguage(user.RelationshipTitlePlang, user.RelationshipTitleSlang);
                            let nationality = NK.Common.getTitleFromLanguage(user.CatNationalityTitlePLang, user.CatNationalityTitleSLang);
                            let imagePath = user.ImagePath ? user.ImagePath : "/images/upload-img.png";
                            let template = $(NK.ShowPatientProfile.singleRefferelUserTemplate).html();

                            template = template.replace('_userFullName', fullName);
                            template = template.replaceAll('_userRelation', relationshipTitle);
                            template = template.replace('_Nationality', nationality);
                            //template = template.replace('_description', description);
                            //template = template.replace('_hospitalimage', "src='" + imagePath + "'");

                            // -- append dynamic template to div
                            $(NK.ShowPatientProfile.refferelUserList)
                                .append(template);
                        });
                        $(NK.ShowPatientProfile.refferelUserList)
                            .append($(NK.ShowPatientProfile.addRefferelUserTemplate).html());
                        $(NK.ShowPatientProfile.refferelUserList + " .col-md-4:first").find(".patient").addClass("active");
                    }
                }
            });

        }
    },
    loadCart: function () {

        let services = NK.Common.getServicesCart();
        $(NK.ShowPatientProfile.dv_cart).html('');
        $(NK.ShowPatientProfile.btnNext).css('display', 'none');
        $.each(services, function (idx, ser) {

            let id = ser.Id;
            let quantity = ser.quantity == null ? "1" : ser.quantity;
            let title = NK.Common.getTitleFromLanguage(ser.TitlePlang, ser.TitleSlang);

            //if (ser.Price && ser.Price != "") {
            //    let totalPrice = quantity * ser.Price;
            //    quantity = quantity + " x " + ser.Price + " = " + totalPrice;
            //}
            let template = $(NK.ShowPatientProfile.dv_HospitalCart).html();

            template = template.replace('style="display:none;"', '');
            template = template.replace('_headerTitle', title);
            template = template.replace('_cartValue', quantity);
            template = template.replace('_ServiceId', id);

            $(NK.ShowPatientProfile.dv_cart).append(template);
            $(NK.ShowPatientProfile.btnNext).css('display', '');
        })
    },
}
$(function () {
    let loggedInUser = NK.Common.getLoggedInUser();
    if (loggedInUser == null || loggedInUser == "") {
        window.location.href = "/User/Login";
    }
    NK.ShowPatientProfile.loadCart();
    NK.ShowPatientProfile.loadRefferelUsers();
});