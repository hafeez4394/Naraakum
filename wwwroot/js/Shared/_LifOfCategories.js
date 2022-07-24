var NK = NK || {};


NK.ListOfCategories = {
    dv_CateogyTemplate: "#CategoryTemplate",
    dv_ListOfCategories: ".Listofcategories",
    dv_ListOfCategoryspecialities: "#Listofcategoryspecialities",
    dv_CategorySpecialityTemplate: "#CategorySpecialityTemplate",

    def_Categories_image: '../images/about-doc.png',
    def_Specialities_image: '../images/docimg.png',

    modal_Speciality: "#SpecialitiesModal",
    modal_GoogleMap: "#GoogleMapModal",

    // ********** CategoryDisplayType
    CatCategoryTypeId: {
        1: { Id: "1", TitlePLang: "Services & Packages", TitleSlang: "الخدمات والحزم" },
        2: { Id: "2", TitlePLang: "Speciality", TitleSlang: "Speciality" },
        3: { Id: "3", TitlePLang: "Service", TitleSlang: "Service" },
    },

    // ******** Ajax Calls
    loadListOfCategories: function () {

        let data = {};
        let url = '/offeredServices/GetOfferedServicesCategories';
        NK.CommonRequest.AjaxGetCall(url, data, function (response) {
            NK.ListOfCategories.fillListOfCategories(response);
        });
    },
    CategoryDisplayWRTTypeId: function (_Id, _displayTypeId) {

        NK.Common.setCatCategoryId(_Id);
        NK.Common.setCategoryDisplayId(_displayTypeId);

        switch (_displayTypeId) {
            case NK.ListOfCategories.CatCategoryTypeId[1].Id:
                window.location.href = "../Service/ShowServicesAndPackages";
                break;
            case NK.ListOfCategories.CatCategoryTypeId[2].Id:
                window.location.href = "../Service/ShowSpecialities";
                break;
            case NK.ListOfCategories.CatCategoryTypeId[3].Id:
                window.location.href = "../Service/ShowServices";
                break;
        }

        //let data = { "abc": abc };
        //let url = '/offeredServices/GetOfferedServicesListByCategory';
        //NK.CommonRequest.AjaxCall(url, data, function (response) {

        //    $(NK.ListOfCategories.dv_ListOfCategoryspecialities).html('');

        //    if (_displayTypeId == 2) {
        //        let list = response.SpecialtyList;
        //        if (list.length == 0)
        //            return $(NK.ListOfCategories.dv_ListOfCategoryspecialities).html('No record found.');
        //        NK.ListOfCategories.fillSpeciality_Popup(list);
        //    }
        //    if (_displayTypeId == 5) {
        //        let services = response.OfferedServices;
        //        if (services.length == 0)
        //            return $(NK.ListOfCategories.dv_ListOfCategoryspecialities).html('No record found.');
        //        NK.ListOfCategories.fillGoogleMap_Popup(services);
        //    }

        //});
    },

    fillListOfCategories: function (response) {
        if (response && response.OfferedCategories) {
            $.each(response.OfferedCategories, function (idx, category) {
                //let encKey = NK.Common.encryptData("salt", category.Id);
                let CategoryId = category.Id;
                let title = NK.Common.getTitleFromLanguage(category.TitlePlang, category.TitleSlang);
                let description = NK.Common.getTitleFromLanguage(category.DescriptionPlang, category.DescriptionSlang);
                let imagePath = category.ImagePath == null ? NK.ListOfCategories.def_Categories_image : category.ImagePath;  // temp

                let template = $(NK.ListOfCategories.dv_CateogyTemplate).html();

                template = template.replace('style="display:none;"', '');
                //template = template.replaceAll('_CategoryId', encKey);
                template = template.replaceAll('_CategoryId', CategoryId);
                template = template.replace('_headerTitle', title);
                template = template.replace('_description', description);
                template = template.replace('_DisplayTypeId', category.CatCategoryTypeId);
                template = template.replace('_cateogryimage', "src='" + imagePath + "'");

                // -- append dynamic template to div
                $(NK.ListOfCategories.dv_ListOfCategories)
                    .append(template);
            })
        }
    },
    fillSpeciality_Popup: function (list) {
        $.each(list, function (idx, speciality) {
            let encKey = NK.Common.encryptData("salt", speciality.Id);
            let title = NK.Common.getTitleFromLanguage(speciality.TitlePlang, speciality.TitleSlang);
            let description = NK.Common.getTitleFromLanguage(speciality.DescriptionPlang, speciality.DescriptionSlang);
            let imagePath = speciality.ImagePath == null ? NK.ListOfCategories.def_Specialities_image : speciality.ImagePath; // temp

            let template = $(NK.ListOfCategories.dv_CategorySpecialityTemplate).html();

            template = template.replace('style="display:none;"', '');
            template = template.replaceAll('_SpecialityId', encKey);
            template = template.replace('_headerTitle', title);
            template = template.replace('_description', description);
            template = template.replace('_DisplayTypeId', speciality.CatCategoryTypeId);
            template = template.replace('_specialityimage', "src='" + imagePath + "'");


            $(NK.ListOfCategories.dv_ListOfCategoryspecialities)
                .append(template);
        })
    },
    fillGoogleMap_Popup: function (services) { },

    Localization: function () {
        let culture = NK.Common.getLanguageCulture(NK.ListOfCategoriesCulture);
        $('#healthcare').html(culture.ServicesAndPackages);
        $('#service-tab').html(culture.Services);
        $('#package-tab').html(culture.Packages);
    },
    
}

