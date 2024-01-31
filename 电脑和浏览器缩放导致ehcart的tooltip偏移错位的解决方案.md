# 解决方案

```js
import { echartZoomStyle } from "@/utils/style";
import ReactEcharts from "echarts-for-react";

<div className={styles["histogram-box"]}>
  <ReactEcharts
    notMerge
    lazyUpdate
    option={option}
    opts={{ renderer: "svg" }}
    style={{
      ...echartZoomStyle,
    }}
    {...props}
  />
</div>;
```

## 一、echartZoomStyle 代码：

```js
// 电脑和浏览器缩放导致 echarts 图表 tooptip 指示器错位便宜解决
const radio = getRatio(); // 电脑本地缩放
const zoom = 1.25; // plugin.js 代码配置的缩放，125%
const echartZoomStyle = {
  // 电脑 100%，plugin.js 缩放代码 zoom 为 125%
  // width: '80%',
  // transform: 'scale(1.25)',
  // transformOrigin: '0 0',

  // 电脑 150%，plugin.js 缩放代码 zoom 为 125%
  height: `${(getRatio() / 1.25) * 100}%`, // 大约电脑本地缩放 ➗ plugin.js 代码缩放 125%
  width: `${(getRatio() / 1.25) * 100}%`, // 大约电脑本地缩放 ➗ plugin.js 代码缩放 125%
  zoom: getRatio() / 1.25, // 大约电脑本地缩放 ➗ plugin.js 代码缩放 125%
  transform: `scale(${1.25 / getRatio()})`, // 大约 plugin.js 代码缩放 125% ➗ 电脑本地缩放
  height: `${(radio / zoom) * 100}%`, // 大约电脑本地缩放 ➗ plugin.js 代码缩放 125%
  width: `${(radio / zoom) * 100}%`, // 大约电脑本地缩放 ➗ plugin.js 代码缩放 125%
  zoom: radio / zoom, // 大约电脑本地缩放 ➗ plugin.js 代码缩放 125%
  transform: `scale(${zoom / radio})`, // 大约 plugin.js 代码缩放 125% ➗ 电脑本地缩放
  transformOrigin: "0 0",
};
```

## 二、获取电脑缩放比例代码：

```js
// 获取电脑缩放比例
export const getRatio = () => {
var ratio = 0;
var screen: any = window.screen;
var ua = navigator.userAgent.toLowerCase();

if (window.devicePixelRatio !== undefined) {
ratio = window.devicePixelRatio;
} else if (~ua.indexOf('msie')) {
if (screen.deviceXDPI && screen.logicalXDPI) {
ratio = screen.deviceXDPI / screen.logicalXDPI;
}
} else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
ratio = window.outerWidth / window.innerWidth;
}

if (ratio) {
ratio = Math.round(ratio \* 100);
}
return ratio / 100;
};
```
