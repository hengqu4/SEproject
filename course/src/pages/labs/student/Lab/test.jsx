// import { Table, Button, Modal, Form, Input, Upload, Icon, notification } from 'antd';
// <Modal
//           title="文件上传"
//           visible={this.state.visible}
//           onOk={this.handleOk} //点击按钮提价表单并上传文件
//           onCancel={this.handleCancel}
//         >
//           <Form layout="vertical" onSubmit={this.handleSubmit}>
//             <Form.Item>
//               <div  key={Math.random()}>//点击关闭在次打开还会有上次上传文件的缓存
//                 <Upload {...props}>
//                   <Button type="primary">
//                     <Icon type="upload" />选择文件
//                   </Button>
//                 </Upload>
//               </div>
//             </Form.Item>
//             <Form.Item label="文件名(可更改)">
//               {getFieldDecorator('filename', {
//                 // initialValue:this.state.defEmail,
//                 rules: [
//                   {
//                     message: '请输入正确的文件名',
//                     // pattern: /^[0-9]+$/,
//                   },
//                   {
//                     required: true,
//                     message: '请输入文件名',
//                   },
//                 ],
//               })(<Input />)}
//             </Form.Item>
//             <Form.Item label="描述(选填)">
//               {getFieldDecorator('describe', {
//                 rules: [
//                   {
//                     message: '描述不能为空',
//                   },
//                   {
//                     required: false,
//                     message: '请输入描述',
//                   },
//                 ],
//               })(<TextArea />)}
//             </Form.Item>
//             <Form.Item label="文件类型">
//               {getFieldDecorator('filetype', {
//                 rules: [
//                   {
//                     message: '文件类型',
//                   },
//                   {
//                     required: true,
//                     message: '文件类型',
//                   },
//                 ],
//               })(<Input disabled={true} />)}
//             </Form.Item>
//           </Form>
//         </Modal>

//     const props = {
//       showUploadList: true,
//       onRemove: file => {
//         this.setState(state => {
//           const index = state.fileList.indexOf(file);
//           const newFileList = state.fileList.slice();
//           newFileList.splice(index, 1);
//           return {
//             fileList: newFileList,
//           };
//         });
//       },
//       beforeUpload: file => {
//         console.log(file)
//         let { name } = file;
//         var fileExtension = name.substring(name.lastIndexOf('.') + 1);//截取文件后缀名
//         this.props.form.setFieldsValue({ 'filename': name, 'filetype': fileExtension });//选择完文件后把文件名和后缀名自动填入表单
//         this.setState(state => ({
//           fileList: [...state.fileList, file],
//         }));
//         return false;
//       },
//       fileList,
//     };


//   handleOk = e => {//点击ok确认上传
//     const { fileList } = this.state;
//     const formData = new FormData();
//     fileList.forEach(file => {
//       formData.append('file', file);
//     });
//     this.props.form.validateFields((err, values) => { //获取表单值
//       let { filename, filetype, describe } = values;
//       formData.append('name', filename);
//       formData.append('type', filetype);
//       formData.append("dir", "1");
//       if(describe==undefined){
//         formData.append('description',"");
//       }else{
//         formData.append('description',describe);
//       }
      
//       UploadFile(formData).then(res => { //这个是请求
//         if (res.status == 200 && res.data != undefined) {
//           notification.success({
//             message: "上传成功",
//             description: res.data,
//           });
//         } else {
//           notification.error({
//             message: "上传失败",
//             description: res.status,
//           });
//         }
//       })
//       this.setState({
//         visible: false
//       });
//     })
//   };