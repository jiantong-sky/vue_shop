<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="" />
            </div>
            <!-- 表单区域 -->
            <el-form label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input prefix-icon="el-icon-key" show-password v-model="loginForm.password"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 这是登录表单的数据绑定对象
            loginForm: {
                username: 'admin',
                password: '123456',
            },
            // 这是登录规则验证
            loginFormRules: {
                // 验证用户名是否合法
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur',
                    },
                    {
                        min: 3,
                        max: 8,
                        message: '长度在 3 到 8 个字符',
                        trigger: 'blur',
                    },
                ],
                // 验证密码是否合法
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    {
                        min: 6,
                        max: 12,
                        message: '长度在 6 到 12 个字符',
                        trigger: 'blur',
                    },
                ],
            },
        }
    },
    methods: {
        // 点击重置按钮，重置登录表单
        resetLoginForm() {
            // console.log(this.$refs);
            this.$refs.loginFormRef.resetFields()
        },
        login() {
            this.$refs.loginFormRef.validate(async valid => {
                // console.log(valid);
                if (!valid) return
                // console.log(this.$http);
                const { data: res } = await this.$http.post('/login', this.loginForm)
                console.log(res)
                if (res.meta.status != 200) return this.$message.error('登录失败')
                this.$message.success('登录成功')
                // 1、将登录之后的 token ，保存到客户端的 sessionStorage 中
                //  1.1、项目中出现登录之外的其他 API 接口，必须要在登录之后才能访问
                //  1.2、token 只能在当前网站打开期间生效，所以token保存在 sessionStorage 中
                window.sessionStorage.setItem('token', res.data.token)
                // 使用编程式导航跳转路由
                this.$router.push('/home')
            })
        },
    },
}
</script>

<style lang="less" scoped>
.login_container {
    background-color: skyblue;
    height: 100%;
}
.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
        padding: 10px;
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0 0 10px #ccc;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;
    }
    .btns {
        display: flex;
        justify-content: flex-end;
    }
}
</style>