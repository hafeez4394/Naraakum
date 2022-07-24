NK = NK || {};
NK.ShowServiceProvider = {
    dv_ListOfServiceProvidersTemplate: "#ServiceProvidersTemplate",
    dv_ListOfServiceProviders: ".ListOfServiceProviders",

    dv_cart: "#dv_cart",
    dv_ProviderCart: "#ProviderCartTemplate",

    List: {},

    loadList: function () {
        //let Id = NK.Common.getCategoryDisplayId();
        //if (Id) {
        //    let id = NK.Common.getCatCategoryId();
        //    let data = { "abc": id };
        //    let url = '/offeredServices/GetOfferedServicesListByCategory';
        //    NK.CommonRequest.AjaxCall(url, data, function (response) {

        //        if (response.List) {
        //            NK.ShowServiceProvider.List = response.List;
        
        NK.ShowServiceProvider.List = NK.ShowServiceProvider.getStaticList();

        if (NK.ShowServiceProvider.List && NK.ShowServiceProvider.List.length > 0) {
            $.each(NK.ShowServiceProvider.List, function (idx, ser) {
                let id = ser.Id;
                let title = ser.Fullname;
                let description = ser.Email;
                let imagePath = ser.ImagePath ? ser.ImagePath : "../images/upload-img.png";

                let template = $(NK.ShowServiceProvider.dv_ListOfServiceProvidersTemplate).html();

                template = template.replace('style="display:none;"', '');
                template = template.replaceAll('_HospitalId', id);
                template = template.replace('_headerTitle', title);
                template = template.replace('_description', description);
                template = template.replace('_hospitalimage', "src='" + imagePath + "'");

                // -- append dynamic template to div
                $(NK.ShowServiceProvider.dv_ListOfServiceProviders)
                    .append(template);
            });
        }
        //            NK.Common.setServicesCart(null);
        //        }
        //    });

        //}
    },
    loadCart: function () {

        let services = {};
        let carType = NK.Common.getServiceProviderCartType();
        switch (carType) {
            case "1":                                     // from ShowServices
                services = NK.Common.getServicesCart();
                break;
            case "2":                                     // from ShowSpecialities
                services = NK.Common.getSpecialitiesCart();
                break;
        }
            
        $(NK.ShowServiceProvider.dv_cart).html('');
        $(NK.ShowServiceProvider.btnNext).css('display', 'none');
        $.each(services, function (idx, ser) {
            
            let id = ser.Id;
            let quantity = ser.quantity == null ? "1" : ser.quantity;
            let title = NK.Common.getTitleFromLanguage(ser.TitlePlang, ser.TitleSlang);

            if (ser.Price && ser.Price != "") {
                let totalPrice = quantity * ser.Price;
                quantity = quantity + " x " + ser.Price + " = " + totalPrice;
            }
            let template = $(NK.ShowServiceProvider.dv_ProviderCart).html();

            template = template.replace('style="display:none;"', '');
            template = template.replace('_headerTitle', title);
            template = template.replace('_cartValue', quantity);
            template = template.replace('_ServiceId', id);

            $(NK.ShowServiceProvider.dv_cart).append(template);
            $(NK.ShowServiceProvider.btnNext).css('display', '');
        })
    },
    getStaticList: function () {
        let list = [
            {
                Id: 1,
                Fullname: "الطبيب / محمد الانصاري",
                CellNumber: "123456789111",
                Email: "saif99@gmail.com",
                ImagePath: "../images/ServiceProvider_01.png",
                DateofBirth: "2002-06-20 21:00:00"
            },
            {
                Id: 2,
                Fullname: "الطبيب / صالح عامر",
                CellNumber: "2001234567895",
                Email: "iamrajaaftab@gmail.com",
                ImagePath: "../images/ServiceProvider_01.png",
                DateofBirth: "2002-06-20 21:00:00"
            }
        ];

        return list;
    },

}

$(function () {
    NK.ShowServiceProvider.loadList();
    NK.ShowServiceProvider.loadCart();
    $(".service-provider").on("click", function () {
        let loggedInUser = NK.Common.getLoggedInUser();
        if (loggedInUser != null && loggedInUser != "") {
            window.location.href = "/Service/ShowPatientProfile";
        }
        else {
            NK.Common.logInFromPartialView = true;
            $("#loginModal").modal("show");
        }
    });
})
