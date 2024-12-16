<script setup>
import { useRouter} from 'vue-router'
import {onMounted, reactive, ref, toRefs, watch} from "vue";
import {isMobile} from "@/util/device-assret.js";
import {Moon, Sunny} from "@element-plus/icons-vue";
import { useDark, useToggle } from '@vueuse/core'
import {themeChannel} from "@/config/theme-constant.js";

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'light',
  valueLight: 'dark'
})
const toggle = useToggle(isDark)

const darken=ref(false)

watch(darken,(o,n)=>{
  toggle()
})


let  router = useRouter();
let theme_type=ref("3")

watch(theme_type,async (n,_)=>{
  if (n==="0"){
    await router.push("desktop")
  }
  if (n==="1"){
    await router.push("desk-attheme")
  }
  // if (n==="2"){
  //   await router.push("tm")
  // }
  if (n==="3"){
    await router.push("tp")
  }
})

</script>

<template>
  <div class="td-layout">
    <el-container>
      <div id="header-div">
      <el-header>
        <el-row>
          <el-col :span="2">
            <div id="avat">
              <a  href="https://t.me/morleydim" target="_blank" >
                <el-avatar :size="50" src="./src/assets/avator.jpg" />
              </a>
            </div>

          </el-col>
          <el-col :span="2">

          </el-col>
          <el-col :span="14">
            <div id="title">
              <h1  class="web-header" >Telegram主题</h1>
            </div>
          </el-col >
          <el-col :span="3">
            <div id="select_div">
              <el-select size="large" v-model="theme_type"  id="second_select" >
                <el-option label="桌面主题" value="0" />
                <el-option label="安卓主题" value="1" />
                <el-option  label="主题制作" value="3"/>
              </el-select>
            </div>
          </el-col>
          <el-col :span="1">
            <el-tooltip

                effect="dark"
                content="主题教程"
                placement="bottom"
            >

            <div id="icon">
              <a href="https://www.yusme.link/blog">
                <i  class="fa-solid fa-blog  fa-2x"></i>
             </a>

            </div>
              </el-tooltip>
          </el-col>

          <el-col :span="1">
          <!--            todo 思考-->
            <div id="icon">
              <a  href="https://github.com/yusifmorley/ThemeFactory" target="_blank" >
                <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" class="octicon octicon-mark-github v-align-middle color-fg-default">
                  <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                </svg>
              </a>
            </div>

          </el-col>
<!--          <el-col :span="1">-->
<!--            <div id="switch_color">-->
<!--              <el-switch-->
<!--                  style="&#45;&#45;el-switch-on-color: #63726a; &#45;&#45;el-switch-off-color: #ff4949"-->
<!--                  size="large"-->
<!--                  v-model="darken"-->
<!--                  :active-action-icon="Moon"-->
<!--                  :inactive-action-icon="Sunny"-->
<!--              />-->
<!--            </div>-->
<!--          </el-col>-->
        </el-row>
      </el-header>
      </div>
      <el-main >
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-main>

      <el-footer>
        <div id="foot_block">
          <h3 style="text-align: center" v-for="(v,k) in themeChannel">
            {{k}} <el-link :href="v" target="_blank" >{{v}}</el-link>
          </h3>
        </div>

      </el-footer>
    </el-container>

  </div>
</template>
<style scoped >
.el-header{
  text-align: center; /*设置文本水平居中*/
  background-color: var(--th-main);
  box-shadow:var(--bor-dark); /* 阴影效果 */

}

.el-main{
  background-color: var(--th-main);
  overflow: hidden;

}

.el-footer{
  height: 15vh;
  background-color: var(--th-footer);

}
#avat{
  padding: 0.36em;
}
#title{
  padding: 0.9em;
}
#icon{
  padding: 13px;
}
#select_div {
  padding: 10px;
}
#switch_color{
  padding: 10px;
  margin-left: 20px;
}
#foot_block{
  margin-top: 20px;
}
#header-div{
  padding-right: 20px;
  padding-bottom: 20px;
}

</style>