<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header height="80px">
            <!-- logo -->
            <div>
                <img src="../assets/heima.png" alt="" />
                <span>黑马电商后台管理</span>
            </div>
            <!-- 退出按钮 -->
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <!-- 左侧导航栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="fold-menu" @click="foldMenu">|||</div>
                <el-menu
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    background-color="#dcdfe6"
                    text-color="#303133"
                    active-text-color="#409EFF"
                    unique-opened
                    router
                    :default-active="activePath"
                >
                    <!-- 一级导航栏 -->
                    <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                        <!-- 一级导航栏模板 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{ item.authName }}</span>
                        </template>
                        <!-- 二级导航栏 -->
                        <el-menu-item
                            @click="saveNavState('/' + item.path)"
                            :index="'/' + subItem.path"
                            v-for="subItem in item.children"
                            :key="subItem.id"
                        >
                            <!-- 二级导航栏模板 -->
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-menu"></i>
                                <!-- 文本 -->
                                <span>{{ subItem.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧主体部分 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            // 左侧菜单栏数据
            menulist: [],
            // 图标
            iconsObj: {
                125: 'el-icon-s-custom',
                103: 'el-icon-connection',
                101: 'el-icon-goods',
                102: 'el-icon-date',
                145: 'el-icon-data-analysis',
            },
            // 折叠菜单栏
            isCollapse: false,
            // 被激活的地址
            activePath: '',
        }
    },
    created() {
        this.getMenuList()
        this.activePath = window.sessionStorage.getItem('url')
    },
    methods: {
        logout() {
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        // 获取所有的菜单栏
        async getMenuList() {
            const { data: res } = await this.$http.get('/menus')
            // console.log(res)
            if (res.meta.status != 200) return this.$message.error(res.meta.msg)
            this.menulist = res.data
        },
        // 折叠菜单栏
        foldMenu() {
            this.isCollapse = !this.isCollapse
        },
        // 保存链接的激活状态
        saveNavState(url) {
            window.sessionStorage.setItem('url', url)
            this.activePath = url
        },
    },
}
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}
.el-header {
    background-color: #909399;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div {
        display: flex;
        align-items: center;
        span {
            margin: 15px;
            color: #f2f6fc;
            font-size: 20px;
        }
    }
}
.el-aside {
    background-color: #dcdfe6;
    .el-menu {
        border-right: none;
    }
}
.el-main {
    background-color: #f3f2f2;
}
.fold-menu {
    height: 25px;
    text-align: center;
    line-height: 25px;
    color: #303133;
    cursor: pointer;
    border-bottom: 1px solid #f3f2f2;
    letter-spacing: 0.3em;
    font-size: 10px;
}
</style>