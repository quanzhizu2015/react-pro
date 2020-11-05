import React from 'react'
import { Upload } from 'antd'
import { withFormsy, propTypes } from 'formsy-react'
import Message from '@/components/message'
import './uploadCard.scss'

function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
}

@withFormsy
class UploadCard extends React.Component {
    static propTypes = {
        ...propTypes
    }
    constructor(props) {
        super(props)
        if (this.props.defaultValue && this.props.defaultValue !== '') {
            this.props.setValue(this.props.defaultValue)
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.defaultValue !== this.props.defaultValue) {
            this.props.setValue(nextProps.defaultValue)
        }
    }
    handleChange = (info) => {
        if (info.file.status === 'done') {
            const imgUrl = info.file.response.data
            if (this.props.setValue && imgUrl.length < 50) {
                this.props.setValue(imgUrl)
                // this.props.onChange(imgUrl)
                this.props.setLoading(false)
            }
        }
    }
    // 上传前进行校验，包含后缀和大小
    beforeUpload = (file) => {
        let result = true
        if (this.props.types && this.props.types.length) {
            let isType = false
            for (let i = 0; i < this.props.types.length; i += 1) {
                if (this.props.types[i] === file.type) {
                    isType = true
                    break
                }
            }
            if (!isType) {
                Message.error(this.props.errorMessage)
                result = false
            }
        }
        if (this.props.size) {
            const isLt2M = file.size / 1024 / 1024 < this.props.size
            if (!isLt2M) {
                Message.error(this.props.errorMessage)
                result = false
            }
        }
        if (result) {
            this.props.setLoading(true)
            getBase64(file, (imageUrl) => {
                this.props.onChange(imageUrl)
            })
        }
        return result
    }
    render() {
        const props = {
            headers: {
                Authorization: localStorage.auth || ''
            },
        }
        return (
            <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                disabled={this.props.disabled}
                action={this.props.uploadurl} // 图片上传URL（请求）
                beforeUpload={this.beforeUpload}
                onChange={this.handleChange}
                {...props}
            >
                {this.props.uploadButton}
            </Upload>
        )
    }
}

export default UploadCard
