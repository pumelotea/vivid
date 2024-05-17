# 配置手册

## 参数Props

| 参数           | 类型      | 默认值                                                      | 说明             | 
|--------------|---------|----------------------------------------------------------|----------------|
| page         | Boolean | false                                                    | 是否以A4纸宽度展示     |  
| dark         | Boolean | false                                                    | 是否以夜间模式显示，需要搭配NConfigProvider |  
| bubbleMenu   | Boolean | true                                                     | 是否开启浮动菜单       |   
| modelValue   | String  | 空字符串                                                     | 编辑器的内容         |   
| to           | String  | 空字符串                                                     | 编辑器全屏dom存放容器   |
| tippyOptions | Object  | `{ duration: 0, maxWidth: 600, placement: 'top-start' }` | tiptap的tippy参数 |

## 事件Event

| 事件名称              | 参数     | 说明         |
|-------------------|--------|------------|
| update:modelValue | String | 编辑器输出的html |
| change            | String | 编辑器输出的html |

## provider

为子组件注入的方法，可以在子组件进行注入，方便以vue的形式开发扩展

| 方法名或变量          | 说明    | 参数       |
|-----------------|-------|----------|
| useExtension    | 注册扩展  | tiptap扩展 |
| removeExtension | 卸载扩展  | 扩展名      |
| editorInstance  | 编辑器实例 | 无        |

## 插槽Slot

| slot        | 参数               | 说明                                                               |
|-------------|------------------|------------------------------------------------------------------|
| bubble-menu | nodeType         | 浮动菜单插槽，可以通过插槽获取到当前选中的类型：`text、image、video、table、magic、undefined` |
| menu        | 无                | 顶部菜单                                                             |
| footer      | words、characters | 底部工具栏，插槽参数：词组、字符数量                                               |

## 自定义顶栏菜单

编辑器默认提供了的顶部菜单，但是没有导出到外部，默认的菜单无法二次修改，灵活性比较差。特别是针对图片上传等功能。

### 自定义方案

- 开发一个vue的菜单组件
- 如果您的组件包含需要注入到tiptap的扩展，那么需要调用`useExtension`，否者是不需要调用。

```VUE
<vivid-editor>
  <template #menu>
    <!--基础扩展组件-->
    <document-ext/>
    <paragraph-ext/>
    <hard-break-ext/>
    <indent-ext/>
    <history-ext/>
    <dropcursor-ext/>
    <gapcursor-ext/>
    <text-ext/>
    <placeholder-ext/>
    <character-count-ext/>
    <text-style-ext/>
    <focus-ext/>
    <!--引入你的组件-->
    <custom-ext/>
  </template>
</vivid-editor>
```

你也可以把这么多一坨组件都包装到一个组件中，再在menu插槽中引入。

### 组件案例(这是标题组件)

```VUE

<script setup>
  import VividMenuItem from '../../components/VividMenuItem.vue'
  import Heading from '@tiptap/extension-heading'
  import {inject} from 'vue'
  import {NSpace} from 'naive-ui'

  const props = defineProps({
    options: {
      type: Object,
      required: false,
    },
  })

  const editorInstance = inject('editorInstance')
  const useExtension = inject('useExtension')
  if (!useExtension) {
    throw new Error('Heading component must under VividEditor menu slot')
  }
  useExtension(Heading.configure(props.options))
</script>

<template>
  <div v-if="editorInstance">
    <slot>
      <n-space :size="2">
        <vivid-menu-item
            icon="h-1"
            title="标题1"
            :action="() =>editorInstance.chain().focus().toggleHeading({ level: 1 }).run()"
            :is-active="() => editorInstance.isActive('heading', { level: 1 })"
        />
        <vivid-menu-item
            icon="h-2"
            title="标题2"
            :action="() =>editorInstance.chain().focus().toggleHeading({ level: 2 }).run()"
            :is-active="() => editorInstance.isActive('heading', { level: 2 })"
        />
        <vivid-menu-item
            icon="h-3"
            title="标题3"
            :action="() =>editorInstance.chain().focus().toggleHeading({ level: 3 }).run()"
            :is-active="() => editorInstance.isActive('heading', { level: 3 })"
        />
      </n-space>
    </slot>
  </div>
</template>

<style scoped></style>
```

- VividMenuItem组件是内置的菜单按钮菜单，已经在主包导出，您可以直接使用，也可以自己实现
    - 默认图标库是remixicon
    - 提供默认插槽，可以更换其他图标

## 自定义浮动菜单

编辑器默认提供了的浮动菜单，而且会通过插槽传递出编辑器点中的内容类型，方便切换不同的浮动菜单。

### 自定义方案

- 开发一个vue的菜单组件，根据nodeType进行针对性切换，插槽内的组件和menu内的组件是同一种组件，不用担心会重复注册扩展，内部会过滤掉相同名称的扩展。
- 自定义组件同菜单的一样

```VUE

<vivid-editor>
  <template v-slot:bubble-menu="{nodeType}">
    <template v-if="nodeType === 'text'">
      <bold-ext/>
      <italic-ext/>
      <strike-ext/>
      <underline-ext/>
      <color-ext/>
      <highlight-ext/>
      <divider-ext/>
      <text-align-ext/>
    </template>
    <template v-if="nodeType === 'image'">
      <image-bubble-menu/>
    </template>
    <template v-if="nodeType === 'video'">
      <video-bubble-menu/>
    </template>
  </template>
</vivid-editor>
```

同样，你也可以把这么多一坨组件都包装到一个组件中，再在menu插槽中引入。

