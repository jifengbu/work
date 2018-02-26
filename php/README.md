#### 启动Apache服务
- sudo apachectl start

#### 关闭Apache服务
- sudo apachectl stop

#### 重启Apache服务
- sudo apachectl restart

#### 查看Apache服务版本
- sudo apachectl -v

#### 查看Apache服务是否启动
* 访问 `http://localhost`

#### 修改Apache配置文件
- 路径 `/private/etc/apache2/httpd.conf`

* 修改 DocumentRoot，默认为`/Library/WebServer/Documents` 修改为 `/Users/fang/work/php`

* 开启php，放开注释`LoadModule php5_module libexec/apache2/libphp5.so`

* 修改端口 Listen 80， 默认为80端口

* 访问 `http://localhost/test/info.php` `http://localhost/project`
