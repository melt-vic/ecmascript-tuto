'use strict';
import $ from 'jquery';
import 'bootstrap-sass';
import '../css/main.scss';

// include this on every page to make sure Promise exists
import 'core-js/library/es6/promise';

$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});
