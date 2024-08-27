<script setup lang="ts">
import { onMounted, watch, computed, unref, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouterLinkProps, RouteRecordRaw } from 'vue-router'
import { cloneDeep } from 'lodash-es'
import { useTemplateRefsList } from '@vueuse/core'
import { ElScrollbar } from 'element-plus'
import { useUserStore } from 'stores/user-store'
import { useTagsViewStore } from 'stores/tags-store'
import { useScrollTo } from 'src/hooks/event/useScrollTo'
import { useTagsView } from 'src/hooks/web/useTagsView'
import { pathResolve } from 'src/utils'
import { generateRoutes } from 'src/router'
import ContextMenu from 'components/ContextMenu.vue'


const { currentRoute, push } = useRouter()

const { closeAll, closeLeft, closeRight, closeOther, closeCurrent, refreshPage } = useTagsView()

const userStore = useUserStore()

const routes = computed(() => generateRoutes(userStore.privileges))
const tagsView: RouteRecordRaw[] = []

const tagsViewStore = useTagsViewStore()

const visitedViews = computed(() => tagsViewStore.getVisitedViews)

const affixTagArr = ref<RouteLocationNormalizedLoaded[]>([])

const selectedTag = computed(() => tagsViewStore.getSelectedTag)

const setSelectTag = tagsViewStore.setSelectedTag

const filterAffixTags = (routes: RouteRecordRaw[], parentPath = '') => {
  let tags: RouteLocationNormalizedLoaded[] = []
  routes.forEach((route) => {
    const meta = route.meta ?? {}
    const tagPath = pathResolve(parentPath, route.path)
    if (meta?.affix) {
      tags.push({ ...route, path: tagPath, fullPath: tagPath } as unknown as RouteLocationNormalizedLoaded)
    }
    if (route.children) {
      const tempTags: RouteLocationNormalizedLoaded[] = filterAffixTags(route.children, tagPath)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })

  return tags
}


// 初始化tag
const initTags = () => {
  affixTagArr.value = filterAffixTags(unref(routes))
  for (const tag of unref(affixTagArr)) {
    // Must have tag name
    if (tag.name) {
      tagsViewStore.addVisitedView(cloneDeep(tag))
    }
  }
}

// 新增tag
const addTags = () => {
  const { name } = unref(currentRoute)
  if (name) {
    setSelectTag(unref(currentRoute))
    tagsViewStore.addView(unref(currentRoute))
  }
}

// 关闭选中的tag
const closeSelectedTag = (view: RouteLocationNormalizedLoaded) => {
  closeCurrent(view, () => {
    if (isActive(view)) {
      toLastView()
    }
  })
}

// 去最后一个
const toLastView = () => {
  const visitedViews = tagsViewStore.getVisitedViews
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    push(latestView)
  } else {
    if (
      unref(currentRoute).path === tagsView[0].path ||
      unref(currentRoute).path === tagsView[0].redirect
    ) {
      addTags()
      return
    }
    // You can set another route
    push(tagsView[0].path)
  }
}

// 关闭全部
const closeAllTags = () => {
  closeAll(() => {
    toLastView()
  })
}

// 关闭其它
const closeOthersTags = () => {
  closeOther()
}

// 重新加载
const refreshSelectedTag = async (view?: RouteLocationNormalizedLoaded) => {
  refreshPage(view)
}

// 关闭左侧
const closeLeftTags = () => {
  closeLeft()
}

// 关闭右侧
const closeRightTags = () => {
  closeRight()
}

// 滚动到选中的tag
const moveToCurrentTag = async () => {
  await nextTick()
  for (const v of unref(visitedViews)) {
    if (v.fullPath === unref(currentRoute).path) {
      moveToTarget(v)
      if (v.fullPath !== unref(currentRoute).fullPath) {
        tagsViewStore.updateVisitedView(unref(currentRoute))
      }

      break
    }
  }
}

const tagLinksRefs = useTemplateRefsList<RouterLinkProps>()

