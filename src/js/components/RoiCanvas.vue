<template>
    <svg    ref="roiSvg"
            :width="width / divisor"
            :height="height / divisor"
            :viewbox="'0 0 ' + width / divisor + ' ' + height / divisor" 
            @mousemove="moveROI($event)" 
            @mousedown="newROI($event)"
            @mouseup="deselectROI()"
            :transform="`scale(${zoomLevel})`"
            >
    <defs>
      <path id="Full-clip-path" :d="fullImageMask" :transform="`scale(${scale})`"></path>
      <clipPath id="Full-clipping-outline">
        <use stroke="none" fill="black" fill-rule="evenodd" href="#Full-clip-path"></use>
      </clipPath>
      <path id="Clip-path" :d="clippingMask" :transform="`scale(${scale})`"></path>
      <clipPath id="Clipping-outline">
        <use stroke="none" fill="black" fill-rule="evenodd" href="#Clip-path"></use>
      </clipPath>
    </defs>
    <g pointer-events="none" :clip-path="clip ? 'url(#Clipping-outline)' : 'url(#Full-clipping-outline)'">
      <image v-for="image of images" 
            :key="'svg-image-' + image.filename"
            class="clippedImg" 
            draggable="false" 
            :xlink:href="image.url + image.filename + '/full/pct:' + 100 / divisor + '/0/' + image.suffix"
            :width="width / divisor"
            :height="height / divisor"
            :opacity="image.opacity"
            :visibility="image.visible ? 'visible' : 'hidden'"></image>
    </g>
    <use class="pulsate" v-show="!clip" stroke="blue" fill="none" fill-rule="evenodd" stroke-width="2" href="#Clip-path"></use>
    <g v-for="box of boxes">
      <rect :x="box.x" 
            :y="box.y" 
            :width="box.width"
            :height="box.height" 
            stroke="blue" 
            :fill="box.color"
            fill-opacity="0.2"
            stroke-opacity="0.8" 
            @mousedown="selectROI($event, box, 'drag')"/>

      <circle class="clipped-img-control-circle"
              :cx="box.x"
              :cy="box.y" 
              :r="4 / zoomLevel"
              stroke="yellow" 
              fill="green"
              fill-opacity="0.5"
              stroke-opacity="0.8" 
              @mousedown="selectROI($event, box, 'resizeXY')"/>

      <circle class="clipped-img-control-circle"
              :cx="box.x"
              :cy="box.y + box.height"
              :r="4 / zoomLevel" 
              stroke="yellow"
              fill="green" 
              fill-opacity="0.5" 
              stroke-opacity="0.8" 
              @mousedown="selectROI($event, box, 'resizeXH')"/>

      <circle class="clipped-img-control-circle"
              :cx="box.x + box.width"
              :cy="box.y"
              :r="4 / zoomLevel"
              stroke="yellow"
              fill="green"
              fill-opacity="0.5" 
              stroke-opacity="0.8" 
              @mousedown="selectROI($event, box, 'resizeWY')"/>

      <circle class="clipped-img-control-circle"
              :cx="box.x + box.width"
              :cy="box.y + box.height"
              :r="4 / zoomLevel"
              stroke="yellow"
              fill="green" 
              fill-opacity="0.5" 
              stroke-opacity="0.8" 
              @mousedown="selectROI($event, box, 'resizeWH')"/>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    width: 0,
    height: 0,
    zoomLevel: '',
    images: {
      type: Array,
      default: [],
    },
    divisor: 0,
    clippingMask: '',
    clip: false,
  },
  data() {
    return {
      boxes: [],
      selectedBox: undefined,
      mouseMoveType: undefined,
      oldMousePos: undefined,
      click: false,
    }
  },
  computed: {
    scale() {
      return 1 / this.divisor
    },
    fullImageMask() {
      return `M0 0L${this.width} 0L${this.width} ${this.height}L0 ${this.height}`
    },
  },
  methods: {
    newROI(event) {
      if (event.target.nodeName === 'svg') {
        const point = this.pointInSvg(event.clientX, event.clientY)
        const box = {
          x: point.x,
          y: point.y,
          width: 10,
          height: 10,
          color: 'purple',
        }
        this.boxes.push(box)
        this.selectROI(event, box, 'resizeWH')
      }
    },

    selectROI(event, box, type) {
      if (this.selectedBox) {
        this.selectedBox.color = 'purple'
      }
      this.selectedBox = box
      this.selectedBox.color = 'orange'
      this.oldMousePos = {
        x: event.clientX,
        y: event.clientY,
      }
      this.mouseMoveType = type
      this.click = true
      window.setTimeout(() => (this.click = false), 200)
    },

    deselectROI() {
      this.mouseMoveType = undefined
      this.oldMousePos = undefined
    },

    moveROI(event) {
      if (this.mouseMoveType) {
        const move = {
          x: (event.clientX - this.oldMousePos.x) / this.zoomLevel,
          y: (event.clientY - this.oldMousePos.y) / this.zoomLevel,
        }
        this.oldMousePos = {
          x: event.clientX,
          y: event.clientY,
        }
        if (this.mouseMoveType === 'drag') {
          this.selectedBox.x += move.x
          this.selectedBox.y += move.y
        } else if (this.mouseMoveType === 'resizeXY') {
          this.selectedBox.x += move.x
          this.selectedBox.y += move.y
          this.selectedBox.width -= move.x
          this.selectedBox.height -= move.y
        } else if (this.mouseMoveType === 'resizeWY') {
          this.selectedBox.y += move.y
          this.selectedBox.width += move.x
          this.selectedBox.height -= move.y
        } else if (this.mouseMoveType === 'resizeWH') {
          this.selectedBox.width += move.x
          this.selectedBox.height += move.y
        } else if (this.mouseMoveType === 'resizeXH') {
          this.selectedBox.x += move.x
          this.selectedBox.width -= move.x
          this.selectedBox.height += move.y
        }
      }
    },

    deleteSelectedRoi() {
      if (this.selectedBox) {
        const idx = this.boxes.indexOf(this.selectedBox)
        if (idx !== -1) {
          this.boxes.splice(idx, 1)
        }
      }
    },

    pointInSvg(x, y) {
      const pt = this.$refs.roiSvg.createSVGPoint()
      pt.x = x
      pt.y = y
      return pt.matrixTransform(this.$refs.roiSvg.getScreenCTM().inverse())
    },
  },
}
</script>

<style lang="scss" scoped>
svg {
  max-height: initial;
}

use.pulsate {
  stroke: skyblue;
  animation: pulsate 3s ease-out;
  animation-iteration-count: infinite;
}

@keyframes pulsate {
  0% {
    opacity: 0.4;
    stroke-width: 3;
  }
  50% {
    opacity: 1;
    stroke-width: 5;
  }
  100% {
    opacity: 0.4;
    stroke-width: 3;
  }
}
</style>
