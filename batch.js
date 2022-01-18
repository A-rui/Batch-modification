var fs = require('fs')
// path模块，可以生产相对和绝对路径
var path = require('path')
// 获取当前目录绝对路径，这里resolve()不传入参数
var filePath = path.resolve()
// 读取文件存储数组
var fileArr = []
// 读取文件目录
fs.readdir(filePath, function (err, files) {
  if (err) {
    console.log(err)
    return
  }
  files.forEach(function (filename) {
    fs.stat(path.join(filePath, filename), function (err, stats) {
      if (err) throw err
      if (stats.isFile()) {
        var newUrl = path.join(filePath, filename)
        if (fileArr.indexOf(newUrl) === -1) fileArr.push(newUrl)
        writeFile(fileArr)
      } else if (stats.isDirectory()) {
        if (filename !== 'node_modules') {
          var name = filename
          readFile(path.join(filePath, filename), name)
        }
      }
    })
  })
})
// 获取文件数组
function readFile(readurl, name) {
  fs.readdir(readurl, function (err, files) {
    if (err) {
      console.log(err)
      return
    }
    files.forEach(function (filename) {
      fs.stat(path.join(readurl, filename), function (err, stats) {
        if (err) throw err
        if (stats.isFile()) {
          var newUrl = path.join(readurl, filename)
          if (fileArr.indexOf(newUrl) == -1) fileArr.push(newUrl)
          writeFile(fileArr)
        } else if (stats.isDirectory()) {
          var dirName = filename
          readFile(path.join(readurl, filename), name + '/' + dirName)
        }
      })
    })
  })
}
// 获取后缀名
function getdir(url) {
  var arr = url.split('.')
  var len = arr.length
  return arr[len - 1]
}
// 文件名当name名
function getName(url) {
  var arr = url.split('/')
  if (arr[arr.length - 1] === 'index.vue') {
    return setData(arr[arr.length - 2])
  } else {
    return setData(arr[arr.length - 1].split('.')[0])
  }
}
// 首字母大写
function setData(name) {
  return name.substring(0, 1).toUpperCase() + name.substring(1)
}

function writeFile(data) {
  data.forEach((e) => {
    if (getdir(e) === 'vue') {
      fs.readFile(e, 'utf8', function (err, files) {
        if (files) {
          var result = files.split('export default')
          var res = result[1]
          var name = getName(e)
          if (res && res.match(/name\:(.+?)\,/)) {
            result[1] = res.replace(/name\:(.+?)\,/, "name: '" + name + "',")
            fs.writeFile(e, result.join('export default'), function (err) {
              if (err) return console.log(err)
            })
          }
        }
      })
    }
  })
}
