<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center" @click.self="handleClose">
        <div class="w-[600px] max-h-[90vh] bg-white rounded-large shadow-apple overflow-hidden flex flex-col">
          <div class="p-6 border-b border-text-primary/10 flex justify-between items-center flex-shrink-0">
            <div>
              <h3 class="text-xl font-semibold text-text-primary font-display">新建识别任务</h3>
              <p class="text-caption text-text-tertiary mt-1">上传视频并配置任务参数</p>
            </div>
            <button @click="handleClose" class="text-text-tertiary hover:text-text-primary transition-colors duration-200">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div class="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <label class="block text-caption-bold text-text-primary mb-2">
                视频文件 <span class="text-error">*</span>
              </label>
              <VideoUpload
                ref="videoUploadRef"
                @upload="handleVideoUpload"
                @error="handleUploadError"
              />
            </div>
            
            <div>
              <label class="block text-caption-bold text-text-primary mb-2">
                识别位置 <span class="text-error">*</span>
              </label>
              <input
                v-model="formData.location"
                type="text"
                placeholder="例: 京广线 - 04号进站口"
                class="w-full px-4 py-2.5 bg-light-gray border border-text-primary/10 rounded-comfortable text-text-primary text-body focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 focus:outline-none transition-all duration-200"
                :class="{ 'border-error': errors.location }"
              />
              <p v-if="errors.location" class="text-caption text-error mt-1">{{ errors.location }}</p>
              <p class="text-caption text-text-tertiary mt-1">请输入视频拍摄的具体位置或线路信息</p>
            </div>
            
            <div>
              <label class="block text-caption-bold text-text-primary mb-2">
                任务描述
              </label>
              <textarea
                v-model="formData.description"
                rows="3"
                placeholder="可选：添加任务相关说明或备注信息"
                class="w-full px-4 py-2.5 bg-light-gray border border-text-primary/10 rounded-comfortable text-text-primary text-body focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 focus:outline-none transition-all duration-200 resize-none"
              ></textarea>
              <p class="text-caption text-text-tertiary mt-1">选填，用于记录任务的额外信息</p>
            </div>
          </div>
          
          <div class="p-4 bg-light-gray border-t border-text-primary/10 flex justify-between items-center flex-shrink-0">
            <div class="text-caption text-text-tertiary">
              <span class="text-error">*</span> 为必填项
            </div>
            <div class="flex gap-3">
              <button
                @click="handleClose"
                class="px-6 py-2 text-body text-text-secondary hover:text-text-primary transition-colors duration-200"
                :disabled="uploading"
              >
                取消
              </button>
              <button
                @click="handleSubmit"
                class="apple-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!canSubmit || uploading"
              >
                <span v-if="uploading" class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                <span>{{ uploading ? '创建中...' : '开始识别' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import VideoUpload from './VideoUpload.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

const videoUploadRef = ref(null)
const uploading = ref(false)
const uploadedFile = ref(null)
const uploadCallbacks = ref(null)

const formData = ref({
  location: '',
  description: ''
})

const errors = ref({
  location: '',
  video: ''
})

const canSubmit = computed(() => {
  return uploadedFile.value && formData.value.location.trim().length > 0 && !uploading.value
})

watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})

function handleVideoUpload(uploadData) {
  uploadedFile.value = uploadData.file
  uploadCallbacks.value = uploadData
  errors.value.video = ''
}

function handleUploadError(error) {
  errors.value.video = error.message
  uploadedFile.value = null
}

function validateForm() {
  errors.value = {
    location: '',
    video: ''
  }
  
  let isValid = true
  
  if (!formData.value.location.trim()) {
    errors.value.location = '请输入识别位置'
    isValid = false
  }
  
  if (!uploadedFile.value) {
    errors.value.video = '请上传视频文件'
    isValid = false
  }
  
  return isValid
}

function handleSubmit() {
  if (!validateForm()) {
    return
  }
  
  uploading.value = true
  
  emit('submit', {
    file: uploadedFile.value,
    metadata: {
      location: formData.value.location.trim(),
      description: formData.value.description.trim()
    },
    uploadCallbacks: uploadCallbacks.value
  })
}

function handleClose() {
  if (!uploading.value) {
    emit('close')
  }
}

function resetForm() {
  formData.value = {
    location: '',
    description: ''
  }
  errors.value = {
    location: '',
    video: ''
  }
  uploadedFile.value = null
  uploadCallbacks.value = null
  uploading.value = false
  
  if (videoUploadRef.value) {
    videoUploadRef.value.reset()
  }
}

defineExpose({
  resetForm,
  setUploading: (value) => {
    uploading.value = value
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
