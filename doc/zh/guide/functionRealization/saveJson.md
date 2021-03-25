<!--
 * @Date: 2021-01-17 14:26:00
 * @LastEditors: chentianshang
 * @LastEditTime: 2021-01-17 21:32:58
 * @FilePath: /github-h5-drag/doc/zh/guide/functionRealization/saveJson.md
-->
# 保存json

我们配置好H5页面之后，如果希望其他人观看，我们可以保存页面并发送链接。但是如果有多人协作的需求，比如一个H5页面可能由多个人完成，这个时候该怎么实现呢？基于已有的方案，我们可以采用socket实现多人协同编辑，但是成本比较大，所有这里我们提供了保存json的功能。

我们可以将配置好的页面导出为json，发送给另一个人，这样另一个人通过导入该json文件可以实时看到当前的页面，这里还是依靠我们的页面渲染引擎viewEngine。实现思路也很简单，可以在github[[https://github.com/MrXujiang/h5-drag](https://github.com/MrXujiang/h5-drag)]上参考体验。
