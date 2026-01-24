import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div style={{display:"flex",justifyContent:"center", alignItems:"center", flexDirection:"column", alignItems:"center", margin:"0 auto",height:"90vh"}}>
      <div style={{fontSize:"5rem"}}>Not Found</div>
      <p style={{fontSize:"3rem"}}>Could not find requested resource</p>
       
      <Link  href="/" style={{padding:"1rem 1.6rem", fontSize:"1.6rem", border:"1px solid black", borderRadius:"5px", boxShadow:"0px 0px 10px 1px #00000014", textDecoration:"none"}}>Return Home</Link>
    </div>
  )
}