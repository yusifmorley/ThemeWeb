<script setup >
import {computed, onMounted, reactive, ref, watch} from "vue";
import {Delete, Download, Plus, Select, ZoomIn} from '@element-plus/icons-vue'

import {nightColorScheme,extendedColorScheme} from '../../../util/colors.js'

const flag0=ref(false)
const flag1=ref(false)

const radio0=ref(0)
const radio1=ref(0);

const color0=ref();
const color1=ref();

const colors0=ref(extendedColorScheme);
const colors1=ref(extendedColorScheme);

let  node0;
let  node1;
onMounted(()=>{
  // 选项本身的字体颜色
  node0= document.getElementById("first_select");
  node1= document.getElementById("second_select");

})

watch(color0,(_,n)=>{
     node0.style.backgroundColor=_
     let main= document.getElementsByClassName("el-main")[0]
     main.style.backgroundColor =_
})
watch(color1,(_,n)=>{
    node1.style.backgroundColor=_
    let main= document.getElementsByClassName("el-header")[0]
    main.style.backgroundColor =_

    let bn=document.getElementById("create-btn")
    bn.style.backgroundColor=_

})

watch(radio0,(_,n)=>{ //背景色监控
  if (radio0.value=== '1'){

     flag0.value=false
     let main= document.getElementsByClassName("el-main")[0]
     main.style.backgroundColor = "black";

     main.style.color = "white";

  }
  else if (radio0.value=== '2') {

    flag0.value=false
    let main= document.getElementsByClassName("el-main")[0]
    main.style.backgroundColor = "white"
    main.style.color = "black";

  }
  else {

    flag0.value=true
    color0.value="#8737f8"

  }

})
watch(radio1,(_,n)=>{ //强调色监控

  if (radio1.value=== '1'){
    flag1.value=false
    let header= document.getElementsByClassName("el-header")[0]
    header.style.backgroundColor = "black";
    header.style.color="white"

    let bn=document.getElementById("create-btn")
    bn.style.backgroundColor = "black";
    bn.style.color="white"

  }
  else if (radio1.value=== '2') {
    flag1.value=false
    let header= document.getElementsByClassName("el-header")[0]
    header.style.backgroundColor = "white";
    header.style.color="black"

    let bn=document.getElementById("create-btn")
    bn.style.backgroundColor = "white";
    bn.style.color="black"

  }
  else {
    flag1.value=true
    color1.value="#8737f8"
  }

})

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)

const handleRemove = (file) => {
  console.log(file)
}

const handlePictureCardPreview = (file) => {
  // dialogImageUrl.value = file.url!
  // dialogVisible.value = true
}

const handleDownload = (file) => {
  console.log(file)
}



</script>

<template>

  <el-row class="item">
    <el-col :span="3"></el-col>
    <el-col :span="9"> <span class="select-title">请选择主要颜色</span> </el-col>
  </el-row>

  <el-row>
      <el-col :span="5"></el-col>
      <el-col :span="15">
        <el-radio-group v-model="radio0">
          <el-radio label="1" size="large">暗色</el-radio>
          <el-radio label="2" size="large">亮色</el-radio>
          <el-radio label="3" size="large">自定义颜色</el-radio>
        </el-radio-group>
      </el-col>

    <el-col :span="4"  >
      <select  v-model="color0"  id="first_select" v-show="flag0" >
        <option   v-for="(option,i) in colors0"
                  :key="i"
                  :value="option.value"
                  :style="{'background-color':option.value,color:'white'}"
        >
          {{option.text}}
        </option>
      </select>
    </el-col>

  </el-row>

  <el-row class="item">
    <el-col :span="3"></el-col>
    <el-col :span="9"> <span class="select-title">请选择强调色</span> </el-col>
  </el-row>

  <el-row>
    <el-col :span="5"></el-col>
    <el-col :span="15">
      <el-radio-group v-model="radio1">
        <el-radio label="1" size="large">暗色</el-radio>
        <el-radio label="2" size="large">亮色</el-radio>
        <el-radio label="3" size="large">自定义颜色</el-radio>
      </el-radio-group>
    </el-col>

    <el-col :span="4"  >
      <select  v-model="color1"  id="second_select" v-show="flag1" >
        <option   v-for="(option,i) in colors1"
                  :key="i"
                  :value="option.value"
                  :style="{'background-color':option.value,color:'white'}"
        >
          {{option.text}}
        </option>
      </select>
    </el-col>

  </el-row>

  <el-row class="item">
    <el-col :span="3"> </el-col>
    <el-col :span="9"> <span class="select-title">上传背景图片</span> </el-col>
  </el-row>

<el-row>
  <el-col :span="5"></el-col>
  <el-col :span="10">
    <el-upload action="#" list-type="picture-card" :auto-upload="false">
      <el-icon><Plus /></el-icon>
      <template #file="{ file }">
        <div>
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <span class="el-upload-list__item-actions">

            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>

          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
          >
            <el-icon><Download /></el-icon>
          </span>

          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>

        </span>
        </div>
      </template>
    </el-upload>

    <el-dialog v-model="dialogVisible">
      <el-image w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>

  </el-col>
</el-row>

<el-row>
  <el-col :span="22"></el-col>
  <el-col :span="2">
    <button id="create-btn" >创建</button>
  </el-col>
</el-row>

</template>


<style scoped>
button{
  background-color: aquamarine;
  width: 110px;
  height: 100px;
  border-radius: 10px;
}

button:hover{
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
  background-color: #4CAF50;
  color: white;
}

.gent{
  font-size: 3em;
}
.select-title{
 font-size: 2.28em;

}
.item{
  margin-top: 20px;
  margin-bottom: 30px;
}
.el-radio{
  margin-right: 180px;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
select{
  font-size: 1.1em;
  height: 50px;
  width: 150px;
  color: white;
}



.avatar-uploader .el-upload {
  border: 1px dashed black;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;

}
</style>