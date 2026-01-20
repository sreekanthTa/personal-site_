import {navigateToNotes} from "./actions/redirect";

export default  function Page() {
  
  return (
    <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100vh", flexDirection:"column", gap:"1rem", background:"black"}}
    onClick={navigateToNotes}
    >
       <h1 style={{color:"white", fontSize:"min(10vw, 10vh)"}}> LEARNING NOTES</h1>
    </div>
  );
}

