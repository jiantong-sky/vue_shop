<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
            <!-- 卡片头部区域 -->
            <el-row :gutter="20">
                <!-- 搜索区域 -->
                <el-col :span="8">
                    <el-input
                        placeholder="请输入内容"
                        clearable
                        v-model="queryInfo.query"
                        @change="searchGoodsList"
                        @input="inputChange"
                    >
                        <el-button slot="append" icon="el-icon-search" @click="searchGoodsList"></el-button>
                    </el-input>
                </el-col>
                <!-- 添加商品按钮 -->
                <el-col :span="6">
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 商品列表数据 -->
            <el-table :data="goodsList.goods" border style="width: 100%">
                <el-table-column type="index" label="#" width="60"> </el-table-column>
                <el-table-column prop="goods_name" label="商品名称" width="600"> </el-table-column>
                <el-table-column prop="goods_price" label="商品价格" width="100"> </el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="100"> </el-table-column>
                <el-table-column prop="add_time" label="创建时间" width="180">
                    <template slot-scope="scope">{{ scope.row.add_time | dateFormat }}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="delGoods(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 3, 5, 10]"
                :page-size="5"
                layout="total, sizes, prev, pager, next, jumper"
                :total="goodsList.total"
            >
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 查询商品列表的参数
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5,
            },
            // 商品列表数据
            goodsList: {},
        }
    },
    // 生命周期函数
    created() {
        this.getGoodsList()
    },
    methods: {
        // 获取商品列表
        async getGoodsList() {
            const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
            if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
            // console.log(res.data)
            this.goodsList = res.data
        },
        // 当当前页码发生改变时触发
        handleCurrentChange(newPage) {
            // console.log(newPage)
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        // 当每页显示的条数发生改变时触发
        handleSizeChange(newSize) {
            // console.log(newSize)
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        // 搜索商品列表
        searchGoodsList() {
            // console.log(this.queryInfo.query)
            this.getGoodsList()
        },
        // 当搜索框内容发送变化时触发
        inputChange() {
            // 当搜索框为空时，显示所有数据
            if (this.queryInfo.query.trim().length == 0) {
                this.getGoodsList()
            }
        },
        // 删除商品
        async delGoods(row) {
            // console.log(row)
            const result = await this.$confirm('你确定要删除这个商品吗？', '警告！', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).catch(err => err)
            if (result !== 'confirm') return this.$message.info('已取消删除')
            // 向服务器发送请求，删除商品
            const { data: res } = await this.$http.delete(`goods/${row.goods_id}`)
            if (res.meta.status !== 200) return this.$message.error('删除商品失败')
            this.getGoodsList()
            this.$message.success('删除商品成功')
        },
        // 点击添加商品按钮跳转路由
        goAddpage() {
            this.$router.push('/goods/add')
        },
    },
}
</script>

<style lang="less" scoped>
.el-table {
    margin-top: 15px;
}
</style>