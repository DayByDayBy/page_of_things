import { useMousePosition } from "../../hooks/useMousePosition";

const Readout = () => {
    const mousePosition = useMousePosition(50);

    return (
        <div className="readout">
            X:{mousePosition.x}
            <br></br>
            Y:{mousePosition.y}
        </div>
    )
};

export default Readout;