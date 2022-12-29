import Axios from 'axios';
import { BASE_URL } from '../store/api';
var OSS = require('ali-oss');

class HttpHandler {
  /**
   * send http request to back-end api server
   * @param {*} url
   * @param {*} method
   * @param {*} payload
   * @return {ResponseObject}
   */
  sendRequest(url, method, payload) {
    return Axios.request({
      method: method,
      url: `${BASE_URL}${url}`,
      data: payload
    })
      .then(res => res)
      .catch(error => error.response);
  }

  /**
   * upload file to server
   * @param {*} url
   * @param {*} httpMethod
   * @param {*} formData
   * @param {*} callbackMethod
   * @return {Promsie}
   */
  uploadFile(url, file, callbackMethod) {
    let client = new OSS({
      region: 'oss-cn-beijing',
      accessKeyId: 'LTAI4FhCZHsNdinNj6zBz6Eb',
      accessKeySecret: 'zOaXUm8LkeiXEGg6d5HhwRoCEEHXbG',
      bucket: 'fengmao-background'
    });

    let fileName =
      url + new Date().getTime() + file.name.substr(file.name.indexOf('.'));

    //定义唯一的文件名，打印出来的uid其实就是时间戳
    //client 是第一步中的 client
    return client
      .multipartUpload(fileName, file, {
        progress: function(p) {
          //获取进度条的值
          callbackMethod(p * 100);
        }
      })
      .then(function(res) {
        return `http://pic.fengmaotec.com/${res.name}`;
      })
      .catch(err => {
        return err;
      });
    /* return Axios.request({
      url: `${FILE_BASE_URL}${url}`,
      method: httpMethod,
      data: formData,
      onUploadProgress: function(event) {
        let percent = (event.loaded / event.total) * 100;

        callbackMethod(percent);
      }
    })
      .then(res => res)
      .catch(error => error.response); */
  }
}

export default HttpHandler;
