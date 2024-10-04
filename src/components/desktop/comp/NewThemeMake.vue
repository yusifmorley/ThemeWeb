<script setup lang="ts">
import {computed, nextTick, onBeforeMount, ref, watch} from "vue";
import axios from "axios";
import download from "downloadjs";
import { useBase64 } from '@vueuse/core'
import {ElMessage} from "element-plus";
import iro from '@jaames/iro';
import Vibrant from "node-vibrant/dist/vibrant.worker.js";
let  arrs=ref([[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]])
let colorPicker;
let serverUrl
if (process.env.NODE_ENV === "production"){
  serverUrl="https://www.yusme.link:3000"
}
else {
  serverUrl="http://127.0.0.1:3000"
}

const  photoEsten="捕获.png"
let l=ref(null);

onBeforeMount( async ()=> {
      let res=  await axios.get(`${serverUrl}/templete-info`)
      l.value= res.data
      colorPicker=  iro.ColorPicker('#picker', {
        // Set the size of the color picker
        width: 320,
        // Set the initial color to pure red

      });

      colorPicker.on('color:change', function(color) {
        colors.value=color.hsl.h
      });
    }
)

//0 为安卓 1  为  桌面
const kind=ref("1")

//true 为白 false 为黑
const type=ref(false)

// 已选 色
const moudle=ref()

const fileo = ref()
const { base64: fileBase64 } = useBase64(fileo)
let pbase;
const optionList=ref()


watch([kind,type,l],([newk, newt])=>{

  moudle.value=`${type.value?'white':'black'}1`
  if(newk=="1"){
    if(newt==true){
      optionList.value= l.value.desktop_white

    }
    if(newt==false){
      optionList.value= l.value.desktop_black
    }
  }

  // 0为桌面
  if(newk=="0"){
    if(newt==true){
      optionList.value= l.value.android_white
    }
    if(newt==false){
      optionList.value= l.value.android_black
    }
  }
})

//选项 计算

// 图片地址生成器
const getPhotoUrl=computed(()=>{
  if(kind.value=="1"){
    if(type.value==true){
      //白
      return `${serverUrl}/desktop/white/${moudle.value}/${photoEsten}`
    }
    // 黑
    if(type.value==false){
      return `${serverUrl}/desktop/black/${moudle.value}/${photoEsten}`
    }
  }
  if(kind.value=="0"){
    //白
    if(type.value==true){
      return `${serverUrl}/android/white/${moudle.value}/${photoEsten}`
    }
    // 黑
    if(type.value==false){
      return `${serverUrl}/android/black/${moudle.value}/${photoEsten}`
    }
  }
})
const colors = ref("");
const previewFiles = () => {
  //@ts-ignore
  img.value=URL.createObjectURL(event.target.files[0])
  //@ts-ignore
  fileo.value=event.target.files[0]
}
watch(fileBase64,()=>{
  pbase = fileBase64.value
})
//当前图片对象
//图片地址
const img=ref()
const imgi=ref(null)

let palette
watch(img,(newVal, oldVal) => {
  let img1 = new Image(); // Image 构造器
  img1.src=img.value

if (img.value!==null){
     Vibrant.from(img1).quality(10).getPalette().then(palette=>{
      arrs.value=[palette.Vibrant.hsl,
         //@ts-ignore
         palette.LightVibrant.hsl,
         //@ts-ignore
         palette.DarkVibrant.hsl,
         //@ts-ignore
         palette.DarkMuted.hsl,
         //@ts-ignore
         palette.Muted.hsl
       ];
       console.log(arrs)

    })

}

})



const submit=async ()=> {
  console.log(img.value)
  if (colors.value=="")
  {
    ElMessage.warning("目标色为空!")
    return;
  }

  if(img.value===undefined){
    ElMessage.warning("图片为空!")
    return;
  }



  await axios.post(`${serverUrl}/templete-editor`, {
    kind: kind.value=="0"?"android":"desktop",
    type:type.value?"white":"black",
    moudle:moudle.value,
    hue:colors.value,
    pic:pbase
  }, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json'
    }}).then(res=>{
    const { data, headers } = res
    const fileName=randomString(10)
    const fileNameExten =  kind.value=="0"?".attheme":".tdesktop-theme"
    // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
    //const blob = new Blob([JSON.stringify(data)], ...)
    const blob = new Blob([data], {type: headers['content-type']})
    download(blob,fileName+fileNameExten)

  })
}
function randomString(length) {
  var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';
  for (var i = length; i > 0; --i)
    result += str[Math.floor(Math.random() * str.length)];
  return result;
}
</script>

<template>

  <el-main class="app">
    <el-row>
      <el-col :span="1">
        <el-text >种类</el-text>
      </el-col>
      <el-col :span="10">
        <el-select v-model="kind" placeholder="Select" style="width: 240px">
          <el-option key="1" label="安卓" value="0" ></el-option>
          <el-option key="2" label="桌面" value="1"></el-option>
        </el-select>
      </el-col>

      <el-col :span="5"  >
        图片突出色:<br/>
        {{arrs[0][0]*360}}<br/>
        {{arrs[1][0]*360}}<br/>
        {{arrs[2][0]*360}}<br/>
        {{arrs[3][0]*360}}<br/>
        {{arrs[4][0]*360}}
      </el-col>

      <el-col :span="3"  >
      </el-col>

      <el-col :span="3"  >
        目标突出色: {{colors}}
      </el-col>

    </el-row>

    <el-row>
      <el-col :span="1" >
        <el-text >黑/白</el-text>
      </el-col>
      <el-col :span="6">
        <el-switch v-model="type" />
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <el-text >可用模板</el-text>
      </el-col>

      <el-col :span="6">
        <el-select v-model="moudle" placeholder="请选择" style="width: 240px">
          <el-option v-for="(e,i) in optionList"
                     :key="i"
                     :label="e"
                     :value="e" />
        </el-select>
      </el-col>
      <el-col :span="5"></el-col>
      <el-col :span="8">
        <div class="imagePicker">
          <input   @change="previewFiles"  type="file" />
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="8">
        <div class="block" v-if="moudle!=null">
          <el-image v-if="kind=='1'" style="margin-top: 5vh;width: 100%; height: auto"  :src="getPhotoUrl" />
          <el-image v-else style="margin-top: 5vh;width: auto; height: 100%"  :src="getPhotoUrl" />
        </div>
      </el-col>
      <el-col :span="3"></el-col>
      <el-col :span="8">
        <div id="container">
          <img id="preview" :src="img" :ref="imgi"/>
        </div>
      </el-col>
      <el-col :span="5" >
        <div id="picker"></div>
        <div id="lcontan" >
          <el-button id="buto" @click="submit">提交</el-button>
        </div>
      </el-col>

    </el-row>
  </el-main>
</template>

<style>

:root{

  background-color: white;
}

.block{
  width: 100%;
  overflow: hidden;
}

#input-file{
  opacity: 0;
}
.file {
  position: relative;
  display: inline-block;
  background: #D0EEFF;
  border: 1px solid #99D3F5;
  border-radius: 4px;
  padding: 4px 12px;
  overflow: hidden;
  color: #1E88C7;
  text-decoration: none;
  text-indent: 0;
  line-height: 20px;
}
.file input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
}
.file:hover {
  background: #AADFFD;
  border-color: #78C3F3;
  color: #004974;
  text-decoration: none;
}
#preview{
  width: 80%;
  height: auto;
}
#container{
  overflow: hidden;
}

#buto{
  margin-top: -156px;
  margin-left: 10vw;
}
#picker{
  margin-bottom: 20vh;
}
</style>
