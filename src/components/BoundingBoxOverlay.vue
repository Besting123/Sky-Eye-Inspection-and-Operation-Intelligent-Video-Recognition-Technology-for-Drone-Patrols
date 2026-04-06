<template>
  <div class="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-900 rounded-xl shadow-inner">
    <div
      ref="wrapperRef"
      class="relative inline-block max-w-full max-h-full"
      :style="wrapperStyle"
    >
      <!-- Media Element -->
      <img
        v-if="mediaType === 'image'"
        ref="mediaRef"
        :src="mediaUrl"
        class="w-full h-full object-contain block select-none rounded-sm"
        @load="onMediaLoaded"
        alt="Media with bounding boxes"
      />
      <video
        v-else-if="mediaType === 'video'"
        ref="mediaRef"
        :src="mediaUrl"
        class="w-full h-full object-contain block rounded-sm"
        controls
        @loadedmetadata="onMediaLoaded"
      ></video>

      <!-- Overlay Container -->
      <div
        v-if="isMediaLoaded"
        class="absolute inset-0 pointer-events-none overflow-hidden rounded-sm"
      >
        <template v-for="box in boxes" :key="box.id">
          <div
            class="absolute border-2 rounded-[2px] transition-all duration-200 box-border z-10 group"
            :style="getBoxStyle(box)"
          >
            <!-- Label -->
            <div
              v-if="box.label"
              class="absolute left-[-2px] px-1.5 py-0.5 text-xs font-semibold text-white rounded-[2px] whitespace-nowrap truncate max-w-full z-20 backdrop-blur-sm drop-shadow-md"
              :style="getLabelStyle(box)"
            >
              {{ box.label }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, shallowRef, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  mediaUrl: {
    type: String,
    required: true,
  },
  mediaType: {
    type: String,
    default: 'image',
    validator: (val) => ['image', 'video'].includes(val),
  },
  boxes: {
    type: Array,
    default: () => [],
    // Expected structure: { id, x, y, width, height, label, color }
  },
});

const mediaRef = shallowRef(null);
const wrapperRef = shallowRef(null);

const naturalWidth = ref(0);
const naturalHeight = ref(0);
const renderedWidth = ref(0);
const renderedHeight = ref(0);
const isMediaLoaded = ref(false);

// Calculate the scale based on the width and height
const scaleX = computed(() => {
  if (!naturalWidth.value || !renderedWidth.value) return 1;
  return renderedWidth.value / naturalWidth.value;
});

const scaleY = computed(() => {
  if (!naturalHeight.value || !renderedHeight.value) return 1;
  return renderedHeight.value / naturalHeight.value;
});

// Maintain the exact aspect ratio of the loaded media so that the wrapper tightly fits it.
const wrapperStyle = computed(() => {
  if (!isMediaLoaded.value) return {};
  return {
    aspectRatio: `${naturalWidth.value} / ${naturalHeight.value}`,
  };
});

const onMediaLoaded = (event) => {
  const target = event.target;
  if (props.mediaType === 'image') {
    naturalWidth.value = target.naturalWidth;
    naturalHeight.value = target.naturalHeight;
  } else {
    naturalWidth.value = target.videoWidth;
    naturalHeight.value = target.videoHeight;
  }
  isMediaLoaded.value = true;
};

const getBoxStyle = (box) => {
  const color = box.color || '#3b82f6'; // Default primary blue
  const x = box.x * scaleX.value;
  const y = box.y * scaleY.value;
  const width = box.width * scaleX.value;
  const height = box.height * scaleY.value;

  return {
    left: `${x}px`,
    top: `${y}px`,
    width: `${width}px`,
    height: `${height}px`,
    borderColor: color,
    backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)`,
  };
};

const getLabelStyle = (box) => {
  const color = box.color || '#3b82f6';
  const y = box.y * scaleY.value;
  
  // If box is too close to top, display label inside the box, else on top
  const isTooCloseToTop = y < 24;
  
  return {
    backgroundColor: `color-mix(in srgb, ${color} 90%, transparent)`,
    top: isTooCloseToTop ? '0' : '-2px',
    transform: isTooCloseToTop ? 'translateY(0)' : 'translateY(-100%)',
  };
};

let resizeObserver;

onMounted(() => {
  // Use ResizeObserver to continuously track the rendered size of the wrapper
  resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      if (entry.target === wrapperRef.value) {
        // Use contentRect for the inner dimensions of the wrapper
        renderedWidth.value = entry.contentRect.width;
        renderedHeight.value = entry.contentRect.height;
      }
    }
  });

  if (wrapperRef.value) {
    resizeObserver.observe(wrapperRef.value);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>

<style scoped>
/* Optional enhancements for better visibility on various backgrounds */
.box-border {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1) inset, 0 0 0 1px rgba(255, 255, 255, 0.15);
}
</style>