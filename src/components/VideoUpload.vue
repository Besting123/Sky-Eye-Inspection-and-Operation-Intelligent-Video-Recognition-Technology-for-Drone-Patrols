<template>
  <div
    @click="triggerFileInput"
    @drop.prevent="handleDrop"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    class="border-2 border-dashed rounded-comfortable p-12 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer"
    :class="[
      isDragging ? 'border-apple-blue bg-apple-blue/5' : 'border-text-primary/20 hover:border-apple-blue',
      uploading ? 'pointer-events-none opacity-60' : ''
    ]"
  >
    <input
      ref="fileInput"
      type="file"
      accept="video/mp4,video/avi,video/mov"
      @change="handleFileSelect"
      class="hidden"
    />
    
    <span 
      class="material-symbols-outlined text-4xl mb-4 transition-colors duration-200"
      :class="isDragging ? 'text-apple-blue' : 'text-text-tertiary'"
    >
      cloud_upload
    </span>
    
    <div v-if="!uploading" class="text-center">
      <div class="text-body font-semibold mb-1 text-text-primary">{{ title || '点击或拖拽视频文件至此处' }}</div>
      <div class="text-caption text-text-tertiary">
        {{ subtitle || '支持 MP4, AVI, MOV (最大 2GB)' }}
      </div>
    </div>
    
    <div v-else class="w-full max-w-md">
      <div class="text-body font-semibold text-center mb-2 text-text-primary">{{ uploadMessage }}</div>
      <div class="w-full h-2 bg-light-gray rounded-full overflow-hidden">
        <div 
          class="h-full bg-apple-blue transition-all duration-300"
          :style="{ width: `${uploadProgress}%` }"
        ></div>
      </div>
      <div class="text-caption text-text-tertiary text-center mt-1">{{ uploadProgress }}%</div>
    </div>
    
    <div v-if="error" class="mt-4 text-caption text-error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: String,
  subtitle: String,
  maxSize: {
    type: Number,
    default: 2 * 1024 * 1024 * 1024
  },
  allowedFormats: {
    type: Array,
    default: () => ['mp4', 'avi', 'mov']
  }
})

const emit = defineEmits(['upload', 'error'])

const fileInput = ref(null)
const isDragging = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadMessage = ref('上传中...')
const error = ref(null)

function triggerFileInput() {
  if (!uploading.value) {
    fileInput.value?.click()
  }
}

function handleFileSelect(event) {
  const file = event.target.files?.[0]
  if (file) {
    validateAndUpload(file)
  }
}

function handleDrop(event) {
  isDragging.value = false
  const file = event.dataTransfer.files?.[0]
  if (file) {
    validateAndUpload(file)
  }
}

function validateAndUpload(file) {
  error.value = null
  
  const extension = file.name.split('.').pop().toLowerCase()
  if (!props.allowedFormats.includes(extension)) {
    error.value = `不支持的文件格式。仅支持: ${props.allowedFormats.join(', ')}`
    emit('error', { code: 'INVALID_FORMAT', message: error.value })
    return
  }
  
  if (file.size > props.maxSize) {
    const maxSizeMB = (props.maxSize / (1024 * 1024)).toFixed(0)
    error.value = `文件过大。最大支持 ${maxSizeMB}MB`
    emit('error', { code: 'FILE_TOO_LARGE', message: error.value })
    return
  }
  
  startUpload(file)
}

function startUpload(file) {
  uploading.value = true
  uploadProgress.value = 0
  uploadMessage.value = '准备上传...'
  
  emit('upload', {
    file,
    updateProgress: (progress) => {
      uploadProgress.value = progress
      if (progress < 100) {
        uploadMessage.value = '上传中...'
      } else {
        uploadMessage.value = '处理中...'
      }
    },
    onComplete: () => {
      uploading.value = false
      uploadProgress.value = 0
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    },
    onError: (err) => {
      uploading.value = false
      uploadProgress.value = 0
      error.value = err.message || '上传失败'
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }
  })
}

defineExpose({
  reset: () => {
    uploading.value = false
    uploadProgress.value = 0
    error.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
})
</script>
