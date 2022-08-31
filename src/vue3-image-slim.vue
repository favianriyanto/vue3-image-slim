<template>
  <div style="display: inline-block">
    <input
      type="file"
      :id="inputId"
      style="display: none"
      accept="image/*"
      @change="onSelectFile()"
    />
    <input
        type="file"
        id="inputcamera"
        style="display: none"
        accept="image/*"
        capture="camera"
        @change="onSelectFile()"
    />
    <button
      @click="doClick"
      style="width: 300px; margin: 10px; background-repeat: no-repeat; background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20class%3D%22ionicon%22%20viewBox%3D%220%200%20512%20512%22%3E%3Ctitle%3EImage%3C%2Ftitle%3E%3Cpath%20d%3D%22M416%2064H96a64.07%2064.07%200%2000-64%2064v256a64.07%2064.07%200%200064%2064h320a64.07%2064.07%200%200064-64V128a64.07%2064.07%200%2000-64-64zm-80%2064a48%2048%200%2011-48%2048%2048.05%2048.05%200%200148-48zM96%20416a32%2032%200%2001-32-32v-67.63l94.84-84.3a48.06%2048.06%200%200165.8%201.9l64.95%2064.81L172.37%20416zm352-32a32%2032%200%2001-32%2032H217.63l121.42-121.42a47.72%2047.72%200%200161.64-.16L448%20333.84z%22%2F%3E%3C%2Fsvg%3E')"
      :class="{ disabled }"
      :style="[{ width : btnWidth, height : btnHeight}, hiddenBtn ? {'display' : 'none'} : {'display' : ''}]"
    ></button>

    <button
        @click="doClick('camera')"
        style="width: 50%; background-repeat: no-repeat; background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20class%3D%22ionicon%22%20viewBox%3D%220%200%20512%20512%22%3E%3Ctitle%3ECamera%3C%2Ftitle%3E%3Ccircle%20cx%3D%22256%22%20cy%3D%22272%22%20r%3D%2264%22%2F%3E%3Cpath%20d%3D%22M432%20144h-59c-3%200-6.72-1.94-9.62-5l-25.94-40.94a15.52%2015.52%200%2000-1.37-1.85C327.11%2085.76%20315%2080%20302%2080h-92c-13%200-25.11%205.76-34.07%2016.21a15.52%2015.52%200%2000-1.37%201.85l-25.94%2041c-2.22%202.42-5.34%205-8.62%205v-8a16%2016%200%2000-16-16h-24a16%2016%200%2000-16%2016v8h-4a48.05%2048.05%200%2000-48%2048V384a48.05%2048.05%200%200048%2048h352a48.05%2048.05%200%200048-48V192a48.05%2048.05%200%2000-48-48zM256%20368a96%2096%200%201196-96%2096.11%2096.11%200%2001-96%2096z%22%2F%3E%3C%2Fsvg%3E')"
        :class="{ disabled }"
        :style="[{ width : btnWidth, height : btnHeight}, hiddenBtn2 ? {'display' : 'none'} : {'display' : ''}]"
    ></button>

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
  inputcamera: HTMLInputElement | null,
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
      default: "70px",
    },
    btnHeight: {
      //按钮高度
      type: String,
      default: "70px",
    },
    disabled2: {
      //按钮高度
      type: Boolean,
      default: false,
    },
    hiddenBtn: {
      //按钮高度
      type: Boolean,
      default: false,
    },
    hiddenBtn2: {
      //按钮高度
      type: Boolean,
      default: false,
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
      inputcamera = <HTMLInputElement>document.getElementById('inputcamera');
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

    const doClick = (type : string) => {
      if (type !== 'camera'){
        if (input && !props.disabled) {
          input.click();
        }
      }else{
        if (inputcamera && !props.disabled) {
          inputcamera.click()
        }
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
  border: 3px solid #575757;
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
  background: #575757;
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
}
</style>
