<script setup name="DynItemHeightVersion08">
import Mock from 'mockjs'

const props = defineProps({
  cacheCount: {
    type: Number,
    default: 5,
  }
})

const { cacheCount } = toRefs(props)

/**
 * 猜测高度（预估高度）
 */
const maybeHeight = 100
/**
 * 所有数据
 */
const allData = ref([])
let positionDataArr = []
/**
 * 柱子节点高度: allData最后一个元素的endPos值
 *
 * 用于撑开滚动容器的高度
 */
const pillarDomHeight = ref(0)
/**
 * 内容列表容器dom
 */
const contentListRef = ref()
/**
 * 滚动容器. 支持显示滚动条的容器。确定虚拟列表的可视区高度
 */
const scrollerContainerRef = ref()
/**
 * 滚动容器高度(视口高度)。采用计算属性方式动态获取滚动容器高度
 */
const scrollerContainerRefHeight = computed(() => {
  return scrollerContainerRef.value ? scrollerContainerRef.value.offsetHeight : 0
})
/**
 * 当前视口第一个数据在allData数组的索引位置. 默认:0
 */
const start = ref(0)
/**
 * 视口第一个元素底部位置与与视口顶部(scrollTop)的偏移量
 */
let startOffset = 0
/**
 * 是否正在修正scrollTop位置
 */
let fixingScrollTop = false
let lastScrollTop = 0
/**
 * 是否向下滚动
 */
let isPositive = true
/**
 * 当前视口最后一个数据在positionDataArr数组的索引位置
 */
const end = computed(() => {
  if (!allData.value || allData.value.length <= 0) return 0

  // 将start.value作为遍历positionDataArr的开始位置
  let endPos = start.value
  // contentDomTotalHeight存放从start位置开始的dom节点总高度
  let contentDomTotalHeight = positionDataArr[endPos].height
  // 获取视口高度
  const viewPortHeight = scrollerContainerRefHeight.value
  // 从start位置开始遍历positionDataArr的同时，统计数据dom节点的累计高度，直至累计高度超过了视口高度
  while (contentDomTotalHeight < viewPortHeight) {
    endPos++
    const endIndex = Math.min(positionDataArr.length, endPos);
    contentDomTotalHeight += positionDataArr[endIndex].height
  }
  // 因为数组的slice方法是包头不包尾的所以还需要再endPos上+1，才会是预期的元素数量
  endPos += 1
  // 因为存在在某个元素位置开区间滚动的情况，此时该元素不会完全移出视口，但又使得视口多出了位置，因此要再+1，渲染下一个元素来占满视口区域
  return endPos + 1
})
/**
 * 内容容器的y轴偏移量。当渲染区域第一个元素完全移到了可视区域之外时，需要重新计算startOffset，将第一个元素移动回可视区域
 */
const contentListOffset = ref(0)
const styleTranslate = computed(() => {
  return `transform:translate(0,${contentListOffset.value}px)`
})
/**
 * 当前视口需要显示的数据
 */
const renderData = computed(() => {
  const _cacheCount = cacheCount.value
  const realStart = Math.max(0, start.value - _cacheCount)
  // 避免最后一个元素的数组下标超出实际的数组长度
  const realEnd = Math.min(end.value + _cacheCount, allData.value.length)
  return allData.value.slice(realStart, realEnd)
})

let totalCount = 0

function loadData(count = 10) {
  return new Promise(resolve => {
    let tmpList = []
    if (totalCount < 500) {
      const obj = {}
      obj[`list|${count}`] = [
        {
          // 属性 id 是一个自增数，起始值为 1，每次增 1
          'id|+1': totalCount,
          title: '@ctitle(10, 20)',
          content: '@cparagraph(1, 7)',
        },
      ]
      const data = Mock.mock(obj)
      totalCount += count
      tmpList = data.list
    }
    console.log('数据加载完毕')
    resolve(tmpList)
  })
}

async function init() {
  const tmpArr = await loadData()
  // allData.value = tmpArr.map((item, idx) => markRaw({ ...item, arrPos: idx }))
  allData.value = tmpArr.map((item, idx) => {
    positionDataArr.push({
    arrPos: idx,
    startPos: maybeHeight * idx,
    endPos: maybeHeight * idx + maybeHeight,
    height: maybeHeight,
  })
    return markRaw({ ...item, arrPos: idx });
  })
}

onMounted(() => {
  init()
})

