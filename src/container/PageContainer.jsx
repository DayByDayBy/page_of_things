import Contact from "../components/Contact";
import RightBox from "../components/RightBox";
import LeftBox from "../components/LeftBox";

const PageContainer = () => {



  return (
    <>

    
        <LeftBox />

      <div className="contact">
        <h1 className="name">boagDev</h1>
        <Contact />
        <p className="text">theboag<br></br>[@]<br></br>gmail</p>
      </div>

        <RightBox />
  

    </>
  );
};

export default PageContainer;
