<template>
  <div id="app">
    <!--     <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top app-nav">

      <a class="navbar-brand" href="#">Logo</a>


    </nav>-->
    <div class="container-fluid main">
      <div class="row app-auto">
        <div class="company-name">
          <div>奉茂科技有限公司</div>
          <div class="company-name-en">FENGMAOKEJIYOUXIANGONGSI</div>
        </div>

        <div class="sidebar">
          <sidebar-menu
            class="dark-background"
            :menu="menuItem"
            :collapsed="collapsed"
            :show-one-child="true"
            :hide-toggle="true"
            :relative="true"
            width="250px"
          >
            <span slot="toggle-icon">
              <i class="el-icon-arrow-right"></i>
            </span>
            <span slot="dropdown-icon">
              <i class="el-icon-arrow-right"></i>
            </span>
          </sidebar-menu>
        </div>
        <div class="col-main main-container">
          <div class="row app-breadcrumbs">
            <div class="col-6 app-breadcrumbs-panel text-color">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
                <el-breadcrumb-item
                  v-for="(crumb, key) in breadcrumbs"
                  :key="key"
                  :to="crumb.path"
                >{{crumb.meta.breadcrumb}}</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            <div class="col-6">
              <div class="app-right">
                <img src="./assets/img_avatar3.png" class="img-circle" @click="goUserDetail">
                <span style="cursor: pointer;">
                  {{allUserName[0]}}
                  <img src="./assets/signout.png">
                </span>
              </div>
            </div>
          </div>
          <router-view/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      breadcrumbs: [],
      menuItem: [
        {
          header: true,
          hiddenOnCollapse: true
        },

        {
          href: "/",
          title: "首页",
          icon: "fa  fa-home"
        },
        {
          title: "用户管理",
          icon: "fa fa-user-o",
          child: [
            {
              href: "/users/userlist",
              title: "收货列表"
            },
            {
              href: "/users/reportpage",
              title: "报告用户"
            }
          ]
        },
        {
          title: "商品管理",
          icon: "fa fa-shopping-bag",
          child: [
            {
              href: "/items/all",
              title: "产品目录" /* ,
              icon: "fa fa-database" */
            },
            {
              href: "/items/brands",
              title: "品牌管理" /* ,
              icon: "fa fa-trademark" */
            },
            {
              href: "/items/audit",
              title: "审核管理" /* ,
              icon: "fa fa-check" */
            }
          ]
        },
        {
          href: "/orders",
          title: "订单管理",
          icon: "fa fa-file-text"
        },
        {
          title: "运营管理",
          icon: "fa fa-desktop",
          child: [
            {
              href: "/businesses/systempush",
              title: "客户列表"
            },
            {
              href: "/businesses/iospush",
              title: "IOS客户列表"
            }
          ]
        },
        {
          href: "/collections",
          title: "特辑",
          icon: "fa fa-tag"
        }
      ],
      collapsed: false
    };
  },
  computed: {
    allUserName: function() {
      return this.$store.getters["Dashboard/getUserName"];
    }
  },
  watch: {
    $route() {
      // manage breadcrumbs
      this.manageBreadcrumbs();
    }
  },
  methods: {
    // manage breadcrumbs
    manageBreadcrumbs() {
      this.breadcrumbs.splice(0);
      this.breadcrumbs.push(...this.$breadcrumbs);
      // path handler
      for (let index = 0; index < this.breadcrumbs.length; index++) {
        this.breadcrumbs[index].path = this.breadcrumbs[index].path.replace(
          ":userId",
          this.$route.params.userId
        );
      }
    },
    goUserDetail() {
      this.$router.push(`/users/0`);
    }
  },
  async created() {
    // manage breadcrumbs
    this.manageBreadcrumbs();
    await this.$store.dispatch("Dashboard/getUserName");
  }
};
</script>

<style>
.app-auto {
  margin: auto;
}
.app-breadcrumbs {
  margin-bottom: 20px;
  opacity: 0.7;
  display: -webkit-box;
  padding: 8px 0px;
  background-color: #fff;
}
.col-main {
  width: calc(100% - 250px);
}
.company-name {
  z-index: 99999;
  position: fixed;
  top: 20px;
  padding-left: 30px;
  font-size: 17px;
  color: white;
  font-weight: bold;
}

.company-name-en {
  font-size: 12px;
  font-weight: normal;
}
.app-nav {
  background-color: black !important;
}
.dark-background {
  background: linear-gradient(to bottom, rgb(173, 215, 255), rgb(83, 58, 196));
}
.sidebar {
  width: 250px;
  height: calc(100vh - 56px);
}

.sidebar .v-sidebar-menu .vsm--link {
  padding-left: 30px;
}
.sidebar .v-sidebar-menu .vsm--link_active {
  background-color: rgba(150, 190, 250, 0.7);
}

.sidebar .v-sidebar-menu.vsm_expanded .vsm--item_open .vsm--link_level-1 {
  color: #fff;
  background-color: rgb(150, 190, 250);
}

.sidebar .v-sidebar-menu .vsm--link_hover {
  background-color: rgb(150, 190, 250);
}

.sidebar .v-sidebar-menu .vsm--dropdown .vsm--list {
  background-color: rgb(144, 150, 250);
  padding-left: 45px;
}

.sidebar .v-sidebar-menu .vsm--link_level-1 .vsm--icon {
  background-color: transparent;
}

.sidebar .v-sidebar-menu .vsm--link_level-1.vsm--link_active .vsm--icon {
  background-color: transparent;
}

.sidebar
  .v-sidebar-menu.vsm_expanded
  .vsm--item_open
  .vsm--link_level-1
  .vsm--icon {
  color: #fff;
  background-color: transparent;
}

.sidebar .v-sidebar-menu .vsm--link > * {
  font-size: 15px;
  font-weight: bold;
}

.main {
  background-color: #eeeeee;
  padding-bottom: 50px;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

element.style {
  position: relative;

  max-width: 250px;
}

.v-sidebar-menu {
  position: fixed !important;

  padding-top: 80px;
}

.main-container {
  padding-left: 0px;
  padding-right: 0px;
  margin-bottom: -55px;
}
.app-display {
  display: -webkit-box;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
  background-color: lightgray;
}
.app-user-name {
  padding-top: 10px;
  text-align: left;
  font-weight: bold;
}
.app-right {
  float: right;
  padding-right: 20px;
}
.img-circle {
  border-radius: 50px;
  height: 40px;
  width: 40px;
  cursor: pointer;
}
.app-breadcrumbs-panel {
  padding-left: 40px;
  padding-top: 10px;
}
.el-breadcrumb__item {
  color: black;
}
.text-color .el-breadcrumb__inner.is-link {
  color: black;
}
</style>
