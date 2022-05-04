# 流程

## 流媒体服务器搭建

### 服务器搭建方案

#### 云服务器：Centos7.6 Nginx Nginx-http-flv-rmpt Nginx.conf

#### 云服务器：Centos7.6 livego-tool

- 获取{key}:  `http://1.15.121.202:8090/control/get?room={room}`

- 拉流:       `http://1.15.121.202:7001/live/{room}`

- 推流:       `rtmp://1.15.121.202:1935/live  {key}`

#### 本地服务器: Ubuntu20.0 Nginx Nginx-http-flv-rmpt Nginx.conf

- 推流
ffmpeg推流:

```bash
ffmpeg -re -i xxx.mp4 -vcodec libx264 -acodec aac -f flv rtmp://127.0.0.1:1935/live/{room}
```

OBS推流:

```text
rtmp://127.0.0.1:1935/live  key:{room}
```

- 拉流

```text
http://127.0.0.1:8080/live?app=live&stream={room}
```

#### 本地服务器: Ubuntu20.0 livego-tool

#### 本地服务器: Windows10 livego-tool

换一下公网ip

- 获取{key}:  `http://{ip}:port/control/get?room={room}`
- 拉流:       `http://{ip}:port/{roomip}`
- 推流:       `rtmp://{ip}:port/live  密钥{key}`

### 推拉流方案选择

- 推流: ffmpeg OBS

- 拉流: web-flv.js, ios m3u8

## 平台搭建

### 前端框架

React

### 美化，交互

React
