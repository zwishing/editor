import React from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";

export type InputAutocompleteProps = {
  value?: string
  options?: any[]
  onChange?(value: string | undefined): unknown
  "aria-label"?: string
};

export default function InputAutocomplete({
  value,
  options = [],
  onChange = () => { },
  "aria-label": ariaLabel,
}: InputAutocompleteProps) {
  const [inputValue, setInputValue] = React.useState(value || "");

  // Update internal state when value prop changes externally
  React.useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleValueChange = (val: string | null) => {
    const resolvedValue = val || "";
    setInputValue(resolvedValue);
    onChange(resolvedValue === "" ? undefined : resolvedValue);
  };

  return (
    <div className="w-full" data-slot="input-autocomplete">
      <Combobox
        value={inputValue}
        onValueChange={handleValueChange}
      >
        <ComboboxInput
          placeholder=""
          aria-label={ariaLabel}
          className="w-full"
          showTrigger={false}
        />
        <ComboboxContent className="z-50 min-w-[200px]">
          <ComboboxEmpty>No results found.</ComboboxEmpty>
          <ComboboxList>
            {options.map((option) => (
              <ComboboxItem key={option[0]} value={option[0]}>
                {option[1] || option[0]}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
