NK = NK || {};
NK.ShowServicesAndPackages = {
    dv_ServiceTemplate_Packages: "#ServicesAndPackagesTemplate_Packages",
    dv_ServiceTemplate_Services: "#ServicesAndPackagesTemplate_Services",
    dv_ListOfService: ".Listofcategories",
    dv_ListOfPackages: ".Listofpackages",

    dv_cart: "#dv_cart",
    dv_ServiceCart: "#ServicesAndPackagesCartTemplate",

    serviceList: {},
    packagesList: {},

    loadServicesAndPackages: function () {
        let Id = NK.Common.getCategoryDisplayId();
        if (Id) {
            let id = NK.Common.getCatCategoryId();
            let data = { "abc": id };
            let url = '/offeredServices/GetOfferedServicesListByCategory';
            NK.CommonRequest.AjaxCall(url, data, function (response) {
                debugger
                if (response.OfferedServices || response.PackagesList) {
                    NK.ShowServicesAndPackages.serviceList = response.OfferedServices;
                    if (NK.ShowServicesAndPackages.serviceList && NK.ShowServicesAndPackages.serviceList.length > 0) {
                        $.each(NK.ShowServicesAndPackages.serviceList, function (idx, ser) {
                            let id = ser.Id;
                            let price = ser.Price;
                            let title = NK.Common.getTitleFromLanguage(ser.TitlePlang, ser.TitleSlang);
                            let featureInclude = NK.Common.getTitleFromLanguage(ser.FeatureIncludedPlang, ser.FeatureIncludedSlang);
                            let featureExclude = NK.Common.getTitleFromLanguage(ser.FeatureExcludedPlang, ser.FeatureExcludedSlang);
                            let description = NK.Common.getTitleFromLanguage(ser.DescriptionPlang, ser.DescriptionSlang);
                            let imagePath = ser.ImagePath || ser.ImagePath == undefined ? "../images/upload-img.png" : ser.ImagePath;

                            let template = $(NK.ShowServicesAndPackages.dv_ServiceTemplate_Services).html();

                            featureInclude = featureInclude ?? "";
                            featureExclude = featureExclude ?? "";

                            template = template.replace('style="display:none;"', '');
                            template = template.replaceAll('_ServicesAndPackagesId', id);
                            template = template.replace('_headerTitle', title);
                            /*template = template.replace('_description', description);*/
                            template = template.replace('_type', "'s'");
                            //template = template.replace('_price', price);
                            //template = template.replace('_servicesandpackagesimage', "src='" + imagePath + "'");
                            template = template.replace('_include', featureInclude);
                            template = template.replace('_exclude', featureExclude);

                            // -- append dynamic template to div
                            $(NK.ShowServicesAndPackages.dv_ListOfService)
                                .append(template);
                        });
                    }

                    NK.ShowServicesAndPackages.packagesList = response.PackagesList;
                    if (NK.ShowServicesAndPackages.packagesList && NK.ShowServicesAndPackages.packagesList.length > 0) {
                        $.each(NK.ShowServicesAndPackages.packagesList, function (idx, ser) {
                            let id = ser.Id;
                            let price = ser.Price;
                            let title = NK.Common.getTitleFromLanguage(ser.TitlePlang, ser.TitleSlang);
                            let description = NK.Common.getTitleFromLanguage(ser.DescriptionPlang, ser.DescriptionSlang);
                            let featureInclude = NK.Common.getTitleFromLanguage(ser.FeatureIncludedPlang, ser.FeatureIncludedSlang);
                            let featureExclude = NK.Common.getTitleFromLanguage(ser.FeatureExcludedPlang, ser.FeatureExcludedSlang);
                            let imagePath = ser.ImagePath || ser.ImagePath == undefined ? "../images/upload-img.png" : ser.ImagePath;

                            let template = $(NK.ShowServicesAndPackages.dv_ServiceTemplate_Packages).html();

                            template = template.replace('style="display:none;"', '');
                            template = template.replaceAll('_ServicesAndPackagesId', id);
                            template = template.replace('_headerTitle', title);
                            template = template.replace('_description', description);
                            template = template.replace('_type', "'p'");
                            template = template.replace('_price', price);

                            template = template.replace('_include', featureInclude);
                            template = template.replace('_exclude', featureExclude);

                            template = template.replace('_servicesandpackagesimage', "src='" + imagePath + "'");

                            // -- append dynamic template to div
                            $(NK.ShowServicesAndPackages.dv_ListOfPackages)
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
        $(NK.ShowServicesAndPackages.dv_cart).html('');
        $('#btnNext').css('display', 'none');
        $('.Cartbody').css('display', 'none');
        $.each(services, function (idx, ser) {

            let id = ser.Id;
            let quantity = ser.quantity == null ? "1" : ser.quantity;
            let title = NK.Common.getTitleFromLanguage(ser.TitlePlang, ser.TitleSlang);

            let template = $(NK.ShowServicesAndPackages.dv_ServiceCart).html();

            template = template.replace('style="display:none;"', '');
            template = template.replace('_headerTitle', title);
            template = template.replace('_cartValue', quantity);
            template = template.replaceAll('_ServicesAndPackagesId', id);
            template = template.replace('_type', ser.type);

            $('#btnNext').css('display', '');
            $('.Cartbody').css('display', '');
            $(NK.ShowServicesAndPackages.dv_cart).append(template);
        })
    },

    onServicesAndPackagesSelection: function (chkbox, type) {

        let _id = parseInt($(chkbox).attr('id'));
        let _isChecked = $(chkbox).is(':checked');

        let services = NK.Common.getServicesCart();
        services = services == null ? [] : services;
        if (_isChecked) {
            switch (type) {
                case "s":
                    $.each(NK.ShowServicesAndPackages.serviceList, function (idx, ser) {
                        if (ser.Id == _id) {
                            ser.type = type;
                            ser.quantity = 1;
                            services.push(ser);
                        }
                    })
                    break;
                case "p":
                    $.each(NK.ShowServicesAndPackages.packagesList, function (idx, ser) {
                        if (ser.Id == _id) {
                            ser.type = type;
                            ser.quantity = 1;
                            services.push(ser);
                        }
                    })
                    break;
            }

        }
        else {

            services = $.grep(services, function (ser) {
                return ser.Id != _id;
            });
        }
        NK.Common.setServicesCart(services);
        NK.ShowServicesAndPackages.loadCart();
    },
    getQuantityTextbox: function (evt) {
        let q = $(evt.currentTarget)
            .parents(".dv_singleCart")
            .find(".cartQuantity");

        return q;
    },
    updateQuantityInList: function (id, quantity) {

        let col = NK.Common.getServicesCart();
        col.find(itm => itm.Id == id).quantity = quantity;
        NK.Common.setServicesCart(col);
        NK.ShowServicesAndPackages.loadCart();
    },
    redirectToServiceCategoryView: function () {
        window.location.href = "../Service/ShowHospitals";
    },
    onSuccess_GoogleMap: function () {
        NK.ShowServicesAndPackages.redirectToServiceCategoryView();
    },
}

$(function () {
    NK.ShowServicesAndPackages.loadServicesAndPackages();
    NK.GoogleMap.Initialize_Map(NK.ShowServicesAndPackages.onSuccess_GoogleMap);
    NK.GoogleMap.attachKeyPress();
    $(document)
        .on("click", ".increaseCartQuantity", function (evt) {

            let q = NK.ShowServicesAndPackages.getQuantityTextbox(evt);

            let id = q.attr('id');
            let v = parseInt(q.text());
            $(q).val((v++).toString());

            NK.ShowServicesAndPackages.updateQuantityInList(id, v);

        })
        .on("click", ".decreaseCartQuantity", function (evt) {
            let q = NK.ShowServicesAndPackages.getQuantityTextbox(evt);
            let id = q.attr('id');

            let v = parseInt(q.text()) <= 1 || q.text() == ''
                ? 1 : q.text();
            if (v > 1) {
                $(q).val((v--).toString());
            }
            NK.ShowServicesAndPackages.updateQuantityInList(id, v);
        })
        .on("click", ".deleteServicesAndPackagesFromCart", function (evt) {

            //let q = NK.ShowServicesAndPackages.getQuantityTextbox(evt);
            //let _id = q.attr('id');

            let _id = $(evt.currentTarget).attr('id');

            let services = NK.Common.getServicesCart();
            services = $.grep(services, function (ser) {
                return ser.Id != _id;
            });
            $('#' + _id).prop('checked', false);

            NK.Common.setServicesCart(services);
            NK.ShowServicesAndPackages.loadCart();
        })

})
