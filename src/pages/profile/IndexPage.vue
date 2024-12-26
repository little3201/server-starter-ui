<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { useUserStore } from 'stores/user-store'

const userStore = useUserStore()


// 登录历史数据模拟
const loginHistory = ref([
  { id: 1, device: 'Chrome on Windows', location: 'New York, USA', ip: '192.168.0.112', status: 'online' },
  { id: 2, device: 'Safari on iPhone', location: 'Los Angeles, USA', ip: '172.168.0.112', status: 'offline' },
  { id: 3, device: 'Edge on Windows', location: 'Chicago, USA', ip: '127.0.0.112', status: 'offline' }
])

// 仓库数据模拟
const activities = ref([
  { id: 4, name: 'Create a set of data', description: 'User: username is test', type: 'primary', lastModifiedDate: '2024-09-12' },
  { id: 3, name: 'Delete the data from user where username is test', description: 'User: username is test', type: 'success', lastModifiedDate: '2024-08-19' },
  { id: 2, name: 'Update the test user', description: 'User: username is test', type: 'danger', lastModifiedDate: '2024-08-17' },
  { id: 1, name: 'Enabled the test user', description: 'User: username is test', type: 'warning', lastModifiedDate: '2024-08-16' }
  // 更多仓库
])

const activeTab = ref('overview')

const formRef = ref<FormInstance>()
const initialValues = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
}
const form = ref({ ...initialValues })

// 表单验证规则
const rules = ref({
  oldPassword: [{ required: true, message: 'Please enter your old password', trigger: 'blur' }],
  newPassword: [{ required: true, message: 'Please enter your new password', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: 'Please confirm your new password', trigger: 'blur' }
  ]
})

function more(id: number) {
  console.log(id)
}

// 提交密码修改
async function onSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return

  formEl.validate((valid) => {
    if (valid) {
      alert('success')
    } else {
      alert('error')
    }
  })
}
</script>

<template>
  <ElRow :gutter="16">
    <ElCol :span="6">
      <ElCard shadow="never">
        <div class="text-center">
          <ElAvatar :size="180" :src="userStore.avatar" />
          <div class="text-lg mt-4 mb-2">{{ userStore.fullName }}</div>
          <div class="text-sm text-[var(--el-text-color-regular)]">{{ userStore.username }}</div>
        </div>

        <ElDivider></ElDivider>

        <!-- 详细信息 -->
        <ul class="text-sm text-[var(--el-text-color-regular)] pl-0 space-y-2">
          <li class="flex items-center">
            <div class="i-material-symbols:location-on-outline-rounded mr-2" />
            西安
          </li>
          <li class="flex items-center">
            <div class="i-material-symbols:mail-outline-rounded  mr-2" />
            <span>{{ userStore.email }}</span>
          </li>
          <li class="flex items-center">
            <div class="i-material-symbols:shield-person-outline-rounded mr-2" />
            角色
          </li>
        </ul>
      </ElCard>
    </ElCol>

    <ElCol :span="18">
      <ElCard shadow="never">
        <ElTabs stretch v-model="activeTab">
          <!-- Overview -->
          <ElTabPane label="Overview" name="overview">
            <h3>Login Information</h3>
            <ElTable :data="loginHistory" :show-header=false stripe table-layout="auto">
              <ElTableColumn prop="device">
                <template #default="scope">
                  <div class="flex items-center">
                    <ElBadge :type="scope.row.status === 'online' ? 'success' : 'info'" is-dot class="mr-2" />
                    <div class="ml-2 inline-flex flex-col">
                      <span class="text-sm">{{ scope.row.location }}&emsp;●&emsp;{{ scope.row.ip }}</span>
                      <span class="text-xs text-[var(--el-text-color-secondary)]">{{ scope.row.device }}</span>
                    </div>
                  </div>
                </template>
              </ElTableColumn>
              <ElTableColumn width="80">
                <template #default="scope">
                  <ElButton title="more" size="small" type="primary" link @click="more(scope.row.id)">
                    {{ $t('more') }}
                  </ElButton>
                </template>
              </ElTableColumn>
            </ElTable>
          </ElTabPane>

          <!-- Activities -->
          <ElTabPane label="Activities" name="activities">
            <ElTimeline>
              <ElTimelineItem v-for="activity in activities" :key="activity.id" :type="activity.type"
                :timestamp="activity.lastModifiedDate" placement="top">
                <ElCard shadow="never">
                  <h4 class="my-0">{{ activity.name }}</h4>
                  <p class="mb-0">{{ activity.description }}</p>
                </ElCard>
              </ElTimelineItem>
            </ElTimeline>
          </ElTabPane>

          <!-- Change password -->
          <ElTabPane label="Change password" name="changePassword">
            <h3>Change Password</h3>
            <ElForm ref="formRef" :model="form" :rules="rules" label-width="auto">
              <ElFormItem label="Old Password" prop="oldPassword">
                <ElInput v-model="form.oldPassword" type="password" show-password></ElInput>
              </ElFormItem>

              <ElFormItem label="New Password" prop="newPassword">
                <ElInput v-model="form.newPassword" type="password" show-password />
              </ElFormItem>

              <ElFormItem label="Confirm Password" prop="confirmPassword">
                <ElInput v-model="form.confirmPassword" type="password" show-password></ElInput>
              </ElFormItem>

              <ElFormItem>
                <ElButton title="submit" type="primary" @click="onSubmit(formRef)">Submit</ElButton>
              </ElFormItem>
            </ElForm>
          </ElTabPane>
        </ElTabs>
      </ElCard>
    </ElCol>
  </ElRow>
</template>

<style lang="scss" scoped>
.el-badge {
  display: inline-flex;
  vertical-align: baseline;
}
</style>
