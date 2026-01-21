import React from "react";

export type InputSelectProps = {
  value: string
  "data-wd-key"?: string
  options: [string, any][] | string[]
  style?: object
  onChange(value: string | [string, any]): unknown
  title?: string
  "aria-label"?: string
};

export default class InputSelect extends React.Component<InputSelectProps> {
  lastEmittedValue?: string;

  componentDidUpdate(prevProps: InputSelectProps) {
    if (prevProps.value !== this.props.value) {
      this.lastEmittedValue = this.props.value;
    }
  }

  handleValueChange = (value: string) => {
    if (this.lastEmittedValue === value) {
      return;
    }
    this.lastEmittedValue = value;
    this.props.onChange(value);
  };

  render() {
    let options = this.props.options;
    if(options.length > 0 && !Array.isArray(options[0])) {
      options = options.map((v) => [v, v]) as [string, any][];
    }

    return <select
      className="maputnik-select"
      data-wd-key={this.props["data-wd-key"]}
      style={this.props.style}
      title={this.props.title}
      value={this.props.value}
      onChange={e => this.handleValueChange(e.target.value)}
      onInput={e => this.handleValueChange((e.target as HTMLSelectElement).value)}
      aria-label={this.props["aria-label"]}
    >
      { options.map(([val, label]) => <option key={val} value={val}>{label}</option>) }
    </select>;
  }
}
