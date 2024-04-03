<script setup>
import {onMounted, reactive, ref, toRefs, watch} from "vue";
import {isMobile} from "./util/device-assret.js";
import {router} from "@/router/index.js";

onMounted(async ()=>{
    if(isMobile()){
     await router.push("/attheme")
    }else {
     await router.push("/desk/desktop")
    }
})
</script>

<template>
  <router-view/>
</template>

<style scoped >

</style>