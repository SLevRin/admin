<template>
  <div class="message">
    <!-- 表格区域 -->
    <el-table
      class="table"
      height="100%"
      :data="tableData"
      @sort-change="sort=$event"
      v-loading="loading"
      element-loading-background="#fff"
    >
      <template v-if="tableData.length">
        <el-table-column prop="time" label="时间" sortable="custom" />
        <el-table-column prop="name" label="姓名" sortable="custom" />
        <el-table-column prop="phone" label="手机号码" sortable="custom" />
        <el-table-column prop="coName" label="公司名称" sortable="custom" />
        <el-table-column prop="weChat" label="微信号码" sortable="custom" />
        <el-table-column prop="content" label="反馈内容" sortable="custom" />
        <el-table-column prop="_id" label="id" v-if="false" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- --- -->
    <!-- 分页区域 -->
    <el-pagination
      class="pagination"
      layout="jumper, prev, pager, next, total, sizes"
      :page-sizes="[10, 20, 50, 100, 200]"
      :total="allData.length"
      :page-size="size"
      :current-page="current"
      @size-change="size=$event"
      @current-change="current=$event"
    />
    <!-- --- -->
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      allData: [],
      current: 1,
      size: 50,
      sort: {},
      loading: false,
    }
  },
  created() {
    this.getAllData()
  },
  computed: {
    tableData() {
      var allData = this.allData
      var sort = this.sort
      var current = this.current
      var size = this.size
      var tableData = allData.slice().sort((a, b) => {
        if (sort.order === 'descending') {
          if (sort.prop === 'time') {
            return Date.parse(b.time) - Date.parse(a.time)
          } else {
            return b[sort.prop] > a[sort.prop] ? 1 : -1
          }
        } else if (sort.order === 'ascending') {
          if (sort.prop === 'time') {
            return Date.parse(a.time) - Date.parse(b.time)
          } else {
            return a[sort.prop] > b[sort.prop] ? 1 : -1
          }
        }
      }).slice((current - 1) * size, current * size)
      return tableData
    }
  },
  methods: {
    getAllData() {
      this.$axios.get(serverUrl + '/getFeedback').then(res => {
        this.allData = res.data.map(item => {
          item.time = moment(item.time).format('YYYY-MM-DD HH:mm:ss')
          return item
        })
      })
    },
    handleDelete(row) {
      this.$axios.get(serverUrl + '/delFeedback?id=' + row._id).then(res => {
        if (res.data.status === 1) {
          this.$message({
            message: '删除成功!',
            type: 'success'
          })
          this.getAllData()
        } else {
          this.$message({
            message: '删除失败!',
            type: 'error'
          })
        }
      })

    }
  }
}
</script>

<style lang="scss" scoped>
.message {
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .table {
    padding: 0 20px;
  }
  .pagination {
    margin: 10px auto;
  }
}
</style>
