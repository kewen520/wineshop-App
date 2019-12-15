const CryptoJS = require("cryptojs/cryptojs.js").CryptoJS; //AES加解密

//开锁
export function ble(options) {
    const o = options; //参数
    o.mac = o.mac.toLocaleLowerCase()
    let deviceId = null; //搜索到的设备Id
    let deviceService = null; //设备的服务
    let conTimes = 3; //蓝牙连接尝试次数
    let result = ""; //解密结果
    let deviceResponse = ""; //蓝牙监听分包拼接参数
    let responseLength = null; //蓝牙监听分包拼接参数长度
    let deviceAll = []; //搜索到的所有设备

    return new Promise((resolve, reject) => {

        openBluetoothAdapter()

        //初始化蓝牙适配器
        function openBluetoothAdapter() {
            logs('初始化蓝牙适配器');
            wx.openBluetoothAdapter({
                success: res => {
                    logs('蓝牙初始化成功');
                    start();
                },
                fail: res => {
                    reject(res)
                }
            });
        }

        //断开连接
        function closeBLEConnection() {
            if (deviceId) {
                wx.closeBLEConnection({
                    deviceId: deviceId,
                    success: () => {
                        logs("断开连接");
                    }
                });
            }
        }

        //长时间未搜索到蓝牙android设备冷却提示
        function androidCoolDown() {
            setTimeout(() => {
                if (deviceAll.length == 0) {
                    logs('搜索蓝牙操作频繁，手机蓝牙已经入冷却（该机制为android特殊行为），请15秒后尝试');
                }
            }, 5000)
        }

        //开始监听搜索蓝牙
        function start() {
            logs('开始');
            deviceAll = [];
            onBluetoothDeviceFound();
            startBluetoothDevicesDiscovery();
            onBluetoothAdapterStateChange();
        }

        //发现蓝牙新设备
        function onBluetoothDeviceFound() {
            getApp().globalData.timeOut = setTimeout(() => {
                wx.stopBluetoothDevicesDiscovery();
                logs('停止搜索设备');
                reject({
                    errMsg: '未找到设备，靠近并重试'
                })
            }, 5000)
            wx.onBluetoothDeviceFound(res => {
                res.devices.forEach(device => {
                    deviceAll.push(device)
                    if (device.name == 'openkey' && ab2hex(device.advertisData).substring(6, 18) ===
                        o.mac) {
                        console.log('我家锁')
                        clearTimeout(getApp().globalData.timeOut);
                        logs('停止搜索设备');
                        wx.stopBluetoothDevicesDiscovery();
                        deviceId = device.deviceId;
                        createBLEConnection();

                    }
                });
            });
        }

        //连接蓝牙
        function createBLEConnection() {
            logs('连接设备');
            wx.createBLEConnection({
                deviceId: deviceId,
                timeout: 6000,
                success: () => {
                    conTimes = 3;
                    logs("连接成功");
                    getBLEDeviceServices();
                },
                fail: (res) => {
                    logs("连接失败");
                    conTimes -= 1;
                    if (conTimes == 0) {
                        closeBLEConnection();
                        closeBluetoothAdapter()
                        reject(res)
                    } else {
                        createBLEConnection();
                    }
                }
            });
        }

        //获取蓝牙设备所有 service（服务）
        function getBLEDeviceServices() {
            logs('获取蓝牙设备服务');
            wx.getBLEDeviceServices({
                deviceId: deviceId,
                success: res => {
                    res.services.forEach(service => {
                        if (
                            service.uuid.substring(4, 8) == "0200"
                        ) {
                            logs(`服务:${service.uuid}`);
                            deviceService = service.uuid;
                            getBLEDeviceCharacteristics();
                        }
                    });
                },
                fail: (res) => {
                    closeBLEConnection();
                    closeBluetoothAdapter()
                    reject(res)
                }
            });
        }

        //获取蓝牙设备某个服务中的所有 characteristic（特征值）
        function getBLEDeviceCharacteristics() {
            logs('获取蓝牙设备服务的特征值');
            wx.getBLEDeviceCharacteristics({
                deviceId: deviceId,
                serviceId: deviceService,
                success: res => {
                    res.characteristics.forEach(characteristic => {
                        //门锁写入
                        if (characteristic.uuid.substring(4, 8) === '0201') {
                            logs(`特征值0:${characteristic.uuid}`);
                            setTimeout(() => {
                                logs(`生成开锁秘钥`);
                                getConnectKey().then((res) => {
                                    logs(`开锁秘钥：${res}`);
                                    writeBLECharacteristicValue(characteristic.uuid, res, 0);
                                });
                            }, 0);
                        }
                        //门锁监听
                        else if (
                            characteristic.uuid.substring(4, 8) === '0202'
                        ) {
                            logs(`特征值1:${characteristic.uuid}`);
                            notifyBLECharacteristicValueChange(characteristic.uuid);
                        }
                    });
                },
                fail: (res) => {
                    closeBLEConnection();
                    closeBluetoothAdapter()
                    reject(res)
                }
            });
        }

        //启用蓝牙设备特征值变化时的notify功能
        function notifyBLECharacteristicValueChange(characteristic) {
            logs("监听特征值变化");
            wx.notifyBLECharacteristicValueChange({
                state: true,
                deviceId: deviceId,
                serviceId: deviceService,
                characteristicId: characteristic,
                success: function (res) {
                    onBLECharacteristicValueChange();
                },
                fail: (res) => {
                    closeBLEConnection();
                    closeBluetoothAdapter()
                    reject(res)
                }
            });
        }

        //写入数据
        function writeBLECharacteristicValue(characteristic, unlockCmd, index) {
            //门锁数据
            let buffer, dataView, imin, imax, i;
            //需要分包几次
            let packageIndex = Math.ceil(unlockCmd.length / 40);
            //最后一个包的长度
            let lastPackageLength = unlockCmd.length / 2 - (packageIndex - 1) * 20;

            buffer =
                index == packageIndex - 1 ?
                new ArrayBuffer(lastPackageLength) :
                new ArrayBuffer(20);
            dataView = new DataView(buffer);
            imin = 20 * index;
            imax =
                index == packageIndex - 1 ?
                20 * index + lastPackageLength :
                20 * (index + 1);
            for (i = imin; i < imax; i++) {
                dataView.setUint8(i - imin, "0x" + unlockCmd.substring(2 * i, 2 * i + 2)); //写入ascll值
            }

            logs(`分包${index}:${ab2hex(buffer)}`);
            wx.writeBLECharacteristicValue({
                deviceId: deviceId,
                serviceId: deviceService,
                characteristicId: characteristic,
                value: buffer,
                success: function (res) {
                    conTimes = 3;
                    if (index < packageIndex - 1) {
                        index++;
                        writeBLECharacteristicValue(characteristic, unlockCmd, index);
                    }
                },
                fail: res => {
                    closeBLEConnection();
                    closeBluetoothAdapter()
                }
            });
        }

        //监听低功耗蓝牙设备的特征值变化。必须先启用notify接口才能接收到设备推送的notification。
        function onBLECharacteristicValueChange() {
            wx.onBLECharacteristicValueChange(res => {
                if (o.moduleType === 3) {
                    if (ab2hex(res.value).substr(2, 2) == "00") {
                        responseLength = Math.floor(parseInt(ab2hex(res.value).substr(0, 2), 16) * 32 / 40) * 40;
                    }
                    if (
                        deviceResponse.length ==
                        responseLength
                    ) {
                        deviceResponse += ab2hex(res.value);
                        result = "";
                        result = decrypt(o, deviceResponse.slice(4));
                        responseLength = null;
                        deviceResponse = "";
                        closeBLEConnection();
                        closeBluetoothAdapter()
                        if (o.isAddUser) {
                            logs('蓝牙用户添加成功')
                            resolve('蓝牙用户添加成功');
                        } else {
                            resolve(getElectricity(result));
                        }
                    } else {
                        deviceResponse += ab2hex(res.value);
                    }
                } else {
                    if (deviceResponse.length == 40) {
                        deviceResponse += ab2hex(res.value);
                        result = "";
                        result = decrypt(o, deviceResponse);
                        responseLength = null;
                        deviceResponse = "";
                        closeBLEConnection();
                        closeBluetoothAdapter()
                        resolve(getElectricity(result));
                    } else {
                        deviceResponse += ab2hex(res.value);
                    }
                }
            });
        }

        //生成开锁秘钥
        function getConnectKey() {
            return new Promise((s, f) => {
                s(createKey());
            })
        }

        //生成开锁秘钥(模块）
        function createKey() {
            logs('秘钥:' + '32' + timestamp() + o.mac);
            return encrypt(o, '32' + timestamp() + o.mac)
        }

        //更新电量
        function getElectricity(result) {
            if (o.moduleType === 3 && result.substring(2, 4) == "01") {
                let e = parseInt("0x" + result.substring(4, 6), 16);
                e = (realEleElectricity(e)).toFixed(0);
                return e + '%'
            }
            if ((o.moduleType === 1 || o.moduleType === 2) && result.substring(2, 4) == "00") {
                let e = parseInt("0x" + result.substring(4, 6), 16);
                e = (realEleElectricity(e)).toFixed(0);
                return e + '%'
            }
        }
    });
}

