import NavBar from "../components/NavBar";

const PageContainer = () => {


  return (
    <>
      <div className="name">
        <h3>boagDev</h3>
      </div>
      {/* <Menu onSelect={handleModSelect}/> */}
      <NavBar />
      <p className="text">
        lab<br></br>[@]<br></br>boag<br></br>dev
      </p>
    </>
  );
};

export default PageContainer;
