<template>
  <div id="app" v-loading="loading" element-loading-background="#fff">
    <div class="header">
      <ul>
        <router-link tag="li" to="/user">用户管理</router-link>
        <router-link tag="li" to="/message">消息管理</router-link>
        <router-link tag="li" to="/feedback">反馈信息</router-link>
      </ul>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true
    }
  },
  created() {
    this.token()
  },
  methods: {
    token() {
      localStorage.setItem('token', '')
      this.$prompt('请输入token', 'token', {
        showCancelButton: false
      }).then(({ value }) => {
        this.$axios.post(serverUrl + '/setToken?token=' + value, {
          token: value
        }).then(res => {
          if (res.data.status === 1) {
            this.$message({
              message: 'token正确!',
              type: 'success'
            })
            this.loading = false
          } else {
            this.$message({
              message: 'token错误!',
              type: 'error'
            })
            this.token()
          }
        })
        localStorage.setItem('token', value)
      }).catch(() => {
        this.token()
      })
    }
  }
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .header {
    height: 60px;
    flex-shrink: 0;
    background-color: #fff;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 99;
    ul {
      height: 100%;
      padding: 0 10px;
      li {
        font-size: 14px;
        color: #909399;
        border-bottom: 2px solid transparent;
        height: 100%;
        padding: 0 20px;
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s;
        float: left;
        &:hover {
          color: #303133;
        }
        &.router-link-active {
          color: #303133;
          border-bottom: 2px solid #409eff;
        }
      }
    }
  }
}
</style>
