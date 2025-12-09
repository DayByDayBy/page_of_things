import katex from "katex";
import "katex/dist/katex.min.css";

const FormulaTooltip = ({ formula }) => {
  return (
    <div
      className="formula-tooltip"
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(formula, {
          throwOnError: false,
        }),
      }}
    />
  );
};


export default FormulaTooltip;