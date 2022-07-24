var NK = NK || {};


NK.ListOfServices = {
    pageSize: 6,
    swap_Services_index: 0,
    swap_Services_index_datafound: 0,
    dv_CateogyTemplate: "#ServicesTemplate",
    dv_ListOfServices: ".Listofservices",

    // ******** Ajax Calls
    loadListOfServices: function (pageSize, pageNo) {

        let data = {
            "pageSize": pageSize,
            "pageNo": pageNo
        };
        //let url = '/offeredServices/GetOfferedServicesList';
        //NK.CommonRequest.AjaxCall(url, data, function (response) {
        //    NK.ListOfServices.swap_Services_index_datafound
        //        = NK.ListOfServices.swap_Services_index

        //    $(NK.ListOfServices.dv_ListOfServices).html('');

        //    NK.ListOfServices.fillListOfServices(response);
        //}, function (xhr) {
        //    NK.ListOfServices.swap_Services_index =
        //        NK.ListOfServices.swap_Services_index_datafound
        //});
    },
    fillListOfServices: function (response) {
        if (response && response.OfferedServicesList) {
            $.each(response.OfferedServicesList, function (idx, service) {

                let encKey = NK.Common.encryptData("salt", service.Id);
                let title = NK.Common.getTitleFromLanguage(service.TitlePlang, service.TitleSlang);
                //let description = NK.Common.getTitleFromLanguage(service.DescriptionPlang, service.DescriptionSlang);
                //let ModalTarget = service.CatCategoryDisplayTypeId == 1 ? NK.ListOfServices.modal_Speciality : NK.ListOfServices.modal_GoogleMap;
                let imagePath = service.ImagePath == null ? NK.ListOfServices.def_Categories_image : service.ImagePath;  // temp

                let template = $(NK.ListOfServices.dv_CateogyTemplate).html();

                template = template.replace('style="display:none;"', '');
                template = template.replaceAll('_ServiceId', encKey);
                template = template.replace('_headerTitle', title);
                template = template.replace('_DisplayTypeId', service.CatCategoryDisplayTypeId);
                //template = template.replace('_CategoryType', category.CatCategoryDisplayTypeId == 1 ? "Speciality" : "Google Map");  // temp
                template = template.replace('_serviceimage', "src='" + imagePath + "'");
                //template = template.replace('_ModalTarget', ModalTarget);

                $(NK.ListOfServices.dv_ListOfServices)
                    .append(template);
            })
        }
    },
    loadServiceOnSwapClick: function () {
        if (NK.ListOfServices.swap_Services_index < 1)
            NK.ListOfServices.swap_Services_index = 1;
        NK.ListOfServices.loadListOfServices(NK.ListOfServices.pageSize, NK.ListOfServices.swap_Services_index);
    },
    Localization: function () {
        let culture = NK.Common.getLanguageCulture(NK.ListOfServicesCulture);
        $('#healthcare').html(culture.ServicesAndPackages);
        $('#service-tab').html(culture.Services);
        $('#package-tab').html(culture.Packages);
    },
    redirectToShowServices: function () {
        window.location.href = "../Service/ShowServices";
    },
}

