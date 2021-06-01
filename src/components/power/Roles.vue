<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card class="box-card">
            <el-row :gutter="20">
                <!-- 添加角色 -->
                <el-col>
                    <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表 -->
            <el-table ref="tableRef" :data="rolesList" border style="width: 100%" height="443">
                <!-- 展开列 -->
                <el-table-column class-name="hide" width="1" type="expand" label-class-name="tb">
                    <template slot-scope="scope">
                        <el-row
                            :class="['bdbottom', index == 0 ? 'bdtop' : '', 'vcenter']"
                            v-for="(item, index) in scope.row.children"
                            :key="item.id"
                        >
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag @close="rmRightById(scope.row, item.id)" closable type="danger">
                                    {{ item.authName }}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二三级权限 -->
                            <el-col :span="19">
                                <el-row
                                    v-for="(item1, index1) in item.children"
                                    :key="item1.id"
                                    :class="[index1 == 0 ? '' : 'bdtop', 'vcenter']"
                                >
                                    <!-- 渲染二级权限 -->
                                    <el-col :span="6">
                                        <el-tag @close="rmRightById(scope.row, item1.id)" closable type="warning">
                                            {{ item1.authName }}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 渲染三级权限 -->
                                    <el-col :span="18">
                                        <el-tag
                                            closable
                                            v-for="item2 in item1.children"
                                            :key="item2.id"
                                            @close="rmRightById(scope.row, item2.id)"
                                        >
                                            {{ item2.authName }}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column width="60">
                    <template slot-scope="scope">
                        <el-button type="text" ref="buttonRef" @click="toogleExpand(scope.row)">{{
                            scope.row.id == text ? '收起' : '展开'
                        }}</el-button>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="#" width="50"> </el-table-column>
                <!-- 数据列 -->
                <el-table-column prop="roleName" label="角色名称" width="180"> </el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
                <!-- 操作列 -->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="editRoles(scope.row.id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="delRoles(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" @click="shareRight(scope.row)">
                            分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加角色对话框 -->
        <el-dialog
            title="添加角色"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose"
            @close="clearAddForm"
        >
            <el-form :model="addFormRoles" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addFormRoles.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addFormRoles.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRoles">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑角色对话框 -->
        <el-dialog
            title="修改角色"
            :visible.sync="editVisible"
            width="50%"
            :before-close="handleClose"
            @close="clearEditForm"
        >
            <el-form :model="editFormRoles" :rules="addFormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editFormRoles.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editFormRoles.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifyForm">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配权限对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="rightDialog"
            width="50%"
            :before-close="handleClose"
            @close="setRightDialogClosed"
        >
            <el-tree
                :data="rightList"
                :props="treeProps"
                node-key="id"
                show-checkbox
                accordion
                :indent="30"
                :default-checked-keys="defKeys"
                default-expand-all
                ref="treeRef"
            ></el-tree>
            <span slot="footer">
                <el-button @click="rightDialog = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            text: '',
            // 角色列表数据
            rolesList: [],
            // 权限列表
            rightList: [],
            // 树形控件的属性绑定对象
            treeProps: {
                children: 'children',
                label: 'authName',
            },
            // 默认选中的id树节点
            defKeys: [],
            // 当前角色id
            roleId: '',
            // 控制添加角色显示对话框
            dialogVisible: false,
            editVisible: false,
            rightDialog: false,
            // 添加的角色数据
            addFormRoles: {
                roleName: '',
                roleDesc: '',
            },
            editFormRoles: {},
            // 添加角色的校验规则
            addFormRules: {
                roleName: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
                roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
            },
        }
    },
    // 生命周期函数
    created() {
        this.getRolesList()
    },
    methods: {
        // 获取角色列表
        async getRolesList() {
            const { data: res } = await this.$http.get('/roles')
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.rolesList = res.data
            // console.log(res.data)
        },
        handleClose(done) {
            // const conf = confirm('你确认要关闭？')
            this.$confirm('你确认要关闭？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info',
            })
                .then(() => {
                    done()
                })
                .catch(() => {})
        },
        // 添加角色
        addRoles() {
            // 对表单进行预验证
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                // 向服务器发送请求，添加角色
                const { data: res } = await this.$http.post('/roles', this.addFormRoles)
                // console.log(res)
                if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
                this.$message.success(res.meta.msg)
                this.dialogVisible = false
                this.getRolesList()
            })
        },
        // 重置添加角色表单
        clearAddForm() {
            this.$refs.addFormRef.resetFields()
        },
        clearEditForm() {
            this.$refs.editFormRef.resetFields()
        },
        // 查询要修改的角色
        async editRoles(id) {
            // 显示表单
            this.editVisible = true
            const { data: res } = await this.$http.get(`/roles/${id}`)
            console.log(res.data)
            this.editFormRoles = res.data
        },
        // 修改用户
        modifyForm() {
            // 对表单进行预验证
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                // 向服务器发送请求，修改角色
                const { data: res } = await this.$http.put(`/roles/${this.editFormRoles.roleId}`, this.editFormRoles)
                console.log(res)
                if (res.meta.status !== 200) return this.$message.error('修改失败')
                this.$message.success('修改成功')
                this.editVisible = false
                this.getRolesList()
            })
        },
        delRoles(id) {
            this.$confirm('是否要删除该角色？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(async () => {
                    // 点击确定时向服务器发送请求，删除用户
                    const { data: res } = await this.$http.delete(`/roles/${id}`)
                    // console.log(res)
                    if (res.meta.status !== 200) return $message.error('删除角色失败')
                    this.getRolesList()
                    this.$message.success('删除角色成功')
                })
                .catch(() => {
                    this.$message.info('已取消删除')
                })
        },
        // 根据id值来删除三级权限
        async rmRightById(role, rightId) {
            const result = await this.$confirm('是否要删除这个权限', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).catch(err => err)
            // console.log(result)
            if (result != 'confirm') {
                return this.$message.info('已取消删除')
            }
            // 向服务器发送请求，删除对应id的权限
            const { data: res } = await this.$http.delete(`/roles/${role.id}/rights/${rightId}`)
            if (res.meta.status !== 200) return this.$message.error('删除权限失败')
            this.$message.success('删除成功')
            // this.getRolesList()
            // console.log(role)
            role.children = res.data
        },
        // 查询所有角色的权限
        async shareRight(row) {
            this.roleId = row.id
            // 向服务器发送请求，查询所有权限列表
            const { data: res } = await this.$http.get(`/rights/tree`)
            if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
            // console.log(res.data)
            this.rightList = res.data
            // 递归获取三级权限的 id
            this.getLeafKeys(row, this.defKeys)
            // 显示对话框
            this.rightDialog = true
        },
        // 利用递归的形式，获取所有三级权限下的id，并保存到 defKeys 数组中
        getLeafKeys(node, arr) {
            // 如果当前 node 节点不包含 children 属性，则为三级节点
            if (!node.children) {
                return arr.push(node.id)
            }
            // 循环遍历节点
            node.children.forEach(item => {
                this.getLeafKeys(item, arr)
            })
        },
        // 监听分配权限对话框的关闭事件
        setRightDialogClosed() {
            this.defKeys = []
        },
        // 实现表格的展开手风琴效果
        toogleExpand(row) {
            let $table = this.$refs.tableRef
            // console.log(this.$refs.buttonRef)
            if (row.id == this.text) {
                this.text = ''
                this.rolesList.map(item => {
                    if (row.id != item.id) {
                        $table.toggleRowExpansion(item, false)
                    }
                })
            } else {
                this.rolesList.map(item => {
                    if (row.id != item.id) {
                        $table.toggleRowExpansion(item, false)
                    } else {
                        this.text = item.id
                    }
                })
            }
            $table.toggleRowExpansion(row)
        },
        // 分配权限
        async allotRights() {
            const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
            // console.log(keys)
            const idstr = keys.join(',')
            const { data: res } = await this.$http.post(`/roles/${this.roleId}/rights`, { rids: idstr })
            // console.log(res)
            if (res.meta.status !== 200) return this.$message.error('分配权限失败')
            this.$message.success('分配权限成功')
            this.rightDialog = false
            this.getRolesList()
        },
    },
}
</script>

<style lang="less" scoped>
.el-table {
    margin-top: 15px;
}
.el-tag {
    margin: 7px;
}
.bdtop {
    border-top: 1px solid #dcdfe6;
}
.bdbottom {
    border-bottom: 1px solid #dcdfe6;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>