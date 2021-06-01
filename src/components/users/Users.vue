<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
            <el-row :gutter="20">
                <!-- 搜索框区域 -->
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <!-- 添加用户 -->
                <el-col :span="4">
                    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表 -->
            <el-table :data="userData" border stripe style="width: 100%">
                <el-table-column label="#" type="index" width="50"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.mg_state"
                            active-color="#409EFF"
                            inactive-color="#ff4949"
                            @change="userStateChange(scope.row)"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button
                            size="small"
                            type="primary"
                            icon="el-icon-edit"
                            @click="showEdit(scope.row)"
                        ></el-button>
                        <!-- 删除按钮 -->
                        <el-button
                            size="small"
                            type="danger"
                            icon="el-icon-delete"
                            @click="delUser(scope.row.id)"
                        ></el-button>
                        <!-- 角色分配按钮 -->
                        <el-tooltip
                            content="角色分配"
                            placement="top"
                            effect="light"
                            :enterable="false"
                            :hide-after="1000"
                        >
                            <el-button
                                @click="setRole(scope.row)"
                                size="small"
                                type="info"
                                icon="el-icon-setting"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>
        <!-- 添加用户的对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="dialogVisible"
            width="50%"
            @close="addDialog"
            :before-close="handleClose"
        >
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input show-password v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPassword">
                    <el-input show-password v-model="addForm.checkPassword"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户的对话框 -->
        <el-dialog
            title="修改用户"
            :visible.sync="dialogEdit"
            width="50%"
            @close="editDialog"
            :before-close="handleClose"
        >
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input disabled v-model="editForm.username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogEdit = false">取 消</el-button>
                <el-button type="primary" @click="editUser">修 改</el-button>
            </span>
        </el-dialog>
        <!-- 分配角色的对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="setRoleDialogVisible"
            width="50%"
            :before-close="handleClose"
            @close="setRoleDialogClose"
        >
            <div>
                <p>当前的用户：{{ userinfo.username }}</p>
                <p>当前的角色：{{ userinfo.role_name }}</p>
                <p>
                    分配新角色：
                    <el-select v-model="selectRoleId" placeholder="请选择">
                        <el-option
                            v-for="item in roleList"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        // 验证邮箱的校验规则
        const checkEmail = (rule, value, callback) => {
            let reg = /^[\da-z]+([\-\.\_]?[\da-z]+)*@[\da-z]+([\-\.]?[\da-z]+)*(\.[a-z]{2,})+$/
            if (reg.test(value)) {
                return callback()
            }
            callback(new Error('请输入正确的邮箱'))
        }
        // 验证点化的校验规则
        const checkMobile = (rule, value, callback) => {
            let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (reg.test(value)) {
                return callback()
            }
            callback(new Error('请输入正确的电话号码'))
        }
        // 验证密码的校验规则
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                if (this.addForm.checkPassword !== '') {
                    this.$refs.addFormRef.validateField('checkPassword')
                }
                callback()
            }
        }
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.addForm.password) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            // 要请求的参数
            queryInfo: {
                query: '',
                // 当前的页数
                pagenum: 1,
                // 当前页显示多少条数据
                pagesize: 2,
            },
            // 所有用户的数据
            userData: [],
            // 数据的总条数
            total: 0,
            // 控制显示或隐藏添加用户对话框
            dialogVisible: false,
            // 控制显示或隐藏修改用户对话框
            dialogEdit: false,
            editForm: {
                username: '',
                email: '',
                mobile: '',
            },
            // 添加用户的表单数据对象
            addForm: {
                username: '',
                email: '',
                mobile: '',
                password: '',
                checkPassword: '',
            },
            // 添加用户的校验规则
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' },
                ],
                mobile: [
                    { required: true, message: '请输入电话号码', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' },
                ],
                password: [
                    { trigger: 'blur', validator: validatePass },
                    { required: true, trigger: 'blur', message: '请输入密码' },
                ],
                checkPassword: [
                    { required: true, trigger: 'blur', message: '请再次输入密码' },
                    { trigger: 'blur', validator: validatePass2 },
                ],
            },
            // 修改用户的校验规则
            editFormRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' },
                ],
                mobile: [
                    { required: true, message: '请输入电话号码', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' },
                ],
            },
            // 控制分配角色对话框的显示与隐藏
            setRoleDialogVisible: false,
            // 当前要分配角色的用户信息
            userinfo: '',
            // 所有的角色列表
            roleList: '',
            // 已选中的id值
            selectRoleId: '',
        }
    },
    // 生命周期函数
    created() {
        this.getUserList()
    },
    methods: {
        // 向服务器请求用户列表数据
        async getUserList() {
            const { data: res } = await this.$http.get('/users', { params: this.queryInfo })
            // console.log(res)
            if (res.meta.status != 200) return this.$message.error(rem.meta.msg)
            this.userData = res.data.users
            this.total = res.data.total
        },
        handleSizeChange(newsize) {
            // console.log(newsize)
            this.queryInfo.pagesize = newsize
            // 重新请求用户列表数据
            this.getUserList()
        },
        handleCurrentChange(newpage) {
            // console.log(newpage)
            this.queryInfo.pagenum = newpage
            this.getUserList()
        },
        // 更改用户状态时触发
        async userStateChange(userinfo) {
            // console.log(userinfo)
            const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            // console.log(res)
            if (res.meta.status !== 200) {
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error(res.meta.msg)
            }
            return this.$message.success(res.meta.msg)
        },
        // 监听添加用户对话框，对话框关闭时触发
        addDialog() {
            // 重置添加用户表单
            this.$refs.addFormRef.resetFields()
        },
        // 添加用户
        addUser() {
            this.$refs.addFormRef.validate(async valid => {
                // console.log(valid)
                if (!valid) return
                // 向服务器发送请求，添加用户
                const { data: res } = await this.$http.post('/users', this.addForm)
                // console.log(res)
                if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
                this.$message.success(res.meta.msg)
                // 隐藏对话框
                this.dialogVisible = false
                // 重新向服务器请求用户列表数据
                this.getUserList()
            })
        },
        // 查询用户的信息
        async showEdit(userinfo) {
            // console.log(userinfo)
            // 显示修改用户的对话框
            this.dialogEdit = true
            // 将当前用户的信息显示在表单中
            const { data: res } = await this.$http.get(`users/${userinfo.id}`)
            // console.log(res)
            if (res.meta.status !== 200) {
                // 修改用户失败时关闭对话框
                this.dialogEdit = false
                return this.$message.error('修改用户失败')
            }
            // 将查询的数据显示到表单中
            this.editForm = res.data
            // this.editForm.username = res.data.username
            // this.editForm.email = res.data.email
            // this.editForm.mobile = res.data.mobile
        },
        // 修改用户信息
        editUser() {
            // 对修改表单进行预验证
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                // 向服务器发送请求，修改用户数据
                const { data: res } = await this.$http.put(`users/${this.editForm.id}`, this.editForm)
                // console.log(res)
                if (res.meta.status !== 200) return this.$message.error('修改失败')
                this.dialogEdit = false
                this.$message.success('修改用户成功')
                this.getUserList()
            })
        },
        // 监听修改用户对话框，对话框关闭时触发
        editDialog() {
            // 重置添加用户表单
            this.$refs.editFormRef.resetFields()
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
        // 删除用户
        delUser(id) {
            this.$confirm('是否要删除该用户？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(async () => {
                    // 点击确定时向服务器发送请求，删除用户
                    const { data: res } = await this.$http.delete(`users/${id}`)
                    // console.log(res)
                    if (res.meta.status !== 200) return $message.error('删除用户失败')
                    this.getUserList()
                    this.$message.success('删除用户成功')
                })
                .catch(() => {
                    this.$message.info('已取消删除')
                })
        },
        // 展示分配角色的对话框
        async setRole(userinfo) {
            // console.log(userinfo)
            this.userinfo = userinfo
            // 获取所有的角色列表
            const { data: res } = await this.$http.get(`/roles`)
            if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
            // this.$message.success('获取角色列表成功')
            this.roleList = res.data
            // console.log(this.roleList)
            this.setRoleDialogVisible = true
        },
        // 点击确定分配角色
        async saveRoleInfo() {
            if (!this.selectRoleId) return this.$message.error('请选择要分配的角色')
            const { data: res } = await this.$http.put(`/users/${this.userinfo.id}/role`, { rid: this.selectRoleId })

            if (res.meta.status !== 200) return this.$message.error('分配角色失败')
            this.$message.success('分配角色成功')
            this.getUserList()
            this.setRoleDialogVisible = false
        },
        // 重置下拉菜单
        setRoleDialogClose() {
            this.selectRoleId = ''
            this.userinfo = {}
        },
    },
}
</script>
<style lang="less" scoped>
.el-table {
    margin-top: 15px;
}
.el-pagination {
    margin-top: 15px;
}
</style>