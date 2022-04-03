# 流程

## 直播实现

### 流媒体服务器搭建

#### 服务器搭建方案

云服务器：Centos7.6 Nginx Nginx-http-flv-rmpt Nginx.conf

云服务器：Centos7.6 livego-tool

- 获取{key}:  `http://1.15.121.202:8090/control/get?room={room}`
- 拉流:       `http://1.15.121.202:7001/live/{room}`
- 推流:       `rtmp://1.15.121.202:1935/live  {key}`

本地服务器: Ubuntu20.0 Nginx Nginx-http-flv-rmpt Nginx.conf

本地服务器: Ubuntu20.0 livego-tool

本地服务器: Windows10 livego-tool

换一下公网ip

- 获取{key}:  `http://{ip}/control/get?room={room}`
- 拉流:       `http://{ip}/{roomip}`
- 推流:       `rtmp://{ip}/live  密钥{key}`

#### 方案选择

推流: OBS

拉流: web flv.js, ios m3u8

### 项目搭建

#### 前端框架

React

#### 美化，交互

React
