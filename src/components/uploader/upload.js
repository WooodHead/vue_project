export default function upload(options) {
  const {url, file, fileVal, onBeforeSend, onProgress, onError, onSuccess} = options
  // const {name} = file
  const data = {
    key: file.name
  }
  const headers = {}

  if (onBeforeSend(file, data, headers) === false) return

  file.status = 'progress'

  onProgress(file, 0)

  const formData = new FormData()
  const xhr = new XMLHttpRequest()

  file.xhr = xhr

  // 设置参数
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key])
  })
  if (options.type === 'file') {
    formData.append(fileVal, file, name)
  } else {
    formData.append(fileVal, file.base64)
  }
  xhr.onload = function () {
    if (xhr.status === 200) {
      // console.log('onload==>' + xhr.responseText)
      try {
        // 只支持json
        const ret = JSON.parse(xhr.responseText)
        if (ret.key) {
          onSuccess(file, {
            state: true,
            info: 'http://jyapp.qiniudn.com/' + ret.key
          })
        }
        return
      } catch (err) {
      }
      onError(file, null)
    } else {
      onError(file, new Error('XMLHttpRequest response status is ' + xhr.status))
    }
  }
  xhr.onerror = function () {
    onError(file, new Error('XMLHttpRequest response status is ' + xhr.status))
  }
  xhr.upload.addEventListener('progress', function (evt) {
    if (evt.total === 0) return
    let percent = Math.ceil(evt.loaded / evt.total) * 100
    // console.log('progress==>', evt)
    if (percent > 99) {
      percent = 99 // 强制设置为99%
    }
    onProgress(file, percent)
  }, false)

  xhr.open('POST', url)

  // 设置头部信息
  Object.keys(headers).forEach((key) => {
    xhr.setRequestHeader(key, headers[key])
  })

  xhr.send(formData)
}
