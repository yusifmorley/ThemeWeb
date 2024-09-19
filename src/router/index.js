import * as VueRouter from 'vue-router';

const routes = [
    { path: '/attheme', component: ()=> import("@/components/mobile/MobileAttheme.vue") },
    {   path: '/desk',
        component: ()=>import("@/components/desktop/demian.vue"),
        children: [
            { path: 'desktop',  component: ()=>import("../components/desktop/comp/DesktopMain.vue") },
            { path: 'desk-attheme', component:()=> import("../components/desktop/comp/AthemeMain.vue") },
            {path: 'tm',component: ()=> import("@/components/desktop/comp/ThemeMake.vue")},
        ]
    }
  ]
  
  export const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
    mode:"history"
  })