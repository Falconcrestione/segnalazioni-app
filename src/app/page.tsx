"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CSSProperties } from "react";

import {
  Shield,
  Trees,
  Tractor,
  MapPinned,
  History,
  BarChart3,
  LayoutDashboard,
  ClipboardList,
  ChevronRight,
} from "lucide-react";


export default function Home() {

  const router = useRouter();

  const [openDistretti, setOpenDistretti] = useState(false);



  function goToTracking() {

    const password = prompt("Inserisci password Tracking");

    if (password === "tracking123") {

      router.push("/tracking1");

    } else {

      alert("Password errata!");

    }

  }




  function goToDashboardAIB() {

    const password = prompt(
      "Inserisci password Dashboard AIB"
    );


    if (password === "AiB2026@") {

      router.push("/dashboard");

    } else {

      alert("Password errata!");

    }

  }




  const apriStoricoSostituzioni = () => {

    const password = prompt(
      "Inserisci la password:"
    );


    if(password !== "CalabriaVerde2026") {

      alert("Password errata");

      return;

    }


    window.open(
      "/storico_sostituzioni.html",
      "_blank"
    );

  };




return (

<div style={page}>


<div style={container}>


<Image

src="/calabriaverde.png"

alt="Logo Calabria Verde"

width={150}

height={150}

style={logo}

/>




<h1 style={title}>

GESTIONE AUTOPARCO

<br/>

<span style={{color:"#15803d"}}>

AZIENDA CALABRIA VERDE

</span>

<br/>

VEICOLI

</h1>




<div style={separator}></div>




<div style={buttonsContainer}>



<Link href="/sorveglianza">

<button style={btnBlue}>

<Shield size={24}/>

REPORT SORVEGLIANZA

<ChevronRight size={20}/>

</button>

</Link>





<Link href="/forestazione/richiedi">

<button style={btnGreen}>

<Trees size={24}/>

SETTORI VARI

<ChevronRight size={20}/>

</button>

</Link>





<Link href="/gestione_mezzi">

<button style={btnOrange}>

<Tractor size={24}/>

RICHIESTA MEZZI MECCANICI

<ChevronRight size={20}/>

</button>

</Link>





<button

style={btnPurple}

onClick={goToTracking}

>

<MapPinned size={24}/>

TRACKING GPS

<ChevronRight size={20}/>

</button>





<button

style={btnGray}

onClick={apriStoricoSostituzioni}

>

<History size={24}/>

STORICO SOSTITUZIONI VEICOLI

<ChevronRight size={20}/>

</button>





<a
href="/dashboard.html"
target="_blank"
rel="noopener noreferrer"
>

<button style={btnTeal}>

<BarChart3 size={24}/>

DASHBOARD1

<ChevronRight size={20}/>

</button>

</a>





<button

style={btnTeal}

onClick={goToDashboardAIB}

>

<LayoutDashboard size={24}/>

Dashboard AIB

<ChevronRight size={20}/>

</button>





<a

href="/reportsaib"

target="_blank"

rel="noopener noreferrer"

>

<button style={btnRed}>

<ClipboardList size={24}/>

Report Squadrette AIB

<ChevronRight size={20}/>

</button>

</a>






<button

style={btnBlue}

onClick={() =>
setOpenDistretti(!openDistretti)
}

>

🗂️ LISTA OFFICINE CONVENZIONATE

</button>





{openDistretti && (

<div style={distrettiContainer}>


{[...Array(11)].map((_,i)=>(


<button

key={i}

style={distrettoBtn}

onClick={() =>
router.push(`/distretti/${i+1}`)
}

>

Distretto {i+1}

</button>


))}


</div>

)}



</div>




<p style={footer}>

Calabria Verde • Sistema Gestione Autoparco • 2026

</p>



</div>



</div>

);


}





// =========================
// STILI
// =========================



const page: CSSProperties = {

minHeight:"100vh",

display:"flex",

justifyContent:"center",

alignItems:"center",

padding:"30px",

background:
"linear-gradient(135deg,#eef7ef,#f4f7fa,#e6f0ff)",

fontFamily:
"Segoe UI, Arial, sans-serif",

};




const container: CSSProperties = {

width:"100%",

maxWidth:"520px",

background:"#ffffff",

padding:"40px",

borderRadius:"24px",

boxShadow:
"0 15px 40px rgba(0,0,0,.12)",

display:"flex",

flexDirection:"column",

alignItems:"center",

};




const logo: CSSProperties = {

marginBottom:"30px",

borderRadius:"50%",

boxShadow:
"0 8px 25px rgba(0,0,0,.18)",

};




const title: CSSProperties = {

marginBottom:"20px",

fontSize:"30px",

fontWeight:700,

lineHeight:1.4,

color:"#1f2937",

textAlign:"center",

};




const separator: CSSProperties = {

width:"90px",

height:"5px",

background:"#16a34a",

borderRadius:"20px",

marginBottom:"30px",

};




const buttonsContainer: CSSProperties = {

display:"flex",

flexDirection:"column",

gap:"18px",

alignItems:"center",

width:"100%",

};





const baseButton: CSSProperties = {

display:"flex",

alignItems:"center",

justifyContent:"space-between",

gap:"12px",

width:"380px",

height:"60px",

padding:"0 20px",

color:"#fff",

border:"none",

borderRadius:"16px",

fontSize:"15px",

fontWeight:700,

cursor:"pointer",

boxShadow:
"0 8px 18px rgba(0,0,0,.16)",

transition:"all .25s ease",

};





const btnBlue: CSSProperties = {

...baseButton,

background:
"linear-gradient(90deg,#2563eb,#3b82f6)",

};



const btnGreen: CSSProperties = {

...baseButton,

background:
"linear-gradient(90deg,#15803d,#22c55e)",

};



const btnOrange: CSSProperties = {

...baseButton,

background:
"linear-gradient(90deg,#ea580c,#fb923c)",

};



const btnPurple: CSSProperties = {

...baseButton,

background:
"linear-gradient(90deg,#6d28d9,#8b5cf6)",

};



const btnGray: CSSProperties = {

...baseButton,

background:
"linear-gradient(90deg,#475569,#64748b)",

};



const btnTeal: CSSProperties = {

...baseButton,

background:
"linear-gradient(90deg,#0f766e,#14b8a6)",

};



const btnRed: CSSProperties = {

...baseButton,

background:
"linear-gradient(90deg,#b91c1c,#ef4444)",

};





const distrettiContainer: CSSProperties = {

display:"flex",

flexDirection:"column",

gap:"12px",

marginTop:"10px",

};





const distrettoBtn: CSSProperties = {

width:"380px",

padding:"14px",

background:"#f8fafc",

border:"1px solid #dbe4ec",

borderRadius:"12px",

cursor:"pointer",

fontWeight:600,

color:"#334155",

};





const footer: CSSProperties = {

marginTop:"30px",

fontSize:"13px",

color:"#64748b",

};