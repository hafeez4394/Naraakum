NK = NK || {};
NK.ShowServices = {
    dv_ListOfService: ".ListOfService",
    dv_ServiceTemplate: "#ServiceTemplate",
    dv_ServiceWithoutIncludeTemplate: "#ServiceWithoutIncludeTemplate",

    dv_cart: "#dv_cart",
    dv_main_cart: "#dv_main_cart",
    dv_ServiceCart: "#ServiceCartTemplate",

    btnNext: "#btnNext",

    ServiceCategory: {
        1:{Id: 1, TitlePLang: "Service Provider", TitleSLang: "Service Provider" },
        2:{ Id: 2, TitlePLang: "Hospital", TitleSLang: "Hospital" },
    },

    serviceList: {},

    loadServices: function () {
        let Id = NK.Common.getCategoryDisplayId();
        if (Id) {
            let id = NK.Common.getCatCategoryId();
            let data = { "abc": id };
            let url = '/offeredServices/GetOfferedServicesListByCategory';
            NK.CommonRequest.AjaxCall(url, data, function (response) {

                if (response.OfferedServices) {
                    NK.ShowServices.serviceList = response.OfferedServices;
                    if (NK.ShowServices.serviceList && NK.ShowServices.serviceList.length > 0) {
                        $.each(NK.ShowServices.serviceList, function (idx, ser) {
                            let id = ser.Id;
                            let title = NK.Common.getTitleFromLanguage(ser.TitlePlang, ser.TitleSlang);
                            let Included = NK.Common.getTitleFromLanguage(ser.FeatureIncludedPlang, ser.FeatureIncludedSlang);
                            let Excluded = NK.Common.getTitleFromLanguage(ser.FeatureExcludedPlang, ser.FeatureExcludedSlang);
                            let description = NK.Common.getTitleFromLanguage(ser.DescriptionPlang, ser.DescriptionSlang);
                            /*let imagePath = ser.ImagePath ? "../images/upload-img.png" : ser.ImagePath;*/

                            let template = '';
                            if (Included != "")
                                template = $(NK.ShowServices.dv_ServiceTemplate).html();
                            else
                                template = $(NK.ShowServices.dv_ServiceWithoutIncludeTemplate).html();

                            template = template.replace('style="display:none;"', '');
                            template = template.replaceAll('_ServiceId', id);
                            template = template.replaceAll('_headerTitle', title);
                            template = template.replaceAll('_description', description);
                            template = template.replaceAll('_include', Included);
                            template = template.replaceAll('_exclude', Excluded);
                            //template = template.replaceAll('_serviceimage', "src='" + imagePath + "'");

                            // -- append dynamic template to div
                            $(NK.ShowServices.dv_ListOfService)
                                .append(template);
                        });
                    }
                    NK.Common.setServicesCart(null);
                }
            });

        }
    },
    loadCart: function () {
        
        let services = NK.Common.getServicesCart();
        $(NK.ShowServices.dv_cart).html('');
        $(NK.ShowServices.btnNext).css('display', 'none');
        $(NK.ShowServices.dv_main_cart).css('display', 'none');
        $.each(services, function (idx, ser) {

            let id = ser.Id;
            let quantity = ser.quantity == null ? "1" : ser.quantity;
            let title = NK.Common.getTitleFromLanguage(ser.TitlePlang, ser.TitleSlang);

            let template = $(NK.ShowServices.dv_ServiceCart).html();

            template = template.replace('style="display:none;"', '');
            template = template.replace('_headerTitle', title);
            template = template.replace('_cartValue', quantity);
            template = template.replace('_ServiceId', id);

            $(NK.ShowServices.dv_cart).append(template);
            $(NK.ShowServices.btnNext).css('display', '');
            $(NK.ShowServices.dv_main_cart).css('display', '');
        })
    },

    onServiceSelection: function (chkbox) {

        let _id = parseInt($(chkbox).attr('id'));
        let _isChecked = $(chkbox).is(':checked');

        let services = NK.Common.getServicesCart();
        services = services == null ? [] : services;
        if (_isChecked) {
            $.each(NK.ShowServices.serviceList, function (idx, ser) {
                if (ser.Id == _id) {
                    ser.quantity = 1;
                    services.push(ser);
                }
            })
        }
        else {

            services = $.grep(services, function (ser) {
                return ser.Id != _id;
            });
        }
        NK.Common.setServicesCart(services);
        NK.ShowServices.loadCart();
    },
    getQuantityTextbox: function (evt) {
        let q = $(evt.currentTarget)
            .parents(".dv_singleCart")
            .find(".cartQuantity");

        return q;
    },
    updateQuantityInList: function (id, quantity) {

        let col = NK.Common.getServicesCart();
        col
            .find(itm => itm.Id == id)
            .quantity = quantity;
        NK.Common.setServicesCart(col);
        NK.ShowServices.loadCart();
    },
    redirectToServiceCategoryView: function () {
        let services = NK.Common.getServicesCart();
        if (services && services.length > 0) {
            let ServiceCategoryId = parseInt(services[0].CatServiceCategoryId);
            switch (ServiceCategoryId) {
                case NK.ShowServices.ServiceCategory[1].Id:
                    window.location.href = "../Service/ShowHospitals";
                    break;
                case NK.ShowServices.ServiceCategory[2].Id:
                    NK.Common.setServiceProviderCartType(1);
                    window.location.href = "../Service/ShowServiceProviders";
                    break;
            }
        }
    },
    onSuccess_GoogleMap: function () {
        NK.ShowServices.redirectToServiceCategoryView();
    },
}


$(function () {
    NK.ShowServices.loadServices();
    NK.GoogleMap.Initialize_Map(NK.ShowServices.onSuccess_GoogleMap);
    NK.GoogleMap.attachKeyPress();

    $(document)
        .on("click", ".increaseCartQuantity", function (evt) {
            
            let q = NK.ShowServices.getQuantityTextbox(evt);

            let id = q.attr('id');
            let v = parseInt(q.text());
            $(q).text((v++).toString());

            NK.ShowServices.updateQuantityInList(id, v);

        })
        .on("click", ".decreaseCartQuantity", function (evt) {
            
            let q = NK.ShowServices.getQuantityTextbox(evt);
            let id = q.attr('id');

            let v = parseInt(q.text()) <= 1 || q.text() == ''
                ? 1 : q.text();
            if (v > 1) {
                $(q).text((v--).toString());
            }
            NK.ShowServices.updateQuantityInList(id, v);
        })
        .on("click", ".deleteServiceFromCart", function (evt) {
            
            let q = NK.ShowServices.getQuantityTextbox(evt);
            let _id = q.attr('id');

            let services = NK.Common.getServicesCart();
            services = $.grep(services, function (ser) {
                return ser.Id != _id;
            });
            $('#' + _id).prop('checked', false);

            NK.Common.setServicesCart(services);
            NK.ShowServices.loadCart();
        })

})
