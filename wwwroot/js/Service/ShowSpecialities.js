NK = NK || {};
NK.ShowSpecialities = {
    dv_SpecialityTemplate: "#SpecialityTemplate",
    dv_ListOfSpeciality: ".ListOfSpeciality",

    dv_cart: "#dv_cart",
    dv_SpecialityCart: "#SpecialityCartTemplate",

    SpecialityList: {},

    loadSpecialities: function () {

        let Id = NK.Common.getCategoryDisplayId();
        if (Id) {
            let id = NK.Common.getCatCategoryId();
            let data = { "abc": id };
            let url = '/offeredServices/GetOfferedServicesListByCategory';
            NK.CommonRequest.AjaxCall(url, data, function (response) {

                if (response.SpecialityList) {
                    NK.ShowSpecialities.serviceList = response.SpecialityList;
                    if (NK.ShowSpecialities.serviceList && NK.ShowSpecialities.serviceList.length > 0) {
                        $.each(NK.ShowSpecialities.serviceList, function (idx, ser) {
                            let id = ser.Id;
                            let title = NK.Common.getTitleFromLanguage(ser.TitlePlang, ser.TitleSlang);
                            let description = NK.Common.getTitleFromLanguage(ser.DescriptionPlang, ser.DescriptionSlang);
                            let imagePath = ser.ImagePath || ser.ImagePath == undefined ? ser.ImagePath : "../images/upload-img.png";
                            
                            let template = $(NK.ShowSpecialities.dv_SpecialityTemplate).html();

                            template = template.replace('style="display:none;"', '');
                            template = template.replaceAll('_SpecialityId', id);
                            template = template.replace('_headerTitle', title);
                            template = template.replace('_description', description);
                            template = template.replace('_specialityimage', "src='" + imagePath + "'");

                            // -- append dynamic template to div
                            $(NK.ShowSpecialities.dv_ListOfSpeciality)
                                .append(template);
                        });
                    }
                    NK.Common.setSpecialitiesCart(null);
                }
            });

        }
    },
    loadCart: function () {
        let Specialities = NK.Common.getSpecialitiesCart();
        $(NK.ShowSpecialities.dv_cart).html('');
        $('#btnNext').css('display', 'none');
        $.each(Specialities, function (idx, ser) {

            let id = ser.Id;
            let quantity = ser.quantity == null ? "1" : ser.quantity;
            let title = NK.Common.getTitleFromLanguage(ser.TitlePlang, ser.TitleSlang);

            let template = $(NK.ShowSpecialities.dv_SpecialityCart).html();

            template = template.replace('style="display:none;"', '');
            template = template.replace('_headerTitle', title);
            template = template.replace('_cartValue', quantity);
            template = template.replace('_SpecialityId', id);

            $(NK.ShowSpecialities.dv_cart).append(template);
            $('#btnNext').css('display', '');
        })
    },

    onSpecialitySelection: function (chkbox) {
        let _id = parseInt($(chkbox).attr('id'));
        let _isChecked = $(chkbox).is(':checked');

        let Specialities = NK.Common.getSpecialitiesCart();
        Specialities = Specialities == null ? [] : Specialities;
        if (_isChecked) {
            $.each(NK.ShowSpecialities.serviceList, function (idx, ser) {
                if (ser.Id == _id) {
                    ser.quantity = 1;
                    Specialities.push(ser);
                }
            })
        }
        else {

            Specialities = $.grep(Specialities, function (ser) {
                return ser.Id != _id;
            });
        }
        NK.Common.setSpecialitiesCart(Specialities);
        NK.ShowSpecialities.loadCart();
    },
    onSpecialityClick: function (chkbox) {
        let _id = parseInt($(chkbox).attr('id'));
        //let _isChecked = $(chkbox).is(':checked');

        let Specialities = [];
        //let Specialities = NK.Common.getSpecialitiesCart();
        //Specialities = Specialities == null ? [] : Specialities;
        /*if (_isChecked) {*/
        $.each(NK.ShowSpecialities.serviceList, function (idx, ser) {
            if (ser.Id == _id) {
                ser.quantity = 1;
                Specialities.push(ser);
            }
        })
        //}
        //else {
        //    Specialities = $.grep(Specialities, function (ser) {
        //        return ser.Id != _id;
        //    });
        //}
        NK.Common.setSpecialitiesCart(Specialities);
        //NK.ShowSpecialities.loadCart();
    },
    getQuantityTextbox: function (evt) {
        let q = $(evt.currentTarget)
            .parents(".dv_singleCart")
            .find(".cartQuantity");

        return q;
    },
    updateQuantityInList: function (id, quantity) {
        let col = NK.Common.getSpecialitiesCart();
        col
            .find(itm => itm.Id == id)
            .quantity = quantity;
        NK.Common.setSpecialitiesCart(col);

        NK.ShowSpecialities.loadCart();
    },
    redirectToServiceCategoryView: function () {
        NK.Common.setServiceProviderCartType(2);
        window.location.href = "../Service/ShowServiceProviders";
    },
    onSuccess_GoogleMap: function () {
        NK.ShowSpecialities.redirectToServiceCategoryView();
    },
}

$(function () {
    NK.ShowSpecialities.loadSpecialities();
    NK.GoogleMap.Initialize_Map(NK.ShowSpecialities.onSuccess_GoogleMap);
    NK.GoogleMap.attachKeyPress();
    $(document)
        .on("click", ".increaseCartQuantity", function (evt) {

            let q = NK.ShowSpecialities.getQuantityTextbox(evt);

            let id = q.attr('id');
            let v = parseInt(q.val());
            $(q).val((v++).toString());

            NK.ShowSpecialities.updateQuantityInList(id, v);

        })
        .on("click", ".decreaseCartQuantity", function (evt) {
            let q = NK.ShowSpecialities.getQuantityTextbox(evt);
            let id = q.attr('id');

            let v = parseInt(q.val()) <= 1 || q.val() == ''
                ? 1 : q.val();
            if (v > 1) {
                $(q).val((v--).toString());
            }
            NK.ShowSpecialities.updateQuantityInList(id, v);
        })
        .on("click", ".deleteSpecialityFromCart", function (evt) {

            let q = NK.ShowSpecialities.getQuantityTextbox(evt);
            let _id = q.attr('id');

            let Specialities = NK.Common.getSpecialitiesCart();
            Specialities = $.grep(Specialities, function (ser) {
                return ser.Id != _id;
            });
            $('#' + _id).prop('checked', false);

            NK.Common.setSpecialitiesCart(Specialities);
            NK.ShowSpecialities.loadCart();
        })

})
