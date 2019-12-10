
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

var topbids_xhr;

function show_spots(evt){
    var target = evt.target;
    var name = $(target).text();
    var event_id = $(target).attr('id');
    var event_date_string = $(target).attr('data-date');
    var event_date = new Date(event_date_string);
    console.log('event date: ', event_date);
    var offset = 2;  // days
    var check_date = new Date();
    check_date.setDate(check_date.getDate() + offset)
    $('#spot1_input_event').val(name);
    $('#spot2_input_event').val(name);
    $('#spot1_input_event_id').val(event_id);
    $('#spot2_input_event_id').val(event_id);

    $('#bid_welcome').hide();
    $('#bid_wrapper').hide();
    $('#bid_closed').hide();

    $('#event_menu').find('a').removeClass('selected');
    $(target).addClass('selected');
    
    if (check_date > event_date || true) {
        console.log('bidding is closed');
        $('#bid_closed').show();
        return;
    }
    
    $('#bid_loading').show();

    if (topbids_xhr && topbids_xhr.abort) {
        topbids_xhr.abort();
    }
    topbids_xhr = $.get('https://pegues.org/relayforlife/topbids?event='+encodeURIComponent(event_id), function(result) {
        var parts = result.split(':');
        top_bid[1] = parts[0];
        top_bid[2] = parts[1];
        $('#spot1_high_bid').text(top_bid[1]);
        $('#spot2_high_bid').text(top_bid[2]);
        $('#bid_loading').hide();
        $('#bid_wrapper').show();
    });

}

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
