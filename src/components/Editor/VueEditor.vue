<template>
  <div class="quillWrapper">
    <div ref="quillContainer" :id="id"></div>
    <input v-if="useCustomImageHandler" @change="emitImageInfo($event)" ref="fileInput" id="file-upload" type="file" style="display:none;">
  </div>
</template>

<script>
import VQuill from 'quill'
import defaultToolbar from '@/assets/editor/toolbar'
import MarkdownShortcuts from '@/assets/editor/MarkdownShortcuts'
import merge from 'lodash.merge'
const Quill = window.Quill || VQuill

export default {
  name: 'vue-editor',
  props: {
    value: String,
    id: {
      type: String,
      default: 'quill-container'
    },
    placeholder: String,
    disabled: Boolean,
    customModules: Array,
    editorToolbar: Array,
    editorOptions: {
      type: Object,
      default: function() {
        return {}
      }
    },
    useCustomImageHandler: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    filteredInitialContent() {
      const content = this.value || ''
      return content.replace(/(<div)/igm, '<p').replace(/<\/div>/igm, '</p>')
    },
    imageResizeActive() {
      return this.quill.options.modules.imageResize !== undefined
    }
  },
  data() {
    return {
      quill: null,
      editor: null,
      editorConfig: {},
      textLength: 0, // 内容长度
      modules: {
        toolbar: this.editorToolbar ? this.editorToolbar : defaultToolbar,
        markdownShortcuts: {}
      }
    }
  },
  mounted() {
    this.initializeVue2Editor()
    this.handleUpdatedEditor()
    this.initButton()
  },
  beforeDestroy() {
    this.quill = null
    delete this.quill
  },
  watch: {
    value(val) {
      if (val !== this.quill.root.innerHTML && !this.quill.hasFocus()) {
        this.quill.root.innerHTML = val
      }
    },
    disabled(status) {
      this.quill.enable(!status)
    }
  },
  methods: {
    initButton: function() { // 在使用的页面中初始化按钮样式
      const cleanButton = document.querySelector('.ql-clean')
      cleanButton.style.cssText = 'width:115px; border:1px solid #ccc; border-radius:5px;margin-top: 2px;'
      cleanButton.innerText = '清除文字样式'
    },
    initializeVue2Editor() {
      this.prepareModules()
      this.setQuillElement()
      this.handleDynamicStyles()
      this.checkForInitialContent()
      this.checkForCustomImageHandler()

      this.quill.on('selection-change', range => {
        this.$emit('selection-change', range)
        var delta = this.quill.getContents()
        if (delta.ops.length === 1) {
          var text = delta.ops[0].insert.replace(/\s*/g, '')
          this.textLength = text.length
          // console.log('delta', JSON.stringify(delta))
          // console.log('text', text)
          // console.log('111', this.textLength)
        } else if (delta.ops.length > 1) {
          var jointText = ''
          for (var i = 0; i < delta.ops.length; i++) {
            jointText = (delta.ops[i].insert + jointText).replace('\r', '').replace('\n', '').replace('\t', '').replace(/\s*/g, '')
          }
          this.textLength = jointText.length
        }
        this.$emit('contentChange', this.textLength)
        if (!range) {
          this.$emit('blur', this.quill)
        } else {
          this.$emit('focus', this.quill)
        }
      })
    },
    setQuillElement() {
      const editorConfig = {
        debug: false,
        modules: this.modules,
        placeholder: this.placeholder ? this.placeholder : '',
        theme: 'snow',
        readOnly: this.disabled ? this.disabled : false
      }
      this.prepareEditorConfig(editorConfig)
      this.quill = new Quill(this.$refs.quillContainer, editorConfig)
    },
    setEditorElement() {
      // this.editor = document.querySelector(`#${this.id} .ql-editor`)
    },
    handleDynamicStyles() {
      if (this.imageResizeActive) {
        this.quill.root.classList.add('imageResizeActive')
      }
    },
    prepareModules() {
      this.registerBuiltInModules()
      this.registerCustomModules()
    },
    registerBuiltInModules() {
      Quill.register('modules/markdownShortcuts', MarkdownShortcuts, true)
    },
    registerCustomModules() {
      if (this.customModules !== undefined) {
        this.customModules.forEach(customModule => {
          Quill.register('modules/' + customModule.alias, customModule.module)
        })
      }
    },
    prepareEditorConfig(editorConfig) {
      if (Object.keys(this.editorOptions).length > 0 && this.editorOptions.constructor === Object) {
        if (this.editorOptions.modules && typeof this.editorOptions.modules.toolbar !== 'undefined') {
        // We don't want to merge default toolbar with provided toolbar.
          delete editorConfig.modules.toolbar
        }
        merge(editorConfig, this.editorOptions)
      }
    },
    checkForInitialContent() {
      if (this.value) {
        this.quill.root.innerHTML = this.filteredInitialContent
      }
      //
    },
    checkForCustomImageHandler() {
      this.useCustomImageHandler === true ? this.setupCustomImageHandler() : ''
    },
    setupCustomImageHandler() {
      const toolbar = this.quill.getModule('toolbar')
      toolbar.addHandler('image', this.customImageHandler)
    },
    handleUpdatedEditor() {
      this.quill.on('text-change', () => {
        let editorContent = this.quill.root.innerHTML
        if (editorContent === '<p><br></p>') {
          editorContent = ''
        }
        this.$emit('input', editorContent)
      })
    },
    customImageHandler(image, callback) {
      this.$refs.fileInput.click()
    },
    emitImageInfo($event) {
      const resetUploader = function() {
        const uploader = document.getElementById('file-upload')
        uploader.value = ''
      }
      const file = $event.target.files[0]
      const Editor = this.quill
      const range = Editor.getSelection()
      const cursorLocation = range.index
      this.$emit('imageAdded', file, Editor, cursorLocation, resetUploader)
    }
  }
}
</script>

<style src="quill/dist/quill.snow.css"></style>
<style src="@/styles/vue2-editor.scss" lang='scss'></style>
