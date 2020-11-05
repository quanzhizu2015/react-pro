/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Upload, Button, Icon } from 'antd'
import moment from 'moment'
import Message from '@/components/message'
import Header from '../../../components/header'
import Footer from '../../../components/funcoinFooter'
import './style.scss'


@withRouter
@connect(state => ({
    apis: state.apis,
    userAuth: state.userAuth
}))
export default class UpCoin extends Component {
    constructor() {
        super()
        this.state = {
            domain: '',
            amount: '',
            cert: '',
            meaning: '',
            elite: '',
            contact: '',
            mobile: '',
            wechat: '',
            qq: '',
            other: '',
            applyList: []
        }
    }
    componentDidMount() {
        // this.getUserAuth()
        this.getMyApply()
    }
    getUserAuth = () => {
        if (this.props.userAuth) {
            this.getMyApply()
        } else {
            Message.warning('请先登录')
            this.props.history.push('/common/login')
        }
    }
    getMyApply = async () => {
        try {
            const res = await this.props.apis.getApplyList()
            if (res.code === 0) {
                this.setState({ applyList: res.data.list })
            }
        } catch (error) {
            Message.error(error)
        }
    }
    // diaojiekou
    postFormData = async() => {
        if (this.props.userAuth) {
            const {
                domain,
                amount,
                cert,
                meaning,
                elite,
                contact,
                mobile,
                wechat,
                qq,
                other
            } = this.state
            const params = {
                domain,
                amount,
                cert,
                meaning,
                elite,
                contact,
                mobile,
                wechat,
                qq,
                other
            }
            try{
                if (!domain || !amount || !cert || !meaning || !elite || !contact || !mobile || !wechat || !qq || !other) {
                    Message.error("请完成整填写申请表单!");
                } else {
                    const res = await this.props.apis.postFormData(params)
                    if (res.code === 0) {
                        Message.success('您的域名上市申请提交成功！')
                        this.props.history.push('/') // 回到主页
                    }    
                }
            } catch (e) {
                console.log(e)
            }
        } else {
            Message.info('请先登录')
            this.props.history.push('/common/login')
        }
    }
    beforeUpload = (file) => {
      const fileTypes = [
        'pdf',
        'png',
        'jpg',
        'jpeg'
      ]
      const type = file.name.substring(file.name.lastIndexOf('.')+1)
      if (type !== fileTypes[0] && type !== fileTypes[1] && type !== fileTypes[2] && type !== fileTypes[3]) {
          Message.error('上传文件类型错误！')
          return false
      }
      return true
    }

