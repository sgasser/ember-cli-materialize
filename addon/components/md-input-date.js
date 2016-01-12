import Ember from 'ember';
import MaterializeInput from './md-input';
import layout from '../templates/components/md-input-date';

const MONTH_NAMES = ['January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August', 'September', 'October',
    'November', 'December'];

function formatDate(timestamp) {
  const d = new Date(timestamp);
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}, ${d.getFullYear()}`;
}

export default MaterializeInput.extend({
  layout,

  selectMonths: true,
  numberOfYears: 15,
  min: '',
  max: '',

  didInsertElement() {
    this._super(...arguments);
    this._setupPicker();
  },

  willDestroyElement() {
    this._super(...arguments);
    this._teardownPicker();
  },

  _setupPicker() {
    const datePickerOptions = this.getProperties('selectMonths', 'numberOfYears', 'min', 'max');
    datePickerOptions.selectYears = datePickerOptions.numberOfYears;

    this._onDateSet = evt => {
      if (evt.select) {
        this.set('value', formatDate(evt.select));
      }
    };
    this._onClose = () => {
      this.$('.picker').blur();
    };

    this.$('.datepicker').pickadate(Ember.$.extend(datePickerOptions, {
      onSet: this._onDateSet,
      onClose: this._onClose
    }));
  },

  _teardownPicker() {
    const $pickadate = this.$('.datepicker').data('pickadate');
    if ($pickadate) {
      $pickadate.stop();
    }
  },

  setMinDate: Ember.observer('min', function() {
    this.$('.datepicker').pickadate('picker').set('min', this.get('min'));
  }),
  setMaxDate: Ember.observer('max', function() {
    this.$('.datepicker').pickadate('picker').set('max', this.get('max'));
  })

});
