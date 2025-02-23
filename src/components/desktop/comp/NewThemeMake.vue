<script setup lang="ts">
import {computed, nextTick, onBeforeMount, ref, watch} from "vue";
import axios from "axios";
import download from "downloadjs";
import { useBase64 } from '@vueuse/core'
import {Action, ElMessage, ElMessageBox} from "element-plus";
import iro from '@jaames/iro';
import Vibrant from "node-vibrant/dist/vibrant.worker.js";
let  arrs=ref([[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]])
let alpha=ref(0.618)
let colorPicker;
let serverUrl;
let targetL=ref(100)
let targetS=ref(100)

let themeMap;
let curThemeType=ref(0)
let curThemeTypeEmessage=ref("")
let isActive=computed(() => {
 return curThemeType.value===1
})
const showThemeType = computed(() => {
  switch (curThemeType.value) {
    case 0:
      curThemeTypeEmessage.value="主题由单一颜色组成";
      return "Simple";
    case 1:
      curThemeTypeEmessage.value="主题由唯一颜色的H构成，但S、L可能不同。在依据此模板制作主题时，饱和度和亮度将无效！";
      return "SimpleDifference";
    case 2:
      curThemeTypeEmessage.value="主题依据多种颜色构成";
      return "SimpleDifference";
  }

})
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
      //反序列化 map
      themeMap=new Map(JSON.parse(res.data.map));
      colorPicker=  iro.ColorPicker('#picker', {
        // Set the size of the color picker
        width: 320,
        // Set the initial color to pure red
        layout: [
          {
            component: iro.ui.Wheel,
            options: {}
          },
          {
            component: iro.ui.Slider,
            options: {
              // can also be 'saturation', 'value', 'red', 'green', 'blue', 'alpha' or 'kelvin'
              sliderType: 'value'
            }
          },
          {
            component: iro.ui.Slider,
            options: {
              // can also be 'saturation', 'value', 'red', 'green', 'blue', 'alpha' or 'kelvin'
              sliderType: 'alpha'
            }
          }
        ]
      });
      //初始化建议
      colorPicker.color.hsla={h:colors.value,l:targetL.value,s:targetS.value, a:alpha.value }
      colorPicker.on('color:change', function(color) {
        colors.value=color.hsla.h
        targetL.value=color.hsla.l
        targetS.value=color.hsla.s
        alpha.value=color.hsla.a
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

watch(moudle,(newM)=>{
 curThemeType.value=themeMap.get(newM)
})


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
const colors = ref(-1);
const previewFiles = (e) => {
  //img.value 当前显示的图片
  let file= e.target.files[0]
  console.log(file.size)
  if(file.size>5_000_000){
    ElMessage({
      message: 'telegram主题不支持图片大小大于5MB的图像作为主题壁纸!',
      type: 'error',
      duration:4000,
    })
    return
  }
  img.value=URL.createObjectURL(file)
  //@ts-ignore
  fileo.value=file
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
      // console.log(arrs.value)

    })

}

})

const expressType=()=>{
  ElMessageBox.alert(curThemeTypeEmessage.value, '说明', {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: '确定',
    callback: (action: Action) => {
      ElMessage({
        type: 'info',
        message: `action: ${action}`,
      })
    },
  })
}

const submit=async ()=> {
  //console.log(img.value)
  if (colors.value==-1)
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
    sat:targetS.value,
    lig:targetL.value,
    alpha:alpha.value,
    pic:pbase
  }, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json'
    }}).then(res=>{
    const { data, headers } = res
    const fileName=randomString(5)
    const fileNameExten =  kind.value=="0"?".attheme":".tdesktop-theme"
    // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
    //const blob = new Blob([JSON.stringify(data)], ...)
    const blob = new Blob([data], {type: headers['content-type']})
    //TODO  指定模板名称
    download(blob,`${kind.value}-${type.value}-${moudle.value}-${alpha.value}-${colors.value}-${targetS.value}-${targetL.value}-`+fileName+fileNameExten)

  })
}
function randomString(length) {
  let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (var i = length; i > 0; --i)
    result += str[Math.floor(Math.random() * str.length)];
  return result;
}

function seek(num:number[]) {
  colorPicker.color.hsl = { h: num[0]*360, s: num[1]*100, l: num[2]*100 };
  console.log(colorPicker.color.hsl);
}

</script>

<template>

  <el-main class="app">
    <el-row>
      <el-col :span="1">
        <div class="overPadding">
        <div class="inFlag" >
          <el-text >种类</el-text>
        </div>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="overPadding">
        <el-select v-model="kind" placeholder="Select" style="width: 240px">
          <el-option key="1" label="安卓" value="0" ></el-option>
          <el-option key="2" label="桌面" value="1"></el-option>
        </el-select>
        </div>
      </el-col>

      <el-col :span="6"  >
        图片突出色(HSL):<br/>
        <el-button v-for="x in arrs" :style="{'background-color':`hsl(${x[0]*360}deg ${x[1]*100}% ${x[2]*100}%)`}" @click="seek(x)" >{{Math.floor(arrs[0][0]*360)}}</el-button>

      </el-col>

      <el-col :span="2"  >
      </el-col>

      <el-col :span="4"  >
        <el-text >聊天消息透明度(Alpha):</el-text>  <span class="ops-clo"> {{ alpha}} </span> <br/>
        <el-text >目标突出色(Hue):</el-text> <span class="ops-clo" > {{ colors }} </span><br/>
        <el-text :class="{deleteLine:isActive }"> 饱和度(Saturation):</el-text> <span class="ops-clo">{{ targetS }} </span><br/>
        <el-text :class="{deleteLine:isActive }"> 亮度( Lightness):</el-text>  <span class="ops-clo">{{ targetL }} </span>
      </el-col>

    </el-row>

    <el-row style="margin-bottom: 21px">
      <el-col :span="1" >
        <div class="inFlag">
          <el-text >黑/白</el-text>
        </div>
      </el-col>
      <el-col :span="6">
        <el-switch v-model="type" />
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="1">
          <div class="inFlag">
                  <el-text>模板</el-text>
          </div>
      </el-col>
      <el-col :span="5">
        <el-select v-model="moudle" placeholder="请选择" style="width: 240px">
          <el-option v-for="(e,i) in optionList"
                     :key="i"
                     :label="e"
                     :value="e" />
        </el-select>
      </el-col>
      <el-col :span="2"><el-button @click="expressType" plain>{{showThemeType}}</el-button></el-col>
      <el-col :span="3"></el-col>
      <el-col :span="8">
        <div class="imagePicker">
          <input   @change="previewFiles($event)"  type="file" />
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
        <div id="content" >
          <el-button id="buTo" @click="submit">提交</el-button>
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
#picker{
  min-height: 400px;
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

#buTo{
  margin-top: -236px;
  margin-left: 10vw;
}
#picker{
  margin-bottom: 20vh;
}
.ops-clo{
  color:rgb(106.8, 108.9, 113.1);
}
.inFlag{
  padding: 5px;
}
.overPadding{
  padding-top: 20px;
}
.deleteLine{
  text-decoration: line-through
}
</style>