    filterStatus = (status) => {
      const name = [0, 1, 2]
      const lever = ['未审核', '审核通过', '审核未通过']
      for (let i = 0; i < name.length; i += 1) {
          if (status === name[i]) {
              return lever[i]
          }
      }
      return '--'
  
    }
    onChange = (info) => {
      if (info.file.status === 'done') {
          // 获取到返回的数据，传出去
          const { response } = info.file
          if (response && response.code === 0) {
            // console.log(response.data)
            this.setState({ cert: response.data })
          } else if (response.code === 401) {
              Message.warning('请先登录')
              this.props.history.push('/common/login')
          } else {
              Message.warning(response.msg)
          }
      } else if (info.file.status === 'error') {
          Message.error(`${info.file.name} 文件上传失败`)
      }
    }
    render() {
        const { applyList } = this.state
        return (
            <div id="APP">
                <div>
                    <Header type="trade" />
                </div>
                <div className="app-main">
                    <form id="funcoin-upcoin" className="funcoin-main">
                        <h3>DTO申请</h3>
                        <h4>请填写申请表单，GoodToken团队会在收到申请的1-3个工作日回复</h4>
                        <p>
                        <h5>注意事项:</h5>
                        <br />
                        * 只接受（.COM）DTO发行
                        <br />
                        * 单个域名估值不低于1000USDT
                        <br />
                        * 只接受双拼、单拼、两字母、三字母、两数字、三数字、四数字、英文单词、英文单词双拼等有价值域名
                        <br />
                        * 项目方（域名所有人）提供的信息必须真实、完整、简洁，不得有任何虚假信息，否则一切损失由项目方承担
                    </p>
                    <div className="funcoin-upcoin-input funcion-must">
                        <label className="funcion-must">
                            1. 域名
                        </label>
                        <input
                            value={this.state.domain}
                            onChange={(e) => { this.setState({ domain: e.target.value })}}
                            required
                            type="text"
                        />
                    </div>
                    <div className="funcoin-upcoin-input funcion-must span">
                        <label htmlFor="" className="funcion-must">
                            2. 自我估值
                        </label>
                        <input
                            value={this.state.amount}
                            onChange={(e) => { this.setState({ amount: e.target.value })}}
                            required
                            type="text"
                        />
                        <span>(USD)</span>
                    </div>
                    <div className="funcoin-upcoin-input funcion-must haha">
                        <label htmlFor="" className="funcion-must">
                            3. 域名证书
                        </label>
                        <Upload
                          action="/api/files/upload"
                          beforeUpload={this.beforeUpload}
                          onChange={this.onChange}
                        >
                          <Button>
                            <Icon type="upload" /> 点击上传
                          </Button>
                        </Upload>
                        <span className="xixi">(pdf/png/jpg/jpeg)</span>
                    </div>
                    <div className="funcoin-upcoin-input funcion-must">
                        <label htmlFor="" className="funcion-must">
                            4. 中文含义
                        </label>
                        <input
                            value={this.state.meaning}
                            onChange={(e) => { this.setState({ meaning: e.target.value })}}
                            required
                            type="text"
                        />
                    </div>
                    <div className="funcoin-upcoin-input funcion-must">
                        <label htmlFor="" className="funcion-must">
                            5. 亮点描述
                        </label>
                        <input
                            value={this.state.elite}
                            onChange={(e) => { this.setState({ elite: e.target.value })}}
                            required
                            type="text"
                        />
                    </div>
                    <div className="funcoin-upcoin-input funcion-must">
                        <label htmlFor="" className="funcion-must">
                            6. 联系人
                        </label>
                        <input
                            value={this.state.contact}
                            onChange={(e) => { this.setState({ contact: e.target.value })}}
                            required
                            type="text"
                        />
                    </div>
                    <div className="funcoin-upcoin-input funcion-must">
                        <label htmlFor="" className="funcion-must">
                            7. 手机
                        </label>
                        <input
                            value={this.state.mobile}
                            onChange={(e) => { this.setState({ mobile: e.target.value })}}
                            required
                            type="text"
                        />
                    </div>
                    <div className="funcoin-upcoin-input funcion-must">
                        <label htmlFor="" className="funcion-must">
                            8. 微信
                        </label>
                        <input
                            value={this.state.wechat}
                            onChange={(e) => { this.setState({ wechat: e.target.value })}}
                            required
                            type="text"
                        />
                    </div>
                    <div className="funcoin-upcoin-input funcion-must">
                        <label htmlFor="" className="funcion-must">
                            9. QQ
                        </label>
                        <input
                            value={this.state.qq}
                            onChange={(e) => { this.setState({ qq: e.target.value })}}
                            required
                            type="text"
                        />
                    </div>
                    <div className="funcoin-upcoin-input">
                        <label htmlFor="">
                            10. 其他
                        </label>
                        <input
                            value={this.state.other}
                            onChange={(e) => { this.setState({ other: e.target.value })}}
                            required
                            type="text"
                        />
                    </div>
                    </form>
                    <div
                        className={this.props.userAuth ? 'button' : 'button disable'}
                        onClick={() => { this.postFormData() }}
                    >
                        提交
                    </div>
                    {
                        applyList && applyList.length > 0 ?
                            <div className="upCoin-table">
                                <h4>我的申请</h4>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>id</th>
                                            <th>域名</th>
                                            <th>时间</th>
                                            <th>结果</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            applyList.map(item => (
                                                <tr>  
                                                    <td>{item.id}</td>
                                                    <td>{item.domain}</td>
                                                    <td>{moment(item.gmtCreate).format('YYYY-MM-DD')}</td>
                                                    <td>{this.filterStatus(item.status)}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            :
                            null
                    }
                </div>
                <div className="Footer">
                    <Footer />
                </div>
            </div>
        )
    }
}