$(function () {
    NK.ListOfServices.swap_Services_index = 1;
    NK.ListOfServices.Localization();
    NK.ListOfServices.loadListOfServices(NK.ListOfServices.pageSize, NK.ListOfServices.swap_Services_index);

    $(function () {
        var print = function (msg) {
            alert(msg);
        };

        var setInvisible = function (elem) {
            elem.css('visibility', 'hidden');
        };
        var setVisible = function (elem) {
            elem.css('visibility', 'visible');
        };
        var setInvisible2 = function (elem2) {
            elem2.css('visibility', 'hidden');
        };
        var setVisible2 = function (elem2) {
            elem2.css('visibility', 'visible');
        };

        var elem = $("#Listofcategories");
        var items = elem.children();
        var elem2 = $("#elem2");
        var items2 = elem2.children();

        // Inserting Buttons
        if (NK.Common.CurrentLanguage == 'en') {
            elem.append('  <div id="service-left-swap-button"  class="left-swap-button"><a href="javascript:void(0)">→</a></div>');
            elem.append('<div id="service-right-swap-button" class="right-swap-button"><a href="javascript:void(0)">←</a></div>');
            elem2.append('  <div id="service-left-swap-button2"  class="left-swap-button2"><a href="javascript:void(0)">→</a></div>');
            elem2.append('<div id="service-right-swap-button2"  class="right-swap-button2"><a href="javascript:void(0)">←</a></div>');
        }
        else {
            elem.append('  <div id="service-right-swap-button" class="right-swap-button"><a href="javascript:void(0)">→</a></div>');
            elem.append('<div id="service-left-swap-button" class="left-swap-button"><a href="javascript:void(0)">←</a></div>');
            elem2.append('  <div id="service-right-swap-button2" class="right-swap-button2"><a href="javascript:void(0)">→</a></div>');
            elem2.append('<div id="service-left-swap-button2" class="left-swap-button2"><a href="javascript:void(0)">←</a></div>');
        }

        // Inserting Inner
        items.wrapAll('<div id="inner" />');
        items2.wrapAll('<div id="inner2" />');

        // Inserting Outer
        elem.find('#inner').wrap('<div id="outer"/>');
        elem2.find('#inner2').wrap('<div id="outer2"/>');

        var outer = $('#outer');
        var outer2 = $('#outer2');

        var updateUI = function () {
            var maxWidth = outer.outerWidth(true);
            var actualWidth = 0;
            $.each($('#inner >'), function (i, item) {
                actualWidth += $(item).outerWidth(true);
            });

            if (actualWidth <= maxWidth) {
                setVisible($('#service-left-swap-button'));
            }
        };
        var updateUI2 = function () {
            var maxWidth2 = outer2.outerWidth(true);
            var actualWidth2 = 0;
            $.each($('#inner2 >'), function (i, item2) {
                actualWidth2 += $(item2).outerWidth(true);
            });

            if (actualWidth2 <= maxWidth2) {
                setVisible2($('#service-left-swap-button2'));
            }
        };

        updateUI(); updateUI2();

        var sc = $('#inner').width();

        $('#service-right-swap-button').click(function () {
            var leftPos = outer.scrollLeft();
            outer.animate({
                scrollLeft: leftPos - sc
            }, 800, function () {
                if ($('#outer').scrollLeft() <= 0) {
                    setInvisible($('#service-right-swap-button'));
                }
            });
            //console.log('right-button');
            NK.ListOfServices.swap_Services_index--;
            NK.ListOfServices.loadServiceOnSwapClick();
        });
        $('#service-right-swap-button2').click(function () {

            var leftPos2 = outer2.scrollLeft();
            outer2.animate({
                scrollLeft: leftPos2 - sc
            }, 800, function () {
                if ($('#outer2').scrollLeft() <= 0) {
                    setInvisible2($('#service-right-swap-button2'));
                }
            });
            NK.ListOfServices.swap_Services_index++;
            NK.ListOfServices.loadServiceOnSwapClick();
        });

        $('#service-left-swap-button').click(function () {
            setVisible($('#service-right-swap-button'));
            var leftPos = outer.scrollLeft();
            outer.animate({
                scrollLeft: leftPos + sc
            }, 800);
            NK.ListOfServices.swap_Services_index++;
            NK.ListOfServices.loadServiceOnSwapClick();
        });
        $('#service-left-swap-button2').click(function () {
            setVisible2($('#service-right-swap-button2'));
            var leftPos2 = outer2.scrollLeft();
            outer2.animate({
                scrollLeft: leftPos2 + sc
            }, 800);

            NK.ListOfServices.swap_Services_index--;
            NK.ListOfServices.loadServiceOnSwapClick();
        });

        $(window).resize(function () {
            updateUI();
        });
    });
})