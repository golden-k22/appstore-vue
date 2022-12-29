<template>
  <div id="dashboard row">
    <main role="main" class="col-md-12 ml-sm-auto my-3">
      <div class="card-list">
        <div class="row">
          <div class="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
            <div class="card blue">
              <i class="fa fa-clock-o icon"></i>
              <div class="title">待处理事务</div>
              <i class="zmdi zmdi-upload"></i>
              <div class="value">{{orderCount}}</div>
              <div class="stat">
                <b>13</b>% 完成
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
            <div class="card orange">
              <i class="fa fa-envelope-o icon"></i>
              <div class="title">商品数量</div>
              <i class="zmdi zmdi-upload"></i>
              <div class="value">{{itemCount}}</div>
              <div class="stat">
                <b>4</b>% 增长率
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
            <div class="card red">
              <i class="fa fa-home icon"></i>
              <div class="title">成交总额</div>
              <i class="zmdi zmdi-download"></i>
              <div class="value">{{totalAmount}}</div>
              <div class="stat">
                <b>13</b>% 增长率
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
            <div class="card green">
              <i class="fa fa-user icon"></i>
              <div class="title">新增会员</div>
              <i class="zmdi zmdi-download"></i>
              <div class="value">{{userCount}}</div>
              <div class="stat">
                <b>13</b>% 增长率
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="projects mb-4">
        <div class="projects-inner">
          <header class="projects-header">
            <div class="title">待审核订单</div>
            <div class="count">| 待审核数量：{{auditItems.length}}</div>
            <i class="zmdi zmdi-download"></i>
          </header>
          <table class="projects-table">
            <thead>
              <tr>
                <th>商品名称</th>
                <th>发布日期</th>
                <th>商品图片/编号</th>
                <th>价格</th>
                <th>交易状态</th>
                <th class="text-center">操作</th>
                <th>提交</th>
              </tr>
            </thead>
            <tr v-for="(item, index) in auditItems" :key="index">
              <td>
                <p>{{item.itemName}}</p>
                <p>{{item.brandName}}</p>
              </td>
              <td>
                <p>{{item.proNum.substring(4, 6) + '/' + item.proNum.substring(6, 8) + '/' + item.proNum.substring(0, 4)}}</p>
                <p class="text-danger"></p>
              </td>
              <td class="member">
                <figure>
                  <img :src="item.itemLogo">
                </figure>
                <div class="member-info">
                  <p>NO.{{item.proNum}}</p>
                </div>
              </td>
              <td>
                <p>${{item.price}}</p>
                <p></p>
              </td>
              <td class="status">
                <span class="status-text status-orange">交易中</span>
              </td>
              <td>
                <form class="form" action="#" method="POST">
                  <select class="action-box">
                    <option>操作</option>
                    <option>通过审核</option>
                    <option>不通过审核</option>
                    <option></option>
                  </select>
                </form>
              </td>
              <td>
                <button class="btn btn-primary" type="button" @click="goToAudit">提交</button>
              </td>
            </tr>
          </table>
        </div>
      </div>-->
      <div class="chart-data">
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="chart radar-chart dark">
              <i class="fa fa-circle point"></i>
              <span class="title">商品增长</span>
              <span class="unit">单位：件</span>
              <!--  <p class="tagline">（月）</p> -->
              <figure>
                <chart :options="itemStatistics" autoresize/>
              </figure>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="chart bar-chart light">
              <i class="fa fa-circle point"></i>
              <span class="title">用户增长</span>
              <span class="unit">单位：人</span>
              <!-- <p class="tagline">（）</p> -->
              <figure>
                <chart :options="userStatistics" autoresize/>
              </figure>
            </div>
          </div>
        </div>
        <div class="row between-charts">
          <div class="col-12 col-md-12">
            <div class="chart doughnut-chart dark">
              <i class="fa fa-circle point"></i>
              <span class="title">成交额</span>
              <span class="unit">单位：人</span>
              <figure>
                <chart :options="paymentStatistics" autoresize/>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import ECharts from "@/components/EChart";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts-liquidfill";
import "echarts/theme/dark";
export default {
  components: { chart: ECharts },
  methods: {
    goToAudit() {
      this.$router.push({ path: "/items/audit" });
    }
  },
  computed: {
    itemStatistics: function() {
      return {
        tooltip: {
          trigger: "axis"
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            boundaryGap: true,
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月"
            ]
          }
        ],
        yAxis: [
          {
            type: "value",
            boundaryGap: true
          }
        ],
        series: [
          {
            type: "bar",
            barWidth: "10",
            smooth: true,
            itemStyle: { barBorderRadius: [10, 10, 0, 0] },
            color: "rgba(0,0,200,0.5)",
            data: this.$store.getters["Dashboard/itemStatistics"]
            //data: [20, 33, 12]
          }
        ],
        textStyle: {
          color: "#000"
        }
      };
    },
    userStatistics: function() {
      return {
        tooltip: {
          trigger: "axis"
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            boundaryGap: true,
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月"
            ]
          }
        ],
        yAxis: [
          {
            type: "value",
            boundaryGap: true
          }
        ],
        series: [
          {
            type: "line",
            smooth: true,
            color: "rgba(0,0,200,0.5)",
            data: this.$store.getters["Dashboard/userStatistics"]
            //data: [22, 11, 23, 43]
          }
        ],
        textStyle: {
          color: "#000"
        }
      };
    },
    paymentStatistics: function() {
      return {
        tooltip: {
          trigger: "item"
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月"
            ]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        color: "rgba(0,0,200,0.5)",
        series: [
          {
            type: "line",
            smooth: true,
            itemStyle: { normal: { areaStyle: { type: "default" } } },
            data: this.$store.getters["Dashboard/paymentStatistics"]
            //data: [12, 33, 55, 23, 23]
          }
        ],
        textStyle: {
          color: "#000"
        }
      };
    },
    auditItems: function() {
      return this.$store.getters["Dashboard/audits"];
    },
    itemCount: function() {
      return this.$store.getters["Dashboard/itemCount"];
    },
    orderCount: function() {
      return this.$store.getters["Dashboard/orderCount"];
    },
    userCount: function() {
      return this.$store.getters["Dashboard/userCount"];
    },
    totalAmount: function() {
      return this.$store.getters["Dashboard/amount"];
    }
  },
  async created() {
    await this.$store.dispatch("Dashboard/getItemCount");
    await this.$store.dispatch("Dashboard/getUserCount");
    await this.$store.dispatch("Dashboard/getOrderCount");
    await this.$store.dispatch("Dashboard/getAllTransaction");
    for (let i = 0; i < 12; i++) {
      let time = { start: 0, end: 0 };

      time.start = new Date(2020, i).getTime();
      time.end = new Date(2020, i + 1).getTime();
      await this.$store.dispatch("Dashboard/getStatistics", time);
    }
  }
};
</script>

<style>
@import url("../../assets/css/home.css");
</style>
