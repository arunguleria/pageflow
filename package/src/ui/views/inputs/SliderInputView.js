import Marionette from 'backbone.marionette';
import 'jquery-ui';

import {inputView} from '../mixins/inputView';

import template from '../../templates/inputs/sliderInput.jst';

/**
 * A slider for numeric inputs.
 * See {@link inputView} for options
 *
 * @param {Object} [options]
 *
 * @param {number} [options.defaultValue]
 *   Defaults value to display if property is not set.
 *
 * @param {number} [options.minValue=0]
 *   Value when dragging slider to the very left.
 *
 * @param {number} [options.maxValue=100]
 *   Value when dragging slider to the very right.
 *
 * @param {string} [options.unit="%"]
 *   Unit to display after value.
 *
 * @param {function} [options.displayText]
 *   Function that receives value and returns custom text to display as value.
 *
 * @param {boolean} [options.saveOnSlide]
 *   Already update the model while dragging the handle - not only after
 *   handle has been released.
 *
 * @class
 */
export const SliderInputView = Marionette.ItemView.extend({
  mixins: [inputView],

  className: 'slider_input',
  template,

  ui: {
    widget: '.slider',
    value: '.value'
  },

  events: {
    'slidechange': 'save',
    'slide': 'handleSlide'
  },

  onRender: function() {
    this.ui.widget.slider({
      animate: 'fast',
      min: 'minValue' in this.options ? this.options.minValue : 0,
      max: 'maxValue' in this.options ? this.options.maxValue : 100
    });

    this.load();
    this.listenTo(this.model, 'change:' + this.options.propertyName, this.load);
  },

  updateDisabled: function(disabled) {
    this.$el.toggleClass('disabled', !!disabled);

    if (disabled) {
      this.ui.widget.slider('disable');
    }
    else {
      this.ui.widget.slider('enable');
    }
  },

  handleSlide(event, ui) {
    this.updateText(ui.value);

    if (this.options.saveOnSlide) {
      this.save(event, ui);
    }
  },

  save: function(event, ui) {
    this.model.set(this.options.propertyName, ui.value);
  },

  load: function() {
    var value;

    if (this.model.has(this.options.propertyName)) {
      value = this.model.get(this.options.propertyName)
    }
    else {
      value = 'defaultValue' in this.options ? this.options.defaultValue : 0
    }

    this.ui.widget.slider('option', 'value', value);
    this.updateText(value);
  },

  updateText: function(value) {
    var unit = 'unit' in this.options ? this.options.unit : '%';
    var text = 'displayText' in this.options ?
               this.options.displayText(value) :
               value + unit;

    this.ui.value.text(text);
  }
});
