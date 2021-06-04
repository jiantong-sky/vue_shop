<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
            <!-- 提示框 -->
            <el-alert
                title="注意：只允许为第三级分类设置相关参数!"
                type="warning"
                show-icon
                :closable="false"
            ></el-alert>
            <!-- 选则分类商品区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品的级联选择框 -->
                    <el-cascader
                        v-model="cateKeys"
                        :options="cateList"
                        :props="props"
                        @change="handleChange"
                    ></el-cascader>
                </el-col>
            </el-row>
            <!-- tabs标签页 -->
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <!-- 添加动态参数面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加参数按钮 -->
                    <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true"
                        >添加参数</el-button
                    >
                    <!-- 动态参数表格 -->
                    <el-table height="310" :data="manyTableData" border style="width: 100%">
                        <!-- 展开列 -->
                        <el-table-column type="expand" width="60">
                            <template slot-scope="scope">
                                <el-tag
                                    closable
                                    v-for="(item, index) in scope.row.attr_vals"
                                    :key="index"
                                    @close="handleClose(index, scope.row)"
                                >
                                    {{ item }}
                                </el-tag>
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm"
                                    @blur="handleInputConfirm"
                                >
                                </el-input>
                                <el-button class="button-new-tag" v-else @click="showInput(scope.row)">
                                    + New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#" width="60"> </el-table-column>
                        <el-table-column prop="attr_name" label="参数名称" width="180"> </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">
                                    编辑
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete" @click="delParams(scope.row)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加属性按钮 -->
                    <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">
                        添加属性
                    </el-button>
                    <!-- 静态属性表格 -->
                    <el-table height="310" :data="onlyTableData" border style="width: 100%">
                        <!-- 展开列 -->
                        <el-table-column type="expand" width="60">
                            <template slot-scope="scope">
                                <el-tag
                                    closable
                                    v-for="(item, index) in scope.row.attr_vals"
                                    :key="index"
                                    @close="handleClose(index, scope.row)"
                                >
                                    {{ item }}
                                </el-tag>
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm"
                                    @blur="handleInputConfirm"
                                >
                                </el-input>
                                <el-button class="button-new-tag" v-else @click="showInput(scope.row)">
                                    + New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#" width="60"> </el-table-column>
                        <el-table-column prop="attr_name" label="属性名称" width="180"> </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"
                                    >编辑</el-button
                                >
                                <el-button type="danger" icon="el-icon-delete" @click="delParams(scope.row)"
                                    >删除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加 参数/属性 的对话框 -->
        <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑 参数/属性 的对话框 -->
        <el-dialog :title="'编辑' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
            <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 商品分类数据列表
            cateList: [],
            // 储存级联选择器选中的分类id
            cateKeys: [],
            // 级联选择框的配置选项
            props: {
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
            },
            // tabs标签页绑定要触发的name
            activeName: 'many',
            // 动态参数数据
            manyTableData: [],
            // 静态属性数据
            onlyTableData: [],
            // 控制添加参数的对话框显示与隐藏
            addDialogVisible: false,
            // 添加参数的表单数据
            addForm: {
                attr_name: '',
            },
            // 添加参数的表单验证规则
            addFormRules: {
                attr_name: [
                    {
                        required: true,
                        message: '请填写数据',
                        trigger: 'blur',
                    },
                ],
            },
            // 控制修改参数的对话框显示与隐藏
            editDialogVisible: false,
            // 修改参数的表单对象
            editForm: {},
        }
    },
    // 生命周期函数
    created() {
        this.getCateList()
    },
    methods: {
        // 获取商品分类的所有数据
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) return this.$message.error('获取商品分类数据列表失败')
            this.cateList = res.data
            // console.log(this.cateList)
        },
        // 当级联选择器发生状态改变时触发
        handleChange() {
            this.getParamsData()
        },
        // 当点击tabs标签页时触发
        handleClick() {
            this.getParamsData()
            // console.log(this.activeName)
        },
        // 获取参数列表数据
        async getParamsData() {
            if (this.cateKeys.length != 3) {
                this.cateKeys = []
                this.manyTableData = []
                this.onlyTableData = []
                return
            }
            // 向服务器发送请求，获取参数列表
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                params: { sel: this.activeName },
            })
            if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
            if (this.activeName === 'many') {
                this.manyTableData = res.data
            } else {
                this.onlyTableData = res.data
            }
            res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                // 控制与隐藏文本框
                item.inputVisible = false
                // 文本框中输入的值
                item.inputValue = ''
            })
            // console.log(res.data)
        },
        // 清空添加参数的表单
        addDialogClose() {
            this.$refs.addFormRef.resetFields()
        },
        // 添加参数
        addParams() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                // 向服务器发送请求
                const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
                    attr_name: this.addForm.attr_name,
                    attr_sel: this.activeName,
                })
                if (res.meta.status !== 201) return this.$message.error('添加失败')
                this.$message.success('添加成功')
                this.addDialogVisible = false
                this.getParamsData()
            })
        },
        // 点击编辑显示修改参数对话框
        async showEditDialog(row) {
            this.editDialogVisible = true
            // 获取当前要修改的参数数据
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                attr_sel: this.activeName,
            })
            if (res.meta.status !== 200) return this.$message.error('获取数据失败')
            this.editForm = res.data
        },
        // 清空修改参数表单
        editDialogClose() {
            this.$refs.editFormRef.resetFields()
        },
        // 修改当前的参数数据
        editParams() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                // 修改参数
                const { data: res } = await this.$http.put(
                    `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                    {
                        attr_name: this.editForm.attr_name,
                        attr_sel: this.activeName,
                    }
                )
                if (res.meta.status !== 200) return this.$message.error('修改失败')
                this.$message.success('修改成功')
                this.editDialogVisible = false
                this.getParamsData()
            })
        },
        // 删除当前参数
        async delParams(row) {
            const result = await this.$confirm(`是否要删除这一条${this.titleText}`, '警告', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).catch(err => err)
            if (result !== 'confirm') return this.$message.info('已取消删除')
            // 向服务器发送请求，删除参数
            const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${row.attr_id}`)
            if (res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.getParamsData()
        },
        // 点击按钮添加参数 Tag标签
        showInput(row) {
            console.log(row)
            row.inputVisible = true
            // this.$nextTick(_ => {
            //     this.$refs.saveTagInput.$refs.input.focus()
            // })
        },
        handleInputConfirm() {
            console.log('ok')
        },
        async handleClose(index, row) {
            row.attr_vals.splice(index, 1)
            const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                attr_vals: row.attr_vals.join(' '),
            })
            if (res.meta.status !== 200) return this.$message.error('修改可选参数失败')
            this.$message.success('修改可选参数成功')
        },
    },
    computed: {
        // 控制添加参数和属性按钮是否被禁用
        isBtnDisabled() {
            if (this.cateKeys.length !== 3) {
                return true
            }
            return false
        },
        // 当前选中的三级分类id
        cateId() {
            if (this.cateKeys.length === 3) {
                return this.cateKeys[2]
            }
            return null
        },
        // 动态更改对话框title
        titleText() {
            if (this.activeName == 'many') {
                return '动态参数'
            } else {
                return '静态属性'
            }
        },
    },
}
</script>

<style lang="less" scoped>
.cat_opt {
    margin: 15px 0;
}
.el-table {
    margin-top: 15px;
    .el-tag {
        margin: 10px;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: center;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
}
</style>