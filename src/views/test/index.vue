<template>
  <div>
    <select v-model="selected">
      <option v-for="option in options" :key="option.text" :value="option">
        {{ option.text }}
      </option>
    </select>
    <qrcode-stream
      class="qrcode-stream"
      @decode="onDecode"
      :track="paintBoundingBox"
      :torch="torch"
    >
      <div class="tools">
        <button class="tool-item">反转相机</button>
        <button class="tool-item" @click="torch = !torch">打开手电</button>
        <!-- <button class="tool-item">相册</button> -->
      </div>
    </qrcode-stream>
    <div class="result">
      {{ result }}
    </div>
    <!-- <qrcode-capture :capture="false"></qrcode-capture> -->
  </div>
</template>

<script>
// import { QrcodeStream, QrcodeCapture } from 'vue-qrcode-reader';
import { QrcodeStream } from 'vue-qrcode-reader';
export default {
  components: {
    QrcodeStream,
    // QrcodeCapture,
  },
  data() {
    const options = [
      { text: 'nothing (default)', value: undefined },
      { text: 'outline', value: this.paintOutline },
      { text: 'centered text', value: this.paintCenterText },
      { text: 'bounding box', value: this.paintBoundingBox },
    ];
    const selected = options[1];

    return {
      selected,
      options,
      torch: false,
      result: '',
    };
  },
  methods: {
    onDecode(url) {
      this.result = url;
    },
    paintOutline(detectedCodes, ctx) {
      for (const detectedCode of detectedCodes) {
        const [firstPoint, ...otherPoints] = detectedCode.cornerPoints;

        ctx.strokeStyle = 'red';

        ctx.beginPath();
        ctx.moveTo(firstPoint.x, firstPoint.y);
        for (const { x, y } of otherPoints) {
          ctx.lineTo(x, y);
        }
        ctx.lineTo(firstPoint.x, firstPoint.y);
        ctx.closePath();
        ctx.stroke();
      }
    },

    paintBoundingBox(detectedCodes, ctx) {
      for (const detectedCode of detectedCodes) {
        const {
          boundingBox: { x, y, width, height },
        } = detectedCode;

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#007bff';
        ctx.strokeRect(x, y, width, height);
      }
    },

    paintCenterText(detectedCodes, ctx) {
      for (const detectedCode of detectedCodes) {
        const { boundingBox, rawValue } = detectedCode;

        const centerX = boundingBox.x + boundingBox.width / 2;
        const centerY = boundingBox.y + boundingBox.height / 2;

        const fontSize = Math.max(
          12,
          (50 * boundingBox.width) / ctx.canvas.width
        );
        console.log(boundingBox.width, ctx.canvas.width);

        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';

        ctx.lineWidth = 3;
        ctx.strokeStyle = '#35495e';
        ctx.strokeText(detectedCode.rawValue, centerX, centerY);

        ctx.fillStyle = '#5cb984';
        ctx.fillText(rawValue, centerX, centerY);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.qrcode-stream {
  width: 100vw;
  height: 80vh;
}
</style>