//监听蓝牙适配器状态变化事件
function onBluetoothAdapterStateChange() {
    logs('监听蓝牙适配器状态变化事件');
    wx.onBluetoothAdapterStateChange(res => {
        if (!res.available) {}
    });
}

//开始搜寻附近的蓝牙外围设备
function startBluetoothDevicesDiscovery() {
    logs("开始搜索设备");
    wx.startBluetoothDevicesDiscovery({
        allowDuplicatesKey: false
    });
}

//关闭蓝牙适配器
function closeBluetoothAdapter() {
    logs('关闭蓝牙适配器');
    wx.closeBluetoothAdapter()
}

//aes加密
function encrypt(o, word) {
    let mac = o.mac + '22' + '56';
    let key = CryptoJS.enc.Utf8.parse(mac);
    let iv = CryptoJS.enc.Utf8.parse(CryptoJS.MD5(key).toString().substring(0, 16));
    let encrypted = '';
    if (typeof (word) == 'string') {
        let srcs = CryptoJS.enc.Utf8.parse(word);
        encrypted = CryptoJS.AES.encrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    } else if (typeof (word) == 'object') {
        data = JSON.stringify(word);
        let srcs = CryptoJS.enc.Utf8.parse(data);
        encrypted = CryptoJS.AES.encrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        })
    }
    return encrypted.ciphertext.toString().toUpperCase();
}

//aes解密
function decrypt(o, word) {
    try {
        let mac = o.mac + +'22' + '56';
        let key = CryptoJS.enc.Utf8.parse(mac);
        let iv = CryptoJS.enc.Utf8.parse(CryptoJS.MD5(key).toString().substring(0, 16));
        let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
        let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        let decrypt = CryptoJS.AES.decrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr.toString();
    } catch (ex) {
        return null;
    }
}

//当前时间转16进制时间戳，精确到秒
function timestamp() {
    let timestamp = Date.parse(new Date()) / 1000;
    return timestamp.toString(16)
}

//电量公式
function realEleElectricity(e) {
    let p, v;
    v = e * 42.1875;
    if (v >= 6000) p = 100;
    else if (v <= 4000) p = 0;
    else p = (v - 4000) / 20;
    return p;
}

//ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
    let hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
        return ("00" + bit.toString(16)).slice(-2);
    });
    return hexArr.join("");
}

//日志
function logs(log) {
    console.log(log)
    getApp().globalData.that.data.logs.push(log)
    getApp().globalData.that.setData({
        logs: getApp().globalData.that.data.logs
    })
}