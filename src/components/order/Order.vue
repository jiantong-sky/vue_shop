<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
            <!-- 卡片头部区域 -->
            <el-row :gutter="20">
                <!-- 搜索区域 -->
                <el-col :span="8">
                    <el-input placeholder="请输入内容" clearable v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search" @click="searchOrderList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table :data="orderList.goods" border style="width: 100%">
                <el-table-column type="index" label="#" width="60"> </el-table-column>
                <el-table-column prop="order_number" label="订单编号" width="400"> </el-table-column>
                <el-table-column prop="order_price" label="价格" width="80"> </el-table-column>
                <el-table-column prop="pay_status" label="是否付款">
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.pay_status == '0'">未付款</el-tag>
                        <el-tag type="success" v-else>已付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货"> </el-table-column>
                <el-table-column prop="create_time" label="下单时间">
                    <template slot-scope="scope">{{ scope.row.create_time | dateFormat }}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template>
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="showDialog"></el-button>
                        <el-button type="success" size="mini" icon="el-icon-location-outline"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页功能 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[2, 3, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="orderList.total"
            >
            </el-pagination>
        </el-card>
        <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="50%" @close="clearForm">
            <el-form :model="addRessForm" :rules="addRessFormRules" ref="addRessFormRef" label-width="100px">
                <el-form-item label="省市/县" prop="address1">
                    <el-cascader
                        v-model="addRessForm.address1"
                        :options="citydata"
                        :props="{ expandTrigger: 'hover' }"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addRessForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import citydata from './citydata.js'
export default {
    data() {
        return {
            // 请求的参数
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5,
            },
            // 订单列表数据
            orderList: {},
            editDialogVisible: false,
            addRessForm: {
                address1: [],
                address2: '',
            },
            addRessFormRules: {
                address1: [{ required: true, message: '请选择地址', trigger: 'blur' }],
                address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }],
            },
            citydata,
        }
    },
    // 生命周期函数
    created() {
        this.getOrderList()
    },
    methods: {
        // 获取订单列表
        async getOrderList() {
            const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
            if (res.meta.status !== 200) return this.$message.error('获取订单列表失败')
            // console.log(res.data)
            this.orderList = res.data
            // console.log(this.orderList)
        },
        // 当前页发生改变时触发
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getOrderList()
        },
        // 每页条数发生改变时触发
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getOrderList()
        },
        // 点击搜索按钮触发
        searchOrderList() {
            console.log(this.queryInfo.query)
            this.getOrderList()
        },
        showDialog() {
            this.editDialogVisible = true
        },
        clearForm() {
            this.$refs.addRessFormRef.resetFields()
        },
    },
}
</script>

<style lang="less" scoped>
.el-table {
    margin: 15px 0;
}
.el-cascader {
    width: 100%;
}
</style>

