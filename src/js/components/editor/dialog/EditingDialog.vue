<template>
  <el-dialog title="Editor Dialog" :visible="dialogVisible" class="editor-dialog" @close="$emit('close')">

    <!-- Display the sign in context of the line -->
    <div class="line-subheader">
      <div class="sign text-sbl-hebrew" dir="rtl">
        <span v-html="signText"></span>
      </div>
      <div class="line text-sbl-hebrew" dir="rtl">
          <span v-for="s in signs" class="line-sign" :class='{"edited-sign": (s.getID() === sign.getID())}' @click="changeSign(s)">{{ s.is_whitespace ? ' ' : s.toDOMString() }}</span>
      </div>
    </div>

    <!-- Editor Tabs -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Sign Attributes" name="attributes">
        <tab>
          <h1>Attributes</h1>
        </tab>
      </el-tab-pane>
      <el-tab-pane label="Comments" name="comments">
        <tab>
          <comments-editor />
        </tab>
      </el-tab-pane>
      <!-- <el-tab-pane label="ROI" title="Regions of Interest" name="roi">
        ROI
      </el-tab-pane> -->
      <!-- <el-tab-pane label="Variants" name="variants">
          <h2>Variants</h2>
      </el-tab-pane> -->
    </el-tabs>
  </el-dialog>
</template>

<script>

// components
import Tab from './Tab.vue'
import CommentsEditor from './CommentsEditor.vue'

/**
 * A tabbed dialog to support editing of Signs/Words/Lines
 */
export default {
  components: {
    'tab': Tab,
    'comments-editor': CommentsEditor
  },
  props: {
    dialogVisible: {
      default: false
    },
    line: {
      default: null
    },
    sign: {
      default: null
    }
  },
  data() {
    return {
      activeName: 'attributes'
    }
  },
  computed: {

    /**
     * @type {array.<Sign>}
     */
    signs() {
      return this.line ? this.line.items() : []
    },

    /**
     * The current sign as a DOM string
     * @type {string}
     */
    signText() {
      return this.sign ? this.sign.toDOMString() : ''
    },

    /**
     * The signs in the line
     * @type {number}
     */
    signIndex() {
      return this.line && this.sign
          ? this.line.findIndex(this.sign)
          : -1
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },

    /**
     * @param {Sign} sign  the sign to switch to
     */
    changeSign(sign) {
      this.$emit('change-sign', sign)
    }
  }
}
</script>

<style lang="scss">

.editor-dialog {

  & .el-dialog__header {
    padding: 10px;
  }

  & .el-dialog__body {
    padding: 0 10px 20px 10px;    
  }

  & .el-dialog__headerbtn {
    top: 10px;
    right: 10px;
  }

  & .line-subheader {
    font-size: 20px;

    & .sign {
      margin-bottom: 5px;
      font-size: 26px;
    }

    & p {
      white-space: wrap;
    }
  }

  & .line {
    & .line-sign {
      display: inline-block;
      font-size: 20px;
      min-width: 6px; // needed for whitespace

      &.edited-sign,
      &:hover {
        border-bottom: .5px solid #000;
      }
    }
  }
}

</style>