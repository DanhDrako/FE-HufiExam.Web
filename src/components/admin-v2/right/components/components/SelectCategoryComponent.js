import React, { Component } from 'react';
import { Select } from 'antd';

class SelectCategoryComponent extends Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  getListCateUI() {
    const list = this.props.listCate;
    if (!list) return;
    return list.map((v) => {
      return (
        <Select.Option key={v.id}>{v.name}</Select.Option>
      );
    });
  }

  getDefaultValue() {
    if (this.props.defaultValue)
      return this.props.defaultValue.name;
  }

  render() {
    return (
      <div>
        <Select
          disabled={this.props.disabled || false}
          placeholder='Select Category'
          size='large' value={this.getDefaultValue()} onChange={(e) => this.props.onChange(e)} style={{ width: '100%' }}>
          {this.getListCateUI()}
        </Select>
      </div>
    );
  }
}

export default SelectCategoryComponent;