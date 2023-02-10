import React, { Component } from 'react';
import { Select } from 'antd';
import FACTORY from '../../../../../common/FACTORY';
import { SearchOutlined } from '@ant-design/icons';

class SelectTagsComponents extends Component {
  getTagsUI() {
    const list = this.props.listTags;
    if (!list) return;
    return list.map((v) => {
      return (
        <Select.Option key={v.id}>{v.name}</Select.Option>
      );
    });
  }

  getDefaultValue() {
    if (this.props.defaultValue)
      return this.props.defaultValue;
  }

  filterOption(value, option) {
    const name = FACTORY.fun_changeToSlug(option.children);
    value = FACTORY.fun_changeToSlug(value);
    if (name.includes(value))
      return true;
    return false;
  }

  render() {
    return (
      <div >
        <Select
          disabled={this.props.disabled}
          mode="multiple"
          size='large'
          placeholder={<span><SearchOutlined />&nbsp;Nhập tìm thẻ</span>}
          value={this.getDefaultValue()}
          onChange={(e) => this.props.onChange(e)}
          filterOption={(value, option) => this.filterOption(value, option)}
          style={{ width: '100%' }}
        >
          {this.getTagsUI()}
        </Select>
      </div>
    );
  }
}

export default SelectTagsComponents;