## 自定义底栏

根据提供的footer插槽进行替换成自定义的vue组件即可。如果需要在您的组件中获取编辑器实例，可以使用

```JS
const editorInstance = inject('editorInstance')
```

## 自定义图片视频上传
编辑器默认提供了一套简单的上传组件和逻辑，可以在image、video扩展组件上进行绑定上传处理的方法，该方法必须返回`promise`,
返回**图片地址**，方法签名为
```ts
declare type handleUpload = (file:File, updateProgress: (percent: number) => void) => Promise<string>
```
通过调用`updateProgress`，进行上传进度条的更新；如果有更加复杂的需求，需要自行实现图片视频扩展，可以通过调用`useImage()`开发更为复杂的image组件以替换默认提供的。

```VUE
<template>
  <vivid-editor>
    <template #menu>
      <!--基础扩展组件-->
      <!--引入你的组件-->
      <image-ext :handleUpload="handleUpload"/>
      <video-ext :handleUpload="handleUpload"/>
    </template>
  </vivid-editor>
</template>
<script setup>
  async function handleUpload(file,per){
    updateProgress(100)
    return 'http://test.com/image.png'
  }
</script>
```


## 多人协作（开发中）
已经提供tiptap官方的websocket扩展，但是demo演示环境未准备好。

## AI助手（开发中）
已经提供AI助手扩展组件，但是不完善。

## 开发自定义扩展

自定义扩展有2种，一种和tiptap结合的组件，一种无关tiptap。前者参考【自定义顶栏菜单】一栏中的讲解，后者直接开发vue组件即可。

## vivid提供的组件清单

vivid对于tiptap的扩展提供了2种方式载入，可以使用导出的`useXXXX(options)`方式创建扩展然后，传入tiptap，
也可以通过使用`XXXXExt`放入到menu插槽中，每个EXT组件均提供了`Options`
参数，最终也会传给，放入插槽后组件会自动调用provider的`useExtension`方法进行注册。
vivid均使用后者方法实现，比较复合vue3的开发风格，让开发者更加容易上手去扩展编辑器。

- Options 参数格式和tiptap对应扩展的参数保持一致
- EXT组件会根据实际情况提供额外的参数以实现其可配置功能

以下为vivid提供的扩展和扩展对应的组件

| 序号 | 方法名称              | 组件名称              | 必需        |
|----|-------------------|-------------------|-----------|
| 1  | useBold           | BoldExt           | 否         |
| 2  | useBlockquote     | BlockQuoteExt     | 否         |
| 3  | useCode           | CodeExt           | 否         |
| 4  | useBulletList     | BulletListExt     | 否         |
| 5  | useColor          | ColorExt          | 否         |
| 6  | useCharacterCount | CharacterCountExt | 是         |
| 7  | useCodeBlock      | CodeBlockExt      | 否         |
| 8  | useDocument       | DocumentExt       | 是         |
| 9  | useDropcursor     | DropcursorExt     | 是         |
| 10 | useGapcursor      | GapcursorExt      | 是         |
| 11 | useHardBreak      | HardBreakExt      | 是         |
| 12 | useHeading        | HeadingExt        | 否         |
| 13 | useHighlight      | HighlightExt      | 否         |
| 14 | useHistory        | HistoryExt        | 是         |
| 15 | useLink           | LinkExt           | 否         |
| 16 | useMath           | MathExt           | 否         |
| 17 | useImage          | ImageExt          | 否         |
| 18 | useItalic         | ItalicExt         | 否         |
| 19 | useIndent         | IndentExt         | 是         |
| 20 | useHorizontalRule | HorizontalRuleExt | 否         |
| 21 | useListItem       | ListItemExt       | 否         |
| 22 | useOrderedList    | OrderedListExt    | 否         |
| 23 | useParagraph      | ParagraphExt      | 是         |
| 24 | usePlaceholder    | PlaceholderExt    | 是         |
| 25 | useStrike         | StrikeExt         | 否         |
| 26 | useSubscript      | SubscriptExt      | 否         |
| 27 | useSuperscript    | SuperscriptExt    | 否         |
| 28 | useTable          | TableExt          | 否         |
| 29 | useText           | TextExt           | 是         |
| 30 | useTaskList       | TaskListExt       | 否         |
| 31 | useVideo          | VideoExt          | 否         |
| 32 | useUnderline      | UnderlineExt      | 否         |
| 33 | useTextAlign      | TextAlignExt      | 否         |
| 34 | useTextStyle      | TextStyleExt      | 是         |
| 35 | useFocus          | FocusExt          | 是         |
| 36 | useLineHeight     | LineHeightExt     | 否         |
| 37 | useTaskItem       | -                 | 否         |
| 38 | getRandomColor    | HocuspocusExt     | 否         |
| 39 | useHocuspocus     | HocuspocusExt     | 否         |
| 40 | useAi             | AiExt             | 否         |
| 41 | -                 | DividerExt        | 否         |
| 42 | -                 | FormatClearExt    | 否         |
| 43 | -                 | FullscreenExt     | 否         |
| 44 | -                 | UndoExt           | 否         |
| 45 | -                 | RedoExt           | 否         |
| 46 | -                 | ImageBubbleMenu   | 默认的图片浮动菜单 |
| 47 | -                 | VideoBubbleMenu   | 默认的视频浮动菜单 |
| 48 | -                 | TableBubbleMenu   | 默认的表格浮动菜单 |
| 49 | -                 | VividEditor       | 核心编辑器组件   |
| 49 | -                 | VividMenuItem     | 菜单按钮组件    |
