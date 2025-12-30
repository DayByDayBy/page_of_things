import katex from "katex";
import "katex/dist/katex.min.css";
import PropTypes from "prop-types";

const FormulaTooltip = ({ formula }) => {
  const safeFormula = typeof formula === "string" ? formula : "";

  return (
    <div
      className="formula-tooltip"
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(safeFormula, {
          throwOnError: false,
        }),
      }}
    />
  );
};

FormulaTooltip.propTypes = {
  formula: PropTypes.string.isRequired,
};


export default FormulaTooltip;