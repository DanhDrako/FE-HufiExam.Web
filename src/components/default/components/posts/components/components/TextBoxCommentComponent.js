import { Component } from 'react';

class TextBoxCommentComponent extends Component {
  onChange(e) {
    if (!this.props.onChange) return;
    this.props.onChange(e);
  }
  render() {
    return (
      <input
        value={this.props.value || ''}
        onChange={(e) => this.onChange(e.target.value)}
        style={{ width: '100%', height: '100%' }}
        placeholder="input @ to mention people, # to mention tag"
        autoComplete='off'
        className='form-control'
      />
    );
  }
}

export default TextBoxCommentComponent;