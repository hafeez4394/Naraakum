var NK = NK || {};
NK.Layout = {
    setLanguage_dropdown: function () {
        
        let v = NK.Common.getLanguage();
        $('#language-dropdown').val(v);
        NK.Common.CurrentLanguage = v;

        if (v == 'ar') {
            $('body').addClass('rtl');
        }
        else {
            $('body').removeClass('rtl');
        }
    },
}

$(function () {

    NK.Layout.setLanguage_dropdown();

    $(document).on('change', "#language-dropdown", function () {
        let v = $(this).val();

        NK.Common.setLanguage(v);
        //NK.Common.CurrentLanguage = v;
        window.location.reload();
    });
})