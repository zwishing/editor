import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import classnames from "classnames";

export type InputCheckboxProps = {
  value?: boolean
  style?: object
  onChange(...args: unknown[]): unknown
};

export default class InputCheckbox extends React.Component<InputCheckboxProps> {
  static defaultProps = {
    value: false,
  };

  onCheckedChange = () => {
    this.props.onChange(!this.props.value);
  };

  render() {
    return (
      // <div className="maputnik-checkbox-wrapper" style={this.props.style}>
      <Checkbox
        checked={this.props.value}
        onCheckedChange={this.onCheckedChange}
        className={classnames(
          "h-[24px]",
          "w-[24px]",
          "rounded-[4px]",
          "border-[#E2E8F0]",
          "bg-[#FFFFFF]",
          "data-[state=checked]:bg-[#2563EB]",
          "data-[state=checked]:border-[#2563EB]",
          "focus-visible:shadow-[0_0_0_2px_rgba(22,119,255,0.12)]",
          "focus-visible:border-[#2563EB]",
          "focus-visible:ring-0",
          "focus-visible:ring-offset-0",
          "disabled:opacity-100"
        )}
      />
      // </div>
    );
  }
}
