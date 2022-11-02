import $ from 'jquery';
import 'bootstrap-sass';
import RepLogApp from './Components/RepLogApp';

$(document).ready(function() {
    var $wrapper = $('.js-rep-log-table');
    var repLogApp = new RepLogApp($wrapper, $wrapper.data('rep-logs'));

    $('.js-custom-popover').popover({
        trigger: 'hover',
        placement: 'left'
    });
});