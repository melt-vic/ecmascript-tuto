'use strict';

import Helper from './RepLogAppHelper';
import $  from 'jquery';
import swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import Routing from './Routing';
import random from 'lodash/random';

let HelperInstances = new WeakMap();

class RepLogApp {
    constructor($wrapper, initialRepLogs) {
        this.$wrapper = $wrapper;
        this.repLogs = [];
        HelperInstances.set(this, new Helper(this.repLogs));

        for (let repLog of initialRepLogs) {
            this._addRow(repLog);
        }
        this._clearForm();

        this.$wrapper.on(
            'click',
            '.js-delete-rep-log',
            this.handleRepLogDelete.bind(this)
        );
        this.$wrapper.on(
            'click',
            'tbody tr',
            this.handleRowClick.bind(this)
        );
        this.$wrapper.on(
            'submit',
            RepLogApp._selectors.newRepForm,
            this.handleNewFormSubmit.bind(this)
        );
    }

    /**
     * Call like this.selectors
     */
    static get _selectors() {
        return {
            newRepForm: '.js-new-rep-log-form'
        }
    }

    updateTotalWeightLifted() {
        this.$wrapper.find('.js-total-weight').html(
            HelperInstances.get(this).getTotalWeightString()
        );
    }

    handleRepLogDelete(e) {
        e.preventDefault();

        const $link = $(e.currentTarget);

        swal({
            title: 'Delete this log???',
            text: 'What? Did you not actually lift this?',
            showCancelButton: true,
            showLoaderOnConfirm: true,
            preConfirm: () => this._deleteRepLog($link)
        }).catch((arg) => {
            // canceling is cool!
        });
    }

    _deleteRepLog($link) {
        $link.addClass('text-danger');
        $link.find('.fa')
            .removeClass('fa-trash')
            .addClass('fa-spinner')
            .addClass('fa-spin');

        const deleteUrl = $link.data('url');
        const $row = $link.closest('tr');

        return $.ajax({
            url: deleteUrl,
            method: 'DELETE'
        }).then(() => {
            $row.fadeOut('normal', () => {
                // we need to remove the repLog from this.repLogs
                // the "key" is the index to this repLog on this.repLogs
                this.repLogs.splice(
                    $row.data('key'),
                    1
                );

                $row.remove();

                this.updateTotalWeightLifted();
            });
        })
    }

    handleRowClick() {
        console.log('row clicked!');
    }

    handleNewFormSubmit(e) {
        e.preventDefault();

        const $form = $(e.currentTarget);
        const formData = {};

        for (let fieldData of $form.serializeArray()) {
            formData[fieldData.name] = fieldData.value
        }

        this._saveRepLog(formData)
            .then((data) => {
                this._clearForm();
                this._addRow(data);
            }).catch((errorData) => {
            this._mapErrorsToForm(errorData.errors);
        });
    }

    _saveRepLog(data) {
        return new Promise((resolve, reject) => {
            const url = Routing.generate('rep_log_new');

            $.ajax({
                url,
                method: 'POST',
                data: JSON.stringify(data)
            }).then((data, textStatus, jqXHR) => {
                $.ajax({
                    url: jqXHR.getResponseHeader('Location')
                }).then((data) => {
                    // we're finally done!
                    resolve(data);
                });
            }).catch((jqXHR) => {
                const errorData = JSON.parse(jqXHR.responseText);

                reject(errorData);
            });
        });
    }

    _mapErrorsToForm(errorData) {
        this._removeFormErrors();
        const $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);

        for (let element of $form.find(':input')) {
            const fieldName = $(element).attr('name');
            const $wrapper = $(element).closest('.form-group');
            if (!errorData[fieldName]) {
                // no error!
                continue;
            }

            const $error = $('<span class="js-field-error help-block"></span>');
            $error.html(errorData[fieldName]);
            $wrapper.append($error);
            $wrapper.addClass('has-error');
        }
    }

    _removeFormErrors() {
        const $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
        $form.find('.js-field-error').remove();
        $form.find('.form-group').removeClass('has-error');
    }

    _clearForm() {
        this._removeFormErrors();

        const $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
        $form[0].reset();

        $form.find('[name="reps"]').val(random(1, 10));
    }

    _addRow(repLog) {
        this.repLogs.push(repLog);
        // destructuring example
        // let {id, itemLabel, reps, totallyMadeUpKey = 'whatever!'} = repLog;
        // console.log(id, itemLabel, reps, totallyMadeUpKey);

        const html = rowTemplate(repLog);
        const $row = $($.parseHTML(html));
        // store the repLogs index
        $row.data('key', this.repLogs.length - 1);
        this.$wrapper.find('tbody').append($row);

        this.updateTotalWeightLifted();
    }
}

const rowTemplate = (repLog) => `
<tr data-weight="${repLog.totalWeightLifted}">
    <td>${repLog.itemLabel}</td>
    <td>${repLog.reps}</td>
    <td>${repLog.totalWeightLifted}</td>
    <td>
        <a href="#"
           class="js-delete-rep-log"
           data-url="${repLog.links._self}"
        >
            <span class="fa fa-trash"></span>
        </a>
    </td>
</tr>
`;

export default RepLogApp; // Gracias al export la variable RepLogApp supera el scope de este módulo y se convierte en global
