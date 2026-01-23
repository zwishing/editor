import React from "react";
import classnames from "classnames";
import { Button } from "@/components/ui/button";

type InputButtonProps = {
  "data-wd-key"?: string
  "aria-label"?: string
  onClick?(...args: unknown[]): unknown
  style?: object
  className?: string
  children?: React.ReactNode
  disabled?: boolean
  type?: typeof HTMLButtonElement.prototype.type
  id?: string
  title?: string
};

export default class InputButton extends React.Component<InputButtonProps> {
  render() {
    return (
      <Button
        id={this.props.id}
        title={this.props.title}
        type={this.props.type}
        onClick={this.props.onClick}
        disabled={this.props.disabled}
        aria-label={this.props["aria-label"]}
        className={classnames(
          "maputnik-button",
          "h-auto",
          "px-[6px]",
          "py-[6px]",
          "text-[11px]",
          "font-normal",
          "rounded-[999px]",
          this.props.className
        )}
        data-wd-key={this.props["data-wd-key"]}
        style={this.props.style}
        variant="outline"
      >
        {this.props.children}
      </Button>
    );
  }
}
