var NK = NK || {};


NK.Menu = {
    lang: "#language-dropdown",
    ul_navbar: ".navbar-nav",
    dv_navbarSupportedContent: "#navbarSupportedContent",

    menu_template: "#menu_template",
    PLanguage_template: "#PLanguage_template",
    SLanguage_template: "#SLanguage_template",

    loadMenus: function () {

        let v = NK.Common.getLanguage();

        let menus = [
            { titlePlang: "About Us", titleSlang: "عن نرعاكم", href: "#", type: 1 },
            { titlePlang: "Our App", titleSlang: "التطبيق", href: "#", type: 1 },
            { titlePlang: "How to use", titleSlang: "كيفيه الاستخدام", href: "#", type: 1 },
            { titlePlang: "Home Health Care", titleSlang: "الرعاية الصحية المنزلية", href: "#", type: 1 },
            { titlePlang: "Home", titleSlang: "الرئيسية", controller: "Home", action: "Index", isActive: true, type: 1 },

            { titlePlang: "AR", titleSlang: "AR", value: "ar", type: 2 },
            { titlePlang: "EN", titleSlang: "EN", value: "en", type: 2 },
        ]

        $.each(menus, function (idx, menu) {


            NK.Common.CurrentLanguage = v;

            let title = NK.Common.getTitleFromLanguage(menu.titlePlang, menu.titleSlang);

            if (menu.type == 1) {  // if menu
                let template = $(NK.Menu.menu_template).html();

                template = template.replace('_titleMenu', title);

                if (menu.href != undefined)
                    template = template.replace('_href', menu.href);
                else
                    template = template.replace('_href', 'asp-controller="' + menu.controller + '" asp-action="' + menu.action + '"');

                if (menu.isActive == undefined)
                    template = template.replace('active', '');

                $(NK.Menu.ul_navbar).prepend(template);
            }
            if (menu.type == 2) {  // if language
                let template = "";
                if (menu.value == "ar")
                    template = $(NK.Menu.PLanguage_template).html();
                else
                    template = $(NK.Menu.SLanguage_template).html();

                template = template.replace('_titleLanague', title);
                template = template.replace('_en', menu.value);

                $(NK.Menu.lang).append(template);
            }
        })
        NK.Menu.loadLanguage();
        return v;
    },
    loadLanguage: function () {
        let menus = [
            { titlePlang: "AR", titleSlang: "AR", value: "ar", type: 2 },
            { titlePlang: "EN", titleSlang: "EN", value: "en", type: 2 },
        ];

        $(NK.Menu.lang).html('');

        $.each(menus, function (idx, menu) {
            let title = NK.Common.getTitleFromLanguage(menu.titlePlang, menu.titleSlang);

            let template = "";
            if (menu.value == "ar" && NK.Common.CurrentLanguage == 'ar')
                template = $(NK.Menu.PLanguage_template).html();
            else if (menu.value == "en" && NK.Common.CurrentLanguage == 'en')
                template = $(NK.Menu.PLanguage_template).html();
            else
                template = $(NK.Menu.SLanguage_template).html();

            template = template.replace('_titleLanague', title);
            template = template.replace('_en', menu.value);

            $(NK.Menu.lang).append(template);
        });
    },

}

$(function () {
    let currentLang = NK.Menu.loadMenus();
    $('#language-dropdown').val(currentLang);
})