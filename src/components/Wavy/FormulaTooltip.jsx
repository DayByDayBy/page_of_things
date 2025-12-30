import katex from "katex";
import "katex/dist/katex.min.css";
import PropTypes from "prop-types";

const FormulaTooltip = ({ formula, accessibleLabel }) => {
  const safeFormula = typeof formula === "string" ? formula : "";
  const ariaLabel = typeof accessibleLabel === "string" ? accessibleLabel : safeFormula;

  return (
    <div
      className="formula-tooltip"
      role="img"
      aria-label={ariaLabel}
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
  accessibleLabel: PropTypes.string,
};


export default FormulaTooltip;