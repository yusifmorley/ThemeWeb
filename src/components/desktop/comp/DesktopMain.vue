<script setup>
import {onMounted, reactive, ref} from "vue";
import myAxios from "@/config/my-axios.js";
import {botUrl, getUrl,pubFile} from "@/config/constant.js";

let arr=ref([]);
onMounted(async ()=>{
  await myAxios.get(getUrl("desk")).then(e=>{
    arr.value.push(...e.data.data)
  })
})

const click_img=(name)=>{
  name=name.substring(0,64)
  window.open(botUrl(name),'_blank')
}

</script>

<template>

  <el-row >

    <el-col :span="6" :xs="24" v-for="x in arr">
      <div class="item-ele" >
        <div class="img-div" >
          <el-image
              style="border-radius: 2%;"
              :src="getUrl(`orgin`)+'/'+x[1]"
              alt="not found"
              @click="click_img(x[0])"
          />
        </div>

<!--        <div class="down-po">-->
<!--            <a  :href="pubFile(x[0])" download="">-->
<!--              <el-button class="bu-my" plain :size='"large"' round bg type="danger" >下载</el-button>-->
<!--            </a>-->
<!--        </div>-->

      </div>
    </el-col>

  </el-row>



</template>

<style scoped>


.img-div {
  padding: 3px;
  transition: opacity 0.5s; /* 添加过渡效果 */
}

.img-div:hover {
  opacity: 0.5;
}

.down-po{
  margin-top: -3px;
}

.bu-my{
  width: 100%;
}
.bu-my:hover{
  background-color: #FF4949FF;
}
</style>