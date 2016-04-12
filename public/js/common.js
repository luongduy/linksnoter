/**
 * Created At 3/12/16.
 */
var LinkNoter = {
    ajax: function(params) {
        if (typeof params.error === 'undefined') {
            params.error = function (xhr, textStatus, e) {
                console.log(xhr);
                console.log(e);
                alert(textStatus);
            };
        }

        return $.ajax(params);
    }
};

function convertDateToUTC(date) { 
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); 
}