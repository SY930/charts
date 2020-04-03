import React, { Component } from 'react'
import { Table, Row, Col, Form, Input, Button, Popconfirm, message } from 'antd';
import _ from 'lodash';


import { UpdateRate, getFeeConfig, delFeeConfig, addFeeConfig } from '../../../api/from'


const getColumnsSimpel = (app) => {
  const columns = [
    {
      title: 'exchange',
      dataIndex: 'exchange',
      key: 'exchange',
      // width: '30%',
      editable: true,
    },
    {
      title: '值',
      dataIndex: 'exchangeVal',
      key: 'exchangeVal',
      // width: '30%',
      editable: true,
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) =>
        app.state.taker.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => app.handleDelete(record)}>
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];
  const list = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: app.handleSave,
      }),
    };
  });
  return list;
}

const getColumns = (app) => {
  const columns = [
    {
      title: 'minSpread',
      dataIndex: 'minSpread',
      key: 'minSpread',
      // width: '30%',
      editable: true,
    }, {
      title: 'hitratio',
      dataIndex: 'hitratio',
      key: 'hitratio',
      editable: true,
    }, {
      title: 'dq',
      dataIndex: 'dq',
      key: 'dq',
      editable: true,
    }, {
      title: 'maker',
      dataIndex: 'maker',
      key: 'maker',
      editable: true,
    }, {
      title: 'rate',
      dataIndex: 'rate',
      key: 'rate',
      editable: true,
    }, {
      title: 'fees',
      dataIndex: 'fees',
      key: 'fees',
      editable: true,
    }, {
      title: '操作',
      render: (t, record) => (
        <Button type="primary" onClick={() => app.updateRate(record)}>
          保存
        </Button>
      )
    }]
  const list = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: app.handleSave,
      }),
    };
  });
  return list;
}

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editing: false,
    };
  }

  toggleEdit = () => {
    const editing = !this.state.editing; // eslint-disable-line
    // console.log('toggleEdit editing: ', editing);
    this.setState({
      editing,
    }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }

  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      // console.log('values: ', values);
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  }

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td
        ref={node => (this.cell = node)}  // eslint-disable-line
        {...restProps}
      >
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <Form.Item>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `${title}不能为空`,
                      }],
                      initialValue: record[dataIndex],
                    })(
                      <Input
                        className="editable-cell-input"
                        ref={node => (this.input = node)}
                        onPressEnter={() => { this.save(false); }}
                        onBlur={() => { this.save(false); }}
                      />,
                    )}
                  </Form.Item>
                ) : (
                    <div // eslint-disable-line
                      className="editable-cell-value-wrap"
                      // style={{ paddingRight: 24 }}
                      onClick={this.toggleEdit}
                    >
                      {restProps.children}
                    </div>
                  )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class config extends Component {

  state = {
    tableList: [],
    taker: [],
    count: 0,
  };

  // formItemKey = { keys: 0 };

  components = {
    body: {
      row: EditableFormRow,
      cell: EditableCell,
    },
  };

  componentDidMount() {
    this.getData();
  }

  // initialKeys = () => {
  //   const { form } = this.props;
  //   const taker = _.map(this.state.taker, (item, index) => {
  //     // console.log(item, index)
  //     return { inpVal: item, keys: index }
  //   });
  //   let nextKeys = [];
  //   nextKeys = nextKeys.concat(taker);
  //   form.setFieldsValue({
  //     keys: nextKeys,
  //   })
  //   // if (_.isEmpty(taker)) {

  //   // }
  //   // console.log(taker)
  // }

  getData = () => {
    // const res = this.getRes();
    getFeeConfig().then((res) => {
      if (res.code === 1200) {
        let tableList = [];
        const taker = _.map(res.obj.exchangeTaker, (v, k) => {
          const id = `${+new Date()}${(Math.random() * 1000) + 1}` - 0;
          return { exchange: k, exchangeVal: v, id, type: 'taker' }
        })
        res.obj.id = 8;
        tableList.push(res.obj);
        console.log('object', tableList, taker)
        this.setState({ tableList, taker, count: taker.length });
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  getRes = () => ({
    "code": 1200,
    "msg": "修改成功",
    "errorMeg": null,
    "obj": {
      "minSpread": 30,
      "hitratio": 1,
      "dq": 0.8,
      "maker": 5,
      "rate": 0,
      "fees": 0,
      "exchangeTaker": {
        "BINANCE": 8,
        "HUOBI": 18,
        "OKEX": 4
      }
    }
  })

  handleDeleteTaker = (row) => {
    delFeeConfig(row.exchange).then((data) => {
      if (data.code === 1200) {
        message.success(data.msg);
        let taker = [];
        if (data.obj.exchangeTaker) {
          taker = _.map(data.obj.exchangeTaker, (v, k) => {
            const id = `${+new Date()}${(Math.random() * 1000) + 1}` - 0;
            return { exchange: k, exchangeVal: v, id, type: 'taker' }
          })
          console.log('taker', taker)
        }
        this.setState({ taker });
      } else if (data.code !== 1200) {
        message.error(data.msg)
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  handleDelete = row => {
    const taker = [...this.state.taker];
    this.handleDeleteTaker(row);
    this.setState({ taker: taker.filter(item => item.id !== row.id) });
  };

  handleSave = row => {
    if (row.type === 'taker') {
      const newData = [...this.state.taker];
      const index = newData.findIndex(item => row.id === item.id);
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...row });
      this.setState({
        taker: newData,
      });
    } else {
      const newData = [...this.state.tableList];
      const index = newData.findIndex(item => row.id === item.id);
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...row });
      this.setState({
        tableList: newData,
      });
    }
  };

  handleAdd = () => {
    const { taker } = this.state;
    const newData = {
      id: `${+new Date()}${(Math.random() * 1000) + 1}` - 0,
      exchange: '',
      exchangeVal: '',
      type: 'taker',
      // key: count,
      // name: `Edward King ${count}`,
      // age: 32,
      // address: `London, Park Lane no. ${count}`,
    };
    this.setState({
      taker: [...taker, newData],
      // count: count + 1,
    });
  };

  // remove = (k) => {
  //   const { form } = this.props;
  //   // can use data-binding to get
  //   const keys = form.getFieldValue('keys');
  //   // We need at least one passenger
  //   // if (keys.length === 1) {
  //   //   return;
  //   // }

  //   // can use data-binding to set
  //   form.setFieldsValue({
  //     keys: keys.filter(key => key.keys !== k.keys),
  //   });
  // }

  // add = () => {
  //   const { form } = this.props;
  //   // can use data-binding to get
  //   const keys = form.getFieldValue('keys');
  //   let nextKeys;
  //   if (keys.length > 0) {
  //     nextKeys = keys.concat([{ inpVal: '', keys: keys[keys.length - 1].keys + 1 }]);
  //   } else {
  //     nextKeys = keys.concat([{ inpVal: '', keys: 0 }]);
  //   }
  //   // can use data-binding to set
  //   // important! notify form to detect changes
  //   form.setFieldsValue({
  //     keys: nextKeys,
  //   });
  // }

  updateRate = (record) => {
    UpdateRate(record).then((data) => {
      if (data.code === 1200) {
        message.success(data.msg);
        let tableList = [];
        data.obj.id = 8;
        tableList.push(data.obj);
        this.setState({ tableList })
      } else {
        message.error(data.msg);
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  handleTakerSave = () => { 
    const t = this.state.taker;
    const takers = _.map(t, (item) => {
        return `${item.exchange}_${item.exchangeVal}`
    })
    console.log('talers', takers);
    addFeeConfig(takers).then((data) => {
      if (data.code === 1200) {
        message.success(data.msg);
        let taker = [];
        if (data.obj.exchangeTaker) {
          taker = _.map(data.obj.exchangeTaker, (v, k) => {
            const id = `${+new Date()}${(Math.random() * 1000) + 1}` - 0;
            return { exchange: k, exchangeVal: v, id, type: 'taker' }
          })
          console.log('taker', taker)
        }
        this.setState({ taker });
      } else if (data.code !== 1200) {
        message.error(data.msg)
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  render() {
    // const { getFieldDecorator, getFieldValue } = this.props.form;
    // getFieldDecorator('keys', { initialValue: [] });
    // // console.log('render===', getFieldValue('keys').length);
    // const keys = getFieldValue('keys');
    // console.log('keys', keys)
    // const formItems = keys.map((k, index) => (
    //   <Form.Item
    //     // {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
    //     label={index === 0 ? 'Passengers' : ''}
    //     required={false}
    //     key={k.keys}
    //   >
    //     {getFieldDecorator(`names-${k.keys}`, {
    //       // validateTrigger: ['onChange', 'onBlur'],
    //       initialValue: k.inpVal,
    //       rules: [
    //         {
    //           required: true,
    //           whitespace: true,
    //           message: "Please input passenger's name or delete this field.",
    //         },
    //       ],
    //     })(<Input placeholder="passenger name" style={{ width: '60%', marginRight: 8 }} />)}
    //     {keys.length > 0 ? (
    //       // <Col span={1}>
    //       // <Form.Item>
    //       <Icon
    //         className="dynamic-delete-button"
    //         type="minus-circle-o"
    //         onClick={() => this.remove(k)}
    //       />
    //       // </Form.Item>
    //       // </Col>

    //     ) : null}
    //   </Form.Item>
    // ));
    return (
      <div className="capital-accounts" >
        <Row gutter={48}>
          <Col span={14}>
            <h4>基础汇率</h4>
            <Table
              components={this.components}
              size="small"
              pagination={false}
              rowKey="id"
              rowClassName={() => 'editable-row'}
              dataSource={this.state.tableList}
              columns={getColumns(this)}
            // scroll={{ x: 1800 }}
            />
            <div style={{ marginTop: 20 }}>
              {/* <Form onSubmit={this.handleSubmit}>
                {formItems}
                <Form.Item>
                  <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                    <Icon type="plus" /> Add field
                 </Button>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                 </Button>
                </Form.Item>
              </Form> */}
            </div>
          </Col>
          <Col span={10}>
            <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16, marginRight: 10 }}>
              Add a row
            </Button>
            <Button onClick={this.handleTakerSave} type="primary" style={{ marginBottom: 16 }}>
              保存
            </Button>
            <Table
              size="small"
              pagination={false}
              components={this.components}
              rowClassName={() => 'editable-row'}
              // bordered
              rowKey="id"
              dataSource={this.state.taker}
              columns={getColumnsSimpel(this)}
              scroll={{ y: 400 }}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

export default Form.create()(config);
