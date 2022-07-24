NK = NK || {};
NK.ShowHospitals = {
    dv_HospitalTemplate: "#HospitalsTemplate",
    dv_ListOfHospitals: ".ListOfHospitals",

    dv_cart: "#dv_cart",
    dv_HospitalCart: "#HospitalCartTemplate",

    hospitalList: {},

    loadHospital: function () {
        let services = NK.Common.getServicesCart();
        if (services) {
            let ids = "";
            $.each(services, function (idx, ser) {
                if (ids.length == 0)
                    ids += ser.Id;
                else
                    ids += "," + ser.Id;
            })
            let data = { "ServiceIds": ids };
            let url = '/offeredServices/GetHospitalListByServices';
            NK.CommonRequest.AjaxCall(url, data, function (response) {

                if (response.HospitalList) {
                    NK.ShowHospitals.hospitalList = response.HospitalList;

                    //NK.ShowHospitals.hospitalList = NK.ShowHospitals.getStaticHospitalList();

                    if (NK.ShowHospitals.hospitalList && NK.ShowHospitals.hospitalList.length > 0) {
                        $.each(NK.ShowHospitals.hospitalList, function (idx, ser) {
                            let id = ser.Id;
                            let title = NK.Common.getTitleFromLanguage(ser.TitlePlang, ser.TitleSlang);
                            let description = NK.Common.getTitleFromLanguage(ser.DescriptionPlang, ser.DescriptionSlang);
                            let imagePath = ser.LogoImagePath ? ser.LogoImagePath : "/images/upload-img.png";

                            let template = $(NK.ShowHospitals.dv_HospitalTemplate).html();

                            template = template.replace('style="display:none;"', '');
                            template = template.replaceAll('_HospitalId', id);
                            template = template.replace('_headerTitle', title);
                            template = template.replace('_description', description);
                            template = template.replace('_hospitalimage', "src='" + imagePath + "'");

                            // -- append dynamic template to div
                            $(NK.ShowHospitals.dv_ListOfHospitals)
                                .append(template);
                        });
                    }
                }
            });

        }
    },
    loadCart: function () {

        let services = NK.Common.getServicesCart();
        $(NK.ShowHospitals.dv_cart).html('');
        $(NK.ShowHospitals.btnNext).css('display', 'none');
        $.each(services, function (idx, ser) {
            
            let id = ser.Id;
            let quantity = ser.quantity == null ? "1" : ser.quantity;
            let title = NK.Common.getTitleFromLanguage(ser.TitlePlang, ser.TitleSlang);

            //if (ser.Price && ser.Price != "") {
            //    let totalPrice = quantity * ser.Price;
            //    quantity = quantity + " x " + ser.Price + " = " + totalPrice;
            //}
            let template = $(NK.ShowHospitals.dv_HospitalCart).html();

            template = template.replace('style="display:none;"', '');
            template = template.replace('_headerTitle', title);
            template = template.replace('_cartValue', quantity);
            template = template.replace('_ServiceId', id);

            $(NK.ShowHospitals.dv_cart).append(template);
            $(NK.ShowHospitals.btnNext).css('display', '');
        })
    },
    getStaticHospitalList: function () {
        let list = [
            {
                Id: 1,
                TitlePlang: "Society of Pediatric Nurses",
                TitleSlang: "Society of Pediatric Nurses",
                DescriptionPlang: "Society of Pediatric Nurses Desc",
                DescriptionSlang: "Society of Pediatric Nurses Desc",
                LogoImagePath: "/images/about-doc.png",

            },
            {
                Id: 2,
                TitlePlang: "American Association for Respiratory Care",
                TitleSlang: "American Association for Respiratory Care",
                DescriptionPlang: "American Association for Respiratory Care Desc",
                DescriptionSlang: "American Association for Respiratory Care Desc",
                LogoImagePath: "/images/about-doc.png",

            }
        ];

        return list;
    },

}
$(document).on("click", ".single-hosital", function () {
    let loggedInUser = NK.Common.getLoggedInUser();
    if (loggedInUser != null && loggedInUser != "") {
        window.location.href = "/Service/ShowPatientProfile";
    }
    else {
        NK.Common.logInFromPartialView = true;
        $("#loginModal").modal("show");
    }
});
$(function () {
    NK.ShowHospitals.loadHospital();
    NK.ShowHospitals.loadCart();
})
