<script setup>
import {onMounted, reactive} from "vue";
import myAxios from "@/config/my-axios.js";
import {botUrl, getUrl} from "@/config/constant.js";
import {ElMessage, ElMessageBox} from "element-plus";

let arr=reactive([]);
onMounted(async ()=>{
  await myAxios.get(getUrl("attheme")).then(e=>{
    arr.push(...e.data)
  })
  await ElMessageBox.alert('若要制作主题，请使用电脑访问本网站', '温馨提示', {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: '确定'
    // callback: (action) => {
    //   localStorage.setItem("showF", 1);
    // },
  })


})

const click_img=(name)=>{
  name=name.split(".")[0]
  window.open(botUrl(name+"A"),'_blank')
}

</script>

<template>
<div id="container">
  <el-header>
    <el-row>
      <el-col :span="2">
        <div id="avat">
          <a  href="https://t.me/morleydim" target="_blank" >
            <el-avatar :size="38" src="./src/assets/avator.jpg" />
          </a>
        </div>

      </el-col>
      <el-col :span="2">

      </el-col>
      <el-col :span="14">
        <div id="title">
          <h2 class="web-header" >Telegram主题</h2>
        </div>
      </el-col >

      <el-col :span="1">
        <div id="icon">
          <a  href="https://github.com/yusifmorley/TelegramBot" target="_blank" >
            <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" class="octicon octicon-mark-github v-align-middle color-fg-default">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
          </a>
        </div>

      </el-col>

    </el-row>
  </el-header>
</div>

  <el-main>
    <el-row>
      <el-col :span="24" v-for="x of arr">

          <div class="img-div"  >
            <el-image
                class="e-image"
                style="border-radius: 8%"
                :src="getUrl(`orgin`)+'/'+x[1]"
                alt="not found"
                @click="click_img(x[0])"
            />
          </div>
        </el-col>
    </el-row>

  </el-main>

  <el-footer>
    <div id="footer">
      <h3 style="color: #0d595d">到底了....</h3>
    </div>

  </el-footer>
</template>

<style scoped>
#container{
  padding-right: 3%;
  padding-bottom: 3%;
}
.el-main{
  background-color: var(--th-main);
  overflow: hidden;

}

.el-footer{
  background-color: var(--th-footer);
}

.el-header{
  text-align: center; /*设置文本水平居中*/

  --el-header-height: 46px;
  box-shadow:var(--bor-dark); /* 阴影效果 */
}

.e-image{
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

}

#title{
  padding: 0.4em;
}
#icon{
  padding: 0.4em;
}
#avat{
  padding: 0.3em;
}
.img-div{
  padding: 5%;
  margin-right: 1vw;
}
#footer{
  padding: 2vh;
  height: 5vh;
}
</style>