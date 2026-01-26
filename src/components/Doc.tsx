import React from "react";
import Markdown from "react-markdown";

const headers = {
  js: "JS",
  android: "Android",
  ios: "iOS"
};

type DocProps = {
  fieldSpec: {
    doc?: string
    values?: {
      [key: string]: {
        doc?: string
      }
    }
    "sdk-support"?: {
      [key: string]: typeof headers
    }
    docUrl?: string,
    docUrlLinkText?: string
  }
};

const Doc: React.FC<DocProps> = ({ fieldSpec }) => {
  const { doc, values, docUrl, docUrlLinkText } = fieldSpec;
  const sdkSupport = fieldSpec["sdk-support"];

  const renderValues = (
    !!values &&
    !Array.isArray(values)
  );

  const sdkSupportToJsx = (value: string) => {
    const supportValue = value.toLowerCase();
    if (supportValue.startsWith("https://")) {
      return (
        <a
          href={supportValue}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline hover:text-primary/80"
        >
          {"#" + supportValue.split("/").pop()}
        </a>
      );
    }
    return value;
  };

  return (
    <div className="space-y-4 text-xs text-muted-foreground p-1">
      {doc && (
        <div className="prose prose-sm prose-invert dark:prose-invert max-w-none">
          <div data-wd-key='spec-field-doc' className="leading-relaxed">
            <Markdown components={{
              a: ({ node: _node, href, children, ...props }) => (
                <a href={href} target="_blank" className="text-primary underline" {...props}>
                  {children}
                </a>
              ),
              code: ({ children }) => (
                <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs">
                  {children}
                </code>
              )
            }}>{doc}</Markdown>
          </div>
          {renderValues && (
            <ul className="mt-2 list-none space-y-2">
              {Object.entries(values as any).map(([key, value]: [string, any]) => (
                <li key={key} className="flex flex-col gap-1">
                  <code className="w-fit bg-muted px-1.5 py-0.5 rounded font-mono text-[11px] font-bold">
                    {JSON.stringify(key)}
                  </code>
                  <div className="pl-2 border-l-2 border-muted">{value.doc}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {sdkSupport && (
        <div className="overflow-x-auto rounded-md border border-input">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-2 py-1 border-r border-b border-input"></th>
                {Object.values(headers).map(header => (
                  <th key={header} className="px-2 py-1 border-b border-input font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(sdkSupport).map(([key, supportObj]) => (
                <tr key={key} className="hover:bg-muted/30">
                  <td className="px-2 py-1 border-r border-b border-input font-medium bg-muted/20">
                    {key}
                  </td>
                  {Object.keys(headers).map((k) => {
                    const val = Object.prototype.hasOwnProperty.call(supportObj, k)
                      ? sdkSupportToJsx((supportObj as any)[k])
                      : "no";
                    return (
                      <td key={k} className="px-2 py-1 border-b border-input">
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {docUrl && docUrlLinkText && (
        <div className="pt-2 italic">
          <a
            href={docUrl}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline hover:text-primary/80"
          >
            {docUrlLinkText}
          </a>
        </div>
      )}
    </div>
  );
};

export default Doc;