const moveToTarget = (currentTag: RouteLocationNormalizedLoaded) => {
  const wrap$ = unref(scrollbarRef)?.wrapRef
  let firstTag: Nullable<RouterLinkProps> = null
  let lastTag: Nullable<RouterLinkProps> = null

  const tagList = unref(tagLinksRefs)
  // find first tag and last tag
  if (tagList.length > 0) {
    firstTag = tagList[0]
    lastTag = tagList[tagList.length - 1]
  }
  if ((firstTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath) {
    // 直接滚动到0的位置
    const { start } = useScrollTo({
      el: wrap$!,
      position: 'scrollLeft',
      to: 0,
      duration: 500
    })
    start()
  } else if ((lastTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath) {
    // 滚动到最后的位置
    const { start } = useScrollTo({
      el: wrap$!,
      position: 'scrollLeft',
      to: wrap$!.scrollWidth - wrap$!.offsetWidth,
      duration: 500
    })
    start()
  } else {
    // find preTag and nextTag
    const currentIndex: number = tagList.findIndex(
      (item) => (item?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath
    )
    const tgsRefs = document.getElementsByClassName(`tag__item`)

    const prevTag = tgsRefs[currentIndex - 1] as HTMLElement
    const nextTag = tgsRefs[currentIndex + 1] as HTMLElement

    // the tag's offsetLeft after of nextTag
    const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + 4

    // the tag's offsetLeft before of prevTag
    const beforePrevTagOffsetLeft = prevTag.offsetLeft - 4

    if (afterNextTagOffsetLeft > unref(scrollLeftNumber) + wrap$!.offsetWidth) {
      const { start } = useScrollTo({
        el: wrap$!,
        position: 'scrollLeft',
        to: afterNextTagOffsetLeft - wrap$!.offsetWidth,
        duration: 500
      })
      start()
    } else if (beforePrevTagOffsetLeft < unref(scrollLeftNumber)) {
      const { start } = useScrollTo({
        el: wrap$!,
        position: 'scrollLeft',
        to: beforePrevTagOffsetLeft,
        duration: 500
      })
      start()
    }
  }
}

// 是否是当前tag
const isActive = (route: RouteLocationNormalizedLoaded): boolean => {
  return route.path === unref(currentRoute).path
}

// 所有右键菜单组件的元素
const itemRefs = useTemplateRefsList<ComponentRef<typeof ContextMenu & ContextMenuExpose>>()

// 右键菜单状态改变的时候
const visibleChange = (visible: boolean, tagItem: RouteLocationNormalizedLoaded) => {
  if (visible) {
    for (const v of unref(itemRefs)) {
      const elDropdownMenuRef = v.elDropdownMenuRef
      if (tagItem.fullPath !== v.tagItem?.fullPath) {
        elDropdownMenuRef?.handleClose()
        setSelectTag(tagItem)
      }
    }
  }
}

// elscroll 实例
const scrollbarRef = ref<ComponentRef<typeof ElScrollbar>>()

// 保存滚动位置
const scrollLeftNumber = ref(0)

const scroll = ({ scrollLeft }: { scrollLeft: number }) => {
  scrollLeftNumber.value = scrollLeft
}

// 移动到某个位置
const move = (to: number) => {
  const wrap$ = unref(scrollbarRef)?.wrapRef
  const { start } = useScrollTo({
    el: wrap$!,
    position: 'scrollLeft',
    to: unref(scrollLeftNumber) + to,
    duration: 500
  })
  start()
}

onMounted(() => {
  initTags()
  addTags()
})

watch(
  () => currentRoute.value,
  () => {
    addTags()
    moveToCurrentTag()
  }
)
</script>

<template>
  <div class="flex w-full relative">
    <span class="w-35px h-35px flex items-center justify-center cursor-pointer" @click="move(-200)">
      <div class="i-material-symbols:chevron-left " />
    </span>
    <div class="overflow-hidden flex-1">
      <ElScrollbar ref="scrollbarRef" class="h-full" @scroll="scroll">
        <div class="flex h-full">
          <ContextMenu :ref="itemRefs.set" :schema="[
            {
              icon: 'i-material-symbols:refresh-rounded-outlined',
              label: $t('reload'),
              disabled: selectedTag?.fullPath !== item.fullPath,
              command: () => {
                refreshSelectedTag(item)
              }
            },
            {
              icon: 'i-material-symbols:close-outlined',
              label: $t('closeTab'),
              disabled: !!visitedViews?.length && (selectedTag?.meta.affix ? true : false),
              command: () => {
                closeSelectedTag(item)
              }
            },
            {
              divided: true,
              icon: 'i-material-symbols:vertical-right-outlined',
              label: $t('closeTheLeftTab'),
              disabled:
                !!visitedViews?.length &&
                (item.fullPath === visitedViews[0].fullPath ||
                  selectedTag?.fullPath !== item.fullPath),
              command: () => {
                closeLeftTags()
              }
            },
            {
              icon: 'i-material-symbols:vertical-left-outlined',
              label: $t('closeTheRightTab'),
              disabled:
                !!visitedViews?.length &&
                (item.fullPath === visitedViews[visitedViews.length - 1].fullPath ||
                  selectedTag?.fullPath !== item.fullPath),
              command: () => {
                closeRightTags()
              }
            },
            {
              divided: true,
              icon: 'i-material-symbols:tag-outlined',
              label: $t('closeOther'),
              disabled: selectedTag?.fullPath !== item.fullPath,
              command: () => {
                closeOthersTags()
              }
            },
            {
              icon: 'i-material-symbols:line-outlined',
              label: $t('closeAll'),
              command: () => {
                closeAllTags()
              }
            }
          ]" v-for="item in visitedViews" :key="item.fullPath" :tag-item="item" :class="[
            {
              'is-active': isActive(item)
            }
          ]" @visible-change="visibleChange">
            <div>
              <RouterLink :ref="tagLinksRefs.set" :to="{ ...item }" custom v-slot="{ navigate }">
                <div @click="navigate" class="h-full flex justify-center items-center whitespace-nowrap pl-15px">
                  <div :class="['i-material-symbols:arrow-left mr-1 ', item?.matched?.[1]?.meta?.icon || item?.meta?.icon]" />
                  {{ $t(item?.meta?.title as string) }}
                  <div @click.prevent.stop="closeSelectedTag(item)" class="i-material-symbols:close mr-1 " />
                </div>
              </RouterLink>
            </div>
          </ContextMenu>
        </div>
      </ElScrollbar>
    </div>
    <span
      class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer"
      @click="move(200)">
      <div class="i-material-symbols:chevron-right mr-1 " />
    </span>
    <span
      class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] flex items-center justify-center cursor-pointer"
      @click="refreshSelectedTag(selectedTag)">
      <div class="i-material-symbols:reload mr-1 " />
    </span>
    <ContextMenu trigger="click" :schema="[
      {
        icon: 'i-material-symbols:refresh-rounded-outlined',
        label: $t('reload'),
        command: () => {
          refreshSelectedTag(selectedTag)
        }
      },
      {
        icon: 'i-material-symbols:close',
        label: $t('closeTab'),
        disabled: !!(visitedViews?.length ?? 0) && (selectedTag?.meta.affix ? true : false),
        command: () => {
          closeSelectedTag(selectedTag!)
        }
      },
      {
        divided: true,
        icon: 'i-material-symbols:vertical-right-outlined',
        label: $t('closeTheLeftTab'),
        disabled: !!visitedViews?.length && selectedTag?.fullPath === visitedViews[0].fullPath,
        command: () => {
          closeLeftTags()
        }
      },
      {
        icon: 'i-material-symbols:vertical-left-outlined',
        label: $t('closeTheRightTab'),
        disabled:
          !!visitedViews?.length &&
          selectedTag?.fullPath === visitedViews[visitedViews.length - 1].fullPath,
        command: () => {
          closeRightTags()
        }
      },
      {
        divided: true,
        icon: 'i-material-symbols:tag-outlined',
        label: $t('closeOther'),
        command: () => {
          closeOthersTags()
        }
      },
      {
        icon: 'i-material-symbols:line-outlined',
        label: $t('closeAll'),
        command: () => {
          closeAllTags()
        }
      }
    ]">
      <span class="w-35px h-35px flex items-center justify-center cursor-pointer block">
        <div class="i-material-symbols:settings mr-1 " />
      </span>
    </ContextMenu>
  </div>
</template>
