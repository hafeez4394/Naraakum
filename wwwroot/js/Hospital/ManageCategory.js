
var NK = NK || {};
NK.ManageCategory = {
    name: "",
    catData: "",
    message: "",
    resources: {},
    flagSave: "",
    flagCate: "",
    AvailableServices: [],
    OrgServices: [],
    CatCategoryTypeId: {
        1: { Id: "1", TitlePLang: "Services & Packages", TitleSlang: "الخدمات والحزم" },
        2: { Id: "2", TitlePLang: "Speciality", TitleSlang: "Speciality" },
        3: { Id: "3", TitlePLang: "Service", TitleSlang: "Service" },
    },
    CatServicesAndSpeciltyTitles: {
        1: { Id: "1", AvailableTitlePLang: "Available Services", OfferdTitlePLang: "Offerd Services", SelectButtonTitle: "Select Services", RemoveButtonTitle: "Remove Services", TitleSlang: "الخدمات والحزم" },
        2: { Id: "2", AvailableTitlePLang: "Available Speciality", OfferdTitlePLang: "Offerd Speciality", SelectButtonTitle: "Select Speciality", RemoveButtonTitle: "Remove Speciality", TitleSlang: "الخدمات والحزم" }
    },
    Categorieslist: {},
    serviceList: [],
    catlist: "",
    specialtyIds: "",
    getClearList: function (response) {
        NK.ManageCategory.catlist = "";
        NK.ManageCategory.serviceList = [];
        NK.ManageCategory.specialtyIds = "";
    },
    saveData: function (flag) {
        debugger;
        if (flag == 1) {
            var url = "/organization/CreatOrganizationCategories";
            var data = {
                "OrganizationId": 1,
                "CategoryIds": NK.ManageCategory.catlist,
            }
        }
        if (flag == 2) {
            var url = "/organization/CreatOrganizationServices";
            var data = {
                "OrganizationId": "1",
                "CatCategoryId": NK.ManageCategory.flagCate,
                "ServiceIds": NK.ManageCategory.serviceList
            }
        }
        if (flag == 3) {
            var url = "/organization/CreatOrganizationSpecialties";
            var data = {
                "OrganizationId": 1,
                "CategoryId": NK.ManageCategory.flagCate,
                "SpecialtyIds": NK.ManageCategory.specialtyIds
            }
        }
        NK.CommonRequest.NodeAPIAjaxCall(url, JSON.stringify(data), function (response) {
            debugger;
            if (response.ResponseStatus.STATUSCODE == 200) {
                NK.Common.ShowSuccessModal("Data has been saved successfully");
                NK.ManageCategory.getClearList();
            }
            else {
                NK.Common.ShowSuccessModal();
            }
        });
    },
    nextAction: function (name) {
        if (name == 2) {
            $("#profile-tab").click();
            NK.ManageCategory.fillOfferdCategoriesList();
        }
        else {
            NK.ManageCategory.serviceList = [];
            NK.ManageCategory.specialtyIds = "";
            $($("#OfferdService").find(".chkCategory")).each(function (idx, ch) {
                var data = {};
                data.Id = $(ch).attr("Id");
                data.Price = $(ch).parent("li").find(".FinalServicePrice").val();
                if (NK.ManageCategory.flagSave == 2) {
                    NK.ManageCategory.serviceList.push(data);
                }
                else {
                    if (NK.ManageCategory.specialtyIds.length == 0) NK.ManageCategory.specialtyIds = data.Id;
                    else NK.ManageCategory.specialtyIds = NK.ManageCategory.specialtyIds + "," + data.Id;
                }
            });
            NK.ManageCategory.saveData(NK.ManageCategory.flagSave);
        }
    },
    previousAction: function (name) {
        if (name == 1) $("#home-tab").click();
    },
    //get all category which is already assign to hospital/Organization
    getByOrganizationId: function (Id) {
        var url = "/organization/GetOrganizationCategoriesByOrganizationId";
        var data = { "OrganizationId": 1 }
        NK.CommonRequest.AjaxCall(url, data, function (response) {

            NK.ManageCategory.Categorieslist = response.Categories;
            NK.ManageCategory.Categorieslist = NK.ManageCategory.Categorieslist.filter(x => !response.OrganizationCategories.filter(y => y.CatCategoryId === x.Id).length);

            if (NK.ManageCategory.Categorieslist.length > 0) {
                for (var item = 0; item < NK.ManageCategory.Categorieslist.length; item++) {
                    var data = NK.ManageCategory.Categorieslist[item];
                    var currentItem = $(".dataItem", ".Custom").clone();
                    $(currentItem).find(".chkCategory").attr("CatTypeId", NK.ManageCategory.Categorieslist[item].CatCategoryTypeId);
                    $(currentItem).find(".chkCategory").attr("id", NK.ManageCategory.Categorieslist[item].Id);
                    $(currentItem).find(".chkCategory").attr("name", NK.ManageCategory.Categorieslist[item].Id);
                    $(currentItem).find(".txtTitle").text(NK.ManageCategory.Categorieslist[item].TitlePlang);
                    $("#AvailableCat").append(currentItem);
                }
            }

            if (response.OrganizationCategories.length > 0) {
                for (var item = 0; item < response.OrganizationCategories.length; item++) {
                    var data = response.OrganizationCategories[item];
                    var currentItem = $(".dataItem", ".Custom").clone();
                    $(currentItem).find(".chkCategory").attr("CatTypeId", response.OrganizationCategories[item].CatCategoryTypeId);
                    $(currentItem).find(".chkCategory").attr("id", response.OrganizationCategories[item].CatCategoryId);
                    $(currentItem).find(".chkCategory").attr("name", response.OrganizationCategories[item].CatCategoryId);
                    $(currentItem).find(".txtTitle").text(response.OrganizationCategories[item].TitlePlang);
                    $("#OfferdCat").append(currentItem);
                }
            }
        });
    },
    fillOfferdCategoriesList: function () {
        $("#SelectedOfferdCat").html("");
        $($("#OfferdCat").find(".chkCategory")).each(function (idx, ch) {
            var currentItem = $(".servicedataItem", ".Custom").clone();
            var cloneCategory = $(ch).clone();
            var CatTypeId = $(ch).attr("CatTypeId");
            var CatId = $(ch).attr("Id");
            var clonedLabel = $(ch).next("label:first").clone();
            $(currentItem).append(clonedLabel)
            $(currentItem).append("<a href='#' class='' onclick='NK.ManageCategory.getServicesByCatId(" + CatTypeId + "," + CatId + ")'>Manage</a>");
            $("#SelectedOfferdCat").append(currentItem);
            if (NK.ManageCategory.catlist.length == 0) NK.ManageCategory.catlist = CatId;
            else NK.ManageCategory.catlist = NK.ManageCategory.catlist + "," + CatId;
        });
        NK.ManageCategory.saveData(1);
    },
    getServicesByCatId: function (CatTypeId, CatId) {
        NK.ManageCategory.flagCate = CatId;
        if (CatTypeId == 3) {
            var url = "/organization/GetOrganizationServicesByCategoryId";
            $("#AvailableServicesSpeciality").text(NK.ManageCategory.CatServicesAndSpeciltyTitles[1].AvailableTitlePLang);
            $("#OfferdServicesSpeciality").text(NK.ManageCategory.CatServicesAndSpeciltyTitles[1].OfferdTitlePLang);

            $("#SelectServicesSpeciality").text(NK.ManageCategory.CatServicesAndSpeciltyTitles[1].SelectButtonTitle);
            $("#RemoveServicesSpeciality").text(NK.ManageCategory.CatServicesAndSpeciltyTitles[1].RemoveButtonTitle);
        }
        if (CatTypeId == 2) {
            var url = "/organization/GetOrganizationSpecialtiesByCategoryId";
            $("#AvailableServicesSpeciality").text(NK.ManageCategory.CatServicesAndSpeciltyTitles[2].AvailableTitlePLang);
            $("#OfferdServicesSpeciality").text(NK.ManageCategory.CatServicesAndSpeciltyTitles[2].OfferdTitlePLang);

            $("#SelectServicesSpeciality").text(NK.ManageCategory.CatServicesAndSpeciltyTitles[2].SelectButtonTitle);
            $("#RemoveServicesSpeciality").text(NK.ManageCategory.CatServicesAndSpeciltyTitles[2].RemoveButtonTitle)
        }

        if (CatTypeId == 3) NK.ManageCategory.flagSave = 2; else NK.ManageCategory.flagSave = 3;
        var data = {
            "CategoryId": CatId,
            "OrganizationId": 1
        }
        NK.CommonRequest.AjaxCall(url, data, function (response) {
            if (CatTypeId == 3) {
                NK.ManageCategory.AvailableServices = response.CategoryServices;
                NK.ManageCategory.OrgServices = response.OrganizationServices;
                NK.ManageCategory.AvailableServices = NK.ManageCategory.AvailableServices.filter(x => !response.OrganizationServices.filter(y => y.Id === x.Id).length);
            }
            else {
                NK.ManageCategory.AvailableServices = response.CategorySpecialties;
                NK.ManageCategory.OrgServices = response.OrganizationSpecialties;
                NK.ManageCategory.AvailableServices = NK.ManageCategory.AvailableServices.filter(x => !response.OrganizationSpecialties.filter(y => y.Id === x.Id).length);
            }
            $("#AvailableService").html("");
            $("#OfferdService").html("");
            if (NK.ManageCategory.AvailableServices.length > 0) {
                $(NK.ManageCategory.AvailableServices).each(function (ind, as) {
                    var currentItem = $(".dataItem", ".Custom").clone();
                    $(currentItem).find(".chkCategory").attr("id", as.Id);
                    $(currentItem).find(".chkCategory").attr("name", as.TitlePlang);
                    $(currentItem).find(".txtTitle").text(as.TitlePlang);
                    if (CatTypeId == 3) {
                        $(currentItem).find(".ServicePrice").attr("Id", as.Id);
                        $(currentItem).find(".ServicePrice").val(as.Price);
                        $(currentItem).find(".ServicePrice").removeAttr("hidden");
                    }
                    $("#AvailableService").append(currentItem);
                    $("#AvailableService").find("li:last").data("dataas",as);
                });

            }
            if (NK.ManageCategory.OrgServices.length > 0) {
                $(NK.ManageCategory.OrgServices).each(function (ind, offerd) {
                    var currentItem = $(".dataItem", ".Custom").clone();
                    $(currentItem).find(".chkCategory").attr("id", offerd.Id);
                    $(currentItem).find(".chkCategory").attr("name", offerd.TitlePlang);
                    $(currentItem).find(".txtTitle").text(offerd.TitlePlang);
                    if (CatTypeId == 3) {
                        $(currentItem).find(".ServicePrice").attr("Id", offerd.Id);
                        $(currentItem).find(".ServicePrice").val(offerd.CatServicePrice);

                        $(currentItem).find(".FinalServicePrice").val(offerd.Price);

                        $(currentItem).find(".ServicePrice").removeAttr("hidden");
                        $(currentItem).find(".FinalServicePrice").removeAttr("hidden");
                        $(currentItem).find(".SaveService").removeAttr("hidden");
                    }
                    $("#OfferdService").append(currentItem);
                    $("#OfferdService").find("li:last").data("dataas", offerd);
                });
            }
        });
        $(".divAvailableServicesSpeciality").removeAttr("hidden");
        $(".divOfferdServicesSpeciality").removeAttr("hidden");
    },
    ///Add and remove button methods
    AddOfferdCategoriesList: function () {
        $($("#AvailableCat").find(".chkCategory:checked")).each(function (idx, ch) {
            $(ch).trigger("click");
            var cloneCategory = $(ch).clone();
            var clonedLabel = $(ch).next("label:first").clone();
            var clonedLi = $(ch).parent("li").clone();
            $(ch).next("label:first").remove();
            $(ch).remove();
            $("#OfferdCat").append(clonedLi);
        });
        $("#SelectAllAvailableCat").prop("checked", false);
    },
    removeOfferdCategoriesList: function () {
        $($("#OfferdCat").find(".chkCategory:checked")).each(function (idx, ch) {
            $(ch).trigger("click");
            var cloneCategory = $(ch).clone();
            var clonedLabel = $(ch).next("label:first").clone();
            var clonedLi = $(ch).parent("li").clone();
            $("#AvailableCat").append(clonedLi);
            $(ch).next("label:first").remove();
            $(ch).remove();
        });
        $("#SelectAllOfferdCat").prop("checked", false);
    },
    addOfferdList: function () {
        $($("#AvailableService").find(".chkCategory:checked")).each(function (idx, ch) {
            $(ch).trigger("click");
            var dataas = $(ch).parent("li").data("dataas");
            var clonedLi = $(ch).parent("li").clone();
            $(clonedLi).find(".FinalServicePrice").removeAttr("hidden");
            $(clonedLi).find(".SaveService").removeAttr("hidden");
            $("#OfferdService").append(clonedLi);
            $("#OfferdService").find("li:last").data("dataas",dataas);
            $($(ch).parent("li")).remove();
        });
        $("#SelectAllAvailableServicesSpeciality").prop("checked", false);
    },
    removeOfferdList: function () {
        $($("#OfferdService").find(".chkCategory:checked")).each(function (idx, ch) {
            $(ch).trigger("click");
            var dataas = $(ch).parent("li").data("dataas");
            var clonedLi = $(ch).parent("li").clone();
            $(clonedLi).find(".FinalServicePrice").attr("hidden", true);
            $(clonedLi).find(".SaveService").attr("hidden", true);
            $(clonedLi).find(".FinalServicePrice").val("");
            $("#AvailableService").append(clonedLi);
            $("#AvailableService").find("li:last").data("dataas", dataas);
            $($(ch).parent("li")).remove();
        });
        $("#SelectAllOfferdServicesSpeciality").prop("checked", false);
    },
    selectAll: function (loc) {
        if ($(loc).attr("Id") == 'SelectAllAvailableCat' && loc.checked == true) $("#AvailableCat").find(".chkCategory").prop("checked", true);
        if ($(loc).attr("Id") == 'SelectAllAvailableCat' && loc.checked == false) $("#AvailableCat").find(".chkCategory").prop("checked", false);

        if ($(loc).attr("Id") == 'SelectAllOfferdCat' && loc.checked == true) $("#OfferdCat").find(".chkCategory").prop("checked", true);
        if ($(loc).attr("Id") == 'SelectAllOfferdCat' && loc.checked == false) $("#OfferdCat").find(".chkCategory").prop("checked", false);

        if ($(loc).attr("Id") == 'SelectAllAvailableServicesSpeciality' && loc.checked == true) $("#AvailableService").find(".chkCategory").prop("checked", true);
        if ($(loc).attr("Id") == 'SelectAllAvailableServicesSpeciality' && loc.checked == false) $("#AvailableService").find(".chkCategory").prop("checked", false);

        if ($(loc).attr("Id") == 'SelectAllOfferdServicesSpeciality' && loc.checked == true) $("#OfferdService").find(".chkCategory").prop("checked", true);
        if ($(loc).attr("Id") == 'SelectAllOfferdServicesSpeciality' && loc.checked == false) $("#OfferdService").find(".chkCategory").prop("checked", false);

    },
    saveSingleService: function (loc) {
        debugger;
        $li = $(loc).closest("li");
        var dataas = $li.data("dataas");
        var ServicePrice = $li.find(".FinalServicePrice").val();
        var url = "/organization/CreatOrganizationServicesByServicesId";
        var data = {
            "OrganizationId": 1,
            "ServiceId": dataas.Id,
            "Price": ServicePrice
        }
        NK.CommonRequest.NodeAPIAjaxCall(url, JSON.stringify(data), function (response) {
            debugger;
            if (response.ResponseStatus.STATUSCODE == 200) {
                NK.Common.ShowSuccessModal("Data has been saved successfully");
            }
        });
    },
}
$(document).ready(function () {
    NK.ManageCategory.getByOrganizationId();
});
