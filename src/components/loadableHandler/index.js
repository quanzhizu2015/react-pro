import Loadable from 'react-loadable'
import Loading from './loading3.js'

// 实现页面组件按需引入
export default function loadableHandler(componentLoad) {
    return Loadable({
        loader: componentLoad,
        loading: Loading,
        delay: 300,
    })
}
