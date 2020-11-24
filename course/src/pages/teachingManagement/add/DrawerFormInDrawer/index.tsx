import React from "react";
import styles from "./index.less";
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  InputNumber
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

class DrawerForm extends React.Component {
  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showDrawer}>
          添加课程
        </Button>
        <Drawer
          title="添加课程"
          width={480}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: "right"
              }}
            >
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={this.onClose} type="primary">
                Submit
              </Button>
            </div>
          }
        >
          <Form layout="vertical" hideRequiredMark>
            
                <Form.Item
                  name="Name"
                  label="班级编号"
                >
                  <Input/>
                </Form.Item>
                <Form.Item
                  name="Url"
                  label="上课地点"
                >
                  <Input/>
                </Form.Item>
                <Form.Item
                  name="Time"
                  label="上课时间"
                >
                  <Input/>
                </Form.Item>
                <Form.Item
                  name="Number"
                  label="班级人数"
                >
                  <InputNumber min={0}/>
                </Form.Item>
                <Form.Item
                  name="Assistant"
                  label="助教姓名"
                >
                  <Input/>
                </Form.Item>
                
             
              
                <Form.Item
                  name="type"
                  label="课程类型"
                  rules={[
                    { required: true, message: "Please choose the type" }
                  ]}
                >
                  <Select>
                    <Option value="private">理论课</Option>
                    <Option value="public">实验课</Option>
                  </Select>
                </Form.Item>
              
            
          </Form>
        </Drawer>
      </div>
    );
  }
}

export default () => (
  <div className={styles.container}>
    <div id="components-drawer-demo-form-in-drawer">
      <DrawerForm />
    </div>
  </div>
);
