# vue3-image-slim README
## 这个组件把你的图片文件进行剪切和优化，适用于vue3。
## This is a vue3 component to crop and optimize your images before you upload them. [More details](#en)
## [demo](https://sfsl.xyz/#/vue-image-slim) | [Vue2版本 | For Vue2](https://github.com/aardpro/vue-image-slim)
<br>

![示意图sketch](http://qiniu-avs.sfsl.xyz/vue-image-slim-sketch.png "SKETCH")

<br>

## <span id='cn'>安装</span>
```
npm install vue3-image-slim
```
## 使用
  1.  在script中引入：
  > import Vue3ImageSlim from "vue3-image-slim"
  > import "vue3-image-slim/dist/default.css"
  2. 在components中:
  ```
  components:{
    Vue3ImageSlim
  }
  ```
  3. 在methods中：
   
```
  getDataURL(dataURL){
    console.log(dataURL);
    // 获取到剪裁并优化后的base64格式字符串，你可以把它渲染到<img>标签内
  },
  getFile(file){
    // 获取到剪裁并优化后的File对象，你可以用它上传
    console.log(file);
  }
```
  4. 在template中：
  ```
    <vue3-image-slim
      o="C"
      :w="300"
      :h="300"
      @getDataURL="getDataURL"
      @getFile="getFile"
    />
```
## 参数说明
  + o(String)，可选 剪切图片的原点，可以使用的值是：
    - LT, left-top, 左上角，这是缺省值
    - RT, right-top, 右上角
    - C, center point, 中心点
    - LB, left-bottom, 左下角
    - RB, right-bottom, 右下角
  + w(Number)，可选 目标图片的宽度，缺省值是原图宽度
  + h(Number)，可选 目标图片的高度，缺省值是原图高度
  + disabled(Boolean)，可选 是否禁止点击文件选择按钮，缺省值否


<br>
<br>

## <span id="en">Install</span>
```
npm install vue3-image-slim
```

## Usage
  1. in script tag:
  > import Vue3ImageSlim from "vue3-image-slim"
  > import "vue3-image-slim/dist/default.css"
  
  2. put it into components:
  ```
  components:{
    Vue3ImageSlim
  }
  ```
  3. create the methods:
   
```
  getDataURL(dataURL){
    // get the cropped and optimized base64 string to render on <img> tag
    console.log(dataURL);
  },
  getFile(file){
    // get the cropped and optimized file object to upload
    console.log(file);
  }
```
4. use the component in template:
  ```
    <vue3-image-slim
      o="C"
      :w="300"
      :h="300"
      @getDataURL="getDataURL"
      @getFile="getFile"
    />
```
## props
  + o(String)，optional, the original point to crop, valid values as below:
    - LT, left-top, default
    - RT, right-top
    - C, center point
    - LB, left-bottom
    - RB, right-bottom
  + w(Number)，optional, px width of final image, default the original width
  + h(Number)，optional, px height of final image, default the original height
  + disabled(Boolean)，optional, if to disable the file selection button, default false
