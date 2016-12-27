export default function (str) {
  str = str.replace(/<\/br>/g, '<br/>')
  // str = str.replace(/<br\/>/g, '\n')
  return str// str.replace(/<[^>]+>/g, '')// 去掉所有的html标记
}
