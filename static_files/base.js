
var top_bid ={};
top_bid[1] = '';
top_bid[2] = '';

$.get('https://pegues.org/relayforlife/topbid?spot=2', function(result) {
    top_bid[2] = parseInt(result, 10);
    $('#spot2_high_bid').text(result);
});
$.get('https://pegues.org/relayforlife/topbid?spot=1', function(result) {
    top_bid[1] = parseInt(result, 10);
    $('#spot1_high_bid').text(result);
});

function spot_submit(spot_num){
    var data = $('#spot'+spot_num+'_form').serialize();
    var arr = $('#spot'+spot_num+'_form').serializeArray();
    console.log('Form data: ', data);

    data = data + '&spot=' + spot_num;

    var error = '';
    if (top_bid[spot_num] < 0) {
        error = 'Current top bid did not load, please reload the page.';
    }
    
    $.each(arr, function(key, d) {
        console.log(d, key);
        if (!d.value) {
            error = d.name + ' is required';
        } else if (d.name == 'amount' && d.value <= top_bid[spot_num]) {
            error = 'New bid must be greater than current one';
        }
    });
    if (error) {
        $('#spot' + spot_num+'_error').text(error).show();
        return;
    } else {
        $('#spot' + spot_num+'_error').hide();
    }

    $('#bid_submit_1').prop("disabled", true);
    $('#bid_submit_2').prop("disabled", true);

    var url = 'https://pegues.org/relayforlife/?' + data;
    console.log('ajax to: ', url);
    $.getJSON(url, function(data) {
        console.info('ajax result: ', data);
        if (data && data.error) {
            error = data.error;
        } else {
            alert('Your bid was successfully received');
            window.location.reload();
        }
    }).fail(function(e) {
        console.error('ajax failed: ', e);
        error = e;
        $('#bid_submit_1').prop("disabled", false);
        $('#bid_submit_2').prop("disabled", false);
    });

    if (error) {
        $('#spot' + spot_num+'_error').text(error).show();
        return;
    } else {
        $('#spot' + spot_num+'_error').hide();
    }

    return false;
}

function donate_submit() {
    var data = $('#donate_form').serialize();
    var arr = $('#donate_form').serializeArray();
    console.log('Form data: ', data);

    var error = '';
    $.each(arr, function(key, d) {
        console.log(d, key);
        if (!d.value) {
            error = d.name + ' is required';
        }
    });

    if (error) {
        $('#donate_error').text(error).show();
        return;
    } else {
        $('#donate_error').hide();
    }

    var url = 'https://pegues.org/relayforlife/donate?' + data;
    console.log('donate ajax to: ', url);
    $.getJSON(url, function(data) {
        console.info('ajax result: ', data);
        if (data && data.error) {
            error = data.error;
        } else {
            alert('Your donation request was successfully received');
            window.location.reload();
        }
    }).fail(function(e) {
        console.error('ajax failed: ', e);
        error = e;
    });

    if (error) {
        $('#donate_error').text(error).show();
        return;
    } else {
        $('#donate_error').hide();
    }

    return false;

}