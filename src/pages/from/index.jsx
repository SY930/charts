import React, { Component } from 'react'
import { Form, DatePicker, Input, Button, Row, Col, Breadcrumb, message } from 'antd';
import { Download, Execute } from '../../api/from';

class indexPage extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(['date', 'group', 'exchange', 'sym'], (err, fieldsValue) => {
            if (err) {
                return;
            }
            // Should format date value before submit.
            const values = {
                ...fieldsValue,
                'date': fieldsValue['date'].format('YYYY/MM/DD'),
            };
            Download(values).then((data) => {
                if (data.code === 1200) {
                    message.success(data.msg);
                }
            })
        });
    };

    handleExecuteSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields(['group_1', 'symbol', 'bps', 'btc'],(err, fieldsValue) => {
            if (err) {
                return;
            }

            // Should format date value before submit.
            const values = {
                ...fieldsValue,
                group: fieldsValue['group_1'],
            };
            Execute(values).then((data) => {
                if (data.code === 1200) {
                    message.success(data.msg);
                }
            })
            console.log('Received values of form: ', values);
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const config = {
            rules: [{ type: 'object', required: true, message: 'Please select time!' }],
        };
        return (
            <React.Fragment>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>表单</Breadcrumb.Item>
                </Breadcrumb>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label="组名">
                        <Row gutter={8}>
                            <Col span={6}>
                                {getFieldDecorator('group', {
                                    rules: [{ required: true, message: 'Please input the group you got!' }],
                                })(<Input />)}
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item label="日期">
                        {getFieldDecorator('date', config)(<DatePicker />)}
                    </Form.Item>

                    <Form.Item label="交易所">
                        <Row gutter={8}>
                            <Col span={6}>
                                {getFieldDecorator('exchange', {
                                    rules: [{ required: true, message: 'Please input the exchange you got!' }],
                                })(<Input />)}
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item label="货币对">
                        <Row gutter={8}>
                            <Col span={6}>
                                {getFieldDecorator('sym', {
                                    rules: [{ required: true, message: 'Please input the sym you got!' }],
                                })(<Input />)}
                            </Col>
                        </Row>
                    </Form.Item>
                    
                    <Form.Item
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 16, offset: 8 },
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            下载
                        </Button>

                    </Form.Item>
                </Form>
                <div>
                <Form {...formItemLayout} onSubmit={this.handleExecuteSubmit}>
                    <Form.Item label="组名">
                        <Row gutter={8}>
                            <Col span={6}>
                                {getFieldDecorator('group_1', {
                                    rules: [{ required: true, message: 'Please input the group you got!' }],
                                })(<Input />)}
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item label="货币对">
                        <Row gutter={8}>
                            <Col span={6}>
                                {getFieldDecorator('symbol', {
                                    rules: [{ required: true, message: 'Please input the sym you got!' }],
                                })(<Input />)}
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item label="bps">
                        <Row gutter={8}>
                            <Col span={6}>
                                {getFieldDecorator('bps', {
                                    rules: [{ required: true, message: 'Please input the bps you got!' }],
                                })(<Input placeholder="整数逗号分开" />)}
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item label="btc">
                        <Row gutter={8}>
                            <Col span={6}>
                                {getFieldDecorator('btc', {
                                    rules: [{ required: true, message: 'Please input the btc you got!' }],
                                })(<Input placeholder="数字类型逗号分开" />)}
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 16, offset: 8 },
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            执行
                        </Button>

                    </Form.Item>
                </Form>
                </div>
            </React.Fragment>
        );
    }
}

export default Form.create()(indexPage);
