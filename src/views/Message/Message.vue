<template>
  <div class="message">
    <!-- 上传区域 -->
    <div class="upload">
      <el-select
        class="select"
        v-model="typeSelected"
        filterable
        placeholder="请选择消息类型"
      >
        <el-option
          label="重要消息"
          :value="2"
        />
        <el-option
          label="紧急消息"
          :value="3"
        />
        <el-option
          label="普通消息"
          :value="4"
        />
      </el-select>
      <el-select
        class="select"
        v-model="userIdSelected"
        multiple
        collapse-tags
        filterable
        placeholder="请选择接收用户"
        @change="change"
      >
        <el-option
          label="所有用户"
          value=""
        />
        <el-option
          v-for="(item, index) in userId"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-input class="input" v-model="input" placeholder="请输入消息内容" clearable />
      <div class="button" @click="upload">添加</div>
    </div>
    <!-- --- -->
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
        <el-table-column prop="content.time" label="时间" sortable="custom" />
        <el-table-column prop="type" label="类型" sortable="custom" />
        <el-table-column prop="userId" label="用户" sortable="custom" />
        <el-table-column prop="content.data" label="消息内容" sortable="custom" />
        <el-table-column prop="id" label="id" v-if="false" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">
              删除
            </el-button>
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
import uuid from 'uuid/v4'
export default {
  data() {
    return {
      allData: [],
      current: 1,
      size: 50,
      sort: {},
      loading: false,
      typeSelected: null,
      userIdSelected: [],
      userId: [],
      input: ''
    }
  },
  created() {
    this.getAllData()
    this.getUserId()
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
      this.$axios.get(serverUrl + '/getAllMsg').then(res => {
        this.allData = res.data.filter(item => {
          return item.data.type !== 1
        }).map(item => {
          var obj = {
            userId: '',
            type: '',
            id: item.data.content.id,
            content: {
              time: moment(item.data.content.time).format('YYYY-MM-DD HH:mm:ss'),
              data: item.data.content.data
            }
          }
          obj.userId = item.userId.join(',') || '所有用户'
          switch (item.data.type) {
            case 2:
              obj.type = '重要消息'
              break
            case 3:
              obj.type = '紧急消息'
              break
            case 4:
              obj.type = '普通消息'
              break
          }
          return obj
        })
      })
    },
    getUserId() {
      this.$axios.get(serverUrl + '/getUserId').then(res => {
        this.userId = res.data
      })
    },
    change(e) {
      if (e[e.length - 1] === '') {
        this.userIdSelected = ['']
      } else {
        this.userIdSelected = this.userIdSelected.filter(item => {
          return item !== ''
        })
      }
    },
    upload() {
      if (!this.typeSelected || !this.userIdSelected.length || !this.input) {
        return this.$message({
          message: '请填写完整!',
          type: 'error'
        })
      } else {
        this.$axios.post(serverUrl, {
          userId: this.userIdSelected,
          data: {
            type: this.typeSelected,
            content: {
              id: uuid(),
              time: Date.now(),
              data: this.input
            }
          }
        }).then(res => {
          if (res.data.status === 1) {
            this.$message({
              message: '添加成功!',
              type: 'success'
            })
            this.getAllData()
          } else {
            this.$message({
              message: '添加失败!',
              type: 'error'
            })
          }
        })
      }
    },
    handleDelete(row) {
      this.$axios.post(serverUrl, {
        userId: [],
        data: {
          type: 6,
          content: {
            id: row.id
          }
        }
      }).then(res => {
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
  .upload {
    display: flex;
    margin: 20px 20px 0 20px;
    .input {
      width: 450px;
      margin-left: 10px;
    }
    .select {
      width: 300px;
      margin-left: 10px;
    }
    .button {
      width: 80px;
      height: 40px;
      border-radius: 30px;
      background-color: #ecf5ff;
      border: 1px solid #409eff;
      margin-left: 10px;
      font-size: 14px;
      color: #409eff;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        color: #fff;
        background-color: #409eff;
      }
    }
  }
  .table {
    padding: 0 20px;
  }
  .pagination {
    margin: 10px auto;
  }
}
</style>
