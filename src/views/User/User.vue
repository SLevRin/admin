<template>
  <div class="user">
    <!-- 表格区域 -->
    <el-table
      class="table"
      height="100%"
      :data="tableData"
      @sort-change="sort=$event"
    >
      <template v-if="tableData.length">
        <el-table-column prop="userId" label="用户名" sortable="custom" align="center" />
        <el-table-column label="操作" align="center">
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
          return b[sort.prop] > a[sort.prop] ? 1 : -1
        } else if (sort.order === 'ascending') {
          return a[sort.prop] > b[sort.prop] ? 1 : -1
        }
      }).slice((current - 1) * size, current * size)
      return tableData
    }
  },
  methods: {
    getAllData() {
      this.$axios.get(serverUrl + '/getUserId').then(res => {
        this.allData = res.data.map(item => {
          return {
            userId: item
          }
        })
      })
    },
    handleDelete(row) {
      this.$axios.get(serverUrl + '/delUser?userId=' + row.userId).then(res => {
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
.user {
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
