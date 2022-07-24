
var NK = NK || {};
NK.ManageServices = {
    name: "",
    catData: "",
    message: "",
    resources: {},
    Categorieslist: {},
    serviceList: "",
    catlist: "",
    specialtyIds: "",

    preServiceList: "",
    preCatlist: "",
    preSpecialtyIds: "",

    getCategoriesList: function (response) {
        var url = "/catalog/GetCategoriesList";
        NK.CommonRequest.AjaxGetCall(url, null, function (response) {
            debugger;
            NK.ManageServices.Categorieslist = response.Categorieslist;
            for (var item = 0; item < response.Categorieslist.length; item++) {
                // var currentItem = $(".card", "#cardTemplate").clone();
                // $(currentItem).find(".mainHeader").text(response.Categorieslist[item].TitlePlang);
                // var collapseId = "#collapse" + item ;
                // var labelledby = "#heading" + item ;
                //// var controls = "#heading" + item ;
                // $(currentItem).find(".mainHeader").attr("data-target", collapseId);
                // $(currentItem).find(".mainHeader").attr("aria-labelledby", labelledby);
                //// $(currentItem).find(".mainHeader").attr("aria-labelledby", labelledby);
                // $(currentItem).find(".card-body").html("hghghg" + item );

                // $("#accordion").append(currentItem);
                $("#accordion").append(

                    "<div class='card'><div class='card-header' id='heading" + item + "'>" +
                    "<h5 class='mb-0''>" +
                    " <button class='btn btn-link' data-toggle='collapse' data-target='#collapse" + item + "' aria-expanded='true' aria-controls='collapseOne' onclick=NK.ManageServices.getByCatlogId(" + response.Categorieslist[item].Id + ")>"
                    + response.Categorieslist[item].TitlePlang +
                    " </button>" +
                    " </h5>" +
                    "</div>" +
                    " <div id='collapse" + item + "' class='collapse' aria-labelledby='heading" + item + "' data-parent='#accordion'>" +
                    " <div class='card-body' id=" + response.Categorieslist[item].Id + ">"
                    + " </div>" +
                    " </div>" +
                    "</div>"
                );
            }
        });
    },
    getClearList: function (response) {
        NK.ManageServices.catlist = "";
        NK.ManageServices.serviceList = "";
        NK.ManageServices.specialtyIds = "";
    },
    saveData: function () {
        $($(".card-header")).each(function (idx, ch) {
            debugger
            if ($(ch).next("div:first").find(".card-body").find(".checkbox:checked").length > 0) {
                var categoryId = $(ch).next("div:first").find(".card-body").attr("id");
                if (NK.ManageServices.catlist.length == 0) {
                    NK.ManageServices.catlist = categoryId;
                }
                else {
                    NK.ManageServices.catlist = NK.ManageServices.catlist + "," + categoryId;
                }
                $($(ch).next("div:first").find(".card-body").find(".checkbox:checked")).each(function (inx, cbx) {
                    var serviceId = $(cbx).attr("name");
                    var specialtyId = $(cbx).attr("catspecialtyid");
                    if (specialtyId > 0) {
                        if (NK.ManageServices.specialtyIds.length == 0) {
                            NK.ManageServices.specialtyIds = specialtyId;
                        }
                        else {
                            NK.ManageServices.specialtyIds = NK.ManageServices.specialtyIds + "," + specialtyId;
                        }
                    }
                    else {
                        if (NK.ManageServices.serviceList.length == 0) {
                            NK.ManageServices.serviceList = serviceId;
                        }
                        else {
                            NK.ManageServices.serviceList = NK.ManageServices.serviceList + "," + serviceId;
                        }
                    }

                });
            }
        });
        var url = "/organization/CreatOrganizationAssociation";
        debugger
        var data = {
            "OrganizationId": 1,
            "CategoryIds": NK.ManageServices.catlist,
            "ServiceIds": NK.ManageServices.serviceList,
            "SpecialtyIds": NK.ManageServices.specialtyIds
        }
        if (NK.ManageServices.catlist != "" && NK.ManageServices.serviceList != "" && NK.ManageServices.specialtyIds != "") {
            NK.CommonRequest.AjaxCall(url, data, function (response) {
                debugger;
                if (response.ResponseStatus.STATUSCODE == 200) {
                    NK.Common.ShowSuccessModal("Data has been saved successfully");
                    NK.ManageServices.getClearList();
                }
                else {
                    NK.Common.ShowSuccessModal();
                }
            });
        }
        else {
            alert("Kindly select data from list!!")
            //NK.Common.ShowSuccessModal("Kindly select data from list!!");
        }
    },
    getByCatlogId: function (Id) {
        debugger;
        if ($("#" + Id).html() == ' ') {
            var url = "/catalog/GetSpecialtyServicesListByCategoryId";
            var data = {
                "CategoryId": Id,
                "OrganizationId": 1
            }
            NK.CommonRequest.AjaxCall(url, data, function (response) {
                debugger;
                $("#" + Id).html('');
                for (var item = 0; item < response.list.length; item++) {
                    var specialtyId = typeof response.list[item].CatSpecialtyId == "undefined" ? 0 : response.list[item].CatSpecialtyId;
                    $("#" + Id).append("<input type = 'checkbox' style='height:15px; width:20px;' catspecialtyid='" + specialtyId + "' id = 'checkbox" + response.list[item].Id + "' name = '" + response.list[item].Id + "' class='checkbox' >&nbsp;&nbsp;&nbsp;" +
                        "<label for='" + response.list[item].Id + "'>" + response.list[item].TitlePlang + "</label>" +
                        "<br>");
                    if (specialtyId > 0) {
                        for (var item2 = 0; item2 < NK.ManageServices.preSpecialtyIds.length; item2++) {
                            $("#" + Id).find("#checkbox" + NK.ManageServices.preSpecialtyIds[item2].CatSpecialtyId).prop('checked', true);
                        }
                    }
                    else {
                        for (var item3 = 0; item3 < NK.ManageServices.preServiceList.length; item3++) {
                            $("#" + Id).find("#checkbox" + NK.ManageServices.preServiceList[item3].CatServiceId).prop('checked', true);
                        }
                    }
                }
            });
        }

    },
    getByOrganizationId: function (Id) {
        debugger;
        var url = "/organization/GetOrganizationAssociationByOrganizationId";
            var data = {
                "OrganizationId": 1
            }
            NK.CommonRequest.AjaxCall(url, data, function (response) {
                NK.ManageServices.preServiceList = response.Services;
                 NK.ManageServices.preCatlist = response.Categories;
                NK.ManageServices.preSpecialtyIds = response.Specialties;

                //for (var item1 = 0; item1 < response.Categories.length; item1++) {
                //    if (NK.ManageServices.catlist.length == 0) {
                //        NK.ManageServices.catlist = response.Categories[item1].CatCategoryId;
                //    }
                //    else {
                //        NK.ManageServices.catlist = NK.ManageServices.catlist + "," + response.Categories[item1].CatCategoryId;
                //    }
                //}
                //for (var item2 = 0; item2 < response.Services.length; item2++) {
                //    if (NK.ManageServices.serviceList.length == 0) {
                //        NK.ManageServices.serviceList = response.Services[item2].CatServiceId;
                //    }
                //    else {
                //        NK.ManageServices.serviceList = NK.ManageServices.serviceList + "," + response.Services[item2].CatServiceId;
                //    }
                //}
                //for (var item3 = 0; item3 < response.Specialties.length; item3++) {
                //    if (NK.ManageServices.specialtyIds.length == 0) {
                //        NK.ManageServices.specialtyIds = response.Specialties[item3].CatSpecialtyId;
                //    }
                //    else {
                //        NK.ManageServices.specialtyIds = NK.ManageServices.specialtyIds + "," + response.Specialties[item3].CatSpecialtyId;
                //    }
                //}
                
              


                //$("#" + Id).html('');
                //for (var item = 0; item < response.list.length; item++) {
                //    var specialtyId = typeof response.list[item].CatSpecialtyId == "undefined" ? 0 : response.list[item].CatSpecialtyId;
                //    $("#" + Id).append("<input type = 'checkbox' style='height:15px; width:20px;' catspecialtyid='" + specialtyId + "' id = 'checkbox" + response.list[item].Id + "' name = '" + response.list[item].Id + "' class='checkbox' >&nbsp;&nbsp;&nbsp;" +
                //        "<label for='" + response.list[item].Id + "'>" + response.list[item].TitlePlang + "</label>" +
                //        "<br>");
                //for (var item2 = 0; item2 < response.SpecialtyandServiceslist.length; item2++) {
                //    var CatSpecialtyId = typeof response.SpecialtyandServiceslist[item2].CatSpecialtyId == "undefined" ? 0 : response.SpecialtyandServiceslist[item2].CatSpecialtyId;
                //    if (CatSpecialtyId > 0) {
                //        if (response.list[item].Id == response.SpecialtyandServiceslist[item2].CatSpecialtyId) {
                //            $("#" + Id).find("#checkbox" + response.list[item].Id).prop('checked', true);
                //        }
                //    }
                //    else {
                //        if (response.list[item].Id == response.SpecialtyandServiceslist[item2].CatServiceId) {
                //            $("#" + Id).find("#checkbox" + response.list[item].Id).prop('checked', true);
                //        }
                //    }
                //}
                // }
            });
    },
    removeElement: function (array, to_remove) {
        var elements = array.split(",");
        var remove_index = elements.indexOf(to_remove);
        elements.splice(remove_index, 1);
        var result = elements.join(",");
        return result;
    }
}
$(document).ready(function () {
    //NK.ManageServices.getCatlog();
    NK.ManageServices.getCategoriesList();
    NK.ManageServices.getByOrganizationId();

});
