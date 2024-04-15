<template>
    <div class="login">
        <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            label-position="left"
            label-width="0px"
            class="login-form"
        >
            <h3 class="title">欢迎使用</h3>
            <el-form-item prop="username">
                <el-input
                    v-model="loginForm.username"
                    type="text"
                    auto-complete="off"
                    placeholder="账号"
                >
                    <svg-icon
                        icon-class="user"
                        class="el-input__icon input-icon"
                    />
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input
                    v-model="loginForm.password"
                    type="password"
                    auto-complete="off"
                    placeholder="密码"
                    @keyup.enter="handleLogin"
                    :show-password="true"
                >
                    <svg-icon
                        icon-class="password"
                        class="el-input__icon input-icon"
                    />
                </el-input>
            </el-form-item>
            <el-form-item prop="code">
            </el-form-item>
            <el-checkbox class="myRedCheckBox" v-model="loginForm.rememberMe" style="margin: 0 0 25px 0">
                记住我
            </el-checkbox>
            <el-form-item style="width: 100%">
                <el-button
                    :loading="loading"
                    size="medium"
                    type="primary"
                    style="width: 100%"
                    @click.prevent="handleLogin"
                >
                    <span v-if="!loading">登 录</span>
                    <span v-else>登 录 中...</span>
                </el-button>
            </el-form-item>
            <el-form-item style="width: 100%">
                <router-link to="/register" class="register">注册</router-link>
                <p class="register" style="width: 1em"></p>
                <router-link to="/" class="register">返回主页</router-link>
            </el-form-item>
        </el-form>
    </div>

</template>

<script>
// 加密
// import { encrypt } from '@/utils/rsaEncrypt'
// import Cookies from 'js-cookie'
import { success, failed } from '@/request/code';
import request from '@/request/request'
export default {
    name: 'LoginPage',
    data() {
        return {
            codeUrl: '',
            cookiePass: '',
            loginForm: {
                username: '',
                password: '',
                // rememberMe: false,
                // uuid: ''
            },
            loginRules: {
                username: [
                    {required: true, trigger: 'blur', message: '用户名不能为空'}
                ],
                password: [
                    {required: true, trigger: 'blur', message: '密码不能为空'}
                ],
            },
            loading: false,
            redirect: undefined
        }
    },
    created() {

    },
    methods: {
        getCookie() {
            let value = '; ' + document.cookie;
            let parts = value.split('; ' + name + '=');
            if (parts.length === 2) return parts.pop().split(';').shift();
        },
        handleLogin: function () {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    let data = new FormData();
                    data.append('username', this.$data.loginForm.username);
                    data.append('password', this.$data.loginForm.password);
                    request.post('/user/login/', data, {headers:{'Content-Type': 'application/json',}}).then((res) => {
                        console.log(res);
                        if (res.code === success) {
                            // alert("登录成功");
                            this.$message({
                                message: '登录成功',
                                type: 'success',
                                center: true,
                            })
                            this.$router.push({path: '/'});
                            
                        } else if (res.code === failed) {
                            this.$message({
                                message: '用户名或密码错误',
                                type: 'error',
                                center: true,
                            })
                        } else {
                            this.$message({
                                message: 'server error',
                                type: 'error',
                                center: true,
                            })
                        }
                    })
                }
            });
        },
        point() {

        }
    }
}
</script>

<style  scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-size: cover;
    margin-top: 10em;
}

.title {
    margin: 0 auto 30px auto;
    text-align: center;
    color: #707070;
}

.login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 385px;
    padding: 25px 25px 5px 25px;
}

.login-form .el-input {
    height: 38px;
}

.login-form .el-input input {
    height: 38px;
}

.login-form .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
}

.login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
}

.login-code {
    width: 33%;
    display: inline-block;
    height: 38px;
}

.login-code img {
    cursor: pointer;
    vertical-align: middle;
}

.register {
    float: right;
    color: rgb(24, 144, 255);
}

a {
    color: #1890ff;
    text-decoration: none;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    transition: color 0.3s;
}

.myRedCheckBox .el-checkbox__input.is-checked + .el-checkbox__label {
    color: deepskyblue;
}

.myRedCheckBox .el-checkbox__input.is-checked .el-checkbox__inner,
.myRedCheckBox .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    border-color: deepskyblue;
    background-color: deepskyblue;
}

.myRedCheckBox .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: deepskyblue;
}

.myRedCheckBox .el-checkbox__inner:hover {
    border-color: deepskyblue;
}

</style>
