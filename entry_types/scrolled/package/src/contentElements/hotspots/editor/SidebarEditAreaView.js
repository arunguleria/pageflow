import {ConfigurationEditorView, SelectInputView} from 'pageflow/ui';
import {editor, FileInputView} from 'pageflow/editor';
import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';

import {AreaInputView} from './AreaInputView';

import styles from './SidebarEditAreaView.module.css';

export const SidebarEditAreaView = Marionette.Layout.extend({
  template: (data) => `
    <a class="back">${I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.back')}</a>
    <a class="destroy">${I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.destroy')}</a>

    <div class='form_container'></div>
  `,

  className: styles.view,

  regions: {
    formContainer: '.form_container',
  },

  events: {
    'click a.back': 'goBack',
    'click a.destroy': 'destroyLink'
  },

  onRender: function () {
    const options = this.options;

    const configurationEditor = new ConfigurationEditorView({
      model: this.model,
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.content_elements.hotspots.edit_area.attributes'],
      tabTranslationKeyPrefix: 'pageflow_scrolled.editor.content_elements.hotspots.edit_area.tabs',
      tab: options.tab || (options.entry.get('emulation_mode') === 'phone' ? 'portrait' : 'area')
    });

    const file = options.contentElement.configuration.getImageFile('image');
    const portraitFile = options.contentElement.configuration.getImageFile('portraitImage');

    if (file && portraitFile) {
      this.previousEmulationMode = options.entry.get('emulation_mode') || 'desktop';
    }

    configurationEditor.tab('area', function() {
      if (file && portraitFile) {
        options.entry.unset('emulation_mode');
      }

      this.input('area', AreaInputView, {
        file,
        portraitFile
      });
      this.input('tooltipPosition', SelectInputView, {
        values: ['below', 'above']
      });
      this.input('activeImage', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'hotspotsArea',
        fileSelectionHandlerOptions: {
          contentElementId: options.contentElement.get('id'),
          tab: 'area'
        },
        positioning: false
      });
    });

    if (portraitFile) {
      configurationEditor.tab('portrait', function() {
        if (file && portraitFile) {
          options.entry.set('emulation_mode', 'phone');
        }

        this.input('portraitArea', AreaInputView, {
          file,
          portraitFile,
          defaultTab: 'portrait'
        });
        this.input('portraitTooltipPosition', SelectInputView, {
          values: ['below', 'above']
        });
        this.input('portraitActiveImage', FileInputView, {
          collection: 'image_files',
          fileSelectionHandler: 'hotspotsArea',
          fileSelectionHandlerOptions: {
            contentElementId: options.contentElement.get('id'),
            tab: 'portrait'
          },
          positioning: false
        });
      });
    }

    this.formContainer.show(configurationEditor);
  },

  onClose() {
    if (this.previousEmulationMode === 'phone') {
      this.options.entry.set('emulation_mode', 'phone');
    }
    else if (this.previousEmulationMode === 'desktop') {
      this.options.entry.unset('emulation_mode');
    }
  },

  goBack: function() {
    editor.navigate(`/scrolled/content_elements/${this.options.contentElement.get('id')}`, {trigger: true});
  },

  destroyLink: function () {
    if (window.confirm(I18n.t('pageflow_scrolled.editor.content_elements.externalLinkList.confirm_delete_link'))) {
      this.options.collection.remove(this.model);
      this.goBack();
    }
  },
});