function updateHeightAndPos() {
  const contentListDom = contentListRef.value
  if (!contentListDom) return

  const childrenElementArr = contentListDom.children
  for (let i = 0; i < childrenElementArr.length; i++) {
    const childEle = childrenElementArr[i]
    // 获取当前数据dom节点的数据再allData数组中的索引位置
    const dataIndexStr = childEle.dataset['index']
    if (!dataIndexStr) continue

    const dataIndex = parseInt(dataIndexStr)
    // 从allData数据中获取到该数据
    const dataItem = positionDataArr[dataIndex]
    if (!dataItem) continue

    // 获取元素的实际高度
    // const { height } = childEle.getBoundingClientRect()
    const { offsetHeight: height } = childEle
    const oldHeight = dataItem.height
    /*
    计算当前数据dom元素的旧高度和当前高度的差值

    如：
    oldHeight为100px，height为50px, 那么dffVal为 50px，那么 oldHeight - dffVal 为 50px
    oldHeight为50px，height为100px, 那么dffVal为 -50px，那么 oldHeight - dffVal 为 100px
     */
    const dffVal = oldHeight - height
    if (dffVal != 0) {
      // 当前dom元素的实际高度与allData中记录的高度不一致，则更新高度以及元素位置信息
      dataItem.height = oldHeight - dffVal
      dataItem.endPos = dataItem.endPos - dffVal

      for (let j = dataIndex + 1; j < positionDataArr.length; j++) {
        const jPosDataItem = positionDataArr[j]
        // j位置的上一个位置的元素
        const jPrevPosDataItem = positionDataArr[j - 1]

        jPosDataItem.startPos = jPrevPosDataItem.endPos
        jPosDataItem.endPos = jPosDataItem.startPos + jPosDataItem.height
      }
    }
  }
  pillarDomHeight.value = positionDataArr.length > 0 ? positionDataArr[positionDataArr.length - 1].endPos : 0

  fixScrollTop();
}

function fixScrollTop() {
  const scrollerContainerDom = scrollerContainerRef.value
  if (!scrollerContainerDom) return

  // 视口第一个元素底部位置与视口顶部位置存在偏移量，且是向上滚动，则需要修正scrollTop值
  if (startOffset > 0 && !isPositive) {
    // 无论新增动态项的实际高度是比记录的高度高还是比记录的高度低，这里都将scrollTop的位置修正为视觉上视口顶部距离视口第一个元素底部有startOffset个间隔的位置
    const newScrollTop = positionDataArr[start.value].endPos - startOffset
    fixingScrollTop = true
    nextTick(() => {
      scrollerContainerDom.scrollTo({ top: newScrollTop })
      fixingScrollTop = false
    })
  }
}

onUpdated(() => {
  nextTick(() => {
    updateHeightAndPos()
  })
})

function onScroll(evt) {
  // 如果处于修正scrollTop的状态，则不执行scroll回调
  const scrollerContainerDom = evt.target
  if (!scrollerContainerDom) return
  // console.log('onScrol')

  if (!scrollerContainerDom) return

  const { scrollTop, scrollHeight, clientHeight } = scrollerContainerDom
  // 正数或0表示向下滚动
  isPositive = scrollTop - lastScrollTop >= 0
  lastScrollTop = scrollTop

  // let idx = 0
  // let dataItem = positionDataArr[idx]
  // while (dataItem.endPos <= scrollTop) {
  //   idx++
  //   dataItem = positionDataArr[idx]
  // }
  // start.value = idx
  start.value = findStartByBinarySearch(positionDataArr, scrollTop)
  if (!isPositive) {
    // 向上滚动则需要记录视口第一个元素底部位置与scrollTop之间的偏移量，用于onUpdate中修正scrollTop
    startOffset = positionDataArr[start.value].endPos - scrollTop
  } else {
    startOffset = 0
  }

  const _cacheCount = cacheCount.value
  const realStart = Math.max(0, start.value - _cacheCount)
  contentListOffset.value = positionDataArr[realStart].startPos
  if (isScrollEnd(scrollTop, scrollHeight, clientHeight)) {
    appendData();
  }
}

/**
 * 是否滚动到了底部
 */
 function isScrollEnd(scrollTop, scrollHeight, clientHeight) {
  // Math.abs(scrollHeight - clientHeight - scrollTop) < 1 : 判断滚动条是否滚动到了最底部。公式来自MDN
  // return Math.abs(scrollHeight - clientHeight - scrollTop) < 1
  /*
  上面公式可以判断完全滚动到了最底部，实际更人性化的方式是，接近底部的时候就开始加载数据，让用户在无感知的情况下就加载了后续数据，因此可以将1调整到一个适合你项目的值
   */
  return Math.abs(scrollHeight - clientHeight - scrollTop) < 50
}

const dataLoading = ref(false)
const hasMoreData = ref(true)

