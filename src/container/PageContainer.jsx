import NavBar from "../components/NavBar";

const PageContainer = () => {
  // const [ modulation, setModulation] = useState(null);
  // const handleModSelect = (mod) => {
  //   setModulation(mod);
  // }

  return (
    <>
      <div className="name">
        <h3>boagDev</h3>
      </div>
      {/* <Menu onSelect={handleModSelect}/> */}
      <NavBar />
      <p className="text">
        theboag<br></br>[@]<br></br>gmail
      </p>
    </>
  );
};

export default PageContainer;
