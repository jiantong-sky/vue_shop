<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
            <el-row :gutter="20">
                <!-- 添加分类 -->
                <el-col :span="4">
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <tree-table
                class="tree-table"
                :data="cateList"
                :columns="columns"
                show-index
                index-text="#"
                tree-type
                border
                :selection-type="false"
                :expand-type="false"
            >
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
                    <i class="el-icon-error" v-else></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag size="small" type="danger" v-if="scope.row.cat_level == 0">一级</el-tag>
                    <el-tag size="small" type="warning" v-else-if="scope.row.cat_level == 1">二级</el-tag>
                    <el-tag size="small" v-else>三级</el-tag>
                </template>
                <template slot="opt" slot-scope="scope">
                    <el-button size="small" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button size="small" type="danger" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <div class="block">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :page-size="5"
                    layout="total, prev, pager, next, jumper"
                    :total="total"
                >
                </el-pagination>
            </div>
        </el-card>
        <!-- 弹出添加商品分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="30%" @close="addCateDialog">
            <el-form :model="addCateForm" :rules="addCateRules" ref="addCateRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <div class="block">
                        <el-cascader
                            v-model="cateKeys"
                            :options="parentCateList"
                            :props="cascaderProps"
                            clearable
                            @change="parentCateChange"
                        ></el-cascader>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 商品分类的数据列表
            cateList: [],
            cateListAll: [],
            // 查询商品列表参数
            queryInfo: {
                type: 1,
                pagenum: 1,
                pagesize: 5,
            },
            // 商品数据总数量
            total: 0,
            // 为 table 指定列的定义
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name',
                },
                {
                    label: '是否有效',
                    type: 'template',
                    template: 'isok',
                },
                {
                    label: '排序',
                    type: 'template',
                    template: 'order',
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'opt',
                },
            ],
            // 控制显示与隐藏添加商品分类对话框
            addCateDialogVisible: false,
            // 添加商品分类的表单数据
            addCateForm: {
                // 分类父 ID
                cat_pid: 0,
                // 分类名称
                cat_name: '',
                // 分类层级
                cat_level: 0,
            },
            // 商品分类表单的验证规则
            addCateRules: {
                cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
            },
            // 父级商品分类列表
            parentCateList: [],
            // 存放级联选择器选中数据的 id ，必须为数组
            cateKeys: [],
            cascaderProps: {
                expandTrigger: 'hover',
                checkStrictly: true,
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
            },
        }
    },
    // 生命周期函数
    created() {
        this.getCateList()
    },
    methods: {
        // 获取商品分类数据列表
        async getCateList() {
            const { data: res } = await this.$http.get('/categories')
            if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
            // console.log(res.data.length)
            this.cateListAll = res.data
            this.cateList = res.data.slice(0, 5)
            this.total = res.data.length
        },
        // 分页
        handleCurrentChange(newPage) {
            var start = 0
            var end = 5
            // console.log(newPage)
            for (let i = 1; i < this.total; i++) {
                if (newPage == i) {
                    this.cateList = this.cateListAll.slice(start, end)
                }
                start += 5
                end += 5
            }
        },
        // 点击弹出分类对话框
        async showAddCateDialog() {
            const { data: res } = await this.$http.get('categories')
            // console.log(res.data)
            this.parentCateList = res.data
            this.parentCateList.forEach(item => {
                // console.log(item)
                if (!item.children) return
                item.children.forEach(ele => {
                    // console.log(ele)
                    if (!ele.children) return
                    delete ele.children
                })
            })
            this.addCateDialogVisible = true
            // console.log(this.parentCateList)
        },
        // 当级联选择器发生变化时
        parentCateChange() {
            // 当 cateKeys 的长度大于0时，表示级联选择器选中了父级分类
            if (this.cateKeys.length) {
                this.addCateForm.cat_pid = this.cateKeys[this.cateKeys.length - 1]
                this.addCateForm.cat_level = this.cateKeys.length
            } else {
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        },
        // 添加商品分类
        addCate() {
            // console.log(this.addCateForm)
            this.$refs.addCateRef.validate(async valid => {
                const { data: res } = await this.$http.post('categories', this.addCateForm)
                // console.log(res)
                if (res.meta.status !== 201) return this.$message.error('添加商品分类失败')
                this.getCateList()
                this.$message.success('添加商品分类成功')
                this.addCateDialogVisible = false
            })
        },
        // 监听对话框
        addCateDialog() {
            this.$refs.addCateRef.resetFields()
            this.cateKeys = []
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0
        },
    },
}
</script>

<style lang="less" scoped>
.el-icon-success {
    color: #67c23a;
    font-size: 20px;
}
.el-icon-error {
    color: #f56c6c;
    font-size: 20px;
}
.tree-table {
    margin-top: 15px;
}
.el-cascader {
    width: 100%;
}
</style>