async function appendData() {
  if (!dataLoading.value && hasMoreData.value) {
    dataLoading.value = true
    try {
      let dataList = await loadData()
      if (dataList && dataList.length > 0) {
        let arrPos = allData.value.length
        dataList = dataList.map((item, idx) => {
          return markRaw({ ...item, arrPos: arrPos + idx })
        })
        arrPos = allData.value.length
        let lastEle = positionDataArr[arrPos - 1]
        let startPos = lastEle.endPos
        const _positionDataArr = dataList.map((_, idx) => {
          const obj = {
            arrPos: arrPos + idx,
            startPos: startPos,
            endPos: startPos + maybeHeight,
            height: maybeHeight,
          }
          startPos = obj.endPos
          return obj
        })
        allData.value.push(...dataList)
        positionDataArr.push(..._positionDataArr)
        hasMoreData.value = true
      } else {
        /*
        这里判断下次滚动到底部是否还有数据可加载，是根据最后一次请求的请求结果是否有数据来判断的，实际不应该这么做，
        因为这会导致多发一次请求。更好的方式应该是每个请求结果中都包含一个字段用于告知前端是否还能请求后端来获取更多数据。
         */
        hasMoreData.value = false
      }
    } finally {
      dataLoading.value = false
    }
  }
}

/**
 * 通过二分查找来获取start值
 *
 * @param   {ContentPosition[]}  _positionDataArr  [_positionDataArr description]
 * @param   {number}             scrollTop         [scrollTop description]
 *
 * @return  {[]}                                   [return description]
 */
function findStartByBinarySearch(_positionDataArr, scrollTop) {
  let startIdx = 0
  let endIdx = _positionDataArr.length - 1
  let resultIdx
  while (startIdx <= endIdx) {
    // Math.floor 去除小数部分，只取整数部分. 取startIdx 到 endIdx的中间索引号
    const middleIdx = Math.floor((startIdx + endIdx) / 2)
    // 获取中间索引号对应元素的位置信息
    const middleEle = _positionDataArr[middleIdx]
    // 获取中间索引号对应元素的底部位置
    const middleEleEndPos = middleEle.endPos
    if (middleEleEndPos === scrollTop) {
      // 当前滚动高度等于中间索引号对应元素的底部位置，则start为中间索引号的下一个位置
      return middleIdx + 1
    } else if (middleEleEndPos < scrollTop) {
      // 当前滚动高度大于中间索引号对应元素的底部位置，则调整查找区间为右区间
      startIdx = middleIdx + 1
    } else if (middleEleEndPos > scrollTop) {
      // 当前滚动高度大于中间索引号对应元素的底部位置，则调整查找区间为左区间
      if (resultIdx === undefined || resultIdx > middleIdx) {
        // 存储元素 middleEleEndPos>scrollTop 元素的最小数组索引号
        resultIdx = middleIdx
      }
      // 调整查找区间为左区间
      endIdx = middleIdx - 1
    }
  }
  return resultIdx
}
</script>

<template>
  <!-- 
    为什么 pillarDomHeight 值在滚动到最后再往回滚的时候还是变化的，
    按理说此时所有元素都真实渲染过一次的获取过一次真实高度，
    那 pillarDomHeight 取的是最后一个元素的endPos，那pillarDomHeight的值应该不变了才对呀？
  
    因为css样式中：有个设置 &:last-child {border-bottom: none;}, 那么就会导致某个元素处于最后一个元素时没有border-bottom，
    而处于非最后一个元素时有border-bottom,所以数据项dom的高度在这个层面也是动态变化的

    那人可能还会想，还是不对呀，你不是给item元素设置box-sizing: border-box;吗？这个盒模型当有border的时候不是也不会撑开元素高度吗？
    是的，但那得元素本身有设置明确的高度的情况，如果元素本身没有明确的设置高度，元素的实际高度依然会被border撑开

    如何验证你上面的说法？
    将 &:last-child {border-bottom: none;} 注释掉，再滚动到底部，再来回滚动，你就会发现 pillarDomHeight 已经是一个固定值了
  -->
  {{ pillarDomHeight }}
  <!-- 实际开发中虚拟列表通常是位于某个dom容器下，并占满这个dom容器的整个高度，这里就是模拟这种情况 -->
  <div class="outContainer">
    <!-- scrollerContainer为支持滚动条的容器，定义整个虚拟列表的高度 -->
    <div class="scrollerContainer" ref="scrollerContainerRef" @scroll="onScroll">
      <div class="pillarDom" :style="{ height: `${pillarDomHeight}px` }"></div>
      <div class="contentList" :style="styleTranslate" ref="contentListRef">
        <div class="item" v-for="oneData in renderData" :key="oneData.id" :data-index="oneData.arrPos">
          <h6>{{ oneData.arrPos }} : {{ oneData.title }}</h6>
          <p>{{ oneData.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.outContainer {
  height: 350px;
  width: 100%;
}
.scrollerContainer {
  height: 100%;
  width: 100%;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}
.pillarDom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}
.contentList {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.item {
  border-bottom: 8px solid green;
  width: 100%;
  // 这里同样很重要，盒模型必须为border-box，item元素的高度才不会因为border值而超出设置的高度
  box-sizing: border-box;
  background-color: orange;
  padding: 5px 10px;
  &:last-child {
    border-bottom: none;
  }
}
</style>
