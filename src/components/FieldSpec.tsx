import Block, { type BlockProps } from "./Block";
import InputSpec, { type FieldSpecType, type InputSpecProps } from "./InputSpec";
import Fieldset, { type FieldsetProps } from "./Fieldset";

function getElementFromType(fieldSpec: { type?: FieldSpecType, values?: unknown[] }): typeof Fieldset | typeof Block {
  switch (fieldSpec.type) {
    case "color":
      return Block;
    case "enum":
      return Block;
    case "boolean":
      return Block;
    case "array":
      if ("length" in fieldSpec && (fieldSpec as any).length) {
        return Block;
      }
      return Fieldset;
    case "resolvedImage":
      return Block;
    case "number":
      return Block;
    case "string":
      return Block;
    case "formatted":
      return Block;
    case "padding":
      return Block;
    case "numberArray":
      return Block;
    case "colorArray":
      return Fieldset;
    case "variableAnchorOffsetCollection":
      return Fieldset;
    default:
      console.warn("No such type for: " + fieldSpec.type);
      return Block;
  }
}

export type FieldSpecProps = InputSpecProps & BlockProps & FieldsetProps;

const FieldSpec: React.FC<FieldSpecProps> = (props) => {
  const TypeBlock = getElementFromType(props.fieldSpec!);

  const isInline = props.inline || (
    (props.fieldSpec?.type === "array" && "length" in props.fieldSpec && !!(props.fieldSpec as any).length) ||
    props.fieldSpec?.type === "numberArray" ||
    props.fieldSpec?.type === "enum" ||
    props.fieldSpec?.type === "number" ||
    props.fieldSpec?.type === "string" ||
    props.fieldSpec?.type === "boolean" ||
    props.fieldSpec?.type === "color"
  );

  return (
    <TypeBlock
      label={props.label}
      action={props.action}
      fieldSpec={props.fieldSpec}
      error={props.error}
      inline={isInline}
    >
      <InputSpec {...props} />
    </TypeBlock>
  );
};

export default FieldSpec;
