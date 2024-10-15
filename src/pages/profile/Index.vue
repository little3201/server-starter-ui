<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { useUserStore } from 'stores/user-store'
import type { User } from 'src/models'


const userStore = useUserStore()

const initialValues = {
  username: '',
  fullName: '',
  email: '',
  avatar: '',
  accountNonLocked: true,
  accountExpiresAt: undefined,
  credentialsExpiresAt: undefined
}
const user = reactive<User>({ ...initialValues })

// 登录历史数据模拟
const loginHistory = ref([
  { id: 1, device: 'Chrome on Windows', location: 'New York, USA', ip: '192.168.0.112', status: 'online' },
  { id: 2, device: 'Safari on iPhone', location: 'Los Angeles, USA', ip: '172.168.0.112', status: 'offline' },
  { id: 3, device: 'Edge on Windows', location: 'Chicago, USA', ip: '127.0.0.112', status: 'offline' },
])

// 仓库数据模拟
const repositories = ref([
  { id: 1, name: 'Vue.js', description: 'The Progressive JavaScript Framework', stars: 12000, forks: 4000 },
  { id: 2, name: 'Element Plus', description: 'A Vue.js 3 UI Library', stars: 6000, forks: 1200 },
  // 更多仓库
])

const activeTab = ref('overview')

const formRef = ref<FormInstance>()

// 密码修改表单
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 表单验证规则
const rules = ref({
  oldPassword: [{ required: true, message: 'Please enter your old password', trigger: 'blur' }],
  newPassword: [{ required: true, message: 'Please enter your new password', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: 'Please confirm your new password', trigger: 'blur' },
  ]
})

function seeMore(id: number) {

}

// 密码强度检测相关状态
const strengthPercent = ref(0)
const passwordStrengthText = ref('')
const strengthClass = ref('')

// 密码强度检测
const checkPasswordStrength = () => {
  const password = passwordForm.value.newPassword;
  if (!password) {
    strengthPercent.value = 0;
    passwordStrengthText.value = '';
    return;
  }

  let strength = 0;
  if (/[a-z]/.test(password)) strength += 1
  if (/[A-Z]/.test(password)) strength += 1
  if (/[0-9]/.test(password)) strength += 1
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1

  strengthPercent.value = (strength / 4) * 100

  switch (strength) {
    case 1:
      passwordStrengthText.value = 'Weak';
      strengthClass.value = 'bg-red-500';
      break;
    case 2:
      passwordStrengthText.value = 'Fair';
      strengthClass.value = 'bg-yellow-500';
      break;
    case 3:
      passwordStrengthText.value = 'Good';
      strengthClass.value = 'bg-blue-500';
      break;
    case 4:
      passwordStrengthText.value = 'Strong';
      strengthClass.value = 'bg-green-500';
      break;
    default:
      passwordStrengthText.value = '';
      strengthClass.value = '';
      break;
  }
}

// 提交密码修改
function submitPasswordChange() {
  let formEl = formRef.value
  if (!formEl) return

  formEl.validate((valid) => {
    if (valid) {
      alert("success")
    } else {
      alert("error")
    }
  })
}

onMounted(() => {
  user.username = userStore.user?.username as string
  user.fullName = userStore.user?.fullName as string
  user.email = userStore.user?.email as string
  user.avatar = userStore.user?.avatar
})
</script>

<template>
  <ElRow :gutter="16">
    <ElCol :span="6">
      <ElCard shadow="never">
        <div class="text-center">
          <ElAvatar :size="180" :src="user.avatar" />
          <div class="text-lg mt-4 mb-2">{{ user.fullName }}</div>
          <div class="text-sm text-[var(--el-text-color-regular)]">{{ user.username }}</div>
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
            <span>{{ user.email }}</span>
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
                  <ElButton size="small" type="primary" link @click="seeMore(scope.row.id)">
                    {{ $t('seeMore') }}
                  </ElButton>
                </template>
              </ElTableColumn>
            </ElTable>
          </ElTabPane>

          <!-- Projects -->
          <ElTabPane label="Projects" name="repositories">
            <ElRow :gutter="20" v-for="repo in repositories" :key="repo.id" class="mb-4">
              <ElCol :span="24">
                <ElCard shadow="hover">
                  <h3>{{ repo.name }}</h3>
                  <p>{{ repo.description }}</p>
                  <div class="repo-meta">
                    <span>Stars: {{ repo.stars }}</span>
                    <span>Forks: {{ repo.forks }}</span>
                  </div>
                </ElCard>
              </ElCol>
            </ElRow>
          </ElTabPane>

          <!-- Settings -->
          <ElTabPane label="Settings" name="settings">
            <h3>Change Password</h3>
            <ElForm ref="formRef" :model="passwordForm" label-width="auto">
              <ElFormItem label="Old Password" prop="oldPassword">
                <ElInput v-model="passwordForm.oldPassword" type="password" show-password></ElInput>
              </ElFormItem>

              <ElFormItem label="New Password" prop="newPassword">
                <ElInput v-model="passwordForm.newPassword" type="password" show-password
                  @input="checkPasswordStrength">
                  <!-- 密码强度条 -->
                  <div v-if="passwordForm.newPassword" class="mt-2">
                    <div class="h-2 bg-[#e0e0e0]">
                      <div :class="strengthClass" :style="{ width: strengthPercent + '%' }"></div>
                    </div>
                    <p class="text-sm">{{ passwordStrengthText }}</p>
                  </div>
                </ElInput>
              </ElFormItem>

              <ElFormItem label="Confirm Password" prop="confirmPassword">
                <ElInput v-model="passwordForm.confirmPassword" type="password" show-password></ElInput>
              </ElFormItem>

              <ElFormItem>
                <ElButton type="primary" @click="submitPasswordChange">Submit</ElButton>
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