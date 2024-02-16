import Contact from "../components/Contact";
import RightBox from "../components/RightBox";
import LeftBox from "../components/RightBox";

const PageContainer = () => {



  return (
    <>

    
        <LeftBox />

      <div className="contact">
        <h3 className="name">boagDev</h3>
        <Contact />
        <p className="text">theboag<br></br>[@]<br></br>gmail</p>
      </div>

        <RightBox />
  

    </>
  );
};

export default PageContainer;
