<template>
  <div>
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
    return {
      torch: false,
      result: '',
    };
  },
  methods: {
    onDecode(url) {
      this.result = url;
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
  },
};
</script>

<style lang="less" scoped>
.qrcode-stream {
  width: 100vw;
  height: 80vh;
}
</style>
