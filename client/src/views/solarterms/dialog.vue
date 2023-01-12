<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="solarTermDialogFormRef" :model="state.solarTermForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="节气名称">
              <el-select
                  v-model="state.solarTermForm.name"
                  placeholder="请选择节气名称"
                  clearable
                  filterable
                  style="width: 95%"
                  @change="updateName"
              >
                <el-option
                    v-for="item in state.solarTermsList"
                    :key="item"
                    :label="item.name"
                    :value="item"
                >
                </el-option>
              </el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="节气英文名">
							{{state.solarTermForm.englishName}}
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="归属季节">
              {{state.solarTermForm.season}}
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="节气序列">
              {{state.solarTermForm.seq}}
            </el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="节气描述">
							<el-input v-model="state.solarTermForm.description" type="textarea" placeholder="请输入节气描述" maxlength="800"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="节气图片">
              <el-upload
                  :file-list="state.files"
                  :limit='1'
                  accept='.gif, .jpg, .png, .pdf, .GIF, .JPG, .PNG, .PDF, .jpeg, .JPEG'
                  list-type="picture"
                  :on-change='onFileSelected'
                  :http-request="uploadFileRequest"
              >
                <el-button type="primary">选择图片</el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    请选择一张图片，若要更换，请先删除已有的！
                  </div>
                </template>
              </el-upload>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { SOLAR_TERMS } from '../../../../shared/utils/SolarTermsConstant';
import solarTermsApi from '/@/api/solarTerms/index';
import _ from 'lodash';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const solarTermDialogFormRef = ref();
const state = reactive({
	solarTermForm: {
    _id: null,
    name: '',
    englishName: '',
    seq: '',
    description: '',
    season: '',
	},
  files: [],
  imageFile: null as File,
	menuData: [] as TreeType[],
	menuProps: {
		children: 'children',
		label: 'label',
	},
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
  solarTermsList: SOLAR_TERMS
});

// 打开弹窗
const openDialog = (type: string, row: any) => {
	if (type === 'edit') {
		state.solarTermForm._id = row._id;
		state.solarTermForm.name = row.name;
		state.solarTermForm.englishName = row.englishName;
		state.solarTermForm.season = row.season;
		state.solarTermForm.seq = row.seq;
		state.solarTermForm.description = row.description;
		state.dialog.title = '修改角色';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增节气';
		state.dialog.submitTxt = '新 增';
		// 清空表单，此项需加表单验证才能使用
		// nextTick(() => {
		// 	solarTermDialogFormRef.value.resetFields();
		// });
	}
	state.dialog.isShowDialog = true;
	getMenuData();
};
// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};
// 提交
const onSubmit = () => {
  const formData = new FormData();
  const solarTermData = _.clone(state.solarTermForm);
  formData.append('image', state.imageFile);
  formData.append('name', state.solarTermForm.name);
  formData.append('englishName', state.solarTermForm.englishName);
  formData.append('seq', state.solarTermForm.seq);
  formData.append('description', state.solarTermForm.description);
  formData.append('season', state.solarTermForm.season);
  if(state.solarTermForm._id) {
    formData.append('_id', state.solarTermForm._id);
  }
  solarTermsApi.saveSolarTerms(formData)
      .then(()=> emit('refresh'))
      // eslint-disable-next-line no-console
  .catch((err) => console.log(`failed to create Solar Terms in server side with error ${JSON.stringify(err)}`))
  .finally(() => {
    closeDialog();
  });
};

const updateName = (solarTerm) => {
  // eslint-disable-next-line no-console
  console.log(solarTerm);
  state.solarTermForm.name = solarTerm.name;
  state.solarTermForm.englishName = solarTerm.englishName;
  state.solarTermForm.seq = solarTerm.seq;
  state.solarTermForm.season = solarTerm.season;
};

const onFileSelected = (file: {
  size: number,
  name: string,
  raw: File
}) => {
  state.imageFile = file.raw;
  // eslint-disable-next-line no-console
  console.log('hey file uploaded:'+file.name);
};

// disable the upload action
const uploadFileRequest = (files: any) => {
  // eslint-disable-next-line no-console
  console.log(files)
}
// 获取菜单结构数据
const getMenuData = () => {
	state.menuData = [
		{
			id: 1,
			label: '系统管理',
			children: [
				{
					id: 11,
					label: '菜单管理',
					children: [
						{
							id: 111,
							label: '菜单新增',
						},
						{
							id: 112,
							label: '菜单修改',
						},
						{
							id: 113,
							label: '菜单删除',
						},
						{
							id: 114,
							label: '菜单查询',
						},
					],
				},
				{
					id: 12,
					label: '角色管理',
					children: [
						{
							id: 121,
							label: '角色新增',
						},
						{
							id: 122,
							label: '角色修改',
						},
						{
							id: 123,
							label: '角色删除',
						},
						{
							id: 124,
							label: '角色查询',
						},
					],
				},
				{
					id: 13,
					label: '用户管理',
					children: [
						{
							id: 131,
							label: '用户新增',
						},
						{
							id: 132,
							label: '用户修改',
						},
						{
							id: 133,
							label: '用户删除',
						},
						{
							id: 134,
							label: '用户查询',
						},
					],
				},
			],
		},
		{
			id: 2,
			label: '权限管理',
			children: [
				{
					id: 21,
					label: '前端控制',
					children: [
						{
							id: 211,
							label: '页面权限',
						},
						{
							id: 212,
							label: '页面权限',
						},
					],
				},
				{
					id: 22,
					label: '后端控制',
					children: [
						{
							id: 221,
							label: '页面权限',
						},
					],
				},
			],
		},
	];
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.system-role-dialog-container {
	.menu-data-tree {
		width: 100%;
		border: 1px solid var(--el-border-color);
		border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
		padding: 5px;
	}
}
</style>
