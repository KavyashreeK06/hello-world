import Link from "next/link";

 export default function Home() {
   return (
     <main
       style={{
         padding: 32,
         fontFamily: "system-ui, sans-serif",
       }}
     >
       <h1>Hello World</h1>

       <ul style={{ lineHeight: "2", marginTop: 16 }}>
         <li>
           <Link href="/login">Go to /login</Link>
         </li>

         <li>
           <Link href="/protected">Go to /protected (gated)</Link>
         </li>

         <li>
           <Link href="/protected/upload">
             Go to /protected/upload (Upload image → captions)
           </Link>
         </li>

         <li>
           <Link href="/list">Go to /list</Link>
         </li>
       </ul>
     </main>
   );
 }