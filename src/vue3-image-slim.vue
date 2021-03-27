<template>
  <div style="display: inline-block">
    <input
      type="file"
      :id="inputId"
      style="display: none"
      accept=".jpg,.jpeg,.png"
      @change="onSelectFile()"
    />
    <div
      @click="doClick"
      class="vue-image-slim-button"
      :class="{ disabled }"
      :style="{ width: btnWidth, height: btnHeight }"
    ></div>
    <div style="display: none">
      <img :id="imgId" />
      <canvas :id="cvsId"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";

type NullableInput = File | null;

const id: number = new Date().valueOf();
let input: HTMLInputElement | null,
  image: HTMLImageElement | null,
  canvas: HTMLCanvasElement | null,
  ctx: any;

export default /*#__PURE__*/ defineComponent({
  name: "Vue3ImageSlim", // vue component name
  props: {
    o: {
      //剪切原点
      type: String,
      default: "C", // LT左上角/RT右上角/LB左下角/RB右下角/C中心点
    },
    w: {
      //输出图片的宽度
      type: Number,
      default: 0, //缺省宽度,原图宽度
    },
    h: {
      //输出图片的高度
      type: Number,
      default: 0, //缺省高度，原图高度
    },
    disabled: {
      //是否禁止点击
      type: Boolean,
      default: false,
    },
    btnWidth: {
      //按钮宽度
      type: String,
      default: "100px",
    },
    btnHeight: {
      //按钮高度
      type: String,
      default: "100px",
    },
  },
  emits: ["getDataURL", "getFile"],
  setup(props, context) {
    const { emit } = context;
    const file = ref(null as NullableInput);
    const imageWidth = ref(0);
    const imageHeight = ref(0);
    const inputId = computed(() => "input" + id);
    const imgId = computed(() => "img" + id);
    const cvsId = computed(() => "cvs" + id);
    onMounted(() => {
      input = <HTMLInputElement>document.getElementById(inputId.value);
      image = <HTMLImageElement>document.getElementById(imgId.value);
      if (!input || !image) {
        return;
      }
      image.onload = async () => {
        if (!file.value) {
          return;
        }
        // 清除cavas内容
        if (canvas && ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        canvas = <HTMLCanvasElement>document.getElementById(cvsId.value);
        if (!canvas) {
          return;
        }
        const pst = positions();
        if (pst === false) {
          return;
        }
        canvas.width = pst[6];
        canvas.height = pst[7];
        ctx = canvas.getContext("2d");
        ctx.drawImage(image, ...pst);
        const dataURL = canvas.toDataURL(file.value.type, 0.75);
        emit("getDataURL", dataURL);
        const slimFile = await url2File(
          dataURL,
          file.value.name,
          file.value.type
        );
        emit("getFile", slimFile);
      };
    });

    const doClick = () => {
      if (input) {
        input.click();
      }
    };

    const onSelectFile = async () => {
      if (!input || !input.files) {
        return;
      }
      if (input.files instanceof FileList && input.files.length > 0) {
        file.value = input.files[0];
        const reader = new FileReader();
        reader.addEventListener(
          "load",
          function () {
            if (image && typeof reader.result === "string") {
              image.src = reader.result;
            }
          },
          false
        );
        reader.readAsDataURL(file.value);
      }
    };

    // 根据参数计算建材参数
    const positions = () => {
      if (!image || !image.width || !image.height) {
        return false;
      }
      const sw = image.width,
        sh = image.height;
      if (
        isNaN(+props.w) ||
        +props.w < 1 ||
        isNaN(+props.h) ||
        +props.h < 1 ||
        props.w >= sw ||
        props.h >= sh
      ) {
        return [0, 0, sw, sh, 0, 0, sw, sh];
      }
      let x = 0,
        y = 0;
      let r = Math.min(sw / props.w, sh / props.h); //取较小比率作为图形比率
      let w = props.w * r;
      let h = props.h * r;
      // 根据原点计算剪切值，缺省是LT
      switch (props.o) {
        case "C": //中心对齐
          x = (sw - w) / 2;
          y = (sh - h) / 2;
          break;
        case "RT": //右上角对齐
          x = sw - w;
          y = 0;
          break;
        case "LB":
          x = 0;
          y = sh - h;
          break;
        case "RB":
          x = sw - w;
          y = sh - h;
          break;
      }
      return [x, y, w, h, 0, 0, props.w, props.h];
    };
    const url2File = async (
      url: string,
      filename: string,
      mimeType: string
    ) => {
      return new Promise((resolve) => {
        fetch(url)
          .then(function (res) {
            return res.arrayBuffer();
          })
          .then(function (buf) {
            resolve(new File([buf], filename, { type: mimeType }));
          });
      });
    };
    return {
      file,
      imageWidth,
      imageHeight,
      inputId,
      imgId,
      cvsId,
      doClick,
      onSelectFile,
    };
  },
});
</script>

<style scope>
.vue-image-slim-button {
  position: relative;
  border: 1px solid #eee;
  background: transparent !important;
  display: inline-block;
  cursor: pointer;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.vue-image-slim-button:before,
.vue-image-slim-button:after {
  content: "";
  position: absolute;
  background: #ccc;
}

.vue-image-slim-button:before {
  left: calc(50% - 1px);
  top: 5%;
  height: 90%;
  width: 3px;
}

.vue-image-slim-button:after {
  top: calc(50% - 1px);
  left: 5%;
  height: 3px;
  width: 90%;
}
.vue-image-slim-button.disabled {
  cursor: not-allowed;
  pointer-events: none;
}
</style>
