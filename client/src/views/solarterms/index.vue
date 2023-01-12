<template>
  <div class="system-role-container layout-padding">
    <div class="system-role-padding layout-padding-auto layout-padding-view">
      <div class="system-user-search mb15">
        <el-input v-model="state.tableData.param.search" size="default" placeholder="请输入节气名称" style="max-width: 180px"> </el-input>
        <el-button size="default" type="primary" class="ml10" @click="getTableData()">
          <el-icon>
            <ele-Search />
          </el-icon>
          查询
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="onOpenAddSolarTerm('add')">
          <el-icon>
            <ele-FolderAdd />
          </el-icon>
          新增节气
        </el-button>
      </div>
      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
        <el-table-column prop="seq" label="序号" width="60" />
        <el-table-column prop="name" label="节气" show-overflow-tooltip></el-table-column>
        <el-table-column prop="season" label="归属季节" show-overflow-tooltip></el-table-column>
        <el-table-column prop="englishName" label="英文名字" show-overflow-tooltip></el-table-column>
        <!--				<el-table-column prop="status" label="角色状态" show-overflow-tooltip>-->
        <!--					<template #default="scope">-->
        <!--						<el-tag type="success" v-if="scope.row.status">启用</el-tag>-->
        <!--						<el-tag type="info" v-else>禁用</el-tag>-->
        <!--					</template>-->
        <!--				</el-table-column>-->

        <el-table-column label="图片" show-overflow-tooltip>
          <template #default="scope">
            <el-image  v-if="scope.row.image" style="width: 100px; height: 100px;"
                       :src="getImagePath(scope.row)" fit="cover"
                       :preview-src-list="[getImagePath(scope.row)]"
                       :hide-on-click-modal ="true"/>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onOpenEditSolarTerm('edit', scope.row)">修改</el-button>
            <el-button size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <SolarTermDialog ref="solarTermDialogRef" @refresh="getTableData()" />
  </div>
</template>

<script setup lang="ts" name="systemRole">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import solarTermsApi from '/@/api/solarTerms/index';

// 引入组件
const SolarTermDialog = defineAsyncComponent(() => import('/@/views/solarterms/dialog.vue'));

// 定义变量内容
const solarTermDialogRef = ref();
const state = reactive<SysRoleState>({
	tableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			search: '',
			pageNum: 1,
			pageSize: 10,
		},
	},
});
// 初始化表格数据
const getTableData = () => {
	state.tableData.loading = true;
    solarTermsApi.getSolarTerms('ALL')
          .then(response => {
            state.tableData.data = response as any;
          }).catch(err => {
            ElMessage.error(`获取节气数据失败 ${JSON.stringify(err)}`);
          }).finally(() => {
            state.tableData.loading = false;
          });
};
// 打开新增角色弹窗
const onOpenAddSolarTerm = (type: string) => {
  solarTermDialogRef.value.openDialog(type);
};
// 打开修改角色弹窗
const onOpenEditSolarTerm = (type: string, row: Object) => {
  solarTermDialogRef.value.openDialog(type, row);
};
// 删除角色
const onRowDel = (row: any) => {
	ElMessageBox.confirm(`此操作将永久删除该节气：“${row.name}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
      solarTermsApi.deleteSolarTerms(row._id)
          .then(() =>{
            ElMessage.success('删除成功');
            getTableData();
          } )
      .catch(err => ElMessage.error('删除失败! '+ JSON.stringify(err)));
		})
		.catch(() => {});
};

const getImagePath = (row: any) => {
  // eslint-disable-next-line no-console
  console.log(`/api/solarTerms/${row._id}/image`)
  return `/api/solarTerms/${row._id}/image`;
};
// 页面加载时
onMounted(() => {
	getTableData();
});
</script>

<style scoped lang="scss">
.system-role-container {
	.system-role-padding {
		padding: 15px;
		.el-table {
			flex: 1;
		}
	}
}
</style>
