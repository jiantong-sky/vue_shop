<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card class="box-card">
            <el-table :data="rightsList" border style="width: 100%" height="500">
                <el-table-column type="index" label="#" width="50"> </el-table-column>
                <el-table-column prop="authName" label="权限名称" width="180"> </el-table-column>
                <el-table-column prop="path" label="路径"> </el-table-column>
                <el-table-column label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level == 0" effect="dark" type="danger" color="#F56C6C">一级</el-tag>
                        <el-tag v-if="scope.row.level == 1" effect="dark" type="warning" color="#E6A23C">二级</el-tag>
                        <el-tag v-if="scope.row.level == 2" effect="dark" color="#409EFF">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 权限列表数据
            rightsList: [],
        }
    },
    // 生命周期函数
    created() {
        this.getRightsList()
    },
    methods: {
        async getRightsList() {
            // 获取权限列表数据
            const { data: res } = await this.$http.get('/rights/list')
            // console.log(res)
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.rightsList = res.data
        },
    },
}
</script>

<style lang="less" scoped>
</style>