$(function () {
    NK.ListOfCategories.Localization();
    NK.ListOfCategories.loadListOfCategories();
    //NK.GoogleMap.Initialize_Map(null);
    //NK.GoogleMap.attachKeyPress();

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
            elem.append('  <div id="left-button"><a href="javascript:void(0)">→</a></div>');
            elem.append('<div id="right-button"><a href="javascript:void(0)">←</a></div>');
            elem2.append('  <div id="left-button2"><a href="javascript:void(0)">→</a></div>');
            elem2.append('<div id="right-button2"><a href="javascript:void(0)">←</a></div>');
        }
        else {
            elem.append('  <div id="right-button"><a href="javascript:void(0)">→</a></div>');
            elem.append('<div id="left-button"><a href="javascript:void(0)">←</a></div>');
            elem2.append('  <div id="right-button2"><a href="javascript:void(0)">→</a></div>');
            elem2.append('<div id="left-button2"><a href="javascript:void(0)">←</a></div>');
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
                setVisible($('#left-button'));
            }
        };
        var updateUI2 = function () {
            var maxWidth2 = outer2.outerWidth(true);
            var actualWidth2 = 0;
            $.each($('#inner2 >'), function (i, item2) {
                actualWidth2 += $(item2).outerWidth(true);
            });

            if (actualWidth2 <= maxWidth2) {
                setVisible2($('#left-button2'));
            }
        };

        updateUI(); updateUI2();

        var sc = $('#inner').width();

        $('#right-button').click(function () {
            var leftPos = outer.scrollLeft();
            outer.animate({
                scrollLeft: leftPos - sc
            }, 800, function () {
                if ($('#outer').scrollLeft() <= 0) {
                    setInvisible($('#right-button'));
                }
            });
        });
        $('#right-button2').click(function () {

            var leftPos2 = outer2.scrollLeft();
            outer2.animate({
                scrollLeft: leftPos2 - sc
            }, 800, function () {
                if ($('#outer2').scrollLeft() <= 0) {
                    setInvisible2($('#right-button2'));
                }
            });
        });

        $('#left-button').click(function () {
            setVisible($('#right-button'));
            var leftPos = outer.scrollLeft();
            outer.animate({
                scrollLeft: leftPos + sc
            }, 800);
        });
        $('#left-button2').click(function () {
            setVisible2($('#right-button2'));
            var leftPos2 = outer2.scrollLeft();
            outer2.animate({
                scrollLeft: leftPos2 + sc
            }, 800);
        });

        $(window).resize(function () {
            updateUI();
        });
    });
})