<template>
  <div class="imageBackground">
    <div class="log-content">
      <div class="input-title">登陆</div>
      <br>
      <input type="text" name="username" v-model="name" placeholder="请输入用户名" class="input-content">
      <br>
      <br>
      <input type="password" name="psw" v-model="pswd" placeholder="请输入密码" class="input-content">
      <br>
      <br>
      <div class="btn-position">
        <button type="button" class="btn mybtn" @click="logInClick()">立即登陆</button>
      </div>
    </div>
  </div>
</template>

<script>
/* import UserInfo from "../dto/UserInformation";
import LoginManager from "../manager/LoginManager"; */
export default {
  data() {
    return {
      name: "",
      pswd: ""
    };
  },
  methods: {
    logInClick() {
      alert(this.name + this.pswd);
    }

    /*
    If login success , return true.
     */
    /*    logIn() {
      var userinfo = new UserInfo();

      var loginManager = new LoginManager();

      userinfo.name = this.logForm.username;
      userinfo.password = this.logForm.pass;

      return loginManager.login(userinfo);
    },
    logInResultProcessing(resultLogIn) {
      if (resultLogIn === true) {
        this.$router.push("/");
        //Set isLogin in store as true.
        this.$store.commit("setIsLogin", true);
        this.$store.commit("setActiveIndex", "/");
        //If success to be login, set user name to store
        //so that the user name can be used for header menu.
        this.$store.commit("setUserName", this.logForm.username);
        return true;
      } else if (resultLogIn === 200) {
        this.logForm.error = new Error(
          "Invalid Credential! Check your username and password, and try again."
        );
        //Set isLogin in store as false.
        this.$store.commit("setIsLogin", false);
        // FAQ: The question: the answerreturn error;
      } else {
        this.logForm.error = new Error(
          "Invalid Credential! Check your username and password, and try again."
        );
        //Set isLogin in store as false.
        this.$store.commit("setIsLogin", false);
        //alert(error);
      }
      this.certificatingFalse = true;
      return this.logForm.error;
    } */
  }
};
</script>

<style>
.imageBackground {
  background-image: url("../../../assets/login_page.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 100%;
  width: 100%;
}

.log-content {
  padding-top: 15%;
  margin-left: 5%;
  width: 400px;
}

.input-title {
  font-size: 50px;
  font-weight: bold;
}

.input-content {
  padding: 15px;
  width: 400px;
}

.mybtn {
  border-radius: 20px;
  background-color: rgb(69, 94, 231);
  color: white;
  width: 300px;
}

.btn-position {
  width: 100%;
  text-align: center;
}
